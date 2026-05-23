"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sparkles, Compass, Users, User, UserCheck, BarChart3, Settings, HelpCircle, X, ChevronUp, ChevronDown } from "lucide-react";
import { getAllRequests, ReferenceRequest, saveRequest } from "@/lib/storage";
import { defaultQuestions, JobTypeKey } from "@/lib/questions";

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
    const pool = [
      {
        name: "김도현",
        email: "dohyun@example.com",
        position: "백엔드 개발자 (Backend Developer)",
        company: "라인 플러스",
        jobType: "backend_developer" as JobTypeKey,
        templateId: "template_backend_developer",
        referees: [
          { name: "강준우", email: "junwoo@example.com", relation: "전 직장 상사" },
          { name: "최윤서", email: "yoonseo@example.com", relation: "전 직장 동료" },
          { name: "황민재", email: "minjae@example.com", relation: "협업 부서 담당자" }
        ],
        interviewer: {
          name: "손정우",
          email: "jungwoo@example.com",
          title: "인프라 파트장"
        }
      },
      {
        name: "이채원",
        email: "chaewon@example.com",
        position: "프론트엔드 개발자 (Frontend Developer)",
        company: "카카오브레인",
        jobType: "frontend_developer" as JobTypeKey,
        templateId: "template_frontend_developer",
        referees: [
          { name: "조현우", email: "hyunwoo@example.com", relation: "전 직장 팀장" },
          { name: "신지아", email: "jia@example.com", relation: "전 직장 동료" },
          { name: "유진우", email: "jinwoo@example.com", relation: "협업 기획자" }
        ],
        interviewer: {
          name: "박영수",
          email: "youngsoo@example.com",
          title: "개발팀 챕터리드"
        }
      },
      {
        name: "정민우",
        email: "minwoo@example.com",
        position: "B2B 영업대표 (Sales Executive)",
        company: "당근 비즈니스",
        jobType: "b2b_sales_executive" as JobTypeKey,
        templateId: "template_b2b_sales_executive",
        referees: [
          { name: "송재하", email: "jaeha@example.com", relation: "전 직장 지점장" },
          { name: "백서진", email: "seojin@example.com", relation: "전 직장 동료" },
          { name: "임지호", email: "jiho@example.com", relation: "주요 고객사 담당자" }
        ],
        interviewer: {
          name: "한상현",
          email: "sanghyun@example.com",
          title: "영업 실장"
        }
      },
      {
        name: "한소희",
        email: "sohee@example.com",
        position: "프로덕트 디자이너 (UX/UI)",
        company: "야놀자 테크",
        jobType: "product_designer" as JobTypeKey,
        templateId: "template_product_designer",
        referees: [
          { name: "서지원", email: "jiwon@example.com", relation: "전 직장 디자인 팀장" },
          { name: "장민석", email: "minseok@example.com", relation: "전 직장 동료 개발자" },
          { name: "권아름", email: "areum@example.com", relation: "기획 파트너" }
        ],
        interviewer: {
          name: "최수아",
          email: "sua@example.com",
          title: "디자인 센터장"
        }
      },
      {
        name: "박준서",
        email: "junseo@example.com",
        position: "데이터 분석가 (Data Analyst)",
        company: "직방",
        jobType: "data_analyst" as JobTypeKey,
        templateId: "template_data_analyst",
        referees: [
          { name: "배현우", email: "hyunwoo2@example.com", relation: "전 직장 팀장" },
          { name: "안소율", email: "soyul@example.com", relation: "전 직장 동료 분석가" },
          { name: "윤성민", email: "sungmin@example.com", relation: "협업 마케팅 담당자" }
        ],
        interviewer: {
          name: "김동현",
          email: "donghyun@example.com",
          title: "데이터 본부장"
        }
      },
      {
        name: "서지민",
        email: "jimin@example.com",
        position: "퍼포먼스 마케터 (Performance Marketer)",
        company: "컬리",
        jobType: "performance_marketer" as JobTypeKey,
        templateId: "template_performance_marketer",
        referees: [
          { name: "이다은", email: "daeun@example.com", relation: "전 직장 마케팅 팀장" },
          { name: "문태오", email: "taeo@example.com", relation: "전 직장 동료" },
          { name: "정재욱", email: "jaewook@example.com", relation: "대행사 파트장" }
        ],
        interviewer: {
          name: "홍하준",
          email: "hajun@example.com",
          title: "그로스 마케팅 디렉터"
        }
      }
    ];

    const selected = pool[Math.floor(Math.random() * pool.length)];
    const newId = "demo_" + Math.random().toString(36).substring(2, 9);

    const newCase: ReferenceRequest = {
      id: newId,
      candidate: {
        name: selected.name,
        email: selected.email,
        position: selected.position,
        company: selected.company
      },
      referees: selected.referees,
      interviewer: selected.interviewer,
      jobType: selected.jobType,
      templateId: selected.templateId,
      customQuestions: [...defaultQuestions],
      createdAt: new Date().toISOString().split("T")[0],
      status: "pending"
    };

    saveRequest(newCase);
    setSelectedCaseId(newId);
    setCases(getAllRequests());
    router.push(`/company/case/${newId}`);
    alert(`데모용 레퍼런스 체크 케이스가 성공적으로 생성되었습니다!\n대상 후보자: ${selected.name} (${selected.position})`);
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
