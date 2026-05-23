"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sparkles, Compass, Users, User, UserCheck, BarChart3, Settings, HelpCircle, X, ChevronUp, ChevronDown } from "lucide-react";
import { getAllRequests, ReferenceRequest, saveRequest } from "@/lib/storage";
import { defaultQuestions } from "@/lib/questions";

export default function DemoNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [cases, setCases] = useState<ReferenceRequest[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("");

  useEffect(() => {
    const list = getAllRequests();
    setCases(list);
    if (list.length > 0 && !selectedCaseId) {
      setSelectedCaseId(list[0].id);
    }
  }, [pathname, isOpen, selectedCaseId]);

  // Create an instant test case to simulate flows
  const handleCreateInstantCase = () => {
    const newId = "demo_" + Math.random().toString(36).substring(2, 9);
    const newCase: ReferenceRequest = {
      id: newId,
      candidate: {
        name: "홍길동",
        email: "gildong@example.com",
        position: "PM",
        company: "테크이노베이터"
      },
      referees: [
        { name: "이민우", email: "minwoo@example.com", relation: "전 직장 상사" },
        { name: "박지수", email: "jisu@example.com", relation: "전 직장 동료" },
        { name: "최진아", email: "jina@example.com", relation: "협업 부서 담당자" }
      ],
      interviewer: {
        name: "김태영",
        email: "taeyoung@example.com",
        title: "채용 총괄 디렉터"
      },
      jobType: "product_manager",
      templateId: "template_product_manager",
      customQuestions: [...defaultQuestions],
      createdAt: new Date().toISOString().split("T")[0],
      status: "pending"
    };

    saveRequest(newCase);
    setSelectedCaseId(newId);
    setCases(getAllRequests());
    router.push(`/company/case/${newId}`);
    alert(`데모용 레퍼런스 체크 케이스가 성공적으로 생성되었습니다!\n대상 후보자: 홍길동 (PM)`);
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  // Determine current active portal role
  let roleBadge = { text: "Company Portal", color: "bg-indigo-600" };
  if (pathname?.startsWith("/candidate")) {
    roleBadge = { text: "Candidate Portal", color: "bg-rose-600" };
  } else if (pathname?.startsWith("/reference")) {
    roleBadge = { text: "Reference Portal", color: "bg-emerald-600" };
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] print:hidden">
      {/* Mini Toggle Pill */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xl hover:bg-slate-800 border border-slate-700 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Compass className="h-4 w-4 text-indigo-400 animate-spin-slow" />
          <span>데모 내비게이터</span>
          <ChevronUp className="h-3 w-3 text-slate-400" />
        </button>
      ) : (
        /* Full Panel */
        <div className="w-80 rounded-2xl border border-slate-700 bg-slate-900 p-4.5 text-white shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-850 pb-2 mb-3">
            <div className="flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-indigo-400" />
              <span className="text-sm font-extrabold tracking-tight">데모 역할/플로우 이동</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white rounded-lg p-0.5 hover:bg-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Current Portal Active Status */}
          <div className="mb-3.5 flex items-center justify-between bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400">현재 접속 페이지</span>
            <span className={`font-extrabold px-1.5 py-0.5 rounded text-[10px] uppercase text-white ${roleBadge.color}`}>
              {roleBadge.text}
            </span>
          </div>

          {/* Case Selector */}
          <div className="space-y-1.5 mb-3.5">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              시뮬레이션 대상 케이스 선택
            </label>
            {cases.length > 0 ? (
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.candidate.name} ({c.candidate.position}) - {c.id.substring(0, 8)}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-[11px] text-amber-400 bg-amber-950/20 border border-amber-900/30 p-2 rounded-lg leading-relaxed">
                생성된 레퍼런스 체크 케이스가 없습니다. 아래 버튼으로 데모용 인스턴스 케이스를 생성하세요.
              </div>
            )}
          </div>

          {/* Nav Actions Group */}
          <div className="space-y-1.5 mb-3.5">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              역할별 페이지 바로가기
            </span>

            <div className="grid grid-cols-2 gap-1.5">
              {/* 1. Company View */}
              <button
                onClick={() => handleNavigate("/company/dashboard")}
                className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 px-2.5 py-1.8 text-xs font-bold hover:bg-slate-800 rounded-lg justify-start text-indigo-300 hover:text-white transition-colors"
              >
                <Settings className="h-3.5 w-3.5 shrink-0" />
                <span>기업 대시보드</span>
              </button>

              {/* 2. Survey Builder */}
              <button
                onClick={() => handleNavigate("/company/survey-builder")}
                className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 px-2.5 py-1.8 text-xs font-bold hover:bg-slate-800 rounded-lg justify-start text-indigo-300 hover:text-white transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                <span>템플릿 빌더</span>
              </button>

              {/* 3. Candidate Flow */}
              <button
                disabled={!selectedCaseId}
                onClick={() => handleNavigate(`/candidate/invite/${selectedCaseId}`)}
                className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 px-2.5 py-1.8 text-xs font-bold hover:bg-slate-800 rounded-lg justify-start disabled:opacity-30 disabled:cursor-not-allowed text-rose-300 hover:text-white transition-colors"
              >
                <User className="h-3.5 w-3.5 shrink-0" />
                <span>후보자 자가진단</span>
              </button>

              {/* 4. Peer Assessment */}
              <button
                disabled={!selectedCaseId}
                onClick={() => handleNavigate(`/reference/invite/${selectedCaseId}/0`)}
                className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 px-2.5 py-1.8 text-xs font-bold hover:bg-slate-800 rounded-lg justify-start disabled:opacity-30 disabled:cursor-not-allowed text-emerald-300 hover:text-white transition-colors"
              >
                <Users className="h-3.5 w-3.5 shrink-0" />
                <span>추천인 평판조회</span>
              </button>

              {/* 5. Interviewer Survey */}
              <button
                disabled={!selectedCaseId}
                onClick={() => handleNavigate(`/company/interviewer-assessment/${selectedCaseId}`)}
                className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 px-2.5 py-1.8 text-xs font-bold hover:bg-slate-800 rounded-lg justify-start disabled:opacity-30 disabled:cursor-not-allowed text-cyan-300 hover:text-white transition-colors"
              >
                <UserCheck className="h-3.5 w-3.5 shrink-0" />
                <span>면접관 최종평가</span>
              </button>

              {/* 6. HR Report */}
              <button
                disabled={!selectedCaseId}
                onClick={() => handleNavigate(`/company/report/${selectedCaseId}`)}
                className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 px-2.5 py-1.8 text-xs font-bold hover:bg-slate-800 rounded-lg justify-start disabled:opacity-30 disabled:cursor-not-allowed text-indigo-300 hover:text-white transition-colors"
              >
                <BarChart3 className="h-3.5 w-3.5 shrink-0" />
                <span>채용 리포트</span>
              </button>
            </div>
          </div>

          {/* Quick Demo Generation */}
          <div className="border-t border-slate-850 pt-3 flex gap-2">
            <button
              onClick={handleCreateInstantCase}
              className="flex-1 inline-flex items-center justify-center gap-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-xs font-extrabold py-2 px-3 rounded-lg hover:from-indigo-500 hover:to-violet-500 transition-all hover:shadow-lg hover:shadow-indigo-500/10 active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>새로운 데모 케이스 생성</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
