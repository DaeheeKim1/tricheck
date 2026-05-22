"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  CheckSquare, 
  Sparkles, 
  Send,
  Info,
  ChevronRight
} from "lucide-react";
import { 
  getRequest, 
  saveRequest, 
  analyzeSurveyAnswers, 
  saveReport, 
  ReferenceRequest 
} from "@/lib/storage";

export default function InterviewerAssessment() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [request, setRequest] = useState<ReferenceRequest | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      const req = getRequest(id);
      if (req) {
        setRequest(req);
        // Initialize answers matching length of customQuestions
        const initialAnswers = req.interviewerAnswers || Array(req.customQuestions.length).fill("");
        
        // Fill defaults for scale questions if empty
        req.customQuestions.forEach((q, idx) => {
          if (!initialAnswers[idx]) {
            if (q.type === "scale") initialAnswers[idx] = "3";
            else if (q.type === "ab") initialAnswers[idx] = "A";
          }
        });
        
        setAnswers(initialAnswers);
      }
      setIsLoaded(true);
    }
  }, [id]);

  const handleSelectAnswer = (idx: number, val: string) => {
    const nextAnswers = [...answers];
    nextAnswers[idx] = val;
    setAnswers(nextAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!request) return;

    // Validate that all interviewer-targeted questions are answered
    const unansweredIndices: number[] = [];
    request.customQuestions.forEach((q, idx) => {
      const isTarget = q.target === "all" || q.target === "interviewer";
      if (isTarget && q.type === "short" && !answers[idx]?.trim()) {
        unansweredIndices.push(idx);
      }
    });

    if (unansweredIndices.length > 0) {
      alert("모든 서술형 문항에 답변을 작성해주세요.");
      return;
    }

    const updatedRequest: ReferenceRequest = {
      ...request,
      interviewerAnswers: answers
    };

    // Check if case is now fully complete (Self, Peers, and Interviewer all complete)
    const isSelfComp = !!(updatedRequest.selfAnswers && updatedRequest.selfAnswers.length > 0);
    const peerCompCount = Object.keys(updatedRequest.peerAnswers || {}).filter(k => (updatedRequest.peerAnswers?.[k]?.length || 0) > 0).length;
    
    if (isSelfComp && peerCompCount === 3) {
      updatedRequest.status = "completed";
      // Trigger evaluation analysis and save
      const report = analyzeSurveyAnswers(updatedRequest);
      saveReport(report);
    }

    saveRequest(updatedRequest);
    alert("면접관 평판 평가 진단이 완료되었습니다!");
    router.push(`/company/case/${request.id}`);
  };

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
        <h2 className="text-xl font-bold text-gray-900">케이스를 찾을 수 없습니다.</h2>
        <p className="mt-2 text-sm text-gray-500">삭제되었거나 유효하지 않은 평판 요청 케이스 ID입니다.</p>
        <Link
          href="/company/dashboard"
          className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          대시보드로 이동
        </Link>
      </div>
    );
  }

  // Filter interviewer questions
  const interviewerQuestions = request.customQuestions.map((q, idx) => ({ q, originalIndex: idx }))
    .filter(({ q }) => q.target === "all" || q.target === "interviewer");

  return (
    <div className="flex-1 bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/company/case/${request.id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-gray-950 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>이전 페이지로</span>
          </Link>
          
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] font-extrabold bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded uppercase tracking-wider">
              Interviewer Portal
            </span>
          </div>
          
          <h1 className="text-2xl font-extrabold text-gray-900 mt-2 tracking-tight">
            면접관 사후 관찰평가 진단
          </h1>
          <p className="mt-1 text-sm text-gray-500 leading-normal">
            후보자 <b>{request.candidate.name}</b> ({request.candidate.position})님에 대하여 면접 과정에서 관찰한 역량과 행동양식을 익명 진단해주세요.
          </p>
        </div>

        {/* Info card */}
        <div className="bg-indigo-50/50 border border-indigo-100 p-4.5 rounded-2xl mb-8 text-xs text-indigo-900 leading-relaxed flex gap-2 font-semibold">
          <Info className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <span>면접관 최종 평가는 평판조회 보고서의 **면접관 평가(Interviewer)** 채점으로 반영되어 자가인식 격차 분석 및 다면 대조 그래프 형성에 직결됩니다. 최대한 사실과 경험에 입각하여 응답해 주십시오.</span>
          </div>
        </div>

        {/* Questions list */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {interviewerQuestions.map(({ q, originalIndex }, seq) => {
            const currentAns = answers[originalIndex] || "";
            return (
              <div 
                key={q.id} 
                className="rounded-2xl border border-gray-150 bg-white p-6 sm:p-7 shadow-sm space-y-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between text-xs font-bold border-b border-gray-100 pb-3">
                  <span className="text-indigo-600 font-mono">Q. 문항 {seq + 1}</span>
                  <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-[10px]">
                    {q.category}
                  </span>
                </div>

                {/* Question */}
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900 leading-relaxed">
                    {q.question}
                  </h3>
                </div>

                {/* Answer UI */}
                <div className="pt-2">
                  
                  {/* Type A/B */}
                  {q.type === "ab" && (
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        type="button"
                        onClick={() => handleSelectAnswer(originalIndex, "A")}
                        className={`flex items-start gap-3 w-full rounded-xl border p-4 text-xs text-left font-semibold transition-all ${
                          currentAns === "A" 
                            ? "border-indigo-600 bg-indigo-50/30 text-indigo-950 ring-2 ring-indigo-50" 
                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                          currentAns === "A" ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-300 text-gray-400"
                        }`}>
                          A
                        </span>
                        <span className="leading-relaxed">{q.optionA}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectAnswer(originalIndex, "B")}
                        className={`flex items-start gap-3 w-full rounded-xl border p-4 text-xs text-left font-semibold transition-all ${
                          currentAns === "B" 
                            ? "border-indigo-600 bg-indigo-50/30 text-indigo-950 ring-2 ring-indigo-50" 
                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                          currentAns === "B" ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-300 text-gray-400"
                        }`}>
                          B
                        </span>
                        <span className="leading-relaxed">{q.optionB}</span>
                      </button>
                    </div>
                  )}

                  {/* Type Scale */}
                  {q.type === "scale" && (
                    <div className="space-y-4">
                      {/* Radios 1-5 */}
                      <div className="flex justify-between items-center gap-1.5 sm:gap-4 py-2">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleSelectAnswer(originalIndex, val.toString())}
                            className={`flex-1 flex flex-col items-center justify-center rounded-xl border py-3 px-1 transition-all ${
                              currentAns === val.toString()
                                ? "border-indigo-600 bg-indigo-550 bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                                : "border-gray-250 bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <span className="text-sm font-extrabold font-mono">{val}점</span>
                            <span className="text-[9px] font-semibold opacity-80 mt-1">
                              {val === 1 && "전혀 미흡"}
                              {val === 2 && "소폭 미흡"}
                              {val === 3 && "보통"}
                              {val === 4 && "우수"}
                              {val === 5 && "매우 탁월"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Type Short */}
                  {q.type === "short" && (
                    <div>
                      <textarea
                        rows={4}
                        placeholder="이 질문 영역에 부합하는 면접자의 구체적인 답변 사례, 행동적 근거, 경험 또는 관찰 내용을 상세히 적어주세요..."
                        value={currentAns}
                        onChange={(e) => handleSelectAnswer(originalIndex, e.target.value)}
                        className="w-full rounded-xl border border-gray-250 px-3 py-3.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed bg-[#F9FAFB] focus:bg-white font-medium"
                      />
                    </div>
                  )}

                </div>
              </div>
            );
          })}

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-white font-bold py-3.5 text-sm shadow-md shadow-indigo-600/15 transition-all"
            >
              <Send className="h-4 w-4" />
              <span>면접관 최종 진단 제출</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
