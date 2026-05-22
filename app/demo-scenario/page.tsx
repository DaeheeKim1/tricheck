"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setAppMode } from "@/lib/storage";
import { CheckCircle2, Clock, Sparkles } from "lucide-react";

const steps = [
  { label: "케이스 생성 완료", desc: "기본 PM 직군 설문 템플릿 로딩 및 후보자 매핑 완료" },
  { label: "후보자 자기평가 완료", desc: "6개 핵심 문항에 대한 자가인식 답변 수집 완료" },
  { label: "추천인 3명 평가 완료", desc: "이전 직장 상사 및 동료 3인의 다면 평판지 답변 매핑 완료" },
  { label: "면접관 평가 완료", desc: "HR 부서의 실무 면접 평가 결과 데이터 수집 완료" },
  { label: "3자 교차분석 리포트 생성 완료", desc: "AI 평판 분석 엔진을 통한 종합 적합도 점수 및 역량 레이더맵 도출 완료" }
];

export default function DemoScenario() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Force set app mode to 'demo' when entering this page
    setAppMode("demo");

    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= steps.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 800); // 800ms per step = 4 seconds total

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeStep === steps.length) {
      const redirectTimer = setTimeout(() => {
        router.push("/company/report/demo");
      }, 1000);
      return () => clearTimeout(redirectTimer);
    }
  }, [activeStep, router]);

  const progressPercentage = Math.min(100, Math.round((activeStep / steps.length) * 100));

  return (
    <div className="flex-1 bg-gradient-to-b from-[#F9FAFB] via-[#F3F4F6] to-transparent py-16 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Card */}
        <div className="bg-white border border-gray-150 rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden">
          {/* Decorative background blur */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none"></div>

          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>데모 시나리오 모드</span>
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl mb-2">
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
                className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-500 ease-out"
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
      </div>
    </div>
  );
}
