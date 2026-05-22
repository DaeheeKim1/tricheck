"use client";

import { CheckCircle2, ShieldCheck } from "lucide-react";

export default function ReferenceComplete() {
  return (
    <div className="flex-1 bg-[#F9FAFB] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        {/* Checkmark Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-6 border border-emerald-100 shadow-sm">
          <CheckCircle2 className="h-10 w-10 animate-pulse" />
        </div>

        {/* Headline */}
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
          평판 설문 제출 완료
        </h1>
        <p className="mt-3 text-sm text-gray-550 leading-relaxed font-semibold">
          소중한 시간을 내어 후보자 평가에 참여해주셔서 진심으로 감사드립니다.
        </p>

        {/* Info Card */}
        <div className="mt-8 rounded-2xl border border-gray-150 bg-white p-6 text-left space-y-4 shadow-sm">
          <div className="flex gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-650 shrink-0 mt-0.5" />
            <div className="text-xs font-semibold text-gray-700 space-y-0.5">
              <h4 className="font-extrabold text-gray-900">철저한 정보 비밀 보장</h4>
              <p className="text-gray-500 leading-relaxed font-medium">추천인님께서 제출하신 모든 의견은 암호화 처리되어 다면적으로 가공 분석됩니다. 후보자 개인은 해당 평판 리포트를 조회하거나 열람할 수 없습니다.</p>
            </div>
          </div>
        </div>

        {/* Close instruction */}
        <p className="mt-8 text-[11px] text-gray-400 font-medium">
          이제 본 브라우저 창을 종료하셔도 좋습니다.
        </p>
      </div>
    </div>
  );
}
