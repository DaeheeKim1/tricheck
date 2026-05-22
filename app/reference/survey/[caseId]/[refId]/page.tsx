"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRequest, saveRequest, analyzeSurveyAnswers, saveReport, ReferenceRequest, Referee } from "@/lib/storage";
import { CheckCircle2, AlertCircle, ArrowRight, Users, MessageSquare } from "lucide-react";

export default function ReferenceSurvey() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.caseId as string;
  const refId = params.refId as string;

  const [request, setRequest] = useState<ReferenceRequest | null>(null);
  const [referee, setReferee] = useState<Referee | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [errors, setErrors] = useState<string | null>(null);

  useEffect(() => {
    if (caseId && refId) {
      const req = getRequest(caseId);
      if (req) {
        setRequest(req);
        const idx = parseInt(refId, 10);
        if (req.referees && req.referees[idx]) {
          setReferee(req.referees[idx]);
        }
        
        // Pre-fill answers if they exist
        const initialAnswers: Record<number, string> = {};
        req.customQuestions.forEach((q, idxQ) => {
          if (q.target === "peer" || q.target === "all") {
            initialAnswers[idxQ] = req.peerAnswers?.[refId]?.[idxQ] || "";
          }
        });
        setAnswers(initialAnswers);
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
        <h2 className="text-xl font-bold text-gray-900">요청을 찾을 수 없습니다.</h2>
        <p className="mt-2 text-sm text-gray-500">유효하지 않은 평판 요청 링크입니다.</p>
      </div>
    );
  }

  const activeReferee = referee || {
    name: `추천인 (ID: ${refId})`,
    email: "",
    relation: "동료"
  };

  const questions = request.customQuestions;
  const peerQuestions = questions
    .map((q, idx) => ({ q, idx }))
    .filter(({ q }) => q.target === "peer" || q.target === "all");

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

    // Check if all peer questions are answered
    const unanswered = peerQuestions.filter(({ idx }) => !answers[idx]?.trim());
    if (unanswered.length > 0) {
      setErrors(`아직 답변하지 않은 질문이 ${unanswered.length}개 있습니다. 모든 질문에 답해 주세요.`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Build peer answer list matching original question indexing
    const peerAnswerList = questions.map((q, idx) => {
      if (q.target === "peer" || q.target === "all") {
        return answers[idx];
      }
      return request.peerAnswers?.[refId]?.[idx] || "";
    });

    const updatedPeerAnswers = {
      ...(request.peerAnswers || {}),
      [refId]: peerAnswerList
    };

    const updatedRequest: ReferenceRequest = {
      ...request,
      peerAnswers: updatedPeerAnswers
    };

    // Evaluate dynamic completion across three roles
    const isSelfComp = !!(updatedRequest.selfAnswers && updatedRequest.selfAnswers.length > 0);
    const peerCompCount = Object.keys(updatedPeerAnswers).filter(k => (updatedPeerAnswers[k]?.length || 0) > 0).length;
    const isIntComp = !!(updatedRequest.interviewerAnswers && updatedRequest.interviewerAnswers.length > 0);

    if (isSelfComp && peerCompCount === 3 && isIntComp) {
      updatedRequest.status = "completed";
      const report = analyzeSurveyAnswers(updatedRequest);
      saveReport(report);
    }

    saveRequest(updatedRequest);
    router.push("/reference/complete");
  };

  return (
    <div className="flex-1 bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
            <span className="text-green-655 flex items-center gap-0.5"><CheckCircle2 className="h-3.5 w-3.5" /> 1단계 완료</span>
            <span className="text-indigo-650">Step 2: 평판 설문 작성 진행 중</span>
            <span>Step 3: 설문 완료</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full transition-all duration-305 w-2/3"></div>
          </div>
        </div>

        {/* Intro Banner */}
        <div className="rounded-2xl border border-gray-150 bg-white p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <MessageSquare className="h-5.5 w-5.5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight sm:text-xl">
                동료 평판 작성 ({activeReferee.name}님)
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                {request.candidate.name} 후보자의 실제 협업 스타일과 직무 성향을 평가합니다.
              </p>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-gray-500 mt-2 font-medium">
            본 평판 조사는 익명성이 철저히 보장되며, 전/현직 회사에서 관찰한 사실을 토대로 솔직하게 작성해주시면 인재 배치 및 팀 핏 확인에 큰 기여가 됩니다.
          </p>
        </div>

        {/* Error Notification */}
        {errors && (
          <div className="mb-6 rounded-xl border border-red-150 bg-red-50/50 p-4 flex gap-3 text-red-900 animate-in fade-in duration-200">
            <AlertCircle className="h-5 w-5 text-red-650 shrink-0 mt-0.5" />
            <span className="text-xs font-bold leading-normal">{errors}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {peerQuestions.map(({ q, idx }, qNum) => {
            const currentVal = answers[idx] || "";
            return (
              <div key={q.id} className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200">
                <div className="flex items-center justify-between mb-3 border-b border-gray-55 pb-2">
                  <span className="inline-flex items-center gap-1 rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 font-mono">
                    Q{qNum + 1}. {q.category}
                  </span>
                  {currentVal ? (
                    <span className="text-[10px] text-green-655 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="h-3 w-3" /> 답변 완료
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-400 font-semibold">⏳ 작성 필요</span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-gray-900 mb-4 leading-snug">
                  {q.question}
                </h3>

                {/* Dynamic Inputs */}
                {q.type === "ab" && (
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSelectOption(idx, "A")}
                      className={`flex items-start text-left p-4.5 rounded-xl border transition-all duration-200 text-xs font-semibold ${
                        currentVal === "A"
                          ? "border-indigo-650 bg-indigo-50/30 text-indigo-950 font-bold"
                          : "border-gray-200 hover:bg-gray-50 text-gray-600"
                      }`}
                    >
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-extrabold mr-3 ${
                        currentVal === "A"
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-gray-300 text-gray-405"
                      }`}>
                        A
                      </span>
                      <span>{q.optionA}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectOption(idx, "B")}
                      className={`flex items-start text-left p-4.5 rounded-xl border transition-all duration-200 text-xs font-semibold ${
                        currentVal === "B"
                          ? "border-indigo-650 bg-indigo-50/30 text-indigo-950 font-bold"
                          : "border-gray-200 hover:bg-gray-50 text-gray-600"
                      }`}
                    >
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-extrabold mr-3 ${
                        currentVal === "B"
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-gray-300 text-gray-405"
                      }`}>
                        B
                      </span>
                      <span>{q.optionB}</span>
                    </button>
                  </div>
                )}

                {q.type === "scale" && (
                  <div>
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
                                ? "border-indigo-650 bg-indigo-650 text-white shadow-md shadow-indigo-600/10"
                                : "border-gray-200 hover:border-gray-350 text-gray-600 bg-white"
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
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
                      placeholder="후보자님이 실제 프로젝트에서 거둔 직무 성과나 협업 스타일을 구체적으로 알려주세요 (예: 커뮤니케이션 능력, 리스크 대응 사례 등)"
                      className="w-full text-xs font-medium p-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none leading-relaxed"
                    />
                    <div className="flex justify-between text-[10px] font-medium text-gray-450">
                      <span>솔직하고 건설적인 의견을 부탁드립니다.</span>
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
              className="w-full flex items-center justify-center gap-1.5 bg-indigo-650 hover:bg-indigo-550 text-white font-extrabold text-sm py-4.5 px-4 rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:-translate-y-0.5 active:scale-98 transition-all duration-250 cursor-pointer"
            >
              <span>답변 완료 및 제출하기</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
