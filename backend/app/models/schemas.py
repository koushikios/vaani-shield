from datetime import datetime

from pydantic import BaseModel, ConfigDict


class HealthResponse(BaseModel):
    status: str
    app_name: str
    environment: str


class HistoryItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    session_id: str
    filename: str | None
    created_at: datetime
    prediction: str
    confidence: float
    processing_time_ms: int | None
    duration_seconds: float | None
    explanation_summary: str | None


class HistoryListResponse(BaseModel):
    total: int
    items: list[HistoryItem]


class DeleteResponse(BaseModel):
    session_id: str
    deleted: bool


class ErrorResponse(BaseModel):
    error: str
    message: str