"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Settings, 
  Briefcase, 
  Mail, 
  Building, 
  User, 
  UserCheck, 
  Plus, 
  Trash2,
  Copy,
  Info,
  CheckCircle,
  FileText,
  Sliders,
  ChevronRight,
  ExternalLink,
  Edit2
} from "lucide-react";
import { 
  getAllTemplates, 
  saveRequest, 
  ReferenceRequest 
} from "@/lib/storage";
import { 
  SurveyTemplate, 
  SurveyQuestion, 
  JobTypeKey,
  QuestionCategory,
  QuestionType,
  QuestionTarget
} from "@/lib/questions";

export default function CreateCase() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [templates, setTemplates] = useState<SurveyTemplate[]>([]);
  
  // Case configurations
  const [jobType, setJobType] = useState<JobTypeKey>("pm");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("template_pm");
  const [caseQuestions, setCaseQuestions] = useState<SurveyQuestion[]>([]);
  const [customizationChoice, setCustomizationChoice] = useState<"as-is" | "custom">("as-is");
  
  // Candidate info
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePosition, setCandidatePosition] = useState("");
  const [candidateCompany, setCandidateCompany] = useState("");

  // Interviewer info
  const [interviewerName, setInterviewerName] = useState("");
  const [interviewerEmail, setInterviewerEmail] = useState("");
  const [interviewerTitle, setInterviewerTitle] = useState("채용 담당자");

  // Output Links (Step 5)
  const [generatedCaseId, setGeneratedCaseId] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Question editing modal/inline state
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<SurveyQuestion>>({
    category: "",
    type: "scale",
    target: "all",
    title: "",
    question: "",
    optionA: "",
    optionB: ""
  });

  useEffect(() => {
    const list = getAllTemplates();
    setTemplates(list);
    
    // Select initial template
    const pmTemp = list.find(t => t.jobType === "pm");
    if (pmTemp) {
      setSelectedTemplateId(pmTemp.id);
      setCaseQuestions(JSON.parse(JSON.stringify(pmTemp.questions)));
    }
  }, []);

  // Update questions whenever job type or template changes
  const handleJobTypeAndTemplateChange = (jType: JobTypeKey, tId: string) => {
    setJobType(jType);
    setSelectedTemplateId(tId);
    const targetTemp = templates.find(t => t.id === tId) || templates.find(t => t.jobType === jType);
    if (targetTemp) {
      setSelectedTemplateId(targetTemp.id);
      setCaseQuestions(JSON.parse(JSON.stringify(targetTemp.questions)));
    }
  };

  const validateStep4 = () => {
    const newErrors: Record<string, string> = {};
    if (!candidateName.trim()) newErrors.candidateName = "후보자 이름을 입력해주세요.";
    if (!candidateEmail.trim()) {
      newErrors.candidateEmail = "후보자 이메일을 입력해주세요.";
    } else if (!/\S+@\S+\.\S+/.test(candidateEmail)) {
      newErrors.candidateEmail = "올바른 이메일 형식이 아닙니다.";
    }
    if (!candidatePosition.trim()) newErrors.candidatePosition = "지원 포지션을 입력해주세요.";
    if (!candidateCompany.trim()) newErrors.candidateCompany = "채용사명을 입력해주세요.";

    if (!interviewerName.trim()) newErrors.interviewerName = "면접관 이름을 입력해주세요.";
    if (!interviewerEmail.trim()) {
      newErrors.interviewerEmail = "면접관 이메일을 입력해주세요.";
    } else if (!/\S+@\S+\.\S+/.test(interviewerEmail)) {
      newErrors.interviewerEmail = "올바른 이메일 형식이 아닙니다.";
    }
    if (!interviewerTitle.trim()) newErrors.interviewerTitle = "면접관 직책을 입력해주세요.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      // Find template for the selected job type
      const targetTemp = templates.find(t => t.jobType === jobType);
      if (targetTemp) {
        setSelectedTemplateId(targetTemp.id);
        setCaseQuestions(JSON.parse(JSON.stringify(targetTemp.questions)));
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      if (validateStep4()) {
        // Save Request and move to Step 5
        const newId = "case_" + Math.random().toString(36).substring(2, 9);
        const newRequest: ReferenceRequest = {
          id: newId,
          candidate: {
            name: candidateName,
            email: candidateEmail,
            position: candidatePosition,
            company: candidateCompany
          },
          referees: [], // Start empty, filled by candidate
          interviewer: {
            name: interviewerName,
            email: interviewerEmail,
            title: interviewerTitle
          },
          jobType,
          templateId: selectedTemplateId,
          customQuestions: caseQuestions,
          createdAt: new Date().toISOString().split("T")[0],
          status: "pending"
        };

        saveRequest(newRequest);
        setGeneratedCaseId(newId);
        setStep(5);
        setErrors({});
      }
    }
  };

  const handleBack = () => {
    if (step > 1 && step < 5) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const handleAddOrEditQuestion = () => {
    if (!newQuestion.title || !newQuestion.question) {
      alert("질문 제목과 질문 내용을 작성해주세요.");
      return;
    }
    if (newQuestion.type === "ab" && (!newQuestion.optionA || !newQuestion.optionB)) {
      alert("A/B 선택지 내용을 작성해주세요.");
      return;
    }

    if (editingQuestionId) {
      const updated = caseQuestions.map(q => {
        if (q.id === editingQuestionId) {
          return {
            ...q,
            category: newQuestion.category || "기본 카테고리",
            title: newQuestion.title || "",
            question: newQuestion.question || "",
            type: newQuestion.type as QuestionType,
            target: newQuestion.target as QuestionTarget,
            optionA: newQuestion.type === "ab" ? newQuestion.optionA : undefined,
            optionB: newQuestion.type === "ab" ? newQuestion.optionB : undefined
          };
        }
        return q;
      });
      setCaseQuestions(updated);
      setEditingQuestionId(null);
    } else {
      const added: SurveyQuestion = {
        id: `custom_q_${Date.now()}`,
        category: newQuestion.category || "기본 카테고리",
        title: newQuestion.title,
        question: newQuestion.question,
        type: newQuestion.type as QuestionType,
        target: newQuestion.target as QuestionTarget,
        optionA: newQuestion.type === "ab" ? newQuestion.optionA : undefined,
        optionB: newQuestion.type === "ab" ? newQuestion.optionB : undefined
      };
      setCaseQuestions([...caseQuestions, added]);
    }

    setIsAddingQuestion(false);
    setNewQuestion({
      category: "",
      type: "scale",
      target: "all",
      title: "",
      question: "",
      optionA: "",
      optionB: ""
    });
  };

  const handleDeleteQuestion = (qId: string) => {
    if (confirm("이 문항을 이 후보자의 평판 질문에서 제외하시겠습니까?")) {
      setCaseQuestions(caseQuestions.filter(q => q.id !== qId));
    }
  };

  const handleDuplicateQuestion = (q: SurveyQuestion) => {
    const duplicated: SurveyQuestion = {
      ...JSON.parse(JSON.stringify(q)),
      id: `custom_q_copy_${Date.now()}`,
      title: `${q.title} (복사본)`
    };
    const idx = caseQuestions.findIndex(item => item.id === q.id);
    const updated = [...caseQuestions];
    updated.splice(idx + 1, 0, duplicated);
    setCaseQuestions(updated);
  };

  const handleOpenEditQuestion = (q: SurveyQuestion) => {
    setEditingQuestionId(q.id);
    setNewQuestion({
      category: q.category,
      type: q.type,
      target: q.target,
      title: q.title,
      question: q.question,
      optionA: q.optionA || "",
      optionB: q.optionB || ""
    });
    setIsAddingQuestion(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("링크가 클립보드에 복사되었습니다!");
  };

  const jobTypeOptions = [
    { key: "general", label: "기본 레퍼런스 체크", focus: "업무성향, 조직적합성, 협업성향 균형 평가" },
    { key: "developer", label: "개발자 채용", focus: "문제 해결력, 업무 신뢰도, 협업 방식, 코드 리뷰, 일정 관리" },
    { key: "designer", label: "디자이너 채용", focus: "사용자 관점, 피드백 수용, 협업 소통, 창의성/실행 균형, 일정 산출물" },
    { key: "hr", label: "인사/HR 채용", focus: "커뮤니케이션, 신뢰성, 조직문화 이해, 민감정보 처리, 갈등 조율" },
    { key: "accounting", label: "회계 채용", focus: "정확성, 규정 준수, 반복 업무 신뢰도, 마감 대응, 세부사항 검토" },
    { key: "finance", label: "재무 채용", focus: "데이터 기반 판단, 리스크 관리, 전략적 사고, 보고서 작성, 의사결정 지원" },
    { key: "sales", label: "영업 채용", focus: "실행력, 커뮤니케이션, 목표 달성, 고객 대응, 회복탄력성" },
    { key: "pm", label: "PM/기획 채용", focus: "우선순위 판단, 문제 정의, 데이터 의사결정, 크로스펑셔널 협업, 실행 관리" }
  ];

  const jobTemplates = templates.filter(t => t.jobType === jobType);

  return (
    <div className="flex-1 bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        
        {/* Top Header */}
        <div className="mb-8">
          <Link
            href="/company/dashboard"
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">대시보드로 돌아가기</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2 tracking-tight sm:text-3xl">
            새로운 레퍼런스 체크 요청 등록
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            5단계 마법사를 통해 직무 유형에 맞는 평가 질문지를 생성하고 후보자 발송 링크를 획득합니다.
          </p>
        </div>

        {/* Wizard Progress Bar */}
        <div className="mb-10 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex flex-col items-center flex-1 relative">
                {s > 1 && (
                  <div className={`absolute top-4.5 left-[-50%] right-[50%] h-0.5 -z-10 ${
                    step >= s ? "bg-indigo-600" : "bg-slate-200"
                  }`} />
                )}
                
                <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 font-bold text-xs transition-all duration-300 ${
                  step > s 
                    ? "bg-indigo-600 border-indigo-600 text-white" 
                    : step === s 
                      ? "border-indigo-600 text-indigo-600 bg-white ring-4 ring-indigo-50"
                      : "border-slate-200 text-slate-400 bg-white"
                }`}>
                  {step > s ? "✓" : s}
                </div>
                
                <span className={`mt-2 text-[10px] sm:text-xs font-bold whitespace-nowrap ${
                  step === s ? "text-indigo-600" : "text-slate-400"
                }`}>
                  {s === 1 && "직무 선택"}
                  {s === 2 && "템플릿 선택"}
                  {s === 3 && "질문 커스텀"}
                  {s === 4 && "정보 입력"}
                  {s === 5 && "링크 생성"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Forms Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          
          {/* Step 1: Select Job Type */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 1: 직무 유형 선택</h2>
                <p className="text-xs text-slate-500 mt-0.5">평가할 후보자의 직무 성격에 가까운 유형을 고르세요.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobTypeOptions.map((opt) => (
                  <div
                    key={opt.key}
                    onClick={() => setJobType(opt.key as JobTypeKey)}
                    className={`border rounded-2xl p-4.5 cursor-pointer transition-all hover:border-indigo-300 hover:bg-slate-50/50 ${
                      jobType === opt.key 
                        ? "border-indigo-650 bg-indigo-50/10 ring-2 ring-indigo-100" 
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 whitespace-nowrap">
                      <Briefcase className={`h-4.5 w-4.5 shrink-0 ${jobType === opt.key ? "text-indigo-600" : "text-slate-400"}`} />
                      <span className="font-bold text-slate-900 text-sm whitespace-nowrap">{opt.label}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      <b className="text-slate-700">진단 핵심:</b> {opt.focus}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Survey Template */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 2: 평가 설문 템플릿 지정</h2>
                <p className="text-xs text-slate-500 mt-0.5">선택하신 직무에 맞춰 미리 구성된 템플릿 중 하나를 지정합니다.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {jobTemplates.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTemplateId(t.id)}
                    className={`border rounded-2xl p-5 cursor-pointer transition-all hover:bg-slate-50/50 ${
                      selectedTemplateId === t.id 
                        ? "border-indigo-650 bg-indigo-50/10 ring-2 ring-indigo-100" 
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-slate-900 text-base">{t.name}</span>
                      <span className="text-xs bg-slate-100 px-2.5 py-0.8 rounded-full font-bold text-slate-600">
                        총 {t.questions.length}개 질문 구성
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-normal mb-3 font-semibold">{t.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {Object.keys(t.weights).map((cat) => (
                        <span key={cat} className="text-[10px] bg-indigo-50/50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100 font-bold">
                          {cat} ({Math.round(t.weights[cat]*100)}%)
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Customize template choice and Inline builder */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 3: 설문지 질문 커스터마이징</h2>
                <p className="text-xs text-slate-500 mt-0.5">기존 템플릿 질문을そのまま 활용하거나, 기업 맞춤형으로 변형시킬 수 있습니다.</p>
              </div>

              {/* Radio Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`border rounded-2xl p-4 flex items-start gap-3 cursor-pointer transition-all hover:bg-slate-50/50 ${
                  customizationChoice === "as-is" 
                    ? "border-indigo-600 bg-indigo-50/10 ring-2 ring-indigo-100" 
                    : "border-slate-200"
                }`}>
                  <input
                    type="radio"
                    name="customizationChoice"
                    value="as-is"
                    checked={customizationChoice === "as-is"}
                    onChange={() => setCustomizationChoice("as-is")}
                    className="mt-1 accent-indigo-600 shrink-0"
                  />
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 block whitespace-nowrap">기본 템플릿 그대로 사용</span>
                    <span className="text-xs text-slate-500 leading-relaxed font-semibold">템플릿에 정의된 표준 {caseQuestions.length}개 평판 질문지를 별도 편집 없이 발송합니다.</span>
                  </div>
                </label>

                <label className={`border rounded-2xl p-4 flex items-start gap-3 cursor-pointer transition-all hover:bg-slate-50/50 ${
                  customizationChoice === "custom" 
                    ? "border-indigo-600 bg-indigo-50/10 ring-2 ring-indigo-100" 
                    : "border-slate-200"
                }`}>
                  <input
                    type="radio"
                    name="customizationChoice"
                    value="custom"
                    checked={customizationChoice === "custom"}
                    onChange={() => setCustomizationChoice("custom")}
                    className="mt-1 accent-indigo-600 shrink-0"
                  />
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 block whitespace-nowrap">질문 커스터마이징 후 사용</span>
                    <span className="text-xs text-slate-500 leading-relaxed font-semibold">이 케이스만을 위한 질문 추가, 내용 편집, 또는 삭제 과정을 거친 뒤 진행합니다.</span>
                  </div>
                </label>
              </div>

              {/* Editable Question Editor (visible if custom selected) */}
              {customizationChoice === "custom" && (
                <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                    <span className="text-xs font-bold text-slate-800">질문 목록 ({caseQuestions.length}개)</span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingQuestionId(null);
                        setNewQuestion({
                          category: caseQuestions[0]?.category || "업무 성격",
                          type: "scale",
                          target: "all",
                          title: "",
                          question: "",
                          optionA: "",
                          optionB: ""
                        });
                        setIsAddingQuestion(true);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 rounded-lg px-2.5 py-1.5 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>질문 추가</span>
                    </button>
                  </div>

                  {/* Add / Edit Inline Form */}
                  {isAddingQuestion && (
                    <div className="bg-slate-50 border border-slate-250 p-4.5 rounded-xl space-y-3.5 animate-in fade-in">
                      <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-700">
                        <div>
                          <label className="block mb-1 text-[11px] text-slate-500">진단 카테고리</label>
                          <input
                            type="text"
                            placeholder="예: 문제 해결력"
                            value={newQuestion.category}
                            onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                            className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-[11px] text-slate-500">질문 유형</label>
                          <select
                            value={newQuestion.type}
                            onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as QuestionType })}
                            className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs"
                          >
                            <option value="scale">5점 척도</option>
                            <option value="ab">A/B 선택형</option>
                            <option value="short">서술형</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-700">
                        <div>
                          <label className="block mb-1 text-[11px] text-slate-500">질문 제목 (간략)</label>
                          <input
                            type="text"
                            placeholder="예: 리팩토링 선호도"
                            value={newQuestion.title}
                            onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                            className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-[11px] text-slate-500">대상 응답자</label>
                          <select
                            value={newQuestion.target}
                            onChange={(e) => setNewQuestion({ ...newQuestion, target: e.target.value as QuestionTarget })}
                            className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs bg-white text-slate-800"
                          >
                            <option value="all">모든 대상자</option>
                            <option value="self">후보자 자기평가</option>
                            <option value="peer">추천인 평판평가</option>
                            <option value="interviewer">면접관 평가</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1 text-[11px] text-slate-500 font-bold">질문 내용</label>
                        <textarea
                          placeholder="응답자용 실제 평판 질문 문구"
                          rows={2}
                          value={newQuestion.question}
                          onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                          className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs font-semibold leading-relaxed"
                        />
                      </div>

                      {newQuestion.type === "ab" && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <input
                            type="text"
                            placeholder="선택지 A 내용"
                            value={newQuestion.optionA}
                            onChange={(e) => setNewQuestion({ ...newQuestion, optionA: e.target.value })}
                            className="border border-slate-250 rounded-lg p-2 bg-white"
                          />
                          <input
                            type="text"
                            placeholder="선택지 B 내용"
                            value={newQuestion.optionB}
                            onChange={(e) => setNewQuestion({ ...newQuestion, optionB: e.target.value })}
                            className="border border-slate-250 rounded-lg p-2 bg-white"
                          />
                        </div>
                      )}

                      <div className="flex justify-end gap-2 text-xs font-bold pt-2 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingQuestion(false);
                            setEditingQuestionId(null);
                          }}
                          className="bg-white border border-slate-250 text-slate-650 hover:bg-slate-50 rounded-lg px-3 py-1.5"
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          onClick={handleAddOrEditQuestion}
                          className="bg-indigo-600 text-white rounded-lg px-3.5 py-1.5 shadow-sm"
                        >
                          {editingQuestionId ? "변경 반영" : "문항 추가"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* List of Custom Questions */}
                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {caseQuestions.map((q, idx) => (
                      <div key={q.id} className="flex justify-between items-start gap-4 bg-slate-50 border border-slate-150 p-3 rounded-xl hover:border-slate-300 transition-colors">
                        <div className="text-[11px] leading-relaxed font-semibold">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap whitespace-nowrap">
                            <span className="bg-slate-900 text-white font-mono px-1 rounded text-[9px] font-bold whitespace-nowrap">#{idx+1}</span>
                            <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-[8px] font-extrabold whitespace-nowrap">{q.category}</span>
                            <span className="bg-slate-100 text-slate-655 px-1.5 py-0.5 rounded text-[8px] font-bold whitespace-nowrap">대상: {q.target === "all" ? "전원" : q.target === "self" ? "자기평가" : q.target === "peer" ? "추천인" : "면접관"}</span>
                          </div>
                          <span className="text-slate-900 font-extrabold block text-xs mb-0.5">{q.title}</span>
                          <span className="text-slate-600">Q. {q.question}</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenEditQuestion(q)}
                            className="p-1 rounded text-slate-400 hover:text-indigo-650 hover:bg-slate-200/50 shrink-0"
                          >
                            <Edit2 className="h-3.5 w-3.5 shrink-0" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicateQuestion(q)}
                            className="p-1 rounded text-slate-400 hover:text-indigo-650 hover:bg-slate-200/50 shrink-0"
                          >
                            <Copy className="h-3.5 w-3.5 shrink-0" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-100/50 shrink-0"
                          >
                            <Trash2 className="h-3.5 w-3.5 shrink-0" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Add Candidate / Interviewer Info */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 4: 평가 대상자 및 담당자 정보 기재</h2>
                <p className="text-xs text-slate-500 mt-0.5">후보자 기본 사항과 이 평판 평가를 최종 검수할 채용 담당자 연락 정보를 작성하세요.</p>
              </div>

              <div className="space-y-5">
                <div className="border border-slate-150 p-5 rounded-2xl space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1 whitespace-nowrap">
                    <User className="h-4.5 w-4.5 text-indigo-600 shrink-0" />
                    <span className="whitespace-nowrap">후보자 정보</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1 whitespace-nowrap">이름 <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        placeholder="이름"
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold ${errors.candidateName ? "border-rose-400" : "border-slate-250"}`}
                      />
                      {errors.candidateName && <span className="text-[10px] font-bold text-rose-600 mt-1 block whitespace-nowrap">{errors.candidateName}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1 whitespace-nowrap">이메일 <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        placeholder="candidate@example.com"
                        value={candidateEmail}
                        onChange={(e) => setCandidateEmail(e.target.value)}
                        className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold ${errors.candidateEmail ? "border-rose-400" : "border-slate-250"}`}
                      />
                      {errors.candidateEmail && <span className="text-[10px] font-bold text-rose-600 mt-1 block whitespace-nowrap">{errors.candidateEmail}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1 whitespace-nowrap">지원 포지션명 <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        placeholder="예: 프론트엔드 엔지니어"
                        value={candidatePosition}
                        onChange={(e) => setCandidatePosition(e.target.value)}
                        className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold ${errors.candidatePosition ? "border-rose-400" : "border-slate-250"}`}
                      />
                      {errors.candidatePosition && <span className="text-[10px] font-bold text-rose-600 mt-1 block whitespace-nowrap">{errors.candidatePosition}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1 whitespace-nowrap">채용 사명 <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        placeholder="예: 트라이체크 코리아"
                        value={candidateCompany}
                        onChange={(e) => setCandidateCompany(e.target.value)}
                        className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold ${errors.candidateCompany ? "border-rose-400" : "border-slate-250"}`}
                      />
                      {errors.candidateCompany && <span className="text-[10px] font-bold text-rose-600 mt-1 block whitespace-nowrap">{errors.candidateCompany}</span>}
                    </div>
                  </div>
                </div>

                <div className="border border-slate-150 p-5 rounded-2xl space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1 whitespace-nowrap">
                    <UserCheck className="h-4.5 w-4.5 text-indigo-600 shrink-0" />
                    <span className="whitespace-nowrap">채용 담당자 (면접관) 정보</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1 whitespace-nowrap">이름 <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        placeholder="이름"
                        value={interviewerName}
                        onChange={(e) => setInterviewerName(e.target.value)}
                        className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold ${errors.interviewerName ? "border-rose-400" : "border-slate-250"}`}
                      />
                      {errors.interviewerName && <span className="text-[10px] font-bold text-rose-600 mt-1 block whitespace-nowrap">{errors.interviewerName}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1 whitespace-nowrap">이메일 <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        placeholder="recruiter@example.com"
                        value={interviewerEmail}
                        onChange={(e) => setInterviewerEmail(e.target.value)}
                        className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold ${errors.interviewerEmail ? "border-rose-400" : "border-slate-250"}`}
                      />
                      {errors.interviewerEmail && <span className="text-[10px] font-bold text-rose-600 mt-1 block whitespace-nowrap">{errors.interviewerEmail}</span>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1 whitespace-nowrap">직함 및 부서 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="예: HR 부장"
                      value={interviewerTitle}
                      onChange={(e) => setInterviewerTitle(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2.5 text-xs font-semibold ${errors.interviewerTitle ? "border-rose-400" : "border-slate-250"}`}
                    />
                    {errors.interviewerTitle && <span className="text-[10px] font-bold text-rose-600 mt-1 block whitespace-nowrap">{errors.interviewerTitle}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Generated Candidate Links */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center py-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3 shadow-sm">
                  <Check className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-black text-slate-900">레퍼런스 체크 케이스 생성 완료!</h2>
                <p className="text-xs text-slate-500 mt-1 font-semibold">후보자용 초대장과 면접관 평가 링크가 생성되었습니다.</p>
              </div>

              <div className="space-y-4">
                {/* Candidate Link Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3.5">
                  <div className="flex items-center justify-between flex-wrap gap-2 whitespace-nowrap">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                      후보자 자기평가 & 추천인 등록 링크
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">후보자에게 카카오톡/이메일로 발송</span>
                  </div>
                  
                  <p className="text-xs font-bold text-slate-800 leading-relaxed">
                    후보자는 이 링크를 타고 들어와 본인의 자가 서술형 문항을 풀고, 자신을 증명해 줄 동료 추천인 3명의 정보를 기입하게 됩니다.
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/candidate/invite/${generatedCaseId}`}
                      className="flex-1 bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-semibold font-mono text-slate-600 select-all"
                    />
                    <button
                      onClick={() => copyToClipboard(`${window.location.origin}/candidate/invite/${generatedCaseId}`)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 text-xs font-bold text-white hover:bg-slate-800 active:scale-95 transition-all shadow-sm whitespace-nowrap shrink-0"
                    >
                      <Copy className="h-3.5 w-3.5 shrink-0" />
                      <span className="whitespace-nowrap">복사</span>
                    </button>
                    <Link
                      href={`/candidate/invite/${generatedCaseId}`}
                      target="_blank"
                      className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-250 bg-white px-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm shrink-0"
                    >
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </Link>
                  </div>
                </div>

                {/* Interviewer Link Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3.5">
                  <div className="flex items-center justify-between flex-wrap gap-2 whitespace-nowrap">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                      면접관 사후 관찰평가 링크
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">지정 면접관용 개별 링크</span>
                  </div>
                  
                  <p className="text-xs font-bold text-slate-800 leading-relaxed">
                    최종 의사결정 면접관 혹은 리쿠르터가 면접 단계에서 수집된 평가 및 정성 항목들을 체크하는 질문지 링크입니다.
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/company/interviewer-assessment/${generatedCaseId}`}
                      className="flex-1 bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-semibold font-mono text-slate-600 select-all"
                    />
                    <button
                      onClick={() => copyToClipboard(`${window.location.origin}/company/interviewer-assessment/${generatedCaseId}`)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 text-xs font-bold text-white hover:bg-slate-800 active:scale-95 transition-all shadow-sm whitespace-nowrap shrink-0"
                    >
                      <Copy className="h-3.5 w-3.5 shrink-0" />
                      <span className="whitespace-nowrap">복사</span>
                    </button>
                    <Link
                      href={`/company/interviewer-assessment/${generatedCaseId}`}
                      target="_blank"
                      className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-250 bg-white px-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm shrink-0"
                    >
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-2.5 shadow-sm text-xs text-indigo-900 font-semibold leading-relaxed">
                <Info className="h-4.5 w-4.5 text-indigo-600 shrink-0 mt-0.5" />
                <span>시뮬레이션 팁: 후보자 이메일 발송 과정은 이 MVP에서 가상처리되었습니다. 대시보드로 돌아가시면 생성된 건의 진행 상황을 모니터링하고 '데모 응답 자동 채우기' 기능을 통해 평판 보고서 결과를 즉각 확인하실 수 있습니다.</span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-8 flex justify-between border-t border-slate-100 pt-6">
            {step > 1 && step < 5 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1 bg-white border border-slate-250 text-xs font-bold text-slate-700 rounded-xl px-4 py-2.5 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
              >
                <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-nowrap">이전 단계</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl px-4.5 py-2.5 hover:bg-indigo-500 shadow-sm transition-all whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">다음 단계</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
              </button>
            ) : step === 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 bg-indigo-650 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-xs font-bold rounded-xl px-5 py-2.5 hover:from-indigo-500 hover:to-indigo-600 shadow-md shadow-indigo-600/10 transition-all whitespace-nowrap shrink-0"
              >
                <Check className="h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-nowrap">레퍼런스 체크 등록 & 링크 생성</span>
              </button>
            ) : (
              <Link
                href="/company/dashboard"
                className="inline-flex items-center justify-center bg-indigo-600 text-white text-xs font-bold rounded-xl px-5 py-2.5 hover:bg-indigo-500 shadow-sm whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">대시보드로 가기</span>
              </Link>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
