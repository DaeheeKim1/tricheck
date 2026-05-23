"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Copy,
  Edit, 
  Sparkles,
  PlusCircle,
  HelpCircle,
  TrendingUp,
  Award,
  Users,
  Scale as ScaleIcon,
  MessageSquare,
  Zap,
  Info,
  CheckCircle,
  FileText,
  Bookmark,
  ChevronRight,
  Sliders,
  Settings
} from "lucide-react";
import { 
  getAllTemplates, 
  saveCustomTemplate, 
  deleteCustomTemplate,
  getTemplateById
} from "@/lib/storage";
import { 
  SurveyTemplate, 
  SurveyQuestion, 
  QuestionCategory, 
  QuestionType, 
  QuestionTarget, 
  JobTypeKey,
  defaultQuestions
} from "@/lib/questions";

export default function SurveyBuilder() {
  const router = useRouter();
  const [templates, setTemplates] = useState<SurveyTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [editingTemplate, setEditingTemplate] = useState<SurveyTemplate | null>(null);
  
  // State for adding/editing questions
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<SurveyQuestion>>({
    category: "업무성향",
    type: "scale",
    target: "all",
    title: "",
    question: "",
    optionA: "",
    optionB: ""
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    const list = getAllTemplates();
    setTemplates(list);
    // Auto-select first template if none selected yet
    if (list.length > 0 && !selectedTemplateId) {
      setSelectedTemplateId(list[0].id);
      setEditingTemplate(JSON.parse(JSON.stringify(list[0])));
    }
  };

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    const t = templates.find(temp => temp.id === id);
    if (t) {
      setEditingTemplate(JSON.parse(JSON.stringify(t)));
    }
    // Smooth scroll to editor
    const element = document.getElementById("template-editor-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDuplicateTemplate = (template: SurveyTemplate) => {
    const newId = `custom_template_${Date.now()}`;
    const duplicated: SurveyTemplate = {
      ...JSON.parse(JSON.stringify(template)),
      id: newId,
      name: `${template.name} (복사본)`,
      description: `기존 ${template.name}을(를) 커스텀 복사하여 생성한 템플릿입니다.`
    };
    saveCustomTemplate(duplicated);
    loadTemplates();
    setSelectedTemplateId(newId);
    setEditingTemplate(duplicated);
    alert(`'${template.name}' 템플릿이 복제되어 새 커스텀 템플릿이 생성되었습니다!`);
  };

  const handleCreateNewTemplate = () => {
    const newId = `custom_template_${Date.now()}`;
    const newTemp: SurveyTemplate = {
      id: newId,
      name: "신규 맞춤형 평가 템플릿",
      jobType: "general",
      description: "우리 기업 인재상에 맞춰 질문 구성을 설정하는 맞춤형 템플릿입니다.",
      weights: {
        "업무성향": 0.20,
        "조직적합성": 0.20,
        "협업성향": 0.20,
        "리스크 대응": 0.20,
        "커뮤니케이션": 0.20
      },
      questions: [...defaultQuestions]
    };

    saveCustomTemplate(newTemp);
    loadTemplates();
    setSelectedTemplateId(newId);
    setEditingTemplate(newTemp);
    alert("새 커스텀 템플릿이 생성되었습니다. 아래 편집기에서 질문을 추가/수정해보세요!");
  };

  const handleWeightChange = (category: string, value: number) => {
    if (!editingTemplate) return;
    const updatedWeights = { ...editingTemplate.weights, [category]: value };
    setEditingTemplate({ ...editingTemplate, weights: updatedWeights });
  };

  const handleFieldChange = (field: keyof SurveyTemplate, value: string | JobTypeKey) => {
    if (!editingTemplate) return;
    setEditingTemplate({ ...editingTemplate, [field]: value });
  };

  const handleOpenAddQuestion = () => {
    setEditingQuestionId(null);
    setNewQuestion({
      category: editingTemplate?.questions[0]?.category || "업무성향",
      type: "scale",
      target: "all",
      title: "",
      question: "",
      optionA: "",
      optionB: ""
    });
    setIsAddingQuestion(true);
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

  const handleSaveQuestion = () => {
    if (!editingTemplate || !newQuestion.title || !newQuestion.question) {
      alert("질문 제목과 질문 내용을 작성해주세요.");
      return;
    }

    if (newQuestion.type === "ab" && (!newQuestion.optionA || !newQuestion.optionB)) {
      alert("A/B 선택지 내용을 작성해주세요.");
      return;
    }

    let updatedQuestions = [...editingTemplate.questions];

    if (editingQuestionId) {
      // Edit mode
      updatedQuestions = updatedQuestions.map(q => {
        if (q.id === editingQuestionId) {
          return {
            ...q,
            category: newQuestion.category || "업무성향",
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
      alert("질문이 수정되었습니다.");
    } else {
      // Add mode
      const questionToAdd: SurveyQuestion = {
        id: `q_${Date.now()}`,
        category: newQuestion.category || "업무성향",
        title: newQuestion.title || "",
        question: newQuestion.question || "",
        type: newQuestion.type as QuestionType,
        target: newQuestion.target as QuestionTarget,
        optionA: newQuestion.type === "ab" ? newQuestion.optionA : undefined,
        optionB: newQuestion.type === "ab" ? newQuestion.optionB : undefined
      };
      updatedQuestions.push(questionToAdd);
      alert("새 질문이 추가되었습니다.");
    }

    // Dynamic category weights sync
    const currentWeights = { ...editingTemplate.weights };
    // If a new category is introduced, init weight to 0
    updatedQuestions.forEach(q => {
      if (currentWeights[q.category] === undefined) {
        currentWeights[q.category] = 0;
      }
    });

    setEditingTemplate({
      ...editingTemplate,
      weights: currentWeights,
      questions: updatedQuestions
    });
    
    setIsAddingQuestion(false);
    setEditingQuestionId(null);
  };

  const handleDeleteQuestion = (qId: string) => {
    if (!editingTemplate) return;
    if (confirm("이 문항을 템플릿에서 삭제하시겠습니까?")) {
      const updatedQuestions = editingTemplate.questions.filter(q => q.id !== qId);
      
      // Clean up unused weights if category has 0 questions now
      const currentWeights = { ...editingTemplate.weights };
      const activeCategories = new Set(updatedQuestions.map(q => q.category));
      (Object.keys(currentWeights) as QuestionCategory[]).forEach(cat => {
        if (!activeCategories.has(cat)) {
          delete currentWeights[cat];
        }
      });

      setEditingTemplate({
        ...editingTemplate,
        weights: currentWeights,
        questions: updatedQuestions
      });
    }
  };

  const handleDuplicateQuestion = (q: SurveyQuestion) => {
    if (!editingTemplate) return;
    const duplicated: SurveyQuestion = {
      ...JSON.parse(JSON.stringify(q)),
      id: `q_copy_${Date.now()}`,
      title: `${q.title} (복사본)`
    };
    const index = editingTemplate.questions.findIndex(item => item.id === q.id);
    const updatedQuestions = [...editingTemplate.questions];
    updatedQuestions.splice(index + 1, 0, duplicated);

    setEditingTemplate({
      ...editingTemplate,
      questions: updatedQuestions
    });
    alert("선택한 질문이 성공적으로 복제되었습니다.");
  };

  const handleSave = () => {
    if (!editingTemplate) return;

    // Check sum of weights
    const sum = Object.values(editingTemplate.weights).reduce((acc, w) => acc + w, 0);
    // Tolerance for float issues
    if (Object.keys(editingTemplate.weights).length > 0 && Math.abs(sum - 1.0) > 0.01) {
      if (!confirm(`경고: 카테고리 가중치 합이 ${Math.round(sum * 100)}% 입니다. 100%가 아닐 경우 평가 리포트 자동 보정 점수가 비례 환산됩니다. 그대로 저장하시겠습니까?`)) {
        return;
      }
    }

    saveCustomTemplate(editingTemplate);
    loadTemplates();
    alert("커스텀 템플릿 설정 및 질문 구성이 성공적으로 저장되었습니다!");
  };

  const handleDeleteTemplate = (id: string) => {
    if (id.startsWith("template_")) {
      alert("시스템 기본 기본 템플릿은 삭제할 수 없습니다.");
      return;
    }

    if (confirm("정말로 이 커스텀 템플릿을 완전히 삭제하시겠습니까?\n이 템플릿을 기반으로 등록된 기존 채용 케이스에는 영향을 미치지 않습니다.")) {
      deleteCustomTemplate(id);
      setSelectedTemplateId("");
      setEditingTemplate(null);
      loadTemplates();
      alert("템플릿이 안전하게 삭제되었습니다.");
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "업무성향": return <TrendingUp className="h-4 w-4 text-amber-500" />;
      case "조직적합성": return <Award className="h-4 w-4 text-indigo-500" />;
      case "협업성향": return <Users className="h-4 w-4 text-emerald-500" />;
      case "문제 해결력": return <Zap className="h-4 w-4 text-sky-500" />;
      case "업무 신뢰도": return <CheckCircle className="h-4 w-4 text-teal-500" />;
      case "커뮤니케이션": return <MessageSquare className="h-4 w-4 text-pink-500" />;
      case "일정 관리": return <Bookmark className="h-4 w-4 text-red-500" />;
      default: return <Sliders className="h-4 w-4 text-slate-500" />;
    }
  };

  // Group questions by category
  const questionsByCategory: Record<string, SurveyQuestion[]> = {};
  if (editingTemplate) {
    editingTemplate.questions.forEach(q => {
      if (!questionsByCategory[q.category]) {
        questionsByCategory[q.category] = [];
      }
      questionsByCategory[q.category].push(q);
    });
  }

  return (
    <div className="flex-1 bg-[#F9FAFB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Breadcrumbs & Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <Link
              href="/company/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-650 transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="h-4.5 w-4.5 shrink-0" />
              <span className="whitespace-nowrap">대시보드로 가기</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight whitespace-nowrap">
              설문 템플릿 관리
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 max-w-4xl">
              다양한 포지션별 기본 템플릿을 선택하여 우리 회사 규정과 인재상에 맞춰 질문을 고도화할 수 있습니다.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCreateNewTemplate}
              className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-700 shadow-sm hover:bg-indigo-100 transition-all whitespace-nowrap shrink-0"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span>신규 템플릿 빌드</span>
            </button>
            {editingTemplate && !editingTemplate.id.startsWith("template_") && (
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4.5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-500 transition-all whitespace-nowrap shrink-0"
              >
                <Save className="h-4 w-4 shrink-0" />
                <span>커스텀 템플릿 저장</span>
              </button>
            )}
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4.5 mb-10 flex gap-3 items-start shadow-sm max-w-7xl">
          <Info className="h-5.5 w-5.5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-indigo-955 leading-relaxed font-semibold">
            <p className="font-bold text-indigo-955 mb-0.5 whitespace-nowrap">💡 안내문구</p>
            기존 템플릿을 기반으로 우리 회사에 맞는 질문을 추가하거나 불필요한 질문을 제거할 수 있습니다. 시스템 기본 제공 템플릿은 변경 불가하지만, **[복제 및 커스터마이징]** 버튼을 통해 쉽게 편집이 가능해집니다.
          </div>
        </div>

        {/* Section 1: Template Cards Grid */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-1.5 whitespace-nowrap">
            <Bookmark className="h-5 w-5 text-indigo-600 shrink-0" />
            <span>제공 중인 설문 템플릿 목록</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map(t => {
              const isDefault = t.id.startsWith("template_");
              const isSelected = selectedTemplateId === t.id;
              
              return (
                <div 
                  key={t.id}
                  className={`rounded-2xl border bg-white p-5 flex flex-col justify-between transition-all relative hover:shadow-md cursor-pointer ${
                    isSelected 
                      ? "border-indigo-600 ring-2 ring-indigo-50 shadow-sm" 
                      : "border-slate-200"
                  }`}
                  onClick={() => handleSelectTemplate(t.id)}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                        isDefault 
                          ? "bg-slate-100 text-slate-700" 
                          : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                      }`}>
                        {isDefault ? "기본 제공" : "기업 커스텀"}
                      </span>
                      {isSelected && (
                        <span className="h-2 w-2 rounded-full bg-indigo-600 animate-ping shrink-0" />
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 tracking-tight line-clamp-1 mb-1.5 whitespace-nowrap overflow-hidden text-overflow-ellipsis">
                      {t.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-normal line-clamp-3 mb-4 font-semibold">
                      {t.description}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-4 mt-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">
                        질문 수: <b className="text-slate-700 whitespace-nowrap">{t.questions?.length || 0}개</b>
                      </span>
                      
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateTemplate(t);
                          }}
                          title="복제하여 새 커스텀 템플릿 만들기"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-655 hover:bg-slate-50 transition-colors shrink-0"
                        >
                          <Copy className="h-4 w-4 shrink-0" />
                        </button>

                        {!isDefault && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTemplate(t.id);
                            }}
                            title="템플릿 삭제"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-650 hover:bg-rose-50 transition-colors shrink-0"
                          >
                            <Trash2 className="h-4 w-4 shrink-0" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Editor Workspace */}
        {editingTemplate && (
          <div id="template-editor-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 scroll-mt-6">
            
            {/* Left Column: Template Metadata & Weight Settings */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">
                    Template Settings
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">템플릿 설정</h3>
                </div>

                <div className="space-y-4 border-t border-slate-100 pt-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">템플릿명</label>
                    <input
                      type="text"
                      disabled={editingTemplate.id.startsWith("template_")}
                      value={editingTemplate.name}
                      onChange={(e) => handleFieldChange("name", e.target.value)}
                      className="w-full rounded-xl border border-slate-250 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">직무 카테고리 매칭</label>
                    <select
                      disabled={editingTemplate.id.startsWith("template_")}
                      value={editingTemplate.jobType}
                      onChange={(e) => handleFieldChange("jobType", e.target.value as JobTypeKey)}
                      className="w-full rounded-xl border border-slate-250 px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-50 disabled:text-slate-400 bg-white"
                    >
                      <option value="general">기본 레퍼런스 체크</option>
                      <option value="backend_developer">백엔드 개발자 채용</option>
                      <option value="frontend_developer">프론트엔드 개발자 채용</option>
                      <option value="fullstack_developer">풀스택 개발자 채용</option>
                      <option value="data_analyst">데이터 분석가 채용</option>
                      <option value="product_manager">프로덕트 매니저(PM) 채용</option>
                      <option value="product_designer">프로덕트 디자이너(UX/UI) 채용</option>
                      <option value="graphic_designer">그래픽 디자이너 채용</option>
                      <option value="sales_manager">영업 관리자 채용</option>
                      <option value="b2b_sales_executive">B2B 영업 대표 채용</option>
                      <option value="hr_recruiter">채용 리크루터 채용</option>
                      <option value="hr_business_partner">HRBP 채용</option>
                      <option value="accountant">회계 담당자 채용</option>
                      <option value="financial_analyst">재무 분석가 채용</option>
                      <option value="marketing_manager">마케팅 매니저 채용</option>
                      <option value="performance_marketer">퍼포먼스 마케터 채용</option>
                      <option value="operations_manager">오퍼레이션 매니저 채용</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">상세 설명</label>
                    <textarea
                      disabled={editingTemplate.id.startsWith("template_")}
                      value={editingTemplate.description}
                      onChange={(e) => handleFieldChange("description", e.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-slate-250 px-3.5 py-2.5 text-xs text-slate-800 leading-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-50 disabled:text-slate-400 font-semibold"
                    />
                  </div>
                </div>

                {editingTemplate.id.startsWith("template_") && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] text-slate-500 leading-normal flex gap-2">
                    <Info className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span>기본 템플릿의 상세 정보는 읽기 전용입니다. 편집하려면 복사본을 생성하거나 신규 템플릿을 빌드해주세요.</span>
                  </div>
                )}
              </div>

              {/* Category Weight Control Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900 whitespace-nowrap">가중치 배분 비율</h4>
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${
                    Math.abs(Object.values(editingTemplate.weights).reduce((a, b) => a + b, 0) - 1.0) < 0.01
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-amber-50 text-amber-700 border border-amber-100"
                  }`}>
                    합계: {Math.round(Object.values(editingTemplate.weights).reduce((a, b) => a + b, 0) * 100)}%
                  </span>
                </div>

                <div className="space-y-4">
                  {(Object.keys(editingTemplate.weights) as QuestionCategory[]).map(cat => {
                    const weightVal = editingTemplate.weights[cat] || 0;
                    return (
                      <div key={cat} className="space-y-1.5 font-medium">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="flex items-center gap-1.5 text-slate-700 whitespace-nowrap">
                            <span className="shrink-0">{getCategoryIcon(cat)}</span>
                            <span className="whitespace-nowrap">{cat}</span>
                          </span>
                          <span className="font-mono text-indigo-650 whitespace-nowrap shrink-0">{Math.round(weightVal * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          disabled={editingTemplate.id.startsWith("template_")}
                          value={Math.round(weightVal * 100)}
                          onChange={(e) => handleWeightChange(cat, parseInt(e.target.value, 10) / 100)}
                          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-50"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Question List grouped by focus category */}
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                
                {/* Header inside list */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 whitespace-nowrap">설문 질문지 구성</h3>
                    <p className="text-xs text-slate-500 mt-0.5 whitespace-nowrap">각 카테고리 영역에 포함된 평가 문항입니다.</p>
                  </div>

                  {!editingTemplate.id.startsWith("template_") && (
                    <button
                      onClick={handleOpenAddQuestion}
                      className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 px-3.5 rounded-xl transition-all shadow-sm whitespace-nowrap shrink-0"
                    >
                      <PlusCircle className="h-4 w-4 shrink-0" />
                      <span>질문 추가</span>
                    </button>
                  )}
                </div>

                {/* Form: Add/Edit Question */}
                {isAddingQuestion && (
                  <div className="border border-indigo-150 bg-indigo-50/10 p-5 rounded-2xl mb-6 space-y-4 animate-in fade-in duration-200">
                    <h4 className="text-sm font-bold text-indigo-955 flex items-center gap-1.5 border-b border-indigo-100 pb-2 whitespace-nowrap">
                      <Sparkles className="h-4 w-4 text-indigo-500 shrink-0" />
                      <span>{editingQuestionId ? "질문 수정" : "새 질문 추가"}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">진단 영역 (카테고리)</label>
                        <select
                          value={newQuestion.category}
                          onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value as QuestionCategory })}
                          className="w-full bg-white border border-slate-250 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
                        >
                          {Object.keys(editingTemplate.weights).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                          <option value="새 카테고리">+ 새 카테고리 추가</option>
                        </select>
                      </div>

                      {/* Custom Category Input if selected */}
                      {(newQuestion.category as string) === "새 카테고리" && (
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-500 mb-1">새 카테고리명</label>
                          <input
                            type="text"
                            placeholder="예: 문제 해결력, 업무 신뢰도 등"
                            onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value as QuestionCategory })}
                            className="w-full bg-white border border-slate-250 text-xs rounded-xl px-3 py-2.5 focus:outline-none text-slate-900 font-semibold"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">질문 형태</label>
                        <select
                          value={newQuestion.type}
                          onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as QuestionType })}
                          className="w-full bg-white border border-slate-250 text-xs rounded-xl px-3 py-2.5 focus:outline-none bg-white font-semibold text-slate-800"
                        >
                          <option value="scale">5점 척도 (Scale)</option>
                          <option value="ab">A/B 선택형 (AB Choice)</option>
                          <option value="short">주관식 서술 (Short Answer)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">진단 대상자</label>
                        <select
                          value={newQuestion.target}
                          onChange={(e) => setNewQuestion({ ...newQuestion, target: e.target.value as QuestionTarget })}
                          className="w-full bg-white border border-slate-250 text-xs rounded-xl px-3 py-2.5 focus:outline-none bg-white font-bold text-slate-800"
                        >
                          <option value="all">모든 응답자 (All)</option>
                          <option value="self">후보자 자기평가 (Self)</option>
                          <option value="peer">추천인 평판평가 (Peer)</option>
                          <option value="interviewer">면접관 관찰평가 (Interviewer)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">질문 제목 (식별 문구)</label>
                      <input
                        type="text"
                        placeholder="예: 업무 추진 속도, 피드백 수용 능력 등"
                        value={newQuestion.title}
                        onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                        className="w-full bg-white border border-slate-250 text-xs rounded-xl px-3 py-2.5 focus:outline-none text-slate-900 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">실제 출제 질문 내용</label>
                      <textarea
                        rows={3}
                        placeholder="실제 설문 응답자에게 노출될 구체적인 평판 질문 내용입니다."
                        value={newQuestion.question}
                        onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                        className="w-full bg-white border border-slate-250 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none text-slate-900 font-semibold leading-relaxed"
                      />
                    </div>

                    {newQuestion.type === "ab" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border border-slate-150 p-4 rounded-xl">
                        <div>
                          <label className="block text-xs font-bold text-rose-600 mb-1">선택지 A</label>
                          <input
                            type="text"
                            placeholder="예: 속도감 위주로 빠르게 전개..."
                            value={newQuestion.optionA}
                            onChange={(e) => setNewQuestion({ ...newQuestion, optionA: e.target.value })}
                            className="w-full bg-white border border-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-indigo-600 mb-1">선택지 B</label>
                          <input
                            type="text"
                            placeholder="예: 완벽성에 초점을 맞춰 설계..."
                            value={newQuestion.optionB}
                            onChange={(e) => setNewQuestion({ ...newQuestion, optionB: e.target.value })}
                            className="w-full bg-white border border-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none text-slate-900"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 border-t border-indigo-100 pt-4">
                      <button
                        onClick={() => {
                          setIsAddingQuestion(false);
                          setEditingQuestionId(null);
                        }}
                        className="bg-white border border-slate-250 text-xs font-bold text-slate-700 rounded-xl px-4 py-2 hover:bg-slate-50 transition-all"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleSaveQuestion}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl px-4.5 py-2 shadow-sm transition-all"
                      >
                        {editingQuestionId ? "질문 변경" : "추가 완료"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Grouped Questions Render */}
                <div className="space-y-8">
                  {Object.keys(questionsByCategory).map(cat => (
                    <div key={cat} className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                        {getCategoryIcon(cat)}
                        <h4 className="text-sm font-extrabold text-slate-800">{cat}</h4>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                          {questionsByCategory[cat].length}개 질문
                        </span>
                      </div>

                      <div className="space-y-3">
                        {questionsByCategory[cat].map(q => (
                          <div 
                            key={q.id}
                            className="border border-slate-150 bg-white rounded-xl p-4.5 hover:border-slate-300 transition-all flex flex-col sm:flex-row justify-between gap-4 items-start"
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex flex-wrap items-center gap-1.5 whitespace-nowrap">
                                <span className="text-[9px] bg-slate-900 text-white font-mono px-1.5 py-0.5 rounded font-bold whitespace-nowrap">
                                  {q.type === "scale" ? "5점 척도" : q.type === "ab" ? "선택 A/B" : "주관식 서술"}
                                </span>
                                <span className="text-[9px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full font-mono whitespace-nowrap">
                                  대상: {q.target === "all" ? "전체 응답" : q.target === "self" ? "자가평가 전용" : q.target === "peer" ? "추천인 전용" : "면접관 전용"}
                                </span>
                              </div>

                              <h5 className="text-xs font-bold text-slate-900">{q.title}</h5>
                              <p className="text-xs text-slate-600 font-semibold leading-relaxed">Q. {q.question}</p>

                              {q.type === "ab" && (
                                <div className="text-[10px] space-y-1 bg-slate-50 border border-slate-100 p-2.5 rounded-lg mt-1 font-semibold leading-relaxed text-slate-700">
                                  <div><span className="text-rose-500 font-bold">[선택 A]</span> {q.optionA}</div>
                                  <div><span className="text-indigo-500 font-bold">[선택 B]</span> {q.optionB}</div>
                                </div>
                              )}
                            </div>

                            {/* Actions block */}
                            {!editingTemplate.id.startsWith("template_") && (
                              <div className="flex items-center gap-1 self-end sm:self-start shrink-0">
                                <button
                                  onClick={() => handleOpenEditQuestion(q)}
                                  title="질문 편집"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-650 hover:bg-slate-50 transition-colors shrink-0"
                                >
                                  <Edit className="h-4 w-4 shrink-0" />
                                </button>
                                <button
                                  onClick={() => handleDuplicateQuestion(q)}
                                  title="질문 복제"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-650 hover:bg-slate-50 transition-colors shrink-0"
                                >
                                  <Copy className="h-4 w-4 shrink-0" />
                                </button>
                                <button
                                  onClick={() => handleDeleteQuestion(q.id)}
                                  title="질문 삭제"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                                >
                                  <Trash2 className="h-4 w-4 shrink-0" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
