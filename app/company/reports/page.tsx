"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FileBarChart2, 
  Search, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  UserCheck, 
  Building2, 
  Award,
  Layers,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { getAllRequests, getAppMode, setAppMode, ReferenceReport, getReport, ReferenceRequest } from "@/lib/storage";
import { jobProfiles } from "@/lib/questions";

export default function ReportsPage() {
  const router = useRouter();
  const [appMode, setAppModeState] = useState<'real' | 'demo'>('real');
  const [searchTerm, setSearchTerm] = useState("");
  const [completedCases, setCompletedCases] = useState<ReferenceRequest[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setAppModeState(getAppMode());
    const handleModeChange = () => {
      setAppModeState(getAppMode());
    };
    window.addEventListener("tricheck_mode_change", handleModeChange);

    // Load cases
    const allReqs = getAllRequests();
    const completed = allReqs.filter(c => {
      const isSelfComp = !!(c.selfAnswers && c.selfAnswers.length > 0);
      const peerCompCount = Object.keys(c.peerAnswers || {}).filter(k => (c.peerAnswers?.[k]?.length || 0) > 0).length;
      const isIntComp = !!(c.interviewerAnswers && c.interviewerAnswers.length > 0);
      return isSelfComp && peerCompCount === 3 && isIntComp;
    });
    setCompletedCases(completed);
    setIsLoaded(false);
    // Timeout for smooth rendering
    const t = setTimeout(() => setIsLoaded(true), 150);

    return () => {
      window.removeEventListener("tricheck_mode_change", handleModeChange);
      clearTimeout(t);
    };
  }, []);

  const handleSwitchToReal = () => {
    setAppMode('real');
    router.push("/company/dashboard");
  };

  const handleSwitchToDemo = () => {
    setAppMode('demo');
    router.push("/demo-scenario");
  };

  // Filter completed cases for Real Flow
  const filteredCases = completedCases.filter(c => {
    return (
      c.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.candidate.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="flex-1 bg-[#F9FAFB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              {appMode === "demo" ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-violet-750 text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  <span>데모 시나리오 모드 (Demo Scenario)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-750 text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>실제 서비스 모드 (Real Flow)</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mt-1.5 tracking-tight sm:text-3xl">
              분석 완료 리포트 조회
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              후보자, 추천인, 면접관의 3각 다면 진단이 완료되어 최종 보정된 평판 보고서를 모아봅니다.
            </p>
          </div>

          <div>
            {appMode === "demo" ? (
              <button
                onClick={handleSwitchToReal}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-250 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <span>실제 서비스 플로우 시작</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSwitchToDemo}
                className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4.5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-600/10 hover:bg-violet-500 hover:shadow-violet-600/20 hover:-translate-y-0.5 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>데모 시나리오 실행</span>
              </button>
            )}
          </div>
        </div>

        {/* Demo Mode Report View */}
        {isLoaded && appMode === "demo" && (
          <div className="space-y-6">
            {/* Banner info */}
            <div className="bg-violet-50/50 border border-violet-150 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex gap-3">
                <Sparkles className="h-6 w-6 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-extrabold text-violet-950 text-sm">데모 시나리오 모드 활성화 중</h3>
                  <p className="mt-1 text-xs text-violet-900 font-medium leading-relaxed">
                    데모 시나리오 모드에서는 3-Point 평판 조회가 완벽히 수행된 PM 직군의 고품질 샘플 보고서 데이터가 상시 활성화됩니다. <br />
                    아래 카드를 클릭해 Tricheck의 3자 교차 평판 분석 최종 산출물을 빠르게 검증해 보세요.
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push("/company/report/demo")}
                className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1 self-start md:self-auto shrink-0 transition-all shadow-md shadow-violet-600/10"
              >
                <span>데모 리포트 바로가기</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Demo Card List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                onClick={() => router.push("/company/report/demo")}
                className="group cursor-pointer rounded-2xl border border-violet-150 bg-white p-6 shadow-sm hover:shadow-xl hover:border-violet-300 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 -mt-6 -mr-6 h-20 w-20 rounded-full bg-violet-500/10 blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
                
                <div className="flex items-center justify-between mb-4.5">
                  <span className="text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-100 px-2 py-0.5 rounded">
                    DEMO REPORT
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 font-mono">
                    2026-05-22
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 group-hover:text-violet-650 group-hover:text-violet-600 transition-colors mb-2">
                  홍길동 후보자 평판 보고서
                </h3>

                <div className="space-y-2 mt-4.5 text-xs text-gray-500 font-medium">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-violet-500" />
                    <span>지원 포지션: <b>프로덕트 매니저 (PM)</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-violet-500" />
                    <span>요청 회사: <b>트라이체크</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-violet-500" />
                    <span>추천인 수: <b>3명 완료</b></span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-mono font-extrabold text-violet-600">89</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">종합 점수</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs font-bold text-violet-600 group-hover:gap-1.5 transition-all">
                    <span>보고서 상세 읽기</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Real Mode Reports List */}
        {isLoaded && appMode === "real" && (
          <div className="space-y-6">
            {/* Search filter bar */}
            <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="후보자 이름, 지원 포지션, 회사명 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-9 pr-4 py-2 border border-gray-250 rounded-xl bg-[#F9FAFB] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white text-sm"
                />
              </div>
              <div className="text-xs font-semibold text-gray-400 px-1">
                완료된 리포트: <span className="text-indigo-600 font-bold">{filteredCases.length}</span>개
              </div>
            </div>

            {filteredCases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCases.map((c) => {
                  const jobName = jobProfiles[c.jobType]?.name.split(" ")[0] || c.jobType;
                  return (
                    <div 
                      key={c.id}
                      onClick={() => router.push(`/company/report/${c.id}`)}
                      className="group cursor-pointer rounded-2xl border border-gray-150 bg-white p-6 shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 -mt-6 -mr-6 h-20 w-20 rounded-full bg-indigo-500/5 blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
                      
                      <div className="flex items-center justify-between mb-4.5">
                        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded">
                          REAL REPORT
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 font-mono">
                          {c.createdAt}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
                        {c.candidate.name} 후보자 평판 보고서
                      </h3>

                      <div className="space-y-2 mt-4.5 text-xs text-gray-500 font-medium">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-indigo-500" />
                          <span>지원 포지션: <b>{c.candidate.position} ({jobName})</b></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-indigo-500" />
                          <span>요청 회사: <b>{c.candidate.company}</b></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-indigo-500" />
                          <span>추천인 수: <b>3명 완료</b></span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-2xl font-mono font-extrabold text-indigo-650 text-indigo-600">
                            {c.id === "case_demo_general" ? "83" : "분석완료"}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 text-xs font-bold text-indigo-600 group-hover:gap-1.5 transition-all">
                          <span>보고서 읽기</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center bg-white border border-gray-150 rounded-2xl py-16 px-4 shadow-sm">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-base font-bold text-gray-900">완료된 레퍼런스 체크 리포트가 없습니다.</h3>
                <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                  {searchTerm 
                    ? "검색어와 완벽히 일치하는 리포트를 찾을 수 없습니다." 
                    : "대시보드에서 후보자들의 3각 평판 조사를 완료하면 이곳에서 최종 종합 보고서를 확인할 수 있습니다."}
                </p>
                <div className="mt-6">
                  {searchTerm ? (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-gray-250 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      필터 초기화
                    </button>
                  ) : (
                    <Link
                      href="/company/dashboard"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4.5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500"
                    >
                      <span>대시보드로 가기</span>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
