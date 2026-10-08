"""
Dynamic Campus Knowledge Base & RAG Query Router with RBAC.
"""
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import CurrentUser
from app.models.knowledge import CampusKnowledgeDoc
from app.rbac import require_role
from app.schemas.knowledge import (
    KnowledgeDocOut,
    KnowledgeIngestRequest,
    SmartAIQueryRequest,
    SmartAIQueryResponse,
)
from app.services.knowledge_service import KnowledgeService

router = APIRouter(prefix="/ai/knowledge", tags=["ai-knowledge"])
DB = Annotated[AsyncSession, Depends(get_db)]


@router.post(
    "/ingest",
    response_model=KnowledgeDocOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_role("ACADEMIC_ADMIN", "SUPER_ADMIN"))],
)
@router.post(
    "/ingest/text",
    response_model=KnowledgeDocOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_role("ACADEMIC_ADMIN", "SUPER_ADMIN"))],
)
async def ingest_knowledge(
    body: KnowledgeIngestRequest,
    current_user: CurrentUser,
    db: DB,
):
    """Admin dynamically uploads campus policies, circulars, fee rules, or guidelines."""
    doc = await KnowledgeService.ingest_document(
        db=db,
        title=body.title,
        category=body.category,
        content=body.content,
        tags=body.tags,
        source_filename=body.source_filename,
    )
    return KnowledgeDocOut.model_validate(doc)


@router.get("/documents", response_model=list[KnowledgeDocOut])
async def list_knowledge_documents(
    current_user: CurrentUser,
    db: DB,
    category: str | None = None,
):
    """List all ingested campus knowledge documents."""
    docs = await KnowledgeService.list_documents(db=db, category=category)
    return [KnowledgeDocOut.model_validate(d) for d in docs]


@router.delete(
    "/documents/{doc_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_role("ACADEMIC_ADMIN", "SUPER_ADMIN"))],
)
async def delete_knowledge_document(
    doc_id: uuid.UUID,
    current_user: CurrentUser,
    db: DB,
):
    """Remove an outdated policy document."""
    res = await db.execute(
        select(CampusKnowledgeDoc).where(CampusKnowledgeDoc.id == doc_id)
    )
    doc = res.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    await db.delete(doc)
    await db.commit()
    return None


@router.post("/ask", response_model=SmartAIQueryResponse)
@router.post("/query", response_model=SmartAIQueryResponse)
async def ask_smart_campus_ai(
    body: SmartAIQueryRequest,
    current_user: CurrentUser,
    db: DB,
):
    """
    Intelligent campus query answering:
    Searches dynamically ingested documents + user profile & role.
    """
    user_ctx = {
        "name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role,
        "year": current_user.year_of_study,
    }

    result = await KnowledgeService.smart_answer(
        db=db,
        query=body.query,
        student_context=user_ctx if body.include_personal_context else None,
    )

    return SmartAIQueryResponse(
        answer=result["answer"],
        intent=result["intent"],
        sources=result["sources"],
        suggested_actions=result["suggested_actions"],
    )
