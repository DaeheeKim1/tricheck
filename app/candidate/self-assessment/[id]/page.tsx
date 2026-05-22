"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRequest, saveRequest, ReferenceRequest } from "@/lib/storage";
import { SurveyQuestion } from "@/lib/questions";
import { CheckCircle2, AlertCircle, ArrowRight, User } from "lucide-react";

export default function CandidateSelfAssessment() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [request, setRequest] = useState<ReferenceRequest | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [errors, setErrors] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const req = getRequest(id);
      if (req) {
        setRequest(req);
        // Pre-fill answers if they exist
        const initialAnswers: Record<number, string> = {};
        req.customQuestions.forEach((q, idx) => {
          if (q.target === "self" || q.target === "all") {
            initialAnswers[idx] = req.selfAnswers?.[idx] || "";
          }
        });
        setAnswers(initialAnswers);
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

  const questions = request.customQuestions;
  const candidateQuestions = questions
    .map((q, idx) => ({ q, idx }))
    .filter(({ q }) => q.target === "self" || q.target === "all");

  const handleSelectOption = (idx: number, val: string) => {
    setAnswers({ ...answers, [idx]: val });
    setErrors(null);
  };

  const handleTextChange = (idx: number, val: string) => {
    setAnswers({ ...answers, [idx]: val });
    setErrors(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all candidate questions are answered
    const unanswered = candidateQuestions.filter(({ idx }) => !answers[idx]?.trim());
    if (unanswered.length > 0) {
      setErrors(`아직 답변하지 않은 질문이 ${unanswered.length}개 있습니다. 모든 질문에 답해 주세요.`);
      // Scroll to top or to the error box
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Build the selfAnswers array preserving exact question indices
    const selfAnswers = questions.map((q, idx) => {
      if (q.target === "self" || q.target === "all") {
        return answers[idx];
      }
      return request.selfAnswers?.[idx] || ""; // Keep existing fallback or empty
    });

    const updatedRequest: ReferenceRequest = {
      ...request,
      selfAnswers
    };

    saveRequest(updatedRequest);
    router.push(`/candidate/references/${id}`);
  };

  return (
    <div className="flex-1 bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
            <span className="text-green-650 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> 1단계 완료</span>
            <span className="text-indigo-650">Step 2: 자가 진단 진행 중</span>
            <span>Step 3: 추천인 등록</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full transition-all duration-305 w-2/3"></div>
          </div>
        </div>

        {/* Introduction */}
        <div className="rounded-2xl border border-gray-150 bg-white p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <User className="h-5.5 w-5.5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight sm:text-xl">
                후보자 자가 진단 (Self-Assessment)
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                지원 직무와 관련된 본인의 업무 성향과 역량을 진단합니다.
              </p>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-gray-500 mt-2 font-medium">
            이 진단은 본인 스스로를 어떻게 인식하는지 파악하여 향후 추천인 및 면접관 평가와 비교/분석하기 위한 목적으로 활용됩니다. 솔직하고 객관적으로 답변해주시기 바랍니다.
          </p>
        </div>

        {/* Form Error Box */}
        {errors && (
          <div className="mb-6 rounded-xl border border-red-150 bg-red-50/50 p-4 flex gap-3 text-red-900 animate-in fade-in duration-200">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <span className="text-xs font-bold leading-normal">{errors}</span>
          </div>
        )}

        {/* Survey Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {candidateQuestions.map(({ q, idx }, qNum) => {
            const currentVal = answers[idx] || "";
            return (
              <div key={q.id} className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200">
                <div className="flex items-center justify-between mb-3 border-b border-gray-50 pb-2">
                  <span className="inline-flex items-center gap-1 rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                    Q{qNum + 1}. {q.category}
                  </span>
                  {currentVal ? (
                    <span className="text-[10px] text-green-650 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="h-3 w-3" /> 입력됨
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-400 font-medium">⏳ 답변 대기</span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-gray-900 mb-4 leading-snug">
                  {q.question}
                </h3>

                {/* Question Option Renderer */}
                {q.type === "ab" && (
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSelectOption(idx, "A")}
                      className={`flex items-start text-left p-4.5 rounded-xl border transition-all duration-200 text-xs font-medium ${
                        currentVal === "A"
                          ? "border-indigo-650 bg-indigo-50/30 text-indigo-950 font-bold"
                          : "border-gray-200 hover:bg-gray-50 text-gray-650"
                      }`}
                    >
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-extrabold mr-3 ${
                        currentVal === "A"
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-gray-300 text-gray-400"
                      }`}>
                        A
                      </span>
                      <span>{q.optionA}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectOption(idx, "B")}
                      className={`flex items-start text-left p-4.5 rounded-xl border transition-all duration-200 text-xs font-medium ${
                        currentVal === "B"
                          ? "border-indigo-650 bg-indigo-50/30 text-indigo-950 font-bold"
                          : "border-gray-200 hover:bg-gray-50 text-gray-650"
                      }`}
                    >
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-extrabold mr-3 ${
                        currentVal === "B"
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-gray-300 text-gray-400"
                      }`}>
                        B
                      </span>
                      <span>{q.optionB}</span>
                    </button>
                  </div>
                )}

                {q.type === "scale" && (
                  <div>
                    {/* Scale Radio Buttons */}
                    <div className="flex justify-between items-center gap-1 max-w-md mx-auto py-2">
                      {[1, 2, 3, 4, 5].map((val) => {
                        const valStr = val.toString();
                        const isSelected = currentVal === valStr;
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleSelectOption(idx, valStr)}
                            className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-xs font-extrabold transition-all duration-200 hover:scale-105 active:scale-95 ${
                              isSelected
                                ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                                : "border-gray-200 hover:border-gray-350 text-gray-600 bg-white"
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                    {/* Labels */}
                    <div className="flex justify-between text-[10px] font-semibold text-gray-400 mt-2 px-1">
                      <span>전혀 그렇지 않다 (1)</span>
                      <span>보통이다 (3)</span>
                      <span>매우 그렇다 (5)</span>
                    </div>
                  </div>
                )}

                {q.type === "short" && (
                  <div className="space-y-1">
                    <textarea
                      rows={3}
                      value={currentVal}
                      onChange={(e) => handleTextChange(idx, e.target.value)}
                      placeholder="구체적인 사례와 경험을 서술해주세요 (최소 15자 권장)"
                      className="w-full text-xs font-medium p-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none leading-relaxed"
                    />
                    <div className="flex justify-between text-[10px] font-medium text-gray-450">
                      <span>공란 입력 가능</span>
                      <span>{currentVal.length}자</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Action Trigger */}
          <div className="pt-4 pb-12">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm py-4.5 px-4 rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:-translate-y-0.5 active:scale-98 transition-all duration-250 cursor-pointer"
            >
              <span>답변 완료 및 추천인 등록 이동</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
