"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  GraduationCap,
  Loader2,
  Mail,
  Phone,
  Upload,
  User,
} from "lucide-react";
import { useState } from "react";

type Step = "upload" | "interview" | "analyzing" | "report" | "email";

interface InterviewQuestion {
  id: string;
  question: string;
  answer?: string;
  status: "pending" | "answered" | "analyzing";
}

export default function AutomataRRHH() {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Simular preguntas de entrevista
  const interviewQuestions: InterviewQuestion[] = [
    {
      id: "1",
      question: "¿Puedes describir tu experiencia laboral más relevante?",
      status: "pending",
    },
    {
      id: "2",
      question: "¿Qué te motiva en tu carrera profesional?",
      status: "pending",
    },
    {
      id: "3",
      question: "¿Cómo manejas situaciones de presión o deadlines ajustados?",
      status: "pending",
    },
    {
      id: "4",
      question: "¿Qué habilidades técnicas dominas?",
      status: "pending",
    },
    { id: "5", question: "¿Dónde te ves en 3 años?", status: "pending" },
    {
      id: "6",
      question: "¿Por qué estás interesado en esta posición?",
      status: "pending",
    },
    {
      id: "7",
      question: "¿Cuál es tu expectativa salarial?",
      status: "pending",
    },
    {
      id: "8",
      question: "¿Tienes disponibilidad para viajar?",
      status: "pending",
    },
  ];

  const [questions, setQuestions] = useState(interviewQuestions);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCurrentStep("interview");
      // Simular inicio automático de entrevista
      setTimeout(() => startInterview(), 2000);
    }
  };

  const startInterview = () => {
    setIsInterviewActive(true);
    setCurrentStep("interview");
    simulateInterview();
  };

  const simulateInterview = async () => {
    for (let i = 0; i < questions.length; i++) {
      setCurrentQuestionIndex(i);

      // Actualizar estado de la pregunta actual
      setQuestions((prev) =>
        prev.map((q, index) =>
          index === i ? { ...q, status: "analyzing" as const } : q
        )
      );

      // Simular tiempo de respuesta
      await new Promise((resolve) =>
        setTimeout(resolve, 3000 + Math.random() * 2000)
      );

      // Simular respuesta del candidato
      const mockAnswer = generateMockAnswer(questions[i].question);
      setQuestions((prev) =>
        prev.map((q, index) =>
          index === i
            ? { ...q, status: "answered" as const, answer: mockAnswer }
            : q
        )
      );

      // Actualizar progreso
      setProgress(((i + 1) / questions.length) * 100);

      // Pequeña pausa entre preguntas
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Finalizar entrevista y generar reporte
    setIsInterviewActive(false);
    setCurrentStep("analyzing");

    setTimeout(() => {
      setCurrentStep("report");
    }, 3000);
  };

  const generateMockAnswer = (question: string): string => {
    const answers = [
      "Tengo 5 años de experiencia en desarrollo web, trabajando principalmente con React y Node.js...",
      "Me motiva poder crear soluciones que impacten positivamente en la vida de las personas...",
      "En situaciones de presión, priorizo tareas, comunico claramente y busco soluciones eficientes...",
      "Domino JavaScript, TypeScript, React, Node.js, y tengo experiencia con bases de datos SQL y NoSQL...",
      "En 3 años me veo liderando proyectos innovadores y mentorando a desarrolladores junior...",
      "Estoy interesado en esta posición porque valoro la cultura de innovación y crecimiento profesional...",
      "Mi expectativa salarial está en el rango de $X a $Y, dependiendo de los beneficios incluidos...",
      "Tengo disponibilidad completa para viajes nacionales e internacionales según sea necesario...",
    ];

    const questionIndex = questions.findIndex((q) => q.question === question);
    return (
      answers[questionIndex] ||
      "Respuesta detallada basada en el perfil del candidato..."
    );
  };

  const handleSendReport = () => {
    setCurrentStep("email");
    // Simular envío de email
    setTimeout(() => {
      alert("✅ Reporte enviado exitosamente por correo electrónico");
    }, 2000);
  };

  const getStepStatus = (step: Step) => {
    const steps = ["upload", "interview", "analyzing", "report", "email"];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-900 via-indigo-900 to-purple-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Automata de Recursos Humanos
              </h1>
              <p className="text-white/70">
                Sistema automatizado de reclutamiento con IA
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[
              { step: "upload", label: "Cargar CV", icon: Upload },
              { step: "interview", label: "Entrevista", icon: Phone },
              { step: "analyzing", label: "Análisis", icon: FileText },
              { step: "report", label: "Reporte", icon: FileText },
              { step: "email", label: "Enviar", icon: Mail },
            ].map(({ step, label, icon: Icon }) => {
              const status = getStepStatus(step as Step);
              return (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      status === "completed"
                        ? "bg-green-500"
                        : status === "active"
                        ? "bg-blue-500 animate-pulse"
                        : "bg-white/20"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span
                    className={`text-xs text-center ${
                      status === "active"
                        ? "text-white font-medium"
                        : "text-white/60"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Panel */}
          <div className="lg:col-span-2">
            {currentStep === "upload" && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Cargar Curriculum Vitae
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Sube tu CV para iniciar el proceso de evaluación
                    automatizada
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-white/50 transition-colors">
                    <Upload className="w-12 h-12 text-white/50 mx-auto mb-4" />
                    <p className="text-white/70 mb-4">
                      Arrastra tu CV aquí o haz clic para seleccionar
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="cv-upload"
                    />
                    <Button
                      onClick={() =>
                        document.getElementById("cv-upload")?.click()
                      }
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Seleccionar Archivo
                    </Button>
                  </div>
                  <p className="text-xs text-white/50 text-center">
                    Formatos aceptados: PDF, DOC, DOCX (Máx. 10MB)
                  </p>
                </CardContent>
              </Card>
            )}

            {currentStep === "interview" && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Entrevista Automatizada
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    La automata te está entrevistando. Responde de forma
                    natural.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Current Question */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                        <span className="text-blue-400 font-medium">
                          Automata Hablando
                        </span>
                      </div>
                      <p className="text-white text-lg">
                        {questions[currentQuestionIndex]?.question}
                      </p>
                    </div>

                    {/* Previous Answers */}
                    {questions
                      .slice(0, currentQuestionIndex)
                      .map((q, index) => (
                        <div
                          key={q.id}
                          className="bg-white/5 border border-white/10 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 font-medium">
                              Tu Respuesta
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              Pregunta {index + 1}
                            </Badge>
                          </div>
                          <p className="text-white/70 italic mb-2">
                            "{q.question}"
                          </p>
                          <p className="text-white">{q.answer}</p>
                        </div>
                      ))}

                    {isInterviewActive && (
                      <div className="text-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-400 mx-auto mb-2" />
                        <p className="text-white/70">Procesando respuesta...</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {(currentStep === "analyzing" || currentStep === "report") && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {currentStep === "analyzing"
                      ? "Analizando Respuestas"
                      : "Reporte Final"}
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    {currentStep === "analyzing"
                      ? "La IA está evaluando tus respuestas y perfil..."
                      : "Análisis completo del candidato generado"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentStep === "analyzing" ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
                      <p className="text-white/70 mb-2">
                        Analizando perfil y respuestas...
                      </p>
                      <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full animate-pulse"
                          style={{ width: "60%" }}
                        ></div>
                      </div>
                      <p className="text-xs text-white/50">
                        Esto tomará unos segundos
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Candidate Summary */}
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <h4 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Evaluación General
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-white/70">
                              Puntuación General:
                            </span>
                            <span className="text-white ml-2 font-medium">
                              8.5/10
                            </span>
                          </div>
                          <div>
                            <span className="text-white/70">
                              Ajuste Cultural:
                            </span>
                            <span className="text-white ml-2 font-medium">
                              Alto
                            </span>
                          </div>
                          <div>
                            <span className="text-white/70">
                              Habilidades Técnicas:
                            </span>
                            <span className="text-white ml-2 font-medium">
                              Excelente
                            </span>
                          </div>
                          <div>
                            <span className="text-white/70">Experiencia:</span>
                            <span className="text-white ml-2 font-medium">
                              5+ años
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Strengths & Areas */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                          <h4 className="text-green-400 font-medium mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Fortalezas
                          </h4>
                          <ul className="space-y-1 text-sm text-white/80">
                            <li>• Excelente comunicación verbal</li>
                            <li>• Experiencia técnica sólida</li>
                            <li>• Alto nivel de motivación</li>
                            <li>• Buena capacidad de liderazgo</li>
                          </ul>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                          <h4 className="text-yellow-400 font-medium mb-3 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Áreas de Mejora
                          </h4>
                          <ul className="space-y-1 text-sm text-white/80">
                            <li>• Experiencia en gestión de equipos</li>
                            <li>• Conocimientos en metodologías ágiles</li>
                            <li>• Idiomas adicionales</li>
                          </ul>
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h4 className="text-blue-400 font-medium mb-3">
                          Recomendaciones
                        </h4>
                        <div className="space-y-3 text-sm text-white/80">
                          <div className="flex items-start gap-2">
                            <Badge className="bg-green-500/20 text-green-400 text-xs mt-0.5">
                              Alta Prioridad
                            </Badge>
                            <span>
                              Invitar a entrevista técnica con el equipo de
                              desarrollo
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge className="bg-blue-500/20 text-blue-400 text-xs mt-0.5">
                              Media Prioridad
                            </Badge>
                            <span>
                              Evaluar competencias de liderazgo en segunda
                              entrevista
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge className="bg-yellow-500/20 text-yellow-400 text-xs mt-0.5">
                              Baja Prioridad
                            </Badge>
                            <span>
                              Considerar capacitación en metodologías ágiles
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {currentStep === "email" && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Reporte Enviado
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    El reporte completo ha sido enviado por correo electrónico
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert className="bg-green-500/10 border-green-500/20">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-100">
                      ✅ Reporte enviado exitosamente a
                      reclutamiento@empresa.com
                      <br />
                      📧 El candidato también recibió una copia del análisis
                    </AlertDescription>
                  </Alert>

                  <div className="mt-6 text-center">
                    <Button
                      onClick={() => {
                        setCurrentStep("upload");
                        setSelectedFile(null);
                        setProgress(0);
                        setQuestions(
                          interviewQuestions.map((q) => ({
                            ...q,
                            status: "pending" as const,
                            answer: undefined,
                          }))
                        );
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Evaluar Otro Candidato
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Candidate Info */}
            {selectedFile && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Información del Candidato
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-white/60" />
                    <span className="text-white/70">CV:</span>
                    <span className="text-white">{selectedFile.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-white/60" />
                    <span className="text-white/70">Progreso:</span>
                    <span className="text-white">{Math.round(progress)}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="w-4 h-4 text-white/60" />
                    <span className="text-white/70">Preguntas:</span>
                    <span className="text-white">
                      {currentQuestionIndex + 1}/{questions.length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Process Steps */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Proceso Automatizado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep !== "upload" ? "bg-green-500" : "bg-white/20"
                    }`}
                  >
                    <Upload className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      Carga de CV
                    </p>
                    <p className="text-white/60 text-xs">PDF/DOC analysis</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      ["interview", "analyzing", "report", "email"].includes(
                        currentStep
                      )
                        ? "bg-blue-500"
                        : "bg-white/20"
                    }`}
                  >
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      Entrevista IA
                    </p>
                    <p className="text-white/60 text-xs">
                      8 preguntas automatizadas
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      ["analyzing", "report", "email"].includes(currentStep)
                        ? "bg-blue-500"
                        : "bg-white/20"
                    }`}
                  >
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      Análisis & Reporte
                    </p>
                    <p className="text-white/60 text-xs">Evaluación completa</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === "email" ? "bg-green-500" : "bg-white/20"
                    }`}
                  >
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      Envío Automático
                    </p>
                    <p className="text-white/60 text-xs">Email al reclutador</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demo Features */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Características de la Demo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/70">
                      Análisis automático de CV
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/70">
                      Entrevista conversacional
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/70">Evaluación por IA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/70">Reportes automáticos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/70">Envío por email</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
