from fastapi import APIRouter
from backend.app.models.tutor import TutorRequestModel, TutorResponseModel
from backend.app.services.ai_service import ai_tutor_service

router = APIRouter(prefix="/tutor", tags=["AI Quantum Tutor"])

@router.post("/chat", response_model=TutorResponseModel)
async def chat_with_tutor(request: TutorRequestModel):
    """
    Query the AI Quantum Tutor with circuit and lesson context.
    Currently backed by MockGeminiTutorService, ready for Google Gemini API swap.
    """
    return await ai_tutor_service.generate_guidance(request)
