"""
Dynamic Campus Knowledge & RAG Service.

Allows administrators to ingest arbitrary campus documents (policies, manuals,
circulars, FAQs, rules), and provides an intelligent search and answering engine
using Groq/Gemini or an intelligent semantic fallback index.
"""
import os
import re
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.knowledge import CampusKnowledgeDoc


class KnowledgeService:
    @staticmethod
    async def ingest_document(
        db: AsyncSession,
        title: str,
        category: str,
        content: str,
        tags: str | None = None,
        source_filename: str | None = None,
    ) -> CampusKnowledgeDoc:
        """Store a new dynamic campus document in the database."""
        doc = CampusKnowledgeDoc(
            title=title,
            category=category.upper(),
            content=content,
            tags=tags,
            source_filename=source_filename,
        )
        db.add(doc)
        await db.commit()
        await db.refresh(doc)
        return doc

    @staticmethod
    async def list_documents(
        db: AsyncSession, category: str | None = None
    ) -> list[CampusKnowledgeDoc]:
        """Fetch all indexed campus knowledge documents."""
        q = select(CampusKnowledgeDoc).where(CampusKnowledgeDoc.is_active == True)
        if category:
            q = q.where(CampusKnowledgeDoc.category == category.upper())
        result = await db.execute(q.order_by(CampusKnowledgeDoc.created_at.desc()))
        return list(result.scalars().all())

    @staticmethod
    def _calculate_relevance(query: str, text: str, title: str) -> float:
        """Compute token overlap and keyword relevance score."""
        q_tokens = set(re.findall(r"\w+", query.lower()))
        if not q_tokens:
            return 0.0

        title_tokens = set(re.findall(r"\w+", title.lower()))
        content_tokens = set(re.findall(r"\w+", text.lower()))

        title_match = len(q_tokens.intersection(title_tokens)) * 3.0
        content_match = len(q_tokens.intersection(content_tokens)) * 1.0

        score = title_match + content_match
        return score

    @classmethod
    async def search_relevant_chunks(
        cls, db: AsyncSession, query: str, top_k: int = 4
    ) -> list[dict[str, Any]]:
        """Search across all dynamically ingested campus documents."""
        docs = await cls.list_documents(db)
        scored_docs = []
        for doc in docs:
            score = cls._calculate_relevance(query, doc.content, doc.title)
            if score > 0:
                scored_docs.append((score, doc))

        scored_docs.sort(key=lambda x: x[0], reverse=True)
        top = scored_docs[:top_k]

        return [
            {
                "title": doc.title,
                "category": doc.category,
                "content": doc.content,
                "score": score,
            }
            for score, doc in top
        ]

    @classmethod
    async def smart_answer(
        cls,
        db: AsyncSession,
        query: str,
        student_context: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """
        Produce a grounded answer combining dynamic ingested docs + live student context.
        Uses Gemini / Groq if configured, otherwise produces a structured grounded summary.
        """
        # 1. Retrieve matching knowledge documents
        relevant_docs = await cls.search_relevant_chunks(db, query)
        sources = [f"{d['category']}: {d['title']}" for d in relevant_docs]

        # 2. Check for action intents
        q_lower = query.lower()
        suggested_actions = []
        intent = "INFORMATIONAL"

        if any(w in q_lower for w in ["certificate", "bonafide", "transcript", "noc"]):
            intent = "ACTIONABLE_REQUEST"
            suggested_actions.append({
                "action": "apply_certificate",
                "label": "Apply for Digital Certificate",
                "endpoint": "/api/v1/certificates/apply",
            })
        if any(w in q_lower for w in ["fee", "dues", "tuition", "payment", "receipt"]):
            intent = "ACTIONABLE_REQUEST"
            suggested_actions.append({
                "action": "view_fees",
                "label": "View & Pay Fees",
                "endpoint": "/api/v1/fees/my-invoices",
            })
        if any(w in q_lower for w in ["bus", "transport", "route", "bus pass"]):
            intent = "ACTIONABLE_REQUEST"
            suggested_actions.append({
                "action": "view_transport",
                "label": "Campus Bus Routes & Passes",
                "endpoint": "/api/v1/transport/routes",
            })
        if any(w in q_lower for w in ["complaint", "grievance", "ticket", "helpdesk"]):
            intent = "ACTIONABLE_REQUEST"
            suggested_actions.append({
                "action": "create_ticket",
                "label": "Raise Helpdesk Ticket",
                "endpoint": "/api/v1/helpdesk/tickets",
            })

        # 3. Context compilation
        docs_context = "\n\n".join(
            f"--- Document: {d['title']} ({d['category']}) ---\n{d['content']}"
            for d in relevant_docs
        )

        user_context_str = ""
        if student_context:
            user_context_str = f"Student Name: {student_context.get('name', 'Student')}\n"
            if "attendance" in student_context and student_context["attendance"]:
                att = student_context["attendance"]
                user_context_str += f"Current Attendance: {att.get('percentage', 0)}% ({att.get('present', 0)}/{att.get('total', 0)})\n"

        prompt = f"""You are CampusOS AI, the intelligent campus assistant for Smart University Digital Campus.
Answer the user's question accurately using the provided official campus documents and student context.
Be concise, helpful, and polite. If the question cannot be answered from the provided documents or context, explain clearly what is known or advise contacting the helpdesk.

OFFICIAL CAMPUS DOCUMENTS:
{docs_context or "No specific policy document matched. Rely on general university guidance."}

STUDENT CONTEXT:
{user_context_str or "No personal student record provided."}

USER QUERY: "{query}"
"""

        # 4. Attempt Gemini LLM Call if key available
        gemini_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
        if gemini_key:
            try:
                from google import genai
                client = genai.Client(api_key=gemini_key)
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                )
                if response and response.text:
                    return {
                        "answer": response.text.strip(),
                        "intent": intent,
                        "sources": sources,
                        "suggested_actions": suggested_actions,
                    }
            except Exception as e:
                print(f"[Gemini API fallback] {e}")

        # 5. Attempt Groq LLM Call if key available
        groq_key = settings.GROQ_API_KEY or os.environ.get("GROQ_API_KEY", "")
        if groq_key:
            try:
                import httpx
                headers = {
                    "Authorization": f"Bearer {groq_key}",
                    "Content-Type": "application/json",
                }
                payload = {
                    "model": "llama-3.3-70b-versatile",
                    "messages": [
                        {"role": "system", "content": "You are CampusOS AI assistant. Answer concisely and accurately based on the provided context."},
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.3,
                    "max_tokens": 500,
                }
                async with httpx.AsyncClient(timeout=10) as client:
                    res = await client.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
                    res.raise_for_status()
                    answer_text = res.json()["choices"][0]["message"]["content"].strip()
                    return {
                        "answer": answer_text,
                        "intent": intent,
                        "sources": sources,
                        "suggested_actions": suggested_actions,
                    }
            except Exception as e:
                print(f"[Groq API fallback] {e}")

        # 6. High-Reliability Local Semantic Grounding (Offline Mode)
        # Even with no external LLM key, intelligently summarize the matched campus knowledge
        if relevant_docs:
            best_doc = relevant_docs[0]
            paragraphs = [p.strip() for p in best_doc["content"].split("\n") if p.strip()]
            snippet = "\n\n".join(paragraphs[:3])
            ans = (
                f"According to the official **{best_doc['title']}** ({best_doc['category']}):\n\n"
                f"{snippet}\n\n"
                f"*(Source: {best_doc['title']})*"
            )
        else:
            ans = (
                f"I processed your query: **\"{query}\"**.\n\n"
                "I could not locate a specific campus rule or circular directly matching this query. "
                "You can raise a ticket at the **Campus Helpdesk** or check the **Notices** tab for recent announcements."
            )

        return {
            "answer": ans,
            "intent": intent,
            "sources": sources,
            "suggested_actions": suggested_actions,
        }
