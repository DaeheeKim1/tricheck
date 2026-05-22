"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  PlusCircle, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Search, 
  Trash2, 
  ExternalLink, 
  Settings, 
  Layers, 
  User, 
  Users, 
  UserCheck, 
  BarChart2, 
  AlertCircle 
} from "lucide-react";
import { getAllRequests, deleteRequest, ReferenceRequest } from "@/lib/storage";
import { jobProfiles } from "@/lib/questions";

export default function CompanyDashboard() {
  const router = useRouter();
  const [cases, setCases] = useState<ReferenceRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCases(getAllRequests());
    setIsLoaded(true);
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("정말로 이 레퍼런스 체크 케이스를 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.")) {
      deleteRequest(id);
      setCases(getAllRequests());
    }
  };

  // Metrics calculations
  const totalCases = cases.length;
  const completedCases = cases.filter(c => {
    const isSelfComp = !!(c.selfAnswers && c.selfAnswers.length > 0);
    const peerCompCount = Object.keys(c.peerAnswers || {}).filter(k => (c.peerAnswers?.[k]?.length || 0) > 0).length;
    const isIntComp = !!(c.interviewerAnswers && c.interviewerAnswers.length > 0);
    return isSelfComp && peerCompCount === 3 && isIntComp;
  }).length;
  const pendingCases = totalCases - completedCases;

  // Filtering cases
  const filteredCases = cases.filter(c => {
    const isSelfComp = !!(c.selfAnswers && c.selfAnswers.length > 0);
    const peerCompCount = Object.keys(c.peerAnswers || {}).filter(k => (c.peerAnswers?.[k]?.length || 0) > 0).length;
    const isIntComp = !!(c.interviewerAnswers && c.interviewerAnswers.length > 0);
    const allCompleted = isSelfComp && peerCompCount === 3 && isIntComp;
    
    const matchesSearch = 
      c.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.candidate.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      filterStatus === "all" ||
      (filterStatus === "completed" && allCompleted) ||
      (filterStatus === "pending" && !allCompleted);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 bg-[#F9FAFB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase tracking-wider">
                Employer View
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mt-1.5 tracking-tight sm:text-3xl">
              레퍼런스 체크 관리자 대시보드
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              후보자 등록, 3자 다면평가 현황 모니터링 및 AI 리포트 조회를 한곳에서 관리합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/company/survey-builder"
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-250 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all whitespace-nowrap shrink-0"
            >
              <Settings className="h-4 w-4 shrink-0" />
              <span>설문 템플릿 관리</span>
            </Link>
            <Link
              href="/company/create-case"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4.5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500 hover:shadow-indigo-600/20 hover:-translate-y-0.5 transition-all whitespace-nowrap shrink-0"
            >
              <PlusCircle className="h-4 w-4 shrink-0" />
              <span>새 평가 요청 등록</span>
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          {/* Card 1 */}
          <div className="rounded-2xl border border-gray-150 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-400 whitespace-nowrap">총 평가 진행 건수</span>
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 shrink-0">
                <Layers className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 whitespace-nowrap">{totalCases}건</p>
            <div className="mt-2 text-xs text-gray-400 whitespace-nowrap">Tricheck 전체 케이스 내역</div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-gray-150 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-400 whitespace-nowrap">진행 중인 평가</span>
              <div className="rounded-lg bg-amber-50 p-2 text-amber-600 shrink-0">
                <Clock className="h-5 w-5 animate-pulse" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 whitespace-nowrap">{pendingCases}건</p>
            <div className="mt-2 text-xs text-gray-400 whitespace-nowrap">평가단 답변 수집 대기 중</div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-gray-150 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-400 whitespace-nowrap">AI 분석 완료</span>
              <div className="rounded-lg bg-green-50 p-2 text-green-600 shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 whitespace-nowrap">{completedCases}건</p>
            <div className="mt-2 text-xs text-gray-400 whitespace-nowrap">3자 피드백 교차분석 리포트 완료</div>
          </div>
        </div>

        {/* List Operations (Search & Filter) */}
        <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {/* Search */}
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

          {/* Tabs / Filter status */}
          <div className="flex bg-[#F9FAFB] p-1 rounded-xl border border-gray-150 text-xs font-bold gap-1 self-start md:self-auto flex-wrap sm:flex-nowrap">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                filterStatus === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              전체 ({totalCases})
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                filterStatus === "pending" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              진행 중 ({pendingCases})
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                filterStatus === "completed" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              완료 ({completedCases})
            </button>
          </div>
        </div>

        {/* Case List */}
        {isLoaded && filteredCases.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-gray-150 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 text-left text-sm">
                <thead className="bg-[#F9FAFB] font-bold text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4 whitespace-nowrap">후보자 정보</th>
                    <th scope="col" className="px-6 py-4 whitespace-nowrap">요청 포지션</th>
                    <th scope="col" className="px-6 py-4 whitespace-nowrap">진행 현황 (3자 다면)</th>
                    <th scope="col" className="px-6 py-4 whitespace-nowrap">등록일자</th>
                    <th scope="col" className="px-6 py-4 text-right whitespace-nowrap">관리 작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredCases.map((c) => {
                    const isSelfComp = !!(c.selfAnswers && c.selfAnswers.length > 0);
                    const peerCompCount = Object.keys(c.peerAnswers || {}).filter(k => (c.peerAnswers?.[k]?.length || 0) > 0).length;
                    const isIntComp = !!(c.interviewerAnswers && c.interviewerAnswers.length > 0);
                    const allCompleted = isSelfComp && peerCompCount === 3 && isIntComp;

                    return (
                      <tr 
                        key={c.id} 
                        className="hover:bg-gray-50/50 cursor-pointer transition-colors"
                        onClick={() => router.push(`/company/case/${c.id}`)}
                      >
                        {/* Candidate info */}
                        <td className="px-6 py-4.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold whitespace-nowrap">
                              {c.candidate.name.substring(0, 2)}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 whitespace-nowrap">{c.candidate.name}</div>
                              <div className="text-xs text-gray-400 font-medium whitespace-nowrap">{c.candidate.company}</div>
                            </div>
                          </div>
                        </td>

                        {/* Job type */}
                        <td className="px-6 py-4.5">
                          <div className="text-gray-950 font-semibold whitespace-nowrap">{c.candidate.position}</div>
                          <div className="text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-1.5 py-0.5 rounded font-mono inline-block mt-0.5 whitespace-nowrap">
                            {jobProfiles[c.jobType]?.name.split(" ")[0] || c.jobType}
                          </div>
                        </td>

                        {/* Checklist progress */}
                        <td className="px-6 py-4.5">
                          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                            {/* Self */}
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                              isSelfComp 
                                ? "bg-green-50 text-green-700 border-green-200" 
                                : "bg-gray-50 text-gray-400 border-gray-200"
                            }`}>
                              <User className="h-3 w-3 shrink-0" />
                              <span>자가 {isSelfComp ? "완료" : "대기"}</span>
                            </span>

                            {/* Peer */}
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                              peerCompCount === 3 
                                ? "bg-green-50 text-green-700 border-green-200" 
                                : peerCompCount > 0 
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-gray-50 text-gray-400 border-gray-200"
                            }`}>
                              <Users className="h-3 w-3 shrink-0" />
                              <span>추천인 {peerCompCount}/3</span>
                            </span>

                            {/* Interviewer */}
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                              isIntComp 
                                ? "bg-green-50 text-green-700 border-green-200" 
                                : "bg-gray-50 text-gray-400 border-gray-200"
                            }`}>
                              <UserCheck className="h-3 w-3 shrink-0" />
                              <span>면접관 {isIntComp ? "완료" : "대기"}</span>
                            </span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4.5 text-gray-500 text-xs font-medium font-mono whitespace-nowrap">
                          {c.createdAt}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            {allCompleted ? (
                              <Link
                                href={`/company/report/${c.id}`}
                                className="inline-flex items-center gap-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors whitespace-nowrap shrink-0"
                              >
                                <BarChart2 className="h-3.5 w-3.5 shrink-0" />
                                <span>리포트 보기</span>
                              </Link>
                            ) : (
                              <Link
                                href={`/company/case/${c.id}`}
                                className="inline-flex items-center gap-0.5 bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-100 hover:text-gray-900 transition-colors whitespace-nowrap shrink-0"
                              >
                                <span>링크/진척 관리</span>
                              </Link>
                            )}
                            <button
                              onClick={(e) => handleDelete(c.id, e)}
                              className="text-gray-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg p-1.5 transition-colors whitespace-nowrap shrink-0"
                              title="삭제"
                            >
                              <Trash2 className="h-4 w-4 shrink-0" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center bg-white border border-gray-150 rounded-2xl py-16 px-4 shadow-sm">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-base font-bold text-gray-900 whitespace-nowrap">레퍼런스 체크 요청 건이 없습니다.</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500 max-w-2xl mx-auto">
              {searchTerm 
                ? "검색 필터와 완벽하게 일치하는 후보자를 찾을 수 없습니다." 
                : "우측 상단의 버튼을 눌러 첫 번째 후보자 등록 및 3자 다면평가를 시작하세요."}
            </p>
            <div className="mt-6">
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm("")}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-250 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                >
                  필터 초기화
                </button>
              ) : (
                <Link
                  href="/company/create-case"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4.5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500 whitespace-nowrap"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>새 평가 요청 등록</span>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Demo Guide Section */}
        <div className="mt-12 bg-indigo-50/40 border border-indigo-100/60 p-6 rounded-2xl leading-relaxed text-xs text-gray-600">
          <div className="flex gap-2.5">
            <AlertCircle className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-indigo-950 text-sm block">💡 트라이체크 3-Point 평판조회 데모 가이드</span>
              <p className="mt-1 font-medium">
                1. 우측 하단의 **[데모 내비게이터]**를 클릭해 편리한 테스트 링크들을 사용하세요.
              </p>
              <p className="mt-1 font-medium">
                2. **새 평가 요청 등록**을 통해 직접 포지션과 설문 템플릿을 선택하고 후보자 정보를 생성할 수 있습니다.
              </p>
              <p className="mt-1 font-medium">
                3. 생성된 케이스의 **링크/진척 관리** 화면으로 가면 후보자용, 추천인용, 면접관용 개별 링크를 확인하고 **원클릭 자동 응답 시뮬레이션**을 실행해 실시간으로 리포트가 완성되는 과정을 볼 수 있습니다.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
