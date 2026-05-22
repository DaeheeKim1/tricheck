"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { setAppMode } from "@/lib/storage";
import { ArrowRight, Play, Sparkles, CheckSquare } from "lucide-react";

export default function ModeSelect() {
  const router = useRouter();

  const handleSelectMode = (mode: 'real' | 'demo') => {
    setAppMode(mode);
    if (mode === 'real') {
      router.push("/company/dashboard");
    } else {
      router.push("/demo-scenario");
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-indigo-50/50 via-white to-transparent py-20 px-4 flex items-center justify-center">
      <div className="max-w-3xl w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
            <CheckSquare className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">
            Tricheck <span className="text-indigo-600">✓</span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-3">
          tricheck을 어떻게 체험하시겠습니까?
        </h1>
        <p className="text-gray-500 text-sm mb-12 max-w-md mx-auto font-medium">
          원하시는 사용 방식을 선택하여 Tricheck의 3-Point 평판 조회 시스템을 직접 경험해 보세요.
        </p>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Real Service Mode */}
          <button
            onClick={() => handleSelectMode('real')}
            className="group relative flex flex-col p-8 bg-white border border-gray-150 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300 focus:outline-none text-left"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Play className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
              실제 서비스 플로우 시작
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
              기업이 직접 케이스를 생성하고, 후보자·추천인·면접관 평가를 순서대로 진행합니다.
            </p>
            <div className="mt-auto flex items-center gap-1 text-sm font-bold text-indigo-600 group-hover:gap-2 transition-all">
              <span>서비스 시작하기</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </button>

          {/* Demo Scenario Mode */}
          <button
            onClick={() => handleSelectMode('demo')}
            className="group relative flex flex-col p-8 bg-white border border-gray-150 rounded-2xl shadow-sm hover:shadow-xl hover:border-violet-300 hover:-translate-y-1 transition-all duration-300 focus:outline-none text-left"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 mb-6 group-hover:bg-violet-600 group-hover:text-white transition-colors">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">
              데모 시나리오 보기
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
              샘플 데이터가 자동 입력된 상태로 tricheck의 최종 리포트와 핵심 기능을 빠르게 확인합니다.
            </p>
            <div className="mt-auto flex items-center gap-1 text-sm font-bold text-violet-600 group-hover:gap-2 transition-all">
              <span>데모 시나리오 실행</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
