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
      return "저는 목표지향적이면서 팀원들의 피드백을 기민하게 경청하여 지속적인 성과를 만들어내는 데 강점을 두고 있습니다.";
    });

    const referees = [
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
      peerAnswers[pIdx] = questions.map(q => {
        if (q.type === "ab") return Math.random() > 0.3 ? "A" : "B";
        if (q.type === "scale") return (Math.floor(Math.random() * 3) + 3).toString(); // 3, 4, 5
        return `${request.candidate.name}님은 업무 책임감이 매우 강하고 난관이 있어도 적극적으로 돌파하여 팀원들의 신뢰가 두터운 분이었습니다.`;
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
      return "면접에서 관찰한 결과 비즈니스 도메인 이해도가 높고 커뮤니케이션 흐름이 명료하여 협업 생산성이 높을 것으로 진단했습니다.";
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
      if (q.type === "ab") return "A";
      if (q.type === "scale") return "5";
      return "체계적인 설계와 주도적인 과업 집중으로 성공을 보장합니다.";
    });

    const referees = [
      { name: "이민우", email: "minwoo@example.com", relation: "전 직장 상사" },
      { name: "박지수", email: "jisu@example.com", relation: "전 직장 동료" },
      { name: "최진아", email: "jina@example.com", relation: "협업 부서 담당자" }
    ];

    // 2. Peers
    const peerAnswers: Record<string, string[]> = {};
    peerAnswers["0"] = questions.map(q => (q.type === "ab" ? "A" : q.type === "scale" ? "4" : "소통이 부드럽고 피드백을 잘 경청합니다."));
    peerAnswers["1"] = questions.map(q => (q.type === "ab" ? "B" : q.type === "scale" ? "5" : "전문성이 매우 우수하여 믿고 맡길 수 있습니다."));
    peerAnswers["2"] = questions.map(q => (q.type === "ab" ? "A" : q.type === "scale" ? "4" : "일정 준수가 명확하고 협업 조율을 잘 해냅니다."));

    // 3. Interviewer
    const interviewerAnswers = questions.map(q => (q.type === "ab" ? "B" : q.type === "scale" ? "4" : "종합 면접 관찰 결과 우수하게 평가되었습니다."));

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
