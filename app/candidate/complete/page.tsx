"use client";

import { CheckCircle2, ShieldCheck, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CandidateComplete() {
  return (
    <div className="flex-1 bg-[#F9FAFB] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        {/* Animated Check */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-green-50 text-green-600 mb-6 border border-green-100 shadow-sm">
          <CheckCircle2 className="h-10 w-10 animate-bounce" />
        </div>

        {/* Text Details */}
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
          자가 진단 및 정보 등록 완료
        </h1>
        <p className="mt-3 text-sm text-gray-550 leading-relaxed font-semibold">
          후보자님의 자가 성향 진단과 평판 추천인 3인의 연락처 등록이 정상적으로 완료되었습니다. 대단히 감사합니다.
        </p>

        {/* Info Block */}
        <div className="mt-8 rounded-2xl border border-gray-150 bg-white p-6 text-left space-y-4 shadow-sm">
          <div className="flex gap-3">
            <Mail className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs font-semibold text-gray-700 space-y-0.5">
              <h4 className="font-extrabold text-gray-900">추천인 평판 설문 발송</h4>
              <p className="text-gray-500 leading-relaxed font-medium">등록해주신 추천인 3인에게 평판 설문 참여 이메일이 발송되었습니다. 추천인께서 답변을 마치시면 전체 다면평가 수집이 자동 완료됩니다.</p>
            </div>
          </div>
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs font-semibold text-gray-700 space-y-0.5">
              <h4 className="font-extrabold text-gray-900">결과 및 리포트 비공개 안내</h4>
              <p className="text-gray-500 leading-relaxed font-medium">채용의 공정성과 익명성을 위해, 최종 레퍼런스 체크 분석 리포트는 채용 기업 담당자에게 직접 전송되며 후보자에게는 공개되지 않습니다.</p>
            </div>
          </div>
        </div>

        {/* Sub-text */}
        <p className="mt-8 text-[11px] text-gray-400 font-medium">
          이제 본 브라우저 창을 닫으셔도 좋습니다.
        </p>
      </div>
    </div>
  );
}
