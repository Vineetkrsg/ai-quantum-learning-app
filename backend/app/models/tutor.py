from typing import Optional, List
from pydantic import BaseModel

class ChatMessageModel(BaseModel):
    id: str
    sender: str  # "user" | "tutor"
    text: str
    timestamp: str

class CircuitContextModel(BaseModel):
    numberOfQubits: int
    gateCount: int
    summary: str

class LessonContextModel(BaseModel):
    moduleId: str
    moduleTitle: str
    lessonTitle: str

class TutorRequestModel(BaseModel):
    message: str
    history: List[ChatMessageModel] = []
    circuitContext: Optional[CircuitContextModel] = None
    lessonContext: Optional[LessonContextModel] = None

class TutorResponseModel(BaseModel):
    reply: str
    suggestedFollowups: List[str] = []
    referencedConcepts: List[str] = []
