"""
Pydantic schemas for Dynamic Campus Knowledge Ingestion & Intelligent AI Search (RAG).
"""
import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class KnowledgeIngestRequest(BaseModel):
    title: str = Field(min_length=3, max_length=255)
    category: str = Field(default="GENERAL")  # POLICY, EXAM_RULES, CIRCULAR, FAQ, HOSTEL, FINANCE, GENERAL
    content: str = Field(min_length=10)
    tags: str | None = None
    source_filename: str | None = None


class KnowledgeDocOut(BaseModel):
    id: uuid.UUID
    title: str
    category: str
    content: str
    tags: str | None
    source_filename: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class SmartAIQueryRequest(BaseModel):
    query: str = Field(min_length=1)
    include_personal_context: bool = True


class SmartAIQueryResponse(BaseModel):
    answer: str
    intent: str  # INFORMATIONAL, ACTIONABLE_REQUEST, TIMETABLE_QUERY, UNKNOWN
    sources: list[str] = []
    suggested_actions: list[dict[str, str]] = []
