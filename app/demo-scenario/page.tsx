"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setAppMode, getDemoCaseRequest, analyzeSurveyAnswers } from "@/lib/storage";
import { 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Play, 
  ArrowRight, 
  User, 
  Briefcase, 
  ShieldAlert, 
  CheckCircle,
  Users,
  Compass
} from "lucide-react";

interface DemoCaseOption {
  key: string;
  title: string;
  name: string;
  position: string;
  company: string;
  badge: string;
  badgeColor: string;
  description: string;
  riskHighlight: string;
}

const demoCaseOptions: DemoCaseOption[] = [
  {
    key: "demo_overconfident",
    title: "자신감 과다형 후보자",
    name: "김민수",
    position: "백엔드 개발자 (Backend Developer)",
    company: "카카오 테크",
    badge: "인식 격차 큼",
    badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
    description: "후보자 자기평가는 96점이나, 전 직장 동료 평판 평균은 74점으로 인식 격차가 매우 큽니다. 피드백 수용성과 R&R 갈등 징후를 관찰합니다.",
    riskHighlight: "피드백 수용성 부족 • 과대 포장"
  },
  {
    key: "demo_stable",
    title: "안정형 후보자",
    name: "이지훈",
    position: "프로덕트 매니저 (Product Manager)",
    company: "네이버 웍스",
    badge: "조화롭고 우수",
    badgeColor: "text-green-700 bg-green-50 border-green-200",
    description: "자기평가, 추천인 평균, 면접관 평가가 모두 82~84점 사이로 매우 균일하고 안정적으로 수렴하며, 특별한 결함 징후가 없는 우수 성과자입니다.",
    riskHighlight: "리스크 낮음 • 신뢰도 극히 높음"
  },
  {
    key: "demo_inconsistent",
    title: "평가 불일치형 후보자",
    name: "박서연",
    position: "프로덕트 디자이너 (UX/UI)",
    company: "토스 스튜디오",
    badge: "동료 평판 불일치",
    badgeColor: "text-indigo-700 bg-indigo-50 border-indigo-200",
    description: "디자인실 내부(상사/동료) 평판은 90점 이상으로 우수하나, 협업 개발 파트너의 평판은 52점으로 극도로 갈리는 칸막이 협업 리스크형입니다.",
    riskHighlight: "칸막이 협업 • 직군 간 갈등"
  },
  {
    key: "demo_conflict",
    title: "면접관 충돌형 후보자",
    name: "최현우",
    position: "B2B 영업 대표 (Sales Executive)",
    company: "쿠팡 비즈니스",
    badge: "면접관 갈등 🚨",
    badgeColor: "text-red-700 bg-red-50 border-red-200",
    description: "전 직장 평판은 86점 이상으로 훌륭하지만, 당사 대면 면접 중 면접관이 공격적인 태도와 리스크 지수를 발견하여 최하점을 매긴 갈등 사례입니다.",
    riskHighlight: "단기 성과 지향 • 대면 신뢰도 저하"
  },
  {
    key: "demo_specialized",
    title: "편향된 역량형 후보자",
    name: "정유진",
    position: "퍼포먼스 마케터 (Performance Marketer)",
    company: "배달의민족",
    badge: "조직 규정 위반 우려",
    badgeColor: "text-purple-700 bg-purple-50 border-purple-200",
    description: "데이터 ROI 최적화와 커뮤니케이션 영역은 최고점(92)이나, 사내 증빙 정산 절차 및 보안 컴플라이언스 준수도가 48점으로 극히 낮은 하이 리스크 테이커입니다.",
    riskHighlight: "규정 회피 • 하이 리스크 성향"
  }
];

export default function DemoScenario() {
  const router = useRouter();
  const [selectedCase, setSelectedCase] = useState<string>("demo_stable");
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Get active case metadata
  const caseMeta = demoCaseOptions.find(o => o.key === selectedCase) || demoCaseOptions[1];
  const reqObj = getDemoCaseRequest(selectedCase);
  const reportObj = reqObj ? analyzeSurveyAnswers(reqObj) : null;

  const steps = [
    { 
      label: "케이스 생성 완료", 
      desc: `${caseMeta.name} 후보자 (${caseMeta.position.split(" ")[0]}) 설문지 자동 생성` 
    },
    { 
      label: "후보자 자기평가 완료", 
      desc: `자가진단 50문항 답변 제출 완료 (자가점수: ${reportObj?.selfScore || 85}점)` 
    },
    { 
      label: "추천인 3명 평가 완료", 
      desc: `전 직장 상사 및 동료 3인의 다면 평판 수집 완료 (평균: ${reportObj?.peerAverageScore || 80}점)` 
    },
    { 
      label: "면접관 평가 완료", 
      desc: `면접관 ${reqObj?.interviewer.name || "인사담당자"}의 사후 관찰평가 회신 완료` 
    },
    { 
      label: "3자 교차분석 리포트 생성 완료", 
      desc: "AI 평판 분석 엔진을 통한 종합 적합도 점수 및 데이터 신뢰도 산출 완료" 
    }
  ];

  const handleStartSimulation = () => {
    // Set active case in localStorage
    localStorage.setItem("tricheck_active_demo_case", selectedCase);
    setAppMode("demo");
    setIsSimulating(true);
    setActiveStep(0);
  };

  useEffect(() => {
    if (!isSimulating) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= steps.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 700); // 700ms per step = ~3.5 seconds total

    return () => clearInterval(timer);
  }, [isSimulating]);

  useEffect(() => {
    if (isSimulating && activeStep === steps.length) {
      const redirectTimer = setTimeout(() => {
        router.push("/company/report/demo");
      }, 900);
      return () => clearTimeout(redirectTimer);
    }
  }, [activeStep, isSimulating, router]);

  const progressPercentage = Math.min(100, Math.round((activeStep / steps.length) * 100));

  return (
    <div className="flex-1 bg-gradient-to-b from-indigo-50/50 via-white to-transparent py-16 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {!isSimulating ? (
          /* Selection Screen */
          <div className="bg-white border border-gray-150 rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden animate-in fade-in duration-300">
            {/* Decorative background blur */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none"></div>

            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
                <span>데모 체험 모드 선택</span>
              </span>
            </div>

            <h2 className="text-2xl font-black text-gray-900 tracking-tight sm:text-3xl mb-3">
              어떤 성향의 후보자 데이터를 시뮬레이션하시겠습니까?
            </h2>
            <p className="text-gray-500 text-sm mb-10 font-semibold leading-relaxed">
              Tricheck의 3자 교차 검증은 단순히 평균 고득점자를 고르는 도구가 아닙니다. <br />
              자가 인식 격차, 동료 평판 간 의견 편차, 면접관 관찰 불일치를 가려내는 5가지 핵심 HR 시나리오를 선택해 리포트를 확인해 보세요.
            </p>

            {/* Grid of Cases */}
            <div className="grid grid-cols-1 gap-4 mb-8">
              {demoCaseOptions.map((opt) => {
                const isSelected = selectedCase === opt.key;
                return (
                  <div
                    key={opt.key}
                    onClick={() => setSelectedCase(opt.key)}
                    className={`border rounded-2xl p-5 cursor-pointer text-left transition-all hover:bg-slate-50/30 ${
                      isSelected 
                        ? "border-indigo-650 bg-indigo-50/10 ring-2 ring-indigo-150" 
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-extrabold text-base text-gray-900">{opt.title}</span>
                        <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full whitespace-nowrap ${opt.badgeColor}`}>
                          {opt.badge}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-indigo-600 font-bold bg-indigo-50/30 border border-indigo-100/50 px-2.5 py-0.8 rounded-lg">
                        <User className="h-3.5 w-3.5 text-indigo-500" />
                        <span>{opt.name} 후보자</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 font-medium leading-relaxed mb-3">
                      {opt.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                      <ShieldAlert className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span>핵심 모니터링: <b className="text-gray-600">{opt.riskHighlight}</b></span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Start Button */}
            <div className="flex justify-end">
              <button
                onClick={handleStartSimulation}
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-8 py-4 text-base shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-200 active:scale-95 whitespace-nowrap"
              >
                <span>시뮬레이션 시작</span>
                <ArrowRight className="h-5 w-5 shrink-0" />
              </button>
            </div>
          </div>
        ) : (
          /* Simulating Screen */
          <div className="bg-white border border-gray-150 rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden animate-in fade-in duration-300">
            {/* Decorative background blur */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-violet-500/10 blur-2xl pointer-events-none"></div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                <Sparkles className="h-3.5 w-3.5 text-violet-600 animate-pulse" />
                <span>시나리오 로딩 중: {caseMeta.title}</span>
              </span>
              <span className="text-xs font-bold text-gray-450 bg-gray-50 border border-gray-150 rounded-lg px-2.5 py-1 flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                <span>{caseMeta.name} ({caseMeta.position.split(" ")[0]})</span>
              </span>
            </div>

            <h2 className="text-2xl font-black text-gray-900 tracking-tight sm:text-3xl mb-2">
              평판 조회 프로세스 시뮬레이션 중
            </h2>
            <p className="text-gray-500 text-sm mb-8 font-medium">
              실제 서비스에서 며칠이 소요되는 후보자·추천인·면접관의 3자 평판 수집 과정을 시각적으로 재현합니다.
            </p>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-2">
                <span>진행률</span>
                <span className="text-indigo-600 font-mono">{progressPercentage}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-550 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Steps Timeline */}
            <div className="relative border-l border-gray-100 ml-4 space-y-6">
              {steps.map((step, idx) => {
                const isCompleted = activeStep > idx;
                const isActive = activeStep === idx;
                
                return (
                  <div key={idx} className="relative pl-8 transition-all duration-300">
                    {/* Bullet */}
                    <div className="absolute -left-[13px] top-1">
                      {isCompleted ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white shadow-sm ring-4 ring-white animate-in zoom-in duration-200">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      ) : isActive ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md shadow-indigo-600/20 ring-4 ring-white animate-pulse">
                          <Clock className="h-3.5 w-3.5" />
                        </div>
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400 ring-4 ring-white border border-gray-200">
                          <span className="text-[10px] font-bold font-mono">{idx + 1}</span>
                        </div>
                      )}
                    </div>

                    {/* Text */}
                    <div className={`transition-all ${isCompleted ? "opacity-100" : isActive ? "opacity-100 translate-x-1" : "opacity-40"}`}>
                      <h3 className={`text-base font-bold ${isCompleted ? "text-gray-900" : isActive ? "text-indigo-600" : "text-gray-500"}`}>
                        {step.label}
                      </h3>
                      <p className="mt-0.5 text-xs text-gray-400 font-medium">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Redirection Notice */}
            {activeStep >= steps.length && (
              <div className="mt-8 text-center text-xs text-gray-450 font-bold animate-pulse">
                곧 AI 분석 리포트 화면으로 이동합니다...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
