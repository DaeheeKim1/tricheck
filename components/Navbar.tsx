"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  CheckSquare, 
  LayoutDashboard, 
  PlusCircle, 
  Settings, 
  FileBarChart2, 
  Sparkles, 
  ArrowLeftRight 
} from "lucide-react";
import { getAppMode, setAppMode } from "@/lib/storage";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [appMode, setAppModeState] = useState<'real' | 'demo'>('real');

  useEffect(() => {
    setAppModeState(getAppMode());
    const handleModeChange = () => {
      setAppModeState(getAppMode());
    };
    window.addEventListener("tricheck_mode_change", handleModeChange);
    return () => {
      window.removeEventListener("tricheck_mode_change", handleModeChange);
    };
  }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleToggleMode = (e: React.MouseEvent) => {
    e.preventDefault();
    const nextMode = appMode === 'real' ? 'demo' : 'real';
    setAppMode(nextMode);
    if (nextMode === 'demo') {
      router.push("/demo-scenario");
    } else {
      router.push("/company/dashboard");
    }
  };

  const handleDemoScenarioLink = (e: React.MouseEvent) => {
    e.preventDefault();
    setAppMode('demo');
    router.push("/demo-scenario");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md print:hidden">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo & Badge Area */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <CheckSquare className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Tricheck <span className="text-indigo-600">✓</span>
            </span>
          </Link>

          {/* Mode Status Badges */}
          <div className="hidden md:flex items-center shrink-0">
            {appMode === "demo" ? (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 font-extrabold text-[10px] tracking-wide animate-pulse whitespace-nowrap">
                <Sparkles className="h-3 w-3 shrink-0" />
                <span className="whitespace-nowrap">데모 시나리오</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-750 text-indigo-700 font-extrabold text-[10px] tracking-wide whitespace-nowrap">
                <CheckSquare className="h-3 w-3 shrink-0" />
                <span className="whitespace-nowrap">실제 서비스 플로우</span>
              </div>
            )}

            {/* Quick Switch Button */}
            <button
              onClick={handleToggleMode}
              className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-gray-900 text-[10px] font-bold transition-all shadow-sm hover:border-gray-300 whitespace-nowrap"
              title="클릭하여 실제/데모 모드를 전환합니다."
            >
              <ArrowLeftRight className="h-2.5 w-2.5 shrink-0" />
              <span className="whitespace-nowrap">모드 전환</span>
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          {/* Dashboard */}
          <Link
            href="/company/dashboard"
            className={`flex items-center space-x-1 rounded-lg px-2.5 py-1.8 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              isActive("/company/dashboard")
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">대시보드</span>
          </Link>

          {/* Templates */}
          <Link
            href="/company/survey-builder"
            className={`flex items-center space-x-1 rounded-lg px-2.5 py-1.8 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              isActive("/company/survey-builder")
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Settings className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">템플릿 관리</span>
          </Link>

          {/* Create Case */}
          <Link
            href="/company/create-case"
            className={`flex items-center space-x-1 rounded-lg px-2.5 py-1.8 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              isActive("/company/create-case")
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <PlusCircle className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">평가 요청 생성</span>
          </Link>

          {/* Demo Scenario */}
          <button
            onClick={handleDemoScenarioLink}
            className={`flex items-center space-x-1 rounded-lg px-2.5 py-1.8 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              isActive("/demo-scenario") || appMode === "demo" && isActive("/company/report/demo")
                ? "bg-violet-50 text-violet-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Sparkles className="h-4 w-4 shrink-0 text-violet-500" />
            <span className="hidden sm:inline whitespace-nowrap">데모 시나리오</span>
          </button>

          {/* Reports */}
          <Link
            href="/company/reports"
            className={`flex items-center space-x-1 rounded-lg px-2.5 py-1.8 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              isActive("/company/reports")
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <FileBarChart2 className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">리포트 조회</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
