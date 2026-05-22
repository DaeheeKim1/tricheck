"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRequest, ReferenceRequest } from "@/lib/storage";
import { ShieldCheck, ArrowRight, Lock, CheckSquare, Info, User, Building, Briefcase } from "lucide-react";

export default function CandidateInvite() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [request, setRequest] = useState<ReferenceRequest | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (id) {
      setRequest(getRequest(id));
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

  if (!request) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#F9FAFB] p-6 text-center">
        <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-650 mb-4 mx-auto">
          <Info className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">요청을 찾을 수 없습니다.</h2>
        <p className="mt-2 text-sm text-gray-500">삭제되었거나 유효하지 않은 평판 조회 초대 링크입니다.</p>
      </div>
    );
  }

  const handleStart = () => {
    if (!agreed) return;
    router.push(`/candidate/self-assessment/${id}`);
  };

  return (
    <div className="flex-1 bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
            <span className="text-indigo-600">Step 1: 약관 동의 및 안내</span>
            <span>Step 2: 자가 진단</span>
            <span>Step 3: 추천인 등록</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full transition-all duration-305 w-1/3"></div>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-150 bg-white p-6 sm:p-8 shadow-xl shadow-gray-100/40">
          <div className="text-center pb-6 border-b border-gray-100 mb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-3">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight sm:text-2xl">
              다면 평판 조회 동의 및 안내
            </h1>
            <p className="mt-2 text-xs text-gray-500 leading-relaxed">
              {request.candidate.company}에서 요청한 {request.candidate.name}님의 다면 평판 조회를 시작합니다.
            </p>
          </div>

          {/* Invitation Target Info */}
          <div className="bg-gray-50 rounded-xl p-4.5 border border-gray-150 mb-6 space-y-3.5 text-xs font-semibold text-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-1.5"><User className="h-4 w-4 shrink-0 text-gray-400" /> 대상 후보자</span>
              <span className="text-gray-900 text-sm font-extrabold">{request.candidate.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-1.5"><Briefcase className="h-4 w-4 shrink-0 text-gray-400" /> 지원 포지션</span>
              <span className="text-gray-900 text-sm font-extrabold">{request.candidate.position}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-1.5"><Building className="h-4 w-4 shrink-0 text-gray-400" /> 요청 기업</span>
              <span className="text-gray-900 text-sm font-extrabold">{request.candidate.company}</span>
            </div>
          </div>

          {/* Core Disclaimers & Info */}
          <div className="space-y-4 text-xs leading-relaxed text-gray-600 mb-8">
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/50 flex gap-3 text-amber-900">
              <Lock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1 font-medium">
                <p className="font-extrabold text-amber-950">비공개 원칙 및 리포트 열람 제안</p>
                <p>본 조사를 통해 최종적으로 생성되는 평판 결과 리포트는 <strong className="text-red-600">채용 담당자(기업)에게만 비공개로 직접 전달</strong>됩니다. 후보자 본인 및 추천인은 완성된 채용 리포트를 열람하실 수 없습니다.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/30 border border-indigo-150/40 flex gap-3 text-indigo-900">
              <Info className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="space-y-1 font-medium">
                <p className="font-extrabold text-indigo-950">평판 수집 절차</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>후보자 본인의 강점과 성향을 진단하는 자가 질문에 답합니다 (약 5분 소요).</li>
                  <li>함께 일했던 동료, 상사 등 추천인 3인의 연락처를 등록합니다.</li>
                  <li>추천인들에게는 익명이 보장되는 평판 조사 설문이 발송됩니다.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Consent Checkbox */}
          <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-all duration-200 select-none mb-6">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <div className="text-xs leading-relaxed text-gray-600 font-semibold">
              <p className="text-gray-900 font-bold">평판 조회 진행 동의 (필수)</p>
              <p className="mt-0.5 text-[11px] text-gray-400">본인의 경력 검증을 위한 3자 다면 평판 수집 절차에 동의하며, 추천인 정보의 제공에 동의합니다.</p>
            </div>
          </label>

          {/* Action Button */}
          <button
            onClick={handleStart}
            disabled={!agreed}
            className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-300 text-white font-extrabold text-sm py-4.5 px-4 rounded-xl shadow-lg shadow-indigo-600/10 disabled:shadow-none hover:shadow-indigo-600/20 hover:-translate-y-0.5 disabled:translate-y-0 active:scale-98 transition-all duration-250 cursor-pointer"
          >
            <span>동의하고 시작하기</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
