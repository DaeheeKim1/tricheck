"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Zap, 
  Lock, 
  BarChart3, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  FileText, 
  PlusCircle, 
  ChevronRight 
} from "lucide-react";
import { getAllRequests, ReferenceRequest } from "@/lib/storage";

export default function Home() {
  const [requests, setRequests] = useState<ReferenceRequest[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setRequests(getAllRequests());
    setIsLoaded(true);
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* Main Hero & Content Section */}
      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-transparent py-20 lg:py-32">
          {/* Subtle decorative background shapes */}
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-200 to-indigo-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72rem]"></div>
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            {/* Tagline */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-700/10 mb-6">
              <span>🚀 3자 교차 평판 검증 시스템</span>
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl max-w-4xl mx-auto leading-tight">
              레퍼런스 체크,<br />
              이제 <span className="text-indigo-650 text-indigo-600 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">5분이면</span> 끝납니다
            </h1>
            
            {/* Subcopy */}
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              후보자 정보를 입력하면 추천인에게 자동으로 설문이 발송되고,<br />
              후보자·추천인·면접관의 3자 다면 평가 데이터를 AI가 실시간 분석해 완벽한 리포트를 제공합니다.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/mode-select"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-4.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>무료로 시작하기</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/demo-scenario"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-4.5 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>데모 시나리오 보기</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 3-Column Features Section */}
        <section className="py-12 bg-white border-y border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="relative flex flex-col items-start p-6 rounded-2xl border border-gray-50 bg-[#F9FAFB]/50 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">⚡ 5분 완성</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 font-medium">
                  후보자 등록 후 즉시 알림 발송. 후보자의 자가진단 및 추천인 등록을 거쳐 실시간으로 평판 데이터를 수집합니다.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="relative flex flex-col items-start p-6 rounded-2xl border border-gray-50 bg-[#F9FAFB]/50 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">🔒 익명 보장 및 보안</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 font-medium">
                  추천인들의 솔직한 답변을 위해 익명 설문을 지원하며, 완성된 평판 결과 리포트는 오직 기업 관리자에게만 비공개 제공됩니다.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="relative flex flex-col items-start p-6 rounded-2xl border border-gray-50 bg-[#F9FAFB]/50 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">📊 3자 다면 분석 및 리포트</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 font-medium">
                  후보자 자가 평가, 추천인 평균 평가, 면접관 관찰 평가를 3각 교차 분석하여 자가 인식 격차 및 리스크 수준을 평가합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Dashboard - User Requests List (Only if exists) */}
        {isLoaded && requests.length > 0 && (
          <section className="py-16 bg-[#F9FAFB]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    최근 레퍼런스 체크 요청 현황
                  </h2>
                  <p className="mt-1 text-sm text-gray-550 font-medium">
                    현재 진행 중이거나 완료된 레퍼런스 체크 요청 목록입니다.
                  </p>
                </div>
                <Link
                  href="/company/create-case"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>새 요청</span>
                </Link>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <ul className="divide-y divide-gray-100">
                  {requests.map((request) => (
                    <li key={request.id} className="hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between p-6 sm:px-8">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">
                                {request.candidate.name}
                              </span>
                              <span className="text-sm text-gray-400">|</span>
                              <span className="text-sm text-gray-500 font-semibold">
                                {request.candidate.position}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-4 text-xs text-gray-400">
                              <span className="font-semibold">{request.candidate.company}</span>
                              <span>•</span>
                              <span>요청일: {request.createdAt}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          {/* Status Badge */}
                          <div className="flex items-center gap-1.5">
                            {request.status === "completed" ? (
                              <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-600/15">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>완료</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-600/15">
                                <Clock className="h-3.5 w-3.5 animate-pulse" />
                                <span>진행중</span>
                              </span>
                            )}
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/company/case/${request.id}`}
                              className="text-xs font-bold text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
                            >
                              진행상황
                            </Link>
                            <Link
                              href={request.status === "completed" ? `/company/report/${request.id}` : `/company/case/${request.id}`}
                              className="inline-flex items-center gap-0.5 text-xs font-bold text-indigo-600 hover:text-indigo-900 px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors"
                            >
                              <span>{request.status === "completed" ? "리포트 보기" : "관리하기"}</span>
                              <ChevronRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Company Logos Slider Section */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              국내 최고 혁신 기업들이 트라이체크와 함께합니다
            </h4>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 sm:gap-x-16 lg:gap-x-20 font-bold">
              <span className="text-lg tracking-tight text-gray-300 hover:text-gray-500 cursor-default transition-colors">
                삼성 (SAMSUNG)
              </span>
              <span className="text-lg tracking-tight text-gray-300 hover:text-gray-500 cursor-default transition-colors">
                카카오 (kakao)
              </span>
              <span className="text-lg tracking-tight text-gray-300 hover:text-gray-500 cursor-default transition-colors">
                네이버 (NAVER)
              </span>
              <span className="text-lg tracking-tight text-gray-300 hover:text-gray-500 cursor-default transition-colors">
                토스 (toss)
              </span>
              <span className="text-lg tracking-tight text-gray-300 hover:text-gray-500 cursor-default transition-colors">
                쿠팡 (Coupang)
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-8 text-center text-sm text-gray-500 font-semibold">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p>© 2025 Tricheck. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
