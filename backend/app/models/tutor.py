from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ChatMessageModel(BaseModel):
    id: str
    sender: str  # "user" | "tutor"
    text: str
    timestamp: str

class CircuitContextModel(BaseModel):
    numberOfQubits: int = 1
    gateCount: int = 0
    summary: str = ""
    gates: List[Dict[str, Any]] = []
    circuitName: Optional[str] = None
    targetOutcome: Optional[str] = None

class CodeContextModel(BaseModel):
    code: str
    language: str = "python"
    taskDescription: Optional[str] = None
    starterCode: Optional[str] = None

class SimulationResultContextModel(BaseModel):
    counts: Optional[Dict[str, int]] = None
    probabilities: Optional[Dict[str, float]] = None
    shots: Optional[int] = 1024
    executionTimeMs: Optional[float] = None

class LessonContextModel(BaseModel):
    moduleId: str
    moduleTitle: Optional[str] = None
    lessonId: Optional[str] = None
    lessonTitle: Optional[str] = None
    currentTopic: Optional[str] = None
    activityId: Optional[str] = None

class StudentProgressContextModel(BaseModel):
    overallProgress: int = 0
    completedLessonsCount: int = 0
    xp: int = 0

class GeneratedQuestionOption(BaseModel):
    id: str
    text: str
    isCorrect: bool

class GeneratedQuestionModel(BaseModel):
    id: str
    type: str  # "multiple-choice" | "prediction" | "circuit-fix" | "code-interpretation"
    question: str
    options: List[GeneratedQuestionOption] = []
    hint: Optional[str] = None
    explanation: str

class TutorRequestModel(BaseModel):
    message: str = ""
    action: str = "chat"  # "chat" | "explain_circuit" | "explain_code" | "debug_code" | "hint" | "generate_question"
    history: List[ChatMessageModel] = []
    circuitContext: Optional[CircuitContextModel] = None
    codeContext: Optional[CodeContextModel] = None
    simulationResult: Optional[SimulationResultContextModel] = None
    lessonContext: Optional[LessonContextModel] = None
    studentProgress: Optional[StudentProgressContextModel] = None
    hintLevel: int = 1  # 1 (conceptual), 2 (specific), 3 (near-solution)

class TutorResponseModel(BaseModel):
    reply: str
    action: str = "chat"
    suggestedFollowups: List[str] = []
    referencedConcepts: List[str] = []
    provider: str = "mock"  # "mock" | "gemini"
    generatedQuestion: Optional[GeneratedQuestionModel] = None
    debugHints: Optional[List[str]] = None
    hintLevel: Optional[int] = None

