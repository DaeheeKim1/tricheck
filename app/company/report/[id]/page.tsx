"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  Printer, 
  ArrowLeft, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  Calendar, 
  Building2, 
  Star,
  ShieldCheck,
  TrendingUp,
  Users,
  AlertCircle,
  HelpCircle,
  XCircle,
  Scale,
  ShieldAlert,
  MessageSquare,
  Zap,
  BookOpen,
  Info,
  Sparkles
} from "lucide-react";
import { getReport, getRequest, getTemplateById, getAppMode, setAppMode, ReferenceReport, ReferenceRequest } from "@/lib/storage";
import { jobProfiles, QuestionCategory, SurveyQuestion, JobTypeKey } from "@/lib/questions";

// Visual 3-Point Evaluation Triangle Component
function TriangleChart({ self, peer, interviewer }: { self: number; peer: number; interviewer: number }) {
  const cX = 150;
  const cY = 135;
  const maxR = 90; // Maximum radius for 100 points

  const getPt = (angleDeg: number, score: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const r = (score / 100) * maxR;
    return {
      x: cX + r * Math.cos(angleRad),
      y: cY + r * Math.sin(angleRad),
    };
  };

  const selfPt = getPt(-90, self);
  const peerPt = getPt(30, peer);
  const intPt = getPt(150, interviewer);

  const levels = [20, 40, 60, 80, 100];

  return (
    <div className="flex justify-center select-none py-4">
      <svg width="300" height="260" viewBox="0 0 300 260" className="overflow-visible">
        {/* Concentric grid triangles */}
        {levels.map((lvl) => {
          const p1 = getPt(-90, lvl);
          const p2 = getPt(30, lvl);
          const p3 = getPt(150, lvl);
          return (
            <polygon
              key={lvl}
              points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="1"
              strokeDasharray={lvl === 100 ? "none" : "3 3"}
            />
          );
        })}

        {/* Axis lines from center */}
        {[-90, 30, 150].map((angle) => {
          const outer = getPt(angle, 100);
          return (
            <line
              key={angle}
              x1={cX}
              y1={cY}
              x2={outer.x}
              y2={outer.y}
              stroke="#E5E7EB"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Grid ticks text labels */}
        {levels.map((lvl) => {
          const pt = getPt(150, lvl);
          return (
            <text
              key={lvl}
              x={pt.x - 6}
              y={pt.y + 3}
              className="text-[9px] fill-gray-400 font-bold font-mono"
              textAnchor="end"
            >
              {lvl}
            </text>
          );
        })}

        {/* Actual Shaded Shape */}
        <polygon
          points={`${selfPt.x},${selfPt.y} ${peerPt.x},${peerPt.y} ${intPt.x},${intPt.y}`}
          fill="rgba(79, 70, 229, 0.15)"
          stroke="#4F46E5"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Dots */}
        <circle cx={selfPt.x} cy={selfPt.y} r="5.5" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx={peerPt.x} cy={peerPt.y} r="5.5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx={intPt.x} cy={intPt.y} r="5.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />

        {/* Vertex Labels */}
        <text
          x={cX}
          y={cY - maxR - 12}
          textAnchor="middle"
          className="text-[11px] font-extrabold fill-rose-600"
        >
          면접자 자기평가 ({self}점)
        </text>
        <text
          x={cX + maxR * Math.cos(Math.PI / 6) + 12}
          y={cY + maxR * Math.sin(Math.PI / 6) + 14}
          textAnchor="start"
          className="text-[11px] font-extrabold fill-indigo-600"
        >
          추천인 평균 ({peer}점)
        </text>
        <text
          x={cX - maxR * Math.cos(Math.PI / 6) - 12}
          y={cY + maxR * Math.sin(Math.PI / 6) + 14}
          textAnchor="end"
          className="text-[11px] font-extrabold fill-emerald-600"
        >
          면접관 평가 ({interviewer}점)
        </text>
      </svg>
    </div>
  );
}

function ReportContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [report, setReport] = useState<ReferenceReport | null>(null);
  const [request, setRequest] = useState<ReferenceRequest | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [appMode, setAppModeState] = useState<'real' | 'demo'>('real');

  useEffect(() => {
    setAppModeState(getAppMode());
    const handleModeChange = () => {
      setAppModeState(getAppMode());
    };
    window.addEventListener("tricheck_mode_change", handleModeChange);
    return () => {
      window.removeEventListener("tricheck_mode_change", handleModeChange);
    };
  }, []);

  useEffect(() => {
    if (id) {
      const rep = getReport(id);
      setReport(rep);
      if (rep) {
        if (id === "demo") {
          setRequest({
            id: "demo",
            candidate: {
              name: rep.candidate.name,
              email: "gildong.hong@example.com",
              position: rep.candidate.position,
              company: rep.candidate.company
            },
            referees: [
              { name: "이민우", email: "minwoo@example.com", relation: "전 직장 상사" },
              { name: "박지수", email: "jisu@example.com", relation: "전 직장 동료" },
              { name: "최진아", email: "jina@example.com", relation: "협업 부서 담당자" }
            ],
            interviewer: { name: "이철수", email: "chulsoo@example.com", title: "HR 파트장" },
            jobType: rep.jobType,
            templateId: "template_pm",
            customQuestions: jobProfiles[rep.jobType]?.questions || [],
            createdAt: rep.createdAt,
            status: "completed"
          });
        } else if (id === "case_demo_general") {
          setRequest({
            id: "case_demo_general",
            candidate: {
              name: rep.candidate.name,
              email: "taehee.kim@example.com",
              position: rep.candidate.position,
              company: rep.candidate.company
            },
            referees: [
              { name: "이종민", email: "jongmin@example.com", relation: "전 직장 상사" },
              { name: "최수연", email: "sooyeon@example.com", relation: "전 직장 동료" },
              { name: "정다은", email: "daeun@example.com", relation: "협업 부서 담당자" }
            ],
            interviewer: { name: "박성호", email: "sungho.park@example.com", title: "인사팀장" },
            jobType: "general",
            templateId: "template_general",
            customQuestions: jobProfiles.general?.questions || [],
            createdAt: rep.createdAt,
            status: "completed"
          });
        } else {
          setRequest(getRequest(id));
        }
      }
      setIsLoaded(true);
    }
  }, [id]);

  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F9FAFB]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#F9FAFB] p-6 text-center animate-in fade-in duration-300">
        <h2 className="text-xl font-bold text-gray-900">리포트를 찾을 수 없습니다.</h2>
        <p className="mt-2 text-sm text-gray-500">아직 모든 평가자가 설문조사에 응답하지 않았거나 생성되지 않은 리포트입니다.</p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => router.push("/company/dashboard")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            홈으로 이동
          </button>
          <button
            onClick={() => router.push(`/company/case/${id}`)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-250 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            진행 상태 확인
          </button>
        </div>
      </div>
    );
  }

  const getRecBadge = (rec: string) => {
    switch (rec) {
      case "강력 추천":
        return { text: "강력 추천 ★", color: "text-indigo-700 bg-indigo-50 border-indigo-200" };
      case "추천":
        return { text: "추천 ★", color: "text-green-700 bg-green-50 border-green-200" };
      case "조건부 추천":
        return { text: "조건부 추천 ⚠️", color: "text-amber-700 bg-amber-50 border-amber-200" };
      case "보류":
        return { text: "채용 보류 🛑", color: "text-red-700 bg-red-50 border-red-200" };
      default:
        return { text: rec, color: "text-gray-700 bg-gray-50 border-gray-200" };
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "낮음":
        return { text: "낮음 (안전) ✅", color: "text-green-700 bg-green-50/50 border-green-200" };
      case "보통":
        return { text: "보통 (모니터링) ⚠️", color: "text-amber-700 bg-amber-50/50 border-amber-200" };
      case "높음":
        return { text: "높음 (주의) 🚨", color: "text-red-700 bg-red-50/50 border-red-200" };
      default:
        return { text: level, color: "text-gray-700 bg-gray-50 border-gray-200" };
    }
  };

  const recBadge = getRecBadge(report.recommendation);
  const riskBadge = getRiskBadge(report.riskLevel);
  const jobName = jobProfiles[report.jobType]?.name || "직무 미지정";

  const questions = request?.customQuestions || jobProfiles[report.jobType]?.questions || [];
  
  const templateName = request
    ? (getTemplateById(request.templateId)?.name || jobProfiles[request.jobType]?.name || "기본 레퍼런스 체크 템플릿")
    : (jobProfiles[report.jobType]?.name || "기본 레퍼런스 체크 템플릿");

  const selfQuestionsCount = questions.filter(q => q.target === "self" || q.target === "all").length;
  const peerQuestionsCount = questions.filter(q => q.target === "peer" || q.target === "all").length;
  const interviewerQuestionsCount = questions.filter(q => q.target === "interviewer" || q.target === "all").length;

  const defaultQIds = new Set(jobProfiles[report.jobType]?.questions.map(q => q.id) || []);
  const customQuestionsCount = questions.filter(
    q => !defaultQIds.has(q.id) || q.id.startsWith("custom_q_") || q.id.startsWith("q_")
  ).length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "업무성향": return <TrendingUp className="h-3.5 w-3.5" />;
      case "조직적합성": return <Award className="h-3.5 w-3.5" />;
      case "협업성향": return <Users className="h-3.5 w-3.5" />;
      case "리스크 대응": return <Scale className="h-3.5 w-3.5" />;
      case "커뮤니케이션": return <MessageSquare className="h-3.5 w-3.5" />;
      case "직무전문성": return <Zap className="h-3.5 w-3.5" />;
      default: return <HelpCircle className="h-3.5 w-3.5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "업무성향": return "text-amber-600 bg-amber-50";
      case "조직적합성": return "text-indigo-600 bg-indigo-50";
      case "협업성향": return "text-green-600 bg-green-50";
      case "리스크 대응": return "text-red-600 bg-red-50";
      case "커뮤니케이션": return "text-pink-600 bg-pink-50";
      case "직무전문성": return "text-sky-600 bg-sky-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="flex-1 bg-[#F9FAFB] py-10 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0 print:px-0">
      
      {/* Global CSS for Print and PDF Page Breaks */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          .print-avoid-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-bottom: 2rem !important;
          }
          .print-page-break {
            page-break-before: always !important;
            break-before: always !important;
            padding-top: 3rem !important;
          }
        }
      `}} />

      <div className="mx-auto max-w-4xl space-y-8 print:max-w-none print:w-full print:space-y-6 print-container">
        
        {/* Navigation Actions (Hidden on Print) */}
        {appMode === "demo" ? (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print bg-slate-900 text-white p-4.5 rounded-2xl border border-slate-800 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="bg-violet-600 text-white font-extrabold px-2.5 py-1 rounded-lg text-xs tracking-wide animate-pulse">
                DEMO SCENARIO
              </span>
              <span className="text-xs text-slate-300 font-semibold">데모 시나리오 모드로 리포트를 임시 조회 중입니다.</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setAppMode('real');
                  router.push("/company/dashboard");
                }}
                className="inline-flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-bold text-white border border-slate-700 transition-all"
              >
                실제 플로우로 돌아가기
              </button>
              <button
                onClick={() => {
                  router.push("/demo-scenario");
                }}
                className="inline-flex items-center justify-center rounded-xl bg-violet-600 hover:bg-violet-500 px-4 py-2 text-xs font-bold text-white border border-violet-500 transition-all shadow-md shadow-violet-600/10"
              >
                데모 리포트 다시 보기
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white border border-indigo-500 transition-all"
              >
                <Printer className="h-3.5 w-3.5 mr-1" />
                <span>PDF 인쇄</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between no-print">
            <button
              onClick={() => router.push(`/company/case/${report.id}`)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>이전 페이지로</span>
            </button>
            
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4.5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500 hover:shadow-indigo-600/20 transition-all"
            >
              <Printer className="h-4 w-4" />
              <span>PDF 저장 / 인쇄하기</span>
            </button>
          </div>
        )}

        {/* 1. Header Information Block */}
        <div className="rounded-2xl border border-gray-150 bg-white p-6 sm:p-8 shadow-sm print:shadow-none print:border-gray-300 print-avoid-break">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-6 print:border-gray-300">
            <div>
              <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">
                Tricheck Verification Report
              </span>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                  Tricheck 3자 교차 레퍼런스 리포트
                </h1>
                {appMode === "demo" && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full select-none">
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    <span>데모 시나리오 (Demo Scenario)</span>
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>진단 작성일: {report.createdAt}</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-gray-400">후보자</span>
                <span className="text-sm font-bold text-gray-900">{report.candidate.name}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-gray-400">대상 포지션</span>
                <span className="text-sm font-bold text-gray-900">{report.candidate.position}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 border border-green-100">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-gray-400">채용 요청 기업</span>
                <span className="text-sm font-bold text-gray-900">{report.candidate.company}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 설문 구성 정보 Block */}
        <div className="rounded-2xl border border-gray-150 bg-white p-6 sm:p-8 shadow-sm print:shadow-none print:border-gray-300 print-avoid-break">
          <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3 mb-6">
            설문 구성 정보
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <span className="block text-xs font-bold text-gray-400">사용 템플릿</span>
              <span className="text-sm font-bold text-gray-900 mt-1 block">{templateName}</span>
            </div>
            
            <div>
              <span className="block text-xs font-bold text-gray-400">직무 카테고리</span>
              <span className="text-sm font-bold text-gray-900 mt-1 block">{jobName}</span>
            </div>

            <div>
              <span className="block text-xs font-bold text-gray-400">기업 커스텀 문항 수</span>
              <span className="text-sm font-bold text-indigo-600 mt-1 block">{customQuestionsCount}개</span>
            </div>

            <div>
              <span className="block text-xs font-bold text-gray-400">후보자 자기평가 문항 수</span>
              <span className="text-sm font-bold text-gray-900 mt-1 block">{selfQuestionsCount}개</span>
            </div>

            <div>
              <span className="block text-xs font-bold text-gray-400">추천인 평가 문항 수</span>
              <span className="text-sm font-bold text-gray-900 mt-1 block">{peerQuestionsCount}개</span>
            </div>

            <div>
              <span className="block text-xs font-bold text-gray-400">면접관 평가 문항 수</span>
              <span className="text-sm font-bold text-gray-900 mt-1 block">{interviewerQuestionsCount}개</span>
            </div>
          </div>
        </div>

        {/* 평가단 응답 및 타임스탬프 정보 Block (데모 전용) */}
        {appMode === "demo" && (
          <div className="rounded-2xl border border-violet-150 bg-violet-50/10 p-6 sm:p-8 shadow-sm print:shadow-none print:border-gray-300 print-avoid-break">
            <div className="flex items-center gap-2 border-b border-violet-100 pb-3 mb-6">
              <Sparkles className="h-4 w-4 text-violet-600" />
              <h3 className="text-sm font-bold text-violet-950">
                데모 시나리오 평가단 응답 정보 (타임스탬프)
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-white border border-gray-150 rounded-xl text-xs font-semibold shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-500">후보자 자가평가</span>
                  <span className="text-gray-950 font-bold">{request?.candidate.name || "홍길동"}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                  <span>2026-05-22 10:14</span>
                  <span className="bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.2 rounded text-[10px]">완료</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white border border-gray-150 rounded-xl text-xs font-semibold shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-500">추천인 1 (상사)</span>
                  <span className="text-gray-950 font-bold">{request?.referees[0]?.name || "이민우"}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                  <span>2026-05-22 11:32</span>
                  <span className="bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.2 rounded text-[10px]">완료</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white border border-gray-150 rounded-xl text-xs font-semibold shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-500">추천인 2 (동료)</span>
                  <span className="text-gray-950 font-bold">{request?.referees[1]?.name || "박지수"}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                  <span>2026-05-22 13:05</span>
                  <span className="bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.2 rounded text-[10px]">완료</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white border border-gray-150 rounded-xl text-xs font-semibold shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-500">추천인 3 (담당자)</span>
                  <span className="text-gray-950 font-bold">{request?.referees[2]?.name || "최진아"}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                  <span>2026-05-22 14:11</span>
                  <span className="bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.2 rounded text-[10px]">완료</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white border border-gray-150 rounded-xl text-xs font-semibold shadow-sm md:col-span-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-500">면접관 평가</span>
                  <span className="text-gray-950 font-bold">{request?.interviewer.name || "이철수"} ({request?.interviewer.title || "HR 파트장"})</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                  <span>2026-05-22 14:45</span>
                  <span className="bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.2 rounded text-[10px]">완료</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Overall Scoring Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-3 print-avoid-break">
          
          {/* Circular Score Gauge */}
          <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm flex flex-col items-center justify-center text-center print:shadow-none print:border-gray-300">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              01. 종합 채용 적합도 점수
            </h3>
            
            <div className="relative flex items-center justify-center">
              <svg className="h-32 w-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="50"
                  className="stroke-gray-100"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="50"
                  className="stroke-indigo-600"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={2 * Math.PI * 50 - (2 * Math.PI * 50 * report.overall) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-gray-900">{report.overall}</span>
                <span className="text-[10px] text-gray-400 font-semibold border-t border-gray-100 mt-0.5 pt-0.5 w-10">100점 만점</span>
              </div>
            </div>
            
            <div className="mt-4 text-[10px] text-gray-400 font-bold uppercase">
              최종 보정 적합도
            </div>
          </div>

          {/* Recommendation & Risk Tier */}
          <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm flex flex-col justify-between print:shadow-none print:border-gray-300">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              02. 채용 추천 및 리스크
            </h3>
            
            <div className="space-y-4 flex-1 flex flex-col justify-center">
              <div>
                <span className="block text-[10px] text-gray-400 font-bold mb-1">최종 추천 등급</span>
                <span className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 w-full text-sm font-extrabold text-center ${recBadge.color}`}>
                  {recBadge.text}
                </span>
              </div>
              
              <div>
                <span className="block text-[10px] text-gray-400 font-bold mb-1">종합 리스크 등급</span>
                <span className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 w-full text-sm font-extrabold text-center ${riskBadge.color}`}>
                  {riskBadge.text}
                </span>
              </div>
            </div>
          </div>

          {/* Consistency score */}
          <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm flex flex-col items-center justify-center text-center print:shadow-none print:border-gray-300">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              03. 평판 응답 일관성
            </h3>
            
            <div className="relative flex items-center justify-center mb-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 border-2 border-indigo-200 font-mono">
                <span className="text-2xl font-extrabold">{report.consistencyScore}%</span>
              </div>
            </div>

            <div className="text-xs font-bold text-gray-800">응답 일치 지수</div>
            <p className="text-[10px] text-gray-400 leading-normal max-w-[200px] mt-1.5 mx-auto">
              추천인 3인의 문항별 답변 편차를 분석하여 산출한 일치도 수준입니다.
            </p>
          </div>

        </div>

        {/* 3. Evaluation Triangle Summary */}
        <div className="rounded-2xl border border-gray-150 bg-white p-6 sm:p-8 shadow-sm print:shadow-none print:border-gray-300 print-avoid-break">
          <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3 mb-6">
            04. 3자 평판교차분석 요약 (Evaluation Triangle)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center print:grid-cols-2">
            <div>
              <TriangleChart 
                self={report.selfScore} 
                peer={report.peerAverageScore} 
                interviewer={report.interviewerScore} 
              />
            </div>
            
            <div className="space-y-4">
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4.5 print:bg-white print:border-gray-200">
                <span className="inline-flex items-center gap-1 bg-indigo-650 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded mb-2">
                  AI 종합 요약 의견
                </span>
                <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                  "{report.aiSummary}"
                </p>
              </div>

              <div className="text-[10px] text-gray-400 leading-normal space-y-1">
                <p>• <b>면접자 자기평가 (Self):</b> 후보자 본인이 진단한 직무 성향 자가 점수</p>
                <p>• <b>추천인 평균 (Peer):</b> 전 동료 및 상사 3인이 익명 진단한 종합 평판 평균</p>
                <p>• <b>면접관 평가 (Interviewer):</b> 당사 면접 과정에서 면접관이 관찰/평가한 점수</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Self-Awareness Gap & Scoring Adjustments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print-avoid-break">
          
          {/* Self-Awareness Gap */}
          <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm flex flex-col print:shadow-none print:border-gray-300">
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">
              05. 자기인식 격차 (Self-Awareness Gap)
            </h3>
            
            <div className="space-y-4 flex-1 flex flex-col justify-around">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-rose-50/50 border border-rose-100 p-3.5 rounded-xl text-center">
                  <span className="block text-[10px] text-rose-700 font-bold mb-0.5">자가 - 추천인 평균 격차</span>
                  <span className="text-lg font-mono font-extrabold text-rose-600">
                    {report.selfPeerGap > 0 ? `+${report.selfPeerGap}` : report.selfPeerGap}점
                  </span>
                </div>
                
                <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl text-center">
                  <span className="block text-[10px] text-emerald-700 font-bold mb-0.5">자가 - 면접관 평가 격차</span>
                  <span className="text-lg font-mono font-extrabold text-emerald-600">
                    {report.selfInterviewerGap > 0 ? `+${report.selfInterviewerGap}` : report.selfInterviewerGap}점
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl text-xs text-gray-600 leading-relaxed print:bg-white print:border-gray-250">
                <span className="font-bold text-gray-800 block mb-1">자기 객관화 분석 해석기준:</span>
                {Math.abs(report.selfPeerGap) <= 4 ? (
                  <span className="text-green-700 font-semibold">
                    ✓ 후보자의 자가인식과 동료의 평판 격차가 4점 이하로 매우 조화롭습니다. 본인의 강점과 보완점을 객관적이고 정확하게 인지하고 있습니다.
                  </span>
                ) : Math.abs(report.selfPeerGap) <= 8 ? (
                  <span className="text-amber-700 font-semibold">
                    ⚠️ 자기인식 격차가 5점~8점 내외로 보통 수준입니다. 본인의 역량을 약간 긍정적으로 포장하는 경향이 있으나 보편적인 범주에 해당합니다.
                  </span>
                ) : (
                  <span className="text-red-700 font-semibold">
                    🚨 자기인식 격차가 8점을 초과하여 본인의 업무 역량을 과도하게 과대평가(긍정 편향)하고 있을 우려가 있습니다. 실제 협업 시 피드백 수용도를 재확인하십시오.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Adjustments details */}
          <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm flex flex-col print:shadow-none print:border-gray-300">
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">
              06. 신뢰도 보정 점수 세부 조정내역
            </h3>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg font-bold text-gray-600 print:bg-gray-100">
                <span>지표 항목</span>
                <span>보정 수치</span>
              </div>
              
              <div className="flex justify-between items-center px-1 font-semibold text-gray-700">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-300"></span>
                  추천인 평균 점수 (원점수 기준)
                </span>
                <span className="font-mono font-bold">{report.peerAverageScore}점</span>
              </div>

              <div className="flex justify-between items-center px-1 text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-450 bg-rose-400"></span>
                  자기인식 격차 감점 (Self-Peer)
                </span>
                <span className="font-mono text-rose-500 font-bold">-{report.penalties.selfPeerGap}점</span>
              </div>

              <div className="flex justify-between items-center px-1 text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
                  자기평가 - 면접관 격차 감점
                </span>
                <span className="font-mono text-rose-500 font-bold">-{report.penalties.selfInterviewerGap}점</span>
              </div>

              <div className="flex justify-between items-center px-1 text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                  추천인 답변 의견 불일치도 감점
                </span>
                <span className="font-mono text-rose-500 font-bold">-{report.penalties.peerInconsistency}점</span>
              </div>

              <div className="flex justify-between items-center px-1 text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400"></span>
                  면접관 평판 갈등 지표 감점
                </span>
                <span className="font-mono text-rose-500 font-bold">-{report.penalties.interviewerConflict}점</span>
              </div>

              <div className="flex justify-between items-center px-1 text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                  자기평가 초고득점 편향 감점
                </span>
                <span className="font-mono text-rose-500 font-bold">-{report.penalties.positiveBias}점</span>
              </div>

              <div className="flex justify-between items-center bg-indigo-50 p-2.5 rounded-lg font-extrabold text-indigo-900 border border-indigo-150 print:bg-white print:border-gray-300">
                <span>최종 산출 보정 점수 (Overall Fit Score)</span>
                <span className="font-mono text-lg">{report.overall}점</span>
              </div>
            </div>
          </div>

        </div>

        {/* 5. Category Radar Breakdown Page Break */}
        <div className="rounded-2xl border border-gray-150 bg-white p-6 sm:p-8 shadow-sm print:shadow-none print:border-gray-300 print-page-break">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
            <h3 className="text-sm font-bold text-gray-800">
              07. 카테고리별 다면 분석 상세
            </h3>
            <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">
              지원 직무: {jobName}
            </span>
          </div>

          <div className="bg-indigo-50/30 border border-indigo-100/50 p-4 rounded-xl text-xs text-gray-700 mb-6 leading-relaxed print:bg-white print:border-gray-200">
            <div className="font-bold text-indigo-950 flex items-center gap-1 mb-1">
              <Info className="h-3.5 w-3.5" />
              <span>직무별 가중치 적용 안내 (05. 직무 적합도 분석)</span>
            </div>
            후보자가 지원한 포지션({jobName})의 직무 전문 영역을 고려하여 각 평가 성향에 핵심 가중치를 설계하였습니다. 주요 협업 부서 및 실무 요구사항에 적합한 가중치가 반영된 최종 점수로, 직무 고유의 평판 지수가 충실히 계량화되었습니다.
          </div>

          <div className="space-y-6">
            {report.gapData.map((cat, idx) => {
              const template = jobProfiles[report.jobType];
              const weightVal = template ? Math.round((template.weights[cat.label] || 0) * 100) : 0;
              return (
                <div key={idx} className="space-y-2 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                      <span className={`p-1 rounded ${getCategoryColor(cat.label)}`}>
                        {getCategoryIcon(cat.label)}
                      </span>
                      <span>{cat.label}</span>
                      {weightVal > 0 && (
                        <span className="text-[10px] text-indigo-650 text-indigo-600 bg-indigo-50 border border-indigo-100/50 font-mono px-1 rounded">
                          가중치 {weightVal}%
                        </span>
                      )}
                    </span>
                    
                    <div className="flex gap-4 text-[10px] font-bold text-gray-400 font-mono">
                      <span className="text-rose-500">자가: {cat.self}</span>
                      <span className="text-indigo-600">추천인: {cat.peer}</span>
                      <span className="text-emerald-600">면접관: {cat.interviewer}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pl-7">
                    {/* Self bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] w-12 font-bold text-gray-400 uppercase font-mono">Self</span>
                      <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-400 rounded-full" style={{ width: `${cat.self}%` }}></div>
                      </div>
                      <span className="text-[10px] w-6 text-right font-mono font-bold text-rose-500">{cat.self}</span>
                    </div>
                    
                    {/* Peer bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] w-12 font-bold text-gray-400 uppercase font-mono">Peer</span>
                      <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${cat.peer}%` }}></div>
                      </div>
                      <span className="text-[10px] w-6 text-right font-mono font-bold text-indigo-600">{cat.peer}</span>
                    </div>

                    {/* Interviewer bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] w-12 font-bold text-gray-400 uppercase font-mono">Interv</span>
                      <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${cat.interviewer}%` }}></div>
                      </div>
                      <span className="text-[10px] w-6 text-right font-mono font-bold text-emerald-600">{cat.interviewer}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Key Strengths & Warnings Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print-page-break">
          
          {/* Strengths */}
          <div className="rounded-2xl border border-green-150 bg-green-50/10 p-6 sm:p-8 shadow-sm print:shadow-none print:border-green-300 print-avoid-break">
            <h3 className="text-sm font-bold text-green-900 flex items-center gap-1.5 mb-4">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
              <span>08. 주요 강점 (Key Strengths)</span>
            </h3>
            <ul className="space-y-3">
              {report.strengths.map((str, idx) => (
                <li key={idx} className="flex gap-2 items-start text-xs font-semibold text-green-950 bg-white border border-green-100 p-3.5 rounded-xl shadow-sm leading-relaxed">
                  <span className="text-green-650 text-green-600 font-mono font-bold">0{idx + 1}.</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Warnings */}
          <div className="rounded-2xl border border-amber-150 bg-amber-50/10 p-6 sm:p-8 shadow-sm print:shadow-none print:border-amber-300 print-avoid-break">
            <h3 className="text-sm font-bold text-amber-900 flex items-center gap-1.5 mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
              <span>09. 우려 및 보완점 (Warnings)</span>
            </h3>
            <ul className="space-y-3">
              {report.warnings.map((warn, idx) => (
                <li key={idx} className="flex gap-2 items-start text-xs font-semibold text-amber-950 bg-white border border-amber-100 p-3.5 rounded-xl shadow-sm leading-relaxed">
                  <span className="text-amber-650 text-amber-600 font-mono font-bold">0{idx + 1}.</span>
                  <span>{warn}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* 7. Detailed Question Answers Table Breakdown Page Break */}
        <div className="space-y-6 print:space-y-4 print-page-break">
          <div className="border-b border-gray-200 pb-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold">✓</span>
              <span>10. 상세 진단 문항 및 다면 응답 비교</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1 leading-normal">
              각 진단 항목별로 면접자 자가 평가, 추천인 3인의 개별 응답, 면접관 평가를 일대일로 대조하여 심층 분석합니다.
            </p>
          </div>

          <div className="space-y-6">
            {report.answersDetail.map((detail, idx) => (
              <div 
                key={idx} 
                className="rounded-2xl border border-gray-150 bg-white overflow-hidden shadow-sm print:shadow-none print:border-gray-300 print-avoid-break"
              >
                {/* Header */}
                <div className="bg-gray-50/50 border-b border-gray-100 px-6 py-4 flex items-center justify-between text-xs print:bg-gray-50 print:border-gray-200">
                  <div className="flex items-center gap-2 font-bold">
                    <span className="text-indigo-650 text-indigo-600">문항 {idx + 1}</span>
                    <span className="text-gray-300">|</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${getCategoryColor(detail.category)}`}>
                      {detail.category}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-700">{detail.title}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">질문 내용</h4>
                    <p className="mt-1 text-sm font-extrabold text-gray-900 leading-relaxed">
                      {detail.question}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-gray-100 print:grid-cols-3">
                    
                    {/* Self Answer */}
                    <div className="bg-rose-50/30 border border-rose-100 p-4 rounded-xl">
                      <span className="block text-[10px] text-rose-700 font-bold mb-1">면접자 자기평가 (Self)</span>
                      <p className="text-xs text-rose-950 font-semibold leading-relaxed">
                        "{detail.selfAnswerText || "미기입"}"
                      </p>
                    </div>

                    {/* Peer Answers */}
                    <div className="bg-indigo-50/30 border border-indigo-100 p-4 rounded-xl space-y-2">
                      <span className="block text-[10px] text-indigo-700 font-bold mb-1">추천인 3인 답변 (Peers)</span>
                      <div className="space-y-1 text-xs text-indigo-950 leading-relaxed font-semibold">
                        <div className="flex items-start gap-1">
                          <span className="text-[9px] bg-indigo-100 px-1 rounded text-indigo-700 shrink-0 mt-0.5 font-mono">추천1</span>
                          <span>"{detail.peerAnswerTexts[0] || "미기입"}"</span>
                        </div>
                        <div className="flex items-start gap-1">
                          <span className="text-[9px] bg-indigo-100 px-1 rounded text-indigo-700 shrink-0 mt-0.5 font-mono">추천2</span>
                          <span>"{detail.peerAnswerTexts[1] || "미기입"}"</span>
                        </div>
                        <div className="flex items-start gap-1">
                          <span className="text-[9px] bg-indigo-100 px-1 rounded text-indigo-700 shrink-0 mt-0.5 font-mono">추천3</span>
                          <span>"{detail.peerAnswerTexts[2] || "미기입"}"</span>
                        </div>
                      </div>
                    </div>

                    {/* Interviewer Answer */}
                    <div className="bg-emerald-50/30 border border-emerald-100 p-4 rounded-xl">
                      <span className="block text-[10px] text-emerald-700 font-bold mb-1">면접관 평가 (Interviewer)</span>
                      <p className="text-xs text-emerald-950 font-semibold leading-relaxed">
                        "{detail.interviewerAnswerText || "미기입"}"
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CompanyReport() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-[#F9FAFB]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    }>
      <ReportContent />
    </Suspense>
  );
}
