"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRequest, saveRequest, ReferenceRequest, Referee } from "@/lib/storage";
import { CheckCircle2, AlertCircle, ArrowRight, Users, PlusCircle, Trash } from "lucide-react";

export default function CandidateReferences() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [request, setRequest] = useState<ReferenceRequest | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

  // Form states for 3 referees
  const [referees, setReferees] = useState<Referee[]>([
    { name: "", email: "", relation: "상사 (Manager)" },
    { name: "", email: "", relation: "동료 (Peer)" },
    { name: "", email: "", relation: "협업 부서 담당자 (Cross-functional)" }
  ]);

  useEffect(() => {
    if (id) {
      const req = getRequest(id);
      if (req) {
        setRequest(req);
        if (req.referees && req.referees.length === 3) {
          setReferees(req.referees);
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

  if (!request) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#F9FAFB] p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900">요청을 찾을 수 없습니다.</h2>
        <p className="mt-2 text-sm text-gray-500">유효하지 않은 평판 요청 링크입니다.</p>
      </div>
    );
  }

  const handleInputChange = (idx: number, field: keyof Referee, val: string) => {
    const updated = [...referees];
    updated[idx] = { ...updated[idx], [field]: val };
    setReferees(updated);
    setErrors(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    for (let i = 0; i < referees.length; i++) {
      const ref = referees[i];
      if (!ref.name.trim()) {
        setErrors(`추천인 ${i + 1}의 성명을 입력해주세요.`);
        return;
      }
      if (!ref.email.trim()) {
        setErrors(`추천인 ${i + 1}의 이메일을 입력해주세요.`);
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(ref.email.trim())) {
        setErrors(`추천인 ${i + 1}의 이메일 형식이 유효하지 않습니다.`);
        return;
      }
      if (!ref.relation.trim()) {
        setErrors(`추천인 ${i + 1}의 관계를 선택해주세요.`);
        return;
      }
    }

    const updatedRequest: ReferenceRequest = {
      ...request,
      referees
    };

    saveRequest(updatedRequest);
    router.push("/candidate/complete");
  };

  const relationships = [
    "상사 (Manager)",
    "동료 (Peer)",
    "부하 직원 (Direct Report)",
    "협업 부서 담당자 (Cross-functional)",
    "클라이언트/고객사 (Client/Partner)"
  ];

  return (
    <div className="flex-1 bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
            <span className="text-green-655 flex items-center gap-0.5"><CheckCircle2 className="h-3.5 w-3.5" /> 1단계 완료</span>
            <span className="text-green-655 flex items-center gap-0.5"><CheckCircle2 className="h-3.5 w-3.5" /> 2단계 완료</span>
            <span className="text-indigo-650">Step 3: 추천인 등록 진행 중</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full transition-all duration-305 w-full"></div>
          </div>
        </div>

        {/* Header Intro */}
        <div className="rounded-2xl border border-gray-150 bg-white p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="h-5.5 w-5.5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight sm:text-xl">
                추천인 3인 정보 등록 (References)
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                평판 조회를 요청할 3명의 전/현직 동료 연락처를 기입해주세요.
              </p>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-gray-500 mt-2 font-medium">
            동의하신 내용에 근거하여 기재해주신 추천인들에게 자동으로 평판조회 설문 링크가 이메일 및 문자(시뮬레이션)로 발송됩니다. 원활한 평판 진행을 위해 추천인분들께 사전에 전해두시면 수집이 빠르게 완료됩니다.
          </p>
        </div>

        {/* Validation Errors */}
        {errors && (
          <div className="mb-6 rounded-xl border border-red-150 bg-red-50/50 p-4 flex gap-3 text-red-900 animate-in fade-in duration-200">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <span className="text-xs font-bold leading-normal">{errors}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {referees.map((ref, idx) => (
            <div key={idx} className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2 border-b border-gray-50 pb-3.5 mb-5 text-sm font-extrabold text-gray-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-650">
                  {idx + 1}
                </span>
                <span>추천인 {idx + 1} 정보</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                    추천인 성명 <span className="text-red-550">*</span>
                  </label>
                  <input
                    type="text"
                    value={ref.name}
                    onChange={(e) => handleInputChange(idx, "name", e.target.value)}
                    placeholder="예: 이민우"
                    className="w-full text-xs font-medium px-3.5 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                  />
                </div>

                {/* Relation */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                    후보자와의 관계 <span className="text-red-550">*</span>
                  </label>
                  <select
                    value={ref.relation}
                    onChange={(e) => handleInputChange(idx, "relation", e.target.value)}
                    className="w-full text-xs font-medium px-3.5 py-3.5 rounded-xl border border-gray-200 bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                  >
                    {relationships.map((rel) => (
                      <option key={rel} value={rel}>
                        {rel}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Email (Full width in grid) */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                    이메일 주소 <span className="text-red-550">*</span>
                  </label>
                  <input
                    type="email"
                    value={ref.email}
                    onChange={(e) => handleInputChange(idx, "email", e.target.value)}
                    placeholder="예: manager@example.com"
                    className="w-full text-xs font-medium px-3.5 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Submission Action */}
          <div className="pt-4 pb-12">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm py-4.5 px-4 rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:-translate-y-0.5 active:scale-98 transition-all duration-250 cursor-pointer"
            >
              <span>추천인 등록 완료 및 요청 전송</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
