from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.db_models import AnalysisSession
from app.models.schemas import (
    DeleteResponse,
    HistoryItem,
    HistoryListResponse,
)

router = APIRouter(
    prefix="/api/history",
    tags=["history"]
)


@router.get("", response_model=HistoryListResponse)
def list_history(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
) -> HistoryListResponse:

    total = db.query(AnalysisSession).count()

    records = (
        db.query(AnalysisSession)
        .order_by(AnalysisSession.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return HistoryListResponse(
        total=total,
        items=[
            HistoryItem.model_validate(record)
            for record in records
        ],
    )


@router.get("/{session_id}", response_model=HistoryItem)
def get_history_item(
    session_id: str,
    db: Session = Depends(get_db)
) -> HistoryItem:

    record = (
        db.query(AnalysisSession)
        .filter(AnalysisSession.session_id == session_id)
        .first()
    )

    if record is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "not_found",
                "message": "Session not found"
            },
        )

    return HistoryItem.model_validate(record)


@router.delete(
    "/{session_id}",
    response_model=DeleteResponse
)
def delete_history_item(
    session_id: str,
    db: Session = Depends(get_db)
) -> DeleteResponse:

    record = (
        db.query(AnalysisSession)
        .filter(AnalysisSession.session_id == session_id)
        .first()
    )

    if record is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "not_found",
                "message": "Session not found"
            },
        )

    db.delete(record)
    db.commit()

    return DeleteResponse(
        session_id=session_id,
        deleted=True
    )