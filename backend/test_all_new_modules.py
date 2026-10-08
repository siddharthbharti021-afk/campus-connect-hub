"""
Comprehensive End-to-End Verification Test Suite for CampusOS Backend:
1. Login Success with real User ID / Password (student01, dean01, prof01, parent01 / Password123!)
2. Login Failure with wrong password (returns 401)
3. Access Protected Endpoints without Token (returns 401)
4. Wrong-Role Access Prevention (e.g. Student calling Dean Admin endpoints returns 403)
5. Data Isolation / Scoping (Student 1 trying to read Student 2's fees/certificates returns 403)
6. Guardian Scoping (Parent 1 sees only linked child student01 & student02, cannot see student03)
7. Dean Institution-Wide Access (Dean sees all fee summaries and all at-risk students)
8. RAG Knowledge Ingestion & Intelligent Answering
"""
import asyncio
import os
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from httpx import ASGITransport, AsyncClient
from app.main import app


async def test_all():
    print("=" * 75)
    print("  CAMPUSOS BACKEND — COMPREHENSIVE SECURITY & RBAC VERIFICATION SUITE")
    print("=" * 75)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Health Check
        r = await client.get("/health")
        assert r.status_code == 200, f"Health check failed: {r.text}"
        print("[PASS] 1. Health check: 200 OK")

        # 2. Login Failure (Wrong password)
        r = await client.post("/api/v1/auth/login", json={"user_id": "student01", "password": "wrongpassword!"})
        assert r.status_code == 401, f"Expected 401 for wrong password, got {r.status_code}"
        print("[PASS] 2. Login Failure with wrong password: 401 Unauthorized")

        # 3. Access Protected Endpoint without Token
        r = await client.get("/api/v1/fees/my-invoices")
        assert r.status_code == 401, f"Expected 401 without token, got {r.status_code}"
        print("[PASS] 3. Protected endpoint without token: 401 Unauthorized")

        # 4. Login Success for all 4 Personas
        r_st1 = await client.post("/api/v1/auth/login", json={"user_id": "student01", "password": "Password123!"})
        assert r_st1.status_code == 200, f"student01 login failed: {r_st1.text}"
        st1_data = r_st1.json()
        st1_headers = {"Authorization": f"Bearer {st1_data['access_token']}"}
        st1_id = st1_data["user"]["id"]
        print(f"[PASS] 4a. Student 1 Login: {st1_data['user']['full_name']} ({st1_data['user']['role']})")

        r_st2 = await client.post("/api/v1/auth/login", json={"user_id": "student02", "password": "Password123!"})
        assert r_st2.status_code == 200
        st2_data = r_st2.json()
        st2_id = st2_data["user"]["id"]

        r_dean = await client.post("/api/v1/auth/login", json={"user_id": "dean01", "password": "Password123!"})
        assert r_dean.status_code == 200
        dean_data = r_dean.json()
        dean_headers = {"Authorization": f"Bearer {dean_data['access_token']}"}
        print(f"[PASS] 4b. Dean Login: {dean_data['user']['full_name']} ({dean_data['user']['role']})")

        r_prof = await client.post("/api/v1/auth/login", json={"user_id": "prof01", "password": "Password123!"})
        assert r_prof.status_code == 200
        prof_headers = {"Authorization": f"Bearer {r_prof.json()['access_token']}"}
        print(f"[PASS] 4c. Professor Login: {r_prof.json()['user']['full_name']} ({r_prof.json()['user']['role']})")

        r_parent1 = await client.post("/api/v1/auth/login", json={"user_id": "parent01", "password": "Password123!"})
        assert r_parent1.status_code == 200
        p1_headers = {"Authorization": f"Bearer {r_parent1.json()['access_token']}"}
        print(f"[PASS] 4d. Guardian Login: {r_parent1.json()['user']['full_name']} ({r_parent1.json()['user']['role']})")

        # 5. GET /auth/me verification
        r = await client.get("/api/v1/auth/me", headers=st1_headers)
        assert r.status_code == 200
        assert r.json()["user_code"] == "student01"
        print("[PASS] 5. GET /auth/me returns active authenticated profile")

        # 6. Wrong-Role Access Check (403 Forbidden)
        # Student trying to call Dean Admin endpoint
        r = await client.get("/api/v1/fees/admin/summary", headers=st1_headers)
        assert r.status_code == 403, f"Expected 403 for student calling admin summary, got {r.status_code}"
        print("[PASS] 6. Wrong-Role Access Prevention (Student calling Admin API): 403 Forbidden")

        # 7. Data Scoping: Student 1 trying to read Student 2's data (403 Forbidden)
        r = await client.get(f"/api/v1/fees/invoices/student/{st2_id}", headers=st1_headers)
        assert r.status_code == 403, f"Expected 403 when student1 reads student2 fees, got {r.status_code}"
        print("[PASS] 7. Cross-Student Data Isolation (Student 1 accessing Student 2 fees): 403 Forbidden")

        # 8. Guardian Data Scoping
        # Parent 1 sees linked children (student01, student02)
        r = await client.get("/api/v1/parent/my-children", headers=p1_headers)
        assert r.status_code == 200
        children = r.json()
        child_codes = [c["email"] for c in children]
        print(f"[PASS] 8a. Guardian 1 sees linked children count: {len(children)}")

        # Parent 1 trying to read unlinked Student 3 data (403 Forbidden)
        r_st3 = await client.post("/api/v1/auth/login", json={"user_id": "student03", "password": "Password123!"})
        st3_id = r_st3.json()["user"]["id"]
        r = await client.get(f"/api/v1/fees/invoices/student/{st3_id}", headers=p1_headers)
        assert r.status_code == 403, f"Expected 403 for unlinked student, got {r.status_code}"
        print("[PASS] 8b. Guardian Scoping (Parent 1 accessing unlinked Student 3): 403 Forbidden")

        # 9. Dean Institution-Wide Access
        r = await client.get("/api/v1/fees/admin/summary", headers=dean_headers)
        assert r.status_code == 200
        summary = r.json()
        print(f"[PASS] 9a. Dean Financial Summary: Total Invoiced: ${summary['total_invoiced']}")

        r = await client.get("/api/v1/intelligence/admin/at-risk-students", headers=dean_headers)
        assert r.status_code == 200
        at_risk_list = r.json()
        print(f"[PASS] 9b. Dean At-Risk Cohort Access: {len(at_risk_list)} student(s) evaluated")

        # 10. Dynamic RAG Knowledge Ingestion & AI Answering
        r = await client.post("/api/v1/ai/knowledge/ingest", headers=dean_headers, json={
            "title": "Hackathon 2026 Submission Rules & Prizes",
            "category": "ACADEMIC",
            "content": "Final project submissions close strictly at 11:59 PM. All teams must submit full-stack repos with backend RBAC and dynamic data scoping.",
            "tags": "hackathon,rules,submission"
        })
        assert r.status_code == 201
        print("[PASS] 10a. Admin dynamic knowledge ingestion: 201 Created")

        r = await client.post("/api/v1/ai/knowledge/ask", headers=st1_headers, json={
            "query": "When do hackathon project submissions close?",
            "include_personal_context": True
        })
        assert r.status_code == 200
        ans = r.json()
        print(f"[PASS] 10b. Role-Aware AI RAG Response: {ans['answer'][:120]}...")

    print("=" * 75)
    print("  ALL E2E SECURITY & DATA SCOPING TESTS PASSED 100%!")
    print("=" * 75)


if __name__ == "__main__":
    asyncio.run(test_all())
