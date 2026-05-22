"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRequest, ReferenceRequest, Referee } from "@/lib/storage";
import { ShieldAlert, ArrowRight, Lock, CheckSquare, Info, User, Users, Building, HelpCircle } from "lucide-react";

export default function ReferenceInvite() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.caseId as string;
  const refId = params.refId as string;

  const [request, setRequest] = useState<ReferenceRequest | null>(null);
  const [referee, setReferee] = useState<Referee | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (caseId && refId) {
      const req = getRequest(caseId);
      if (req) {
        setRequest(req);
        const idx = parseInt(refId, 10);
        if (req.referees && req.referees[idx]) {
          setReferee(req.referees[idx]);
        }
      }
      setIsLoaded(true);
    }
  }, [caseId, refId]);

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
        <p className="mt-2 text-sm text-gray-550 font-semibold">유효하지 않거나 만료된 평판 조회 초대 링크입니다.</p>
      </div>
    );
  }

  // Fallback referee details if candidate hasn't input them yet
  const activeReferee = referee || {
    name: `추천인 (ID: ${refId})`,
    email: "",
    relation: "동료"
  };

  const handleStart = () => {
    if (!agreed) return;
    router.push(`/reference/survey/${caseId}/${refId}`);
  };

  return (
    <div className="flex-1 bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
            <span className="text-indigo-600">Step 1: 정보 안내 및 약관 동의</span>
            <span>Step 2: 평판 조사 설문</span>
            <span>Step 3: 설문 완료</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full transition-all duration-305 w-1/3"></div>
          </div>
        </div>

        {/* Card Wrapper */}
        <div className="rounded-2xl border border-gray-150 bg-white p-6 sm:p-8 shadow-xl shadow-gray-100/40">
          <div className="text-center pb-6 border-b border-gray-100 mb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-3">
              <Users className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight sm:text-2xl">
              동료 평판 설문 요청
            </h1>
            <p className="mt-2 text-xs text-gray-500 leading-relaxed font-semibold">
              안녕하세요, {activeReferee.name}님.<br />
              {request.candidate.name}님을 위한 평판조회 설문에 협조해 주셔서 감사드립니다.
            </p>
          </div>

          {/* Context Details */}
          <div className="bg-gray-50 rounded-xl p-4.5 border border-gray-150 mb-6 space-y-3 text-xs font-semibold text-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-1.5"><User className="h-4 w-4 shrink-0 text-gray-400" /> 평가 대상 후보자</span>
              <span className="text-gray-900 text-sm font-extrabold">{request.candidate.name} ({request.candidate.position})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-1.5"><Building className="h-4 w-4 shrink-0 text-gray-400" /> 제출 기업</span>
              <span className="text-gray-900 text-sm font-extrabold">{request.candidate.company}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-1.5"><HelpCircle className="h-4 w-4 shrink-0 text-gray-400" /> 추천인과의 관계</span>
              <span className="text-gray-900 text-sm font-extrabold">{activeReferee.relation}</span>
            </div>
          </div>

          {/* Confidentiality and Security Details */}
          <div className="space-y-4 text-xs leading-relaxed text-gray-600 mb-8 font-medium">
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/50 flex gap-3 text-emerald-950">
              <Lock className="h-5 w-5 text-emerald-650 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-extrabold text-emerald-950">철저한 익명성 보장</p>
                <p>본 설문을 통해 작성해주신 내용은 다른 추천인들의 답변과 결합 및 보정 처리되어 분석 리포트 형태로 기업에만 제공되며, <strong className="text-emerald-700">후보자 본인에게는 절대 공개되지 않습니다.</strong> 안심하시고 솔직하고 객관적으로 기입하여 주시기 바랍니다.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/30 border border-indigo-150/40 flex gap-3 text-indigo-900">
              <Info className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-extrabold text-indigo-955">참여 안내</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>문항은 객관식 성향 질문과 역량 5점 척도, 주관식 등으로 구성되어 있습니다.</li>
                  <li>작성 도중 브라우저를 닫으면 작성 내용이 유실될 수 있으니 완료 단계까지 한 번에 완료해 주시기를 권장합니다 (약 5분 소요).</li>
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
            <div className="text-xs leading-relaxed text-gray-650 font-semibold">
              <p className="text-gray-900 font-bold">평판 설문 약관 및 정보 제공 동의 (필수)</p>
              <p className="mt-0.5 text-[11px] text-gray-400">작성한 답변 내용이 채용 사의 인재 검증 분석 목적으로 제공되는 것에 동의합니다.</p>
            </div>
          </label>

          {/* Action Trigger */}
          <button
            onClick={handleStart}
            disabled={!agreed}
            className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-300 text-white font-extrabold text-sm py-4.5 px-4 rounded-xl shadow-lg shadow-indigo-600/10 disabled:shadow-none hover:shadow-indigo-600/20 hover:-translate-y-0.5 disabled:translate-y-0 active:scale-98 transition-all duration-250 cursor-pointer"
          >
            <span>설문 작성하기</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
