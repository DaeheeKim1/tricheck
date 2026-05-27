"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Copy, 
  ExternalLink, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  User, 
  Users, 
  UserCheck, 
  BarChart2, 
  ClipboardCopy, 
  RefreshCw,
  Info
} from "lucide-react";
import { 
  getRequest, 
  saveRequest, 
  analyzeSurveyAnswers, 
  saveReport, 
  ReferenceRequest 
} from "@/lib/storage";

function getJobSpecificAnswer(jobType: string, category: string, respondent: 'self' | 'peer' | 'interviewer', peerIdx?: number): string {
  let domain = "general";
  if (["backend_developer", "frontend_developer", "fullstack_developer"].includes(jobType)) {
    domain = "tech";
  } else if (["product_designer", "graphic_designer"].includes(jobType)) {
    domain = "design";
  } else if (["product_manager", "operations_manager", "hr_recruiter", "hr_business_partner"].includes(jobType)) {
    domain = "pm_hr";
  } else if (["sales_manager", "b2b_sales_executive", "marketing_manager", "performance_marketer"].includes(jobType)) {
    domain = "sales_mkt";
  } else if (["data_analyst", "accountant", "financial_analyst"].includes(jobType)) {
    domain = "data_finance";
  }

  if (category === "업무성향") {
    if (respondent === 'self') {
      if (domain === "tech") return "클라우드 마이그레이션과 대용량 트래픽 처리를 성공적으로 설계하고 병목 현상을 40% 개선하는 비즈니스 임팩트를 냈습니다.";
      if (domain === "design") return "디자인 시스템을 선제 구축하여 프론트엔드와 마찰을 방지하고 디자인 생산성을 2배로 증가시켰습니다.";
      if (domain === "pm_hr") return "고객 지표 분석을 통해 최우선 비즈니스 과제를 규명하고 로드맵 설정을 완성해 사용자 리텐션을 크게 높였습니다.";
      if (domain === "sales_mkt") return "주요 B2B 타겟 리드를 공격적으로 발굴하고 제안 프로세스를 혁신하여 연간 수주 매출 150%를 초과 달성했습니다.";
      if (domain === "data_finance") return "데이터 파이프라인 정비 및 정확한 예산 흐름 예측을 통해 매월 경영 의사결정의 오차범위를 최소화시켰습니다.";
      return "목표 성과 달성을 위해 우선순위를 주도적으로 정의하고 예외 사항에 대비하는 성공적인 성과 기여를 해왔습니다.";
    } else if (respondent === 'peer') {
      const idx = peerIdx || 0;
      if (idx === 0) {
        if (domain === "tech") return "기술적 완성도와 구조적 우수성을 유지하면서도 배포 기한을 성실하게 맞춰낸 역량이 검증되었습니다.";
        if (domain === "design") return "트렌디한 비주얼 감각과 체계적인 피그마 컴포넌트 관리가 뛰어났던 주도적인 디자이너입니다.";
        if (domain === "pm_hr") return "이해관계 부서들 간의 의견 대립 속에서 명확한 목표 지표를 리드하며 스펙 아웃라인을 잘 구축해 냈습니다.";
        if (domain === "sales_mkt") return "탁월한 목표 지향성과 딜 클로징 추진력을 통해 영업 본부 내 핵심 성과를 이끈 고성과자입니다.";
        if (domain === "data_finance") return "작은 전산 오차도 사전에 방어하고 철저한 데이터 컴플라이언스를 고수하는 신뢰도 높은 인재입니다.";
        return "안정성과 성과 목표를 골고루 지향하며 주어진 과업 이상을 주도적으로 완수하는 동료입니다.";
      } else if (idx === 1) {
        return "동료들과의 코드 리뷰나 기획 스케치 공유를 매우 충실하게 주도하며 팀의 핵심 가치를 높여 주었습니다.";
      } else {
        return "과업 조율 시 마찰이 적고, 병목 상황 발생 시 적극적으로 다른 담당자를 서포트하여 일정을 성공적으로 도왔습니다.";
      }
    } else {
      if (domain === "tech") return "백엔드/프론트엔드 하드스킬이 확실하고 아키텍처 예외 처리에 대한 주관이 뚜렷하여 기술 검증을 마쳤습니다.";
      if (domain === "design") return "사용자 중심의 가설 검증 프로세스가 튼튼하고 디자인과 테크의 연계 이해도가 우수합니다.";
      if (domain === "pm_hr") return "프로덕트 지수 관리 및 인사이트 공유력이 명료하며 수평적인 커뮤니케이션 매너를 확인했습니다.";
      if (domain === "sales_mkt") return "수치적인 세일즈 성과 달성 모델과 컴플라이언스 인식이 양호하게 대조되어 입사가 추천됩니다.";
      if (domain === "data_finance") return "데이터 모델링 및 예산 분석 정확성이 매우 꼼꼼하며 논리적 설득 수준이 평균 이상입니다.";
      return "전반적인 실무 경험과 역량 증명이 면접 과정에서 안정적으로 확인되어 당사 기준에 부합합니다.";
    }
  }

  if (category === "조직적합성") {
    if (respondent === 'self') {
      return "수평적이고 솔직한 피드백 문화를 지향하며, 비즈니스 성장을 위한 투명한 정보 공유와 조화를 중요하게 생각합니다.";
    } else if (respondent === 'peer') {
      const idx = peerIdx || 0;
      if (idx === 0) return "회사의 보안 및 정보 유출 관리 규정을 모범적으로 이행하고 팀의 정서적 사기 진작에도 크게 기여했습니다.";
      if (idx === 1) return "피드백에 방어적이지 않고 항상 열린 질문을 던지며 동료들의 의견을 정중하게 존중해 주었습니다.";
      return "조직의 조화와 행정적 준수 절차를 철저히 지키며 비판적 태도 대신 건설적인 성장을 선호하는 동료입니다.";
    } else {
      return "자가 인식과 평판이 조화로우며 당사 핵심 조직 가치인 상호 신뢰와 협업 중심 문화에 빠르게 녹아들 성향입니다.";
    }
  }

  if (category === "협업성향") {
    if (respondent === 'self') {
      return "갈등 시 데이터 지표 중심의 논리적 합의와 정서적 공감 케어를 병행해 장기적인 신뢰를 구축합니다.";
    } else if (respondent === 'peer') {
      const idx = peerIdx || 0;
      if (idx === 0) return "업무적 신념을 주장할 때 지나친 고집이 없으며, 비즈니스 최적의 지점을 위해 논리적 양보도 잘 조율했습니다.";
      if (idx === 1) return "본인 성과만을 고집하지 않고 팀 전체의 공유 지식 창출을 위해 내부 위키 정리를 자발적으로 기여했습니다.";
      return "협업한 동료들이 항상 신뢰를 보내며, 커뮤니케이션 흐름에서 가장 마찰이 없고 유쾌했던 동료입니다.";
    } else {
      return "부서 간 갈등 상황 시 본인의 설득 방식을 유연하게 조율하려는 지적 태도가 엿보여 협업 만족도가 기대됩니다.";
    }
  }

  if (category === "리스크 대응") {
    if (respondent === 'self') {
      return "자주 발생하는 휴먼 에러를 방지하기 위해 개인 체크리스트를 상시 운용하고 신규 기기 배포 전 철저한 사전 테스트를 거칩니다.";
    } else if (respondent === 'peer') {
      const idx = peerIdx || 0;
      if (idx === 0) return "정보 보안 의식이 탁거하며 기밀 자산 관리에 틈이 없었으며, 위험을 사전 감지해 대비책을 자주 발의했습니다.";
      if (idx === 1) return "문제나 리스크가 감지되었을 때 뒤늦게 수습하기보다 실시간으로 얼리 워닝을 공유하여 피해를 사전에 예방합니다.";
      return "작은 전산 데이터 변경이나 계약 조항 검증 시 절차대로 꼼꼼히 확인하여 에러 발생률을 대폭 제어해 주었습니다.";
    } else {
      return "위험 발생 시 실시간 투명 보고를 옹호하고 사전 보안 가이드라인에 따른 성실한 이행 의지를 확인했습니다.";
    }
  }

  if (category === "커뮤니케이션") {
    if (respondent === 'self') {
      return "감정을 배제한 정량적 사실 중심의 간결한 비동기 보고와 빠른 구두 소통을 유연하게 활용합니다.";
    } else if (respondent === 'peer') {
      const idx = peerIdx || 0;
      if (idx === 0) return "상황 보고 시 논점이 정제되어 있고, 회의 리드 시 의제를 신속하게 결정하여 시간 낭비를 제어합니다.";
      if (idx === 1) return "메시지 가독성이 훌륭해 슬랙 소통만으로도 핵심 의도를 오차 없이 전달하고 경청 능력이 좋습니다.";
      return "상대방 주장의 이면 맥락을 빠르게 해독하며 정중하고 부드러운 스피치 스타일을 보여주었습니다.";
    } else {
      return "전달하려는 의도가 논리적이고 깔끔하며, 면접 중 구체적 사실에 입각한 정량적 설명 방식이 우수했습니다.";
    }
  }

  return "해당 사항 없음.";
}

export default function CaseDetails() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [request, setRequest] = useState<ReferenceRequest | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [copySuccess, setCopySuccess] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (id) {
      setRequest(getRequest(id));
      setIsLoaded(true);
    }
  }, [id]);

  const handleCopyLink = (urlPath: string, key: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const fullUrl = `${origin}${urlPath}`;
    navigator.clipboard.writeText(fullUrl);
    setCopySuccess({ ...copySuccess, [key]: true });
    setTimeout(() => {
      setCopySuccess({ ...copySuccess, [key]: false });
    }, 2000);
  };

  const handleRefresh = () => {
    if (id) {
      setRequest(getRequest(id));
    }
  };

  // Simulation Helpers
  const fillCandidateSelf = () => {
    if (!request) return;
    
    const questions = request.customQuestions;
    const selfAnswers = questions.map(q => {
      if (q.type === "ab") return Math.random() > 0.4 ? "A" : "B";
      if (q.type === "scale") return (Math.floor(Math.random() * 2) + 4).toString(); // 4 or 5
      return getJobSpecificAnswer(request.jobType, q.category, 'self');
    });

    const referees = request.referees && request.referees.length >= 3
      ? request.referees
      : [
          { name: "이민우", email: "minwoo@example.com", relation: "전 직장 상사" },
          { name: "박지수", email: "jisu@example.com", relation: "전 직장 동료" },
          { name: "최진아", email: "jina@example.com", relation: "협업 부서 담당자" }
        ];

    const updated: ReferenceRequest = {
      ...request,
      selfAnswers,
      referees
    };

    saveRequest(updated);
    setRequest(updated);
    alert("후보자 자가 진단 및 추천인 3인 등록이 시뮬레이션 완료되었습니다.");
  };

  const fillPeerAnswers = () => {
    if (!request) return;
    if (!request.referees || request.referees.length === 0) {
      alert("먼저 후보자가 추천인을 등록해야 합니다. (후보자 자가 진단 진행 필요)");
      return;
    }

    const questions = request.customQuestions;
    
    // Gen answers for peer 0, 1, 2
    const peerAnswers: Record<string, string[]> = {};
    ["0", "1", "2"].forEach(pIdx => {
      const peerIdx = parseInt(pIdx, 10);
      peerAnswers[pIdx] = questions.map(q => {
        if (q.type === "ab") return Math.random() > 0.3 ? "A" : "B";
        if (q.type === "scale") {
          if (peerIdx === 0) return (Math.floor(Math.random() * 2) + 4).toString(); // 4 or 5
          if (peerIdx === 1) return (Math.floor(Math.random() * 2) + 4).toString(); // 4 or 5
          return (Math.floor(Math.random() * 3) + 3).toString(); // 3, 4, or 5
        }
        return getJobSpecificAnswer(request.jobType, q.category, 'peer', peerIdx);
      });
    });

    const updated: ReferenceRequest = {
      ...request,
      peerAnswers
    };

    saveRequest(updated);
    setRequest(updated);
    alert("추천인 3인의 평판 응답 시뮬레이션이 완료되었습니다.");
  };

  const fillInterviewerAnswers = () => {
    if (!request) return;
    
    const questions = request.customQuestions;
    const interviewerAnswers = questions.map(q => {
      if (q.type === "ab") return Math.random() > 0.5 ? "A" : "B";
      if (q.type === "scale") return (Math.floor(Math.random() * 3) + 3).toString(); // 3, 4, 5
      return getJobSpecificAnswer(request.jobType, q.category, 'interviewer');
    });

    const updated: ReferenceRequest = {
      ...request,
      interviewerAnswers
    };

    saveRequest(updated);
    setRequest(updated);
    alert("면접관의 관찰 평가 시뮬레이션이 완료되었습니다.");
  };

  const fillAllAndComplete = () => {
    if (!request) return;
    
    const questions = request.customQuestions;

    // 1. Candidate
    const selfAnswers = questions.map(q => {
      if (q.type === "ab") return Math.random() > 0.4 ? "A" : "B";
      if (q.type === "scale") return (Math.floor(Math.random() * 2) + 4).toString(); // 4 or 5
      return getJobSpecificAnswer(request.jobType, q.category, 'self');
    });

    const referees = request.referees && request.referees.length >= 3
      ? request.referees
      : [
          { name: "이민우", email: "minwoo@example.com", relation: "전 직장 상사" },
          { name: "박지수", email: "jisu@example.com", relation: "전 직장 동료" },
          { name: "최진아", email: "jina@example.com", relation: "협업 부서 담당자" }
        ];

    // 2. Peers
    const peerAnswers: Record<string, string[]> = {};
    peerAnswers["0"] = questions.map(q => (q.type === "ab" ? "A" : q.type === "scale" ? "4" : getJobSpecificAnswer(request.jobType, q.category, 'peer', 0)));
    peerAnswers["1"] = questions.map(q => (q.type === "ab" ? "B" : q.type === "scale" ? "5" : getJobSpecificAnswer(request.jobType, q.category, 'peer', 1)));
    peerAnswers["2"] = questions.map(q => (q.type === "ab" ? "A" : q.type === "scale" ? "4" : getJobSpecificAnswer(request.jobType, q.category, 'peer', 2)));

    // 3. Interviewer
    const interviewerAnswers = questions.map(q => (q.type === "ab" ? "B" : q.type === "scale" ? "4" : getJobSpecificAnswer(request.jobType, q.category, 'interviewer')));

    const updated: ReferenceRequest = {
      ...request,
      selfAnswers,
      referees,
      peerAnswers,
      interviewerAnswers,
      status: "completed"
    };

    // Calculate report and save
    const report = analyzeSurveyAnswers(updated);
    saveReport(report);
    saveRequest(updated);
    setRequest(updated);
    
    alert("축하합니다! 3자 다면 응답 전체 자동 생성이 완료되었습니다.\n[채용 리포트 조회] 버튼이 활성화되었습니다!");
  };

  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F9FAFB]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#F9FAFB] p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900">케이스를 찾을 수 없습니다.</h2>
        <p className="mt-2 text-sm text-gray-500">삭제되었거나 유효하지 않은 평판 요청 케이스 ID입니다.</p>
        <Link
          href="/company/dashboard"
          className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          대시보드로 이동
        </Link>
      </div>
    );
  }

  // Count completions
  const isSelfComp = !!(request.selfAnswers && request.selfAnswers.length > 0);
  const peerCompCount = Object.keys(request.peerAnswers || {}).filter(k => (request.peerAnswers?.[k]?.length || 0) > 0).length;
  const isIntComp = !!(request.interviewerAnswers && request.interviewerAnswers.length > 0);
  const allCompleted = isSelfComp && peerCompCount === 3 && isIntComp;

  return (
    <div className="flex-1 bg-[#F9FAFB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Link
              href="/company/dashboard"
              className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>대시보드로 돌아가기</span>
            </Link>
            <h1 className="text-2xl font-extrabold text-gray-900 mt-2 tracking-tight sm:text-3xl">
              레퍼런스 체크 진행 관리
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              후보자 {request.candidate.name}님의 다면 평판 수집 현황을 실시간으로 확인하고 링크를 관리합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-250 bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-350 transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              <span>진행 상황 새로고침</span>
            </button>

            {allCompleted && (
              <Link
                href={`/company/report/${request.id}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4.5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500 transition-all"
              >
                <BarChart2 className="h-4 w-4" />
                <span>채용 리포트 조회</span>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Progress Checklist and Invite URLs */}
          <div className="md:col-span-8 space-y-6">
            
            {/* Checklist */}
            <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3.5 mb-5">
                3자 다면평가 수집 상태
              </h3>

              <div className="space-y-4">
                
                {/* 1. Candidate Self */}
                <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-[#F9FAFB]">
                  <div className={`mt-0.5 rounded-full p-1.5 ${isSelfComp ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-400"}`}>
                    {isSelfComp ? <CheckCircle2 className="h-4.5 w-4.5" /> : <Clock className="h-4.5 w-4.5" />}
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-gray-900 mb-0.5">
                      <span>1. 후보자 자가 진단 및 추천인 등록</span>
                      <span className={isSelfComp ? "text-green-600" : "text-amber-600 font-medium"}>
                        {isSelfComp ? "응답 완료" : "대기 중"}
                      </span>
                    </div>
                    <p className="text-gray-500 leading-relaxed mb-3">
                      후보자가 자가 설문에 응시하고, 평판을 의뢰할 전 직장 동료 3명의 명단을 직접 기입합니다.
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyLink(`/candidate/invite/${request.id}`, "cand")}
                        className="inline-flex items-center gap-1 bg-white border border-gray-250 hover:bg-gray-50 px-3 py-1.5 rounded-lg font-bold text-gray-600 shadow-sm text-[10px] transition-colors"
                      >
                        <Copy className="h-3 w-3" />
                        <span>{copySuccess.cand ? "복사 성공!" : "링크 복사"}</span>
                      </button>
                      <Link
                        href={`/candidate/invite/${request.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 bg-white border border-gray-250 hover:bg-gray-50 px-3 py-1.5 rounded-lg font-bold text-gray-600 shadow-sm text-[10px]"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>미리보기</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* 2. Referee Peers */}
                <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-[#F9FAFB]">
                  <div className={`mt-0.5 rounded-full p-1.5 ${peerCompCount === 3 ? "bg-green-100 text-green-700" : peerCompCount > 0 ? "bg-amber-100 text-amber-700" : "bg-gray-200 text-gray-400"}`}>
                    {peerCompCount === 3 ? <CheckCircle2 className="h-4.5 w-4.5" /> : <Clock className="h-4.5 w-4.5" />}
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-gray-900 mb-0.5">
                      <span>2. 추천인 평판 조사 (응답: {peerCompCount}/3)</span>
                      <span className={peerCompCount === 3 ? "text-green-600" : "text-amber-600 font-medium"}>
                        {peerCompCount === 3 ? "조사 완료" : "진행 중"}
                      </span>
                    </div>
                    <p className="text-gray-500 leading-relaxed mb-3">
                      등록된 3명의 추천인이 익명으로 후보자의 직무 성향 및 조직 협업을 평가합니다.
                    </p>

                    {request.referees && request.referees.length > 0 ? (
                      <div className="space-y-2 mb-2 bg-white p-3 rounded-lg border border-gray-200">
                        {request.referees.map((ref, idx) => {
                          const hasAns = !!(request.peerAnswers?.[idx]?.length);
                          return (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                              <div>
                                <span className="font-bold text-gray-900">{ref.name}</span>
                                <span className="text-[10px] text-gray-400 ml-1.5 font-medium">({ref.relation})</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold ${hasAns ? "text-green-600" : "text-amber-500"}`}>
                                  {hasAns ? "✓ 제출함" : "⏳ 미제출"}
                                </span>
                                <button
                                  onClick={() => handleCopyLink(`/reference/invite/${request.id}/${idx}`, `ref_${idx}`)}
                                  className="text-gray-400 hover:text-gray-700 bg-gray-50 border border-gray-150 p-1 rounded"
                                  title="추천인 조사 URL 복사"
                                >
                                  <Copy className="h-3 w-3" />
                                </button>
                                <Link
                                  href={`/reference/invite/${request.id}/${idx}`}
                                  target="_blank"
                                  className="text-gray-400 hover:text-gray-700 bg-gray-50 border border-gray-150 p-1 rounded"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-[10px] text-amber-600 bg-amber-50/50 border border-amber-100 rounded-lg p-2.5 mb-2 font-semibold">
                        ⚠️ 후보자가 자가진단을 시작하고 추천인을 등록할 때까지 링크 대기 중입니다.
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Interviewer Assessment */}
                <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-[#F9FAFB]">
                  <div className={`mt-0.5 rounded-full p-1.5 ${isIntComp ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-400"}`}>
                    {isIntComp ? <CheckCircle2 className="h-4.5 w-4.5" /> : <Clock className="h-4.5 w-4.5" />}
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-gray-900 mb-0.5">
                      <span>3. 면접관 사후 관찰 진단</span>
                      <span className={isIntComp ? "text-green-600" : "text-amber-600 font-medium"}>
                        {isIntComp ? "입력 완료" : "대기 중"}
                      </span>
                    </div>
                    <p className="text-gray-500 leading-relaxed mb-3">
                      채용 전담 면접관({request.interviewer.name})이 실제 관찰한 평가를 기입하여 3점 평판 구조를 형성합니다.
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyLink(`/company/interviewer-assessment/${request.id}`, "int")}
                        className="inline-flex items-center gap-1 bg-white border border-gray-250 hover:bg-gray-50 px-3 py-1.5 rounded-lg font-bold text-gray-600 shadow-sm text-[10px] transition-colors"
                      >
                        <Copy className="h-3 w-3" />
                        <span>{copySuccess.int ? "복사 성공!" : "링크 복사"}</span>
                      </button>
                      <Link
                        href={`/company/interviewer-assessment/${request.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 bg-white border border-gray-250 hover:bg-gray-50 px-3 py-1.5 rounded-lg font-bold text-gray-600 shadow-sm text-[10px]"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>평가하기</span>
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Case Info & Simulation Board */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Case Info */}
            <div className="rounded-2xl border border-gray-150 bg-white p-5 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                케이스 기본 정보
              </h4>

              <div className="text-xs font-semibold text-gray-700 space-y-2 pt-1">
                <div>
                  <span className="text-[10px] text-gray-400 block mb-0.5">후보자 성명 / 지원 직무</span>
                  <p className="text-sm font-extrabold text-gray-900">{request.candidate.name} ({request.candidate.position})</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block mb-0.5">이메일</span>
                  <p className="text-gray-900 font-mono">{request.candidate.email}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block mb-0.5">요청 기업</span>
                  <p className="text-gray-900">{request.candidate.company}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block mb-0.5">등록 일자</span>
                  <p className="text-gray-900 font-mono">{request.createdAt}</p>
                </div>
              </div>
            </div>

            {/* Simulation Dashboard */}
            <div className="rounded-2xl border border-indigo-150 bg-indigo-50/15 p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-1 border-b border-indigo-100 pb-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <h4 className="text-sm font-extrabold text-indigo-950">
                  데모 자동완성 패널
                </h4>
              </div>
              <p className="text-[10.5px] text-indigo-900/80 leading-relaxed font-semibold">
                백엔드가 없는 환경에서 역할을 대역하여 답변을 채워보는 간편 테스트 패널입니다.
              </p>

              <div className="space-y-2">
                {/* 1. Candidate autofill */}
                <button
                  disabled={isSelfComp}
                  onClick={fillCandidateSelf}
                  className="w-full flex items-center justify-start gap-2 bg-white border border-gray-250 hover:bg-indigo-50/40 text-xs font-bold text-gray-700 py-2.5 px-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Play className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                  <span>[1 단계] 후보자 자가진단 채우기</span>
                </button>

                {/* 2. Peer autofill */}
                <button
                  disabled={!isSelfComp || peerCompCount === 3}
                  onClick={fillPeerAnswers}
                  className="w-full flex items-center justify-start gap-2 bg-white border border-gray-250 hover:bg-indigo-50/40 text-xs font-bold text-gray-700 py-2.5 px-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Play className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500" />
                  <span>[2 단계] 추천인 3인 답변 채우기</span>
                </button>

                {/* 3. Interviewer autofill */}
                <button
                  disabled={isIntComp}
                  onClick={fillInterviewerAnswers}
                  className="w-full flex items-center justify-start gap-2 bg-white border border-gray-250 hover:bg-indigo-50/40 text-xs font-bold text-gray-700 py-2.5 px-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Play className="h-3.5 w-3.5 text-cyan-500 fill-cyan-500" />
                  <span>[3 단계] 면접관 관찰 평가 채우기</span>
                </button>

                <div className="border-t border-indigo-100 my-3.5 pt-3.5">
                  {/* 4. Complete all-in-one */}
                  <button
                    onClick={fillAllAndComplete}
                    className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-650 to-indigo-600 hover:from-indigo-550 hover:to-indigo-500 text-xs font-extrabold text-white py-3 px-3 rounded-xl shadow-md transition-all active:scale-95"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>전체 일괄 자동완성</span>
                  </button>
                </div>
              </div>

              <div className="bg-white border border-indigo-100 rounded-xl p-2.5 text-[9.5px] text-indigo-950 font-semibold leading-relaxed flex gap-1 items-start">
                <Info className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <span>일괄 자동완성을 누르시면 3자 다면 평가 결과가 즉시 채점 보정되어 HR 분석 리포트 생성이 완료됩니다!</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
