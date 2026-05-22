import { defaultQuestions, defaultTemplates, JobTypeKey, QuestionCategory, SurveyQuestion, SurveyTemplate } from "./questions";

export interface Candidate {
  name: string;
  email: string;
  position: string;
  company: string;
}

export interface Referee {
  name: string;
  email: string;
  relation: string;
}

export interface Interviewer {
  name: string;
  email: string;
  title: string;
}

export interface ReferenceRequest {
  id: string;
  candidate: Candidate;
  referees: Referee[]; // Starts empty, filled by candidate
  interviewer: Interviewer;
  jobType: JobTypeKey;
  templateId: string;
  customQuestions: SurveyQuestion[]; // Overrides default template questions
  createdAt: string;
  status: 'pending' | 'completed';
  selfAnswers?: string[]; // Candidate self answers (index matches customQuestions)
  peerAnswers?: Record<string, string[]>; // Peer answers (keys: "0", "1", "2")
  interviewerAnswers?: string[]; // Interviewer answers
}

export interface TraitGap {
  label: QuestionCategory;
  self: number;
  peer: number;
  interviewer: number;
}

export interface AnswerDetail {
  id: string;
  category: QuestionCategory;
  title: string;
  question: string;
  type: 'ab' | 'scale' | 'short';
  selfAnswerText: string;
  peerAnswerTexts: string[];
  interviewerAnswerText: string;
}

export interface ReferenceReport {
  id: string;
  candidate: {
    name: string;
    position: string;
    company: string;
  };
  jobType: JobTypeKey;
  createdAt: string;
  overall: number; // Calibrated final score
  selfScore: number;
  peerAverageScore: number;
  interviewerScore: number;
  consistencyScore: number;
  selfPeerGap: number;
  selfInterviewerGap: number;
  peerDeviation: number; // Deviation among peers (standard deviation)
  interviewerPeerGap: number; // Compare interviewer with peer average
  riskLevel: '낮음' | '보통' | '높음';
  recommendation: '강력 추천' | '추천' | '조건부 추천' | '보류';
  strengths: string[];
  warnings: string[];
  gapData: TraitGap[];
  aiSummary: string;
  categoryScores: Record<string, { self: number; peer: number; interviewer: number }>;
  answersDetail: AnswerDetail[];
  penalties: {
    selfPeerGap: number;
    selfInterviewerGap: number;
    peerInconsistency: number;
    interviewerConflict: number;
    positiveBias: number;
  };
}

const STORAGE_KEY_CASES = "tricheck_cases";
const STORAGE_KEY_TEMPLATES = "tricheck_custom_templates";
const STORAGE_KEY_REPORTS = "tricheck_reports";

const isBrowser = typeof window !== "undefined";

let isInitializing = false;

export function initializeDemoData(): void {
  if (!isBrowser) return;
  const initialized = localStorage.getItem("tricheck_demo_initialized");
  if (initialized === "true" || isInitializing) return;

  isInitializing = true;
  try {
    // 1. Initialize at least one custom template
    const customTemplate: SurveyTemplate = {
      id: "template_custom_pm",
      name: "IT 스타트업 시니어 PM 커스텀 템플릿",
      jobType: "pm",
      description: "애자일 스프린트 운영, 데이터 기반 의사결정 및 프로덕트 전략 수립 능력을 다각도로 평가하는 템플릿입니다.",
      weights: {
        "제품 전략": 0.40,
        "데이터 분석력": 0.30,
        "애자일 프로세스": 0.30
      },
      questions: [
        {
          id: "q_custom_pm_1",
          category: "제품 전략",
          title: "로드맵 우선순위 설정",
          question: "제한된 개발 리소스 상황에서 비즈니스 로드맵 우선순위를 설정하는 후보자님의 핵심 접근은 무엇입니까?",
          type: "ab",
          optionA: "정량적 예상 ROI와 데이터 모델을 엄격히 계량화하여 우선순위를 결정하는 방식",
          optionB: "핵심 고객의 즉각적인 피드백과 사용자 경험 개선을 최우선으로 유연하게 조율하는 방식",
          target: "all"
        },
        {
          id: "q_custom_pm_2",
          category: "데이터 분석력",
          title: "데이터 기반 개선 도출",
          question: "정밀한 유저 퍼널 데이터 및 A/B 테스트 결과를 해석하고 실제 제품 개선 액션으로 전환하는 능력이 우수합니까?",
          type: "scale",
          target: "all"
        },
        {
          id: "q_custom_pm_3",
          category: "애자일 프로세스",
          title: "스프린트 및 협업 조율",
          question: "스크럼 마스터 및 개발 리드와 함께 애자일 스프린트를 정기적으로 운영하며, 지연 리스크를 사전에 식별하고 소통합니까?",
          type: "scale",
          target: "all"
        }
      ]
    };

    localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify([customTemplate]));

    // 2. Initialize one completed case request
    const completedCase: ReferenceRequest = {
      id: "case_demo_general",
      candidate: {
        name: "김민수",
        email: "minsu.kim@example.com",
        position: "서비스 기획자 / PM",
        company: "트라이체크 테크"
      },
      referees: [
        { name: "이종민", email: "jongmin@example.com", relation: "전 직장 상사" },
        { name: "최수연", email: "sooyeon@example.com", relation: "전 직장 동료" },
        { name: "정다은", email: "daeun@example.com", relation: "협업 부서 담당자" }
      ],
      interviewer: {
        name: "박성호",
        email: "sungho.park@example.com",
        title: "인사팀장"
      },
      jobType: "general",
      templateId: "template_general",
      customQuestions: [...defaultQuestions],
      createdAt: new Date().toISOString().split('T')[0],
      status: 'completed',
      selfAnswers: [
        "A", // 업무 접근 방식
        "5", // 주도성과 가이드라인
        "B", // 의사결정 상충
        "4", // 조직 규정 및 체계 준수
        "A", // 갈등 해결 스타일
        "5"  // 피드백 수용성
      ],
      peerAnswers: {
        "0": ["A", "4", "A", "4", "A", "4"],
        "1": ["B", "4", "B", "3", "A", "4"],
        "2": ["A", "4", "B", "4", "A", "4"]
      },
      interviewerAnswers: ["A", "4", "B", "4", "B", "4"]
    };

    localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify([completedCase]));

    // Set initialization flag before analyzing to prevent recursion
    localStorage.setItem("tricheck_demo_initialized", "true");

    // 3. Save report
    const report = analyzeSurveyAnswers(completedCase);
    const reportsObj = {
      [completedCase.id]: report
    };
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reportsObj));
  } catch (e) {
    console.error("Failed to initialize demo data:", e);
  } finally {
    isInitializing = false;
  }
}

// Custom Templates Storage Helpers
export function getAllTemplates(): SurveyTemplate[] {
  if (!isBrowser) return Object.values(defaultTemplates);
  initializeDemoData();
  const stored = localStorage.getItem(STORAGE_KEY_TEMPLATES);
  const custom = stored ? JSON.parse(stored) : [];
  return [...Object.values(defaultTemplates), ...custom];
}

export function saveCustomTemplate(template: SurveyTemplate): void {
  if (!isBrowser) return;
  const stored = localStorage.getItem(STORAGE_KEY_TEMPLATES);
  const custom: SurveyTemplate[] = stored ? JSON.parse(stored) : [];
  const filtered = custom.filter(t => t.id !== template.id);
  filtered.push(template);
  localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(filtered));
}

export function deleteCustomTemplate(id: string): void {
  if (!isBrowser) return;
  const stored = localStorage.getItem(STORAGE_KEY_TEMPLATES);
  const custom: SurveyTemplate[] = stored ? JSON.parse(stored) : [];
  const filtered = custom.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(filtered));
}

export function getTemplateById(id: string): SurveyTemplate | null {
  const all = getAllTemplates();
  return all.find(t => t.id === id) || null;
}

// Cases Storage Helpers
export function saveRequest(req: ReferenceRequest): void {
  if (!isBrowser) return;
  const cases = getAllRequests();
  const filtered = cases.filter(c => c.id !== req.id);
  filtered.push(req);
  localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(filtered));
}

export function getAllRequests(): ReferenceRequest[] {
  if (!isBrowser) return [];
  initializeDemoData();
  const stored = localStorage.getItem(STORAGE_KEY_CASES);
  return stored ? JSON.parse(stored) : [];
}

export function getRequest(id: string): ReferenceRequest | null {
  const cases = getAllRequests();
  return cases.find(c => c.id === id) || null;
}

export function deleteRequest(id: string): void {
  if (!isBrowser) return;
  const cases = getAllRequests();
  const filtered = cases.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(filtered));
}

// Reports Storage Helpers
export function saveReport(report: ReferenceReport): void {
  if (!isBrowser) return;
  const reports = getAllReports();
  reports[report.id] = report;
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
}

export function getAllReports(): Record<string, ReferenceReport> {
  if (!isBrowser) return {};
  initializeDemoData();
  const stored = localStorage.getItem(STORAGE_KEY_REPORTS);
  return stored ? JSON.parse(stored) : {};
}

export function getReport(id: string): ReferenceReport | null {
  if (id === "demo") return demoReport;
  if (!isBrowser) return null;
  const reports = getAllReports();
  return reports[id] || null;
}

// Dynamic Option Scorer
function getQuestionScore(q: SurveyQuestion, answer: string): number {
  if (q.type === "ab") {
    return answer === "A" ? 82 : 96; // Standard A/B scores
  } else if (q.type === "scale") {
    const val = parseInt(answer, 10);
    switch (val) {
      case 5: return 98;
      case 4: return 85;
      case 3: return 60;
      case 2: return 40;
      case 1: return 20;
      default: return 60;
    }
  }
  return 0; // Short answer or unknown type
}

// 3-Point Calibration and Scoring Engine
export function analyzeSurveyAnswers(req: ReferenceRequest): ReferenceReport {
  const questions = req.customQuestions;
  const template = getTemplateById(req.templateId) || defaultTemplates[req.jobType];
  const weights = template.weights;

  // Fallbacks in case answers are pending
  const selfAns = req.selfAnswers || Array(questions.length).fill("A");
  const pAnsDict: Record<string, string[]> = req.peerAnswers || {
    "0": Array(questions.length).fill("A"),
    "1": Array(questions.length).fill("B"),
    "2": Array(questions.length).fill("A")
  };
  const intAns = req.interviewerAnswers || Array(questions.length).fill("A");

  const categories = Object.keys(weights) as QuestionCategory[];

  // Helper to compute respondent category scores
  const getRespondentCategoryScores = (answers: string[], role: 'self' | 'peer' | 'interviewer') => {
    const totals: Record<string, number> = {};
    const counts: Record<string, number> = {};

    questions.forEach((q, idx) => {
      // Check if question targets this respondent role
      const matchesTarget = q.target === "all" || q.target === role;
      if (!matchesTarget) return;
      if (q.type === "short") return; // Skip qualitative in scores

      const answer = answers[idx] || (q.type === "scale" ? "3" : "A");
      const score = getQuestionScore(q, answer);
      totals[q.category] = (totals[q.category] || 0) + score;
      counts[q.category] = (counts[q.category] || 0) + 1;
    });

    const scores: Record<string, number> = {};
    categories.forEach(cat => {
      const total = totals[cat] || 0;
      const count = counts[cat] || 0;
      scores[cat] = count > 0 ? Math.round(total / count) : 80; // Default 80 if no questions in category
    });
    return scores;
  };

  const selfCatScores = getRespondentCategoryScores(selfAns, 'self');
  const peer0CatScores = getRespondentCategoryScores(pAnsDict["0"] || [], 'peer');
  const peer1CatScores = getRespondentCategoryScores(pAnsDict["1"] || [], 'peer');
  const peer2CatScores = getRespondentCategoryScores(pAnsDict["2"] || [], 'peer');
  const interviewerCatScores = getRespondentCategoryScores(intAns, 'interviewer');

  // Compute Peer Average Category scores
  const peerCatScores: Record<string, number> = {};
  categories.forEach(cat => {
    const sum = (peer0CatScores[cat] + peer1CatScores[cat] + peer2CatScores[cat]) / 3;
    peerCatScores[cat] = Math.round(sum);
  });

  // Helper to calculate overall weighted score
  const calculateOverallWeighted = (catScores: Record<string, number>) => {
    let totalWeight = 0;
    let weightedSum = 0;
    categories.forEach(cat => {
      const w = weights[cat] || 0;
      weightedSum += catScores[cat] * w;
      totalWeight += w;
    });
    return Math.round(weightedSum / (totalWeight || 1));
  };

  const selfScore = calculateOverallWeighted(selfCatScores);
  const peer0Score = calculateOverallWeighted(peer0CatScores);
  const peer1Score = calculateOverallWeighted(peer1CatScores);
  const peer2Score = calculateOverallWeighted(peer2CatScores);
  const peerAverageScore = Math.round((peer0Score + peer1Score + peer2Score) / 3);
  const interviewerScore = calculateOverallWeighted(interviewerCatScores);

  // 1. Peer Deviation (Standard Deviation of peer scores)
  const peerScores = [peer0Score, peer1Score, peer2Score];
  const peerMean = (peer0Score + peer1Score + peer2Score) / 3;
  const variance = peerScores.reduce((acc, val) => acc + Math.pow(val - peerMean, 2), 0) / 3;
  const peerDeviation = Math.round(Math.sqrt(variance) * 10) / 10;

  // 2. Gaps
  const selfPeerGap = selfScore - peerAverageScore;
  const selfInterviewerGap = selfScore - interviewerScore;
  const interviewerPeerGap = interviewerScore - peerAverageScore;

  // 3. Penalties Calibration
  // A. Self-Peer gap penalty (> 5)
  let selfPeerGapPenalty = 0;
  if (selfPeerGap > 5) {
    selfPeerGapPenalty = Math.min(15, (selfPeerGap - 5) * 0.6);
  }

  // B. Self-Interviewer gap penalty (> 5)
  let selfInterviewerGapPenalty = 0;
  if (selfInterviewerGap > 5) {
    selfInterviewerGapPenalty = Math.min(10, (selfInterviewerGap - 5) * 0.4);
  }

  // C. Peer Inconsistency Penalty
  let disagreementCount = 0;
  questions.forEach((q, idx) => {
    if (q.target !== "all" && q.target !== "peer") return;
    if (q.type === "short") return;

    const ans0 = pAnsDict["0"]?.[idx] || "";
    const ans1 = pAnsDict["1"]?.[idx] || "";
    const ans2 = pAnsDict["2"]?.[idx] || "";

    if (q.type === "ab") {
      const allSame = ans0 === ans1 && ans1 === ans2;
      if (!allSame) disagreementCount++;
    } else if (q.type === "scale") {
      const nums = [parseInt(ans0, 10), parseInt(ans1, 10), parseInt(ans2, 10)].filter(n => !isNaN(n));
      if (nums.length === 3) {
        const spread = Math.max(...nums) - Math.min(...nums);
        if (spread >= 2) disagreementCount++;
      }
    }
  });
  const peerInconsistencyPenalty = disagreementCount * 0.8;

  // D. Interviewer Conflict Penalty
  const intConflict = Math.abs(interviewerScore - peerAverageScore);
  let interviewerConflictPenalty = 0;
  if (intConflict > 8) {
    interviewerConflictPenalty = Math.min(12, (intConflict - 8) * 0.5);
  }

  // E. Positive Response Bias
  const positiveBiasPenalty = selfScore > 94 ? 4.0 : 0;

  // Calibrate final score
  let overall = peerAverageScore - selfPeerGapPenalty - selfInterviewerGapPenalty - peerInconsistencyPenalty - interviewerConflictPenalty - positiveBiasPenalty;
  overall = Math.round(Math.max(35, Math.min(98, overall)));

  // Recommendation Tier
  let recommendation: '강력 추천' | '추천' | '조건부 추천' | '보류';
  if (overall >= 88) recommendation = '강력 추천';
  else if (overall >= 75) recommendation = '추천';
  else if (overall >= 60) recommendation = '조건부 추천';
  else recommendation = '보류';

  // Risk Level
  const totalPenalties = selfPeerGapPenalty + selfInterviewerGapPenalty + peerInconsistencyPenalty + interviewerConflictPenalty;
  let riskLevel: '낮음' | '보통' | '높음';
  if (totalPenalties > 15 || overall < 60) riskLevel = '높음';
  else if (totalPenalties > 7 || overall < 75) riskLevel = '보통';
  else riskLevel = '낮음';

  // Consistency Score
  let consistencyScore = Math.round(100 - (peerInconsistencyPenalty * 3) - (selfPeerGapPenalty * 1.5) - (interviewerConflictPenalty * 1.2));
  consistencyScore = Math.max(40, Math.min(99, consistencyScore));

  // Trait Gaps compiler
  const gapData: TraitGap[] = categories.map(cat => ({
    label: cat,
    self: selfCatScores[cat] || 80,
    peer: peerCatScores[cat] || 80,
    interviewer: interviewerCatScores[cat] || 80
  }));

  const categoryScores: Record<string, { self: number; peer: number; interviewer: number }> = {};
  categories.forEach(cat => {
    categoryScores[cat] = {
      self: selfCatScores[cat] || 80,
      peer: peerCatScores[cat] || 80,
      interviewer: interviewerCatScores[cat] || 80
    };
  });

  // Answer Details compiler
  const answersDetail: AnswerDetail[] = questions.map((q, idx) => {
    const sVal = selfAns[idx] || "";
    const iVal = intAns[idx] || "";

    const selfAnswerText = q.type === "ab"
      ? (sVal === "A" ? q.optionA : q.optionB) || ""
      : q.type === "scale" ? `${sVal}점 (5점 만점)` : sVal;

    const interviewerAnswerText = q.type === "ab"
      ? (iVal === "A" ? q.optionA : q.optionB) || ""
      : q.type === "scale" ? `${iVal}점 (5점 만점)` : iVal;

    const peerAnswerTexts = ["0", "1", "2"].map(pIdx => {
      const pVal = pAnsDict[pIdx]?.[idx] || "";
      return q.type === "ab"
        ? (pVal === "A" ? q.optionA : q.optionB) || ""
        : q.type === "scale" ? `${pVal}점` : pVal;
    });

    return {
      id: q.id,
      category: q.category,
      title: q.title,
      question: q.question,
      type: q.type,
      selfAnswerText,
      peerAnswerTexts,
      interviewerAnswerText
    };
  });

  // Dynamic Strengths & Warnings
  const strengths: string[] = [];
  const warnings: string[] = [];

  categories.forEach(cat => {
    const pVal = peerCatScores[cat];
    const sVal = selfCatScores[cat];
    const iVal = interviewerCatScores[cat];

    if (pVal >= 88) {
      if (cat === "업무성향") strengths.push("주도적인 태도와 책임감 있는 과업 수행력");
      if (cat === "조직적합성") strengths.push("조직 문화에 긍정적인 태도와 조화력");
      if (cat === "협업성향") strengths.push("팀 내 소통과 원활한 갈등 조정 해결 역량");
      if (cat === "리스크 대응") strengths.push("체계적인 관리력 기반의 잠재적 리스크 예방 능력");
      if (cat === "커뮤니케이션") strengths.push("데이터 및 감성 설득을 아우르는 탁월한 대화 기술");
      if (cat === "직무전문성") strengths.push("업계 평균을 상회하는 직무 관련 하드스킬 수준");
    }

    if (pVal < 70) {
      if (cat === "업무성향") warnings.push("기동력 있는 속도 조절 및 추진력이 제한될 여지");
      if (cat === "조직적합성") warnings.push("전통적인 수직 체계 및 사내 절차 준수에 저조함");
      if (cat === "협업성향") warnings.push("협업 시 다소 보수적인 R&R 구획과 경직된 대응 우려");
    }

    if (sVal - pVal > 10) {
      warnings.push(`'${cat}' 영역에서 후보자 본인의 자가 인식 수준이 피어 평가 대비 높은 상태`);
    }
  });

  if (strengths.length < 3) {
    strengths.push("업무 성과 달성을 향한 끈기와 성실성");
    if (strengths.length < 3) strengths.push("전문 지식에 기반한 문제 중심 분석력");
  }
  if (warnings.length < 3) {
    warnings.push("피크 타임 스트레스 하에서 정기적 번아웃 예방 권장");
    if (warnings.length < 3) warnings.push("자가 진단 피드백 상의 일부 과도 긍정 편향성");
  }

  // AI Summary Paragraph Builder
  const name = req.candidate.name;
  const position = req.candidate.position;
  const ratingText = recommendation === "강력 추천" 
    ? "전 평가자 그룹에서 대단히 고르고 우수한 평판과 협업 일치율을 보였습니다." 
    : recommendation === "추천" 
    ? "대체로 우수한 직무 평판을 보유했으나 일부 영역의 모니터링이 권장됩니다."
    : "자가 평가와 주변인 평가 간 인식 격차나 면접관 불일치 항목이 발견되었습니다.";

  const aiSummary = `${name} 후보자의 다면 교차평가 결과, 종합 적합도는 ${overall}점이며 추천 등급은 '${recommendation}'입니다. ${ratingText} 추천인 간 평가 편차는 ${peerDeviation}점으로 ${peerDeviation > 8 ? "추천인별 피드백 편차가 높은 편입니다." : "평가자들 간의 시각이 안정적으로 일치하고 있습니다."} 면접관과 추천인 평균 점수 격차는 ${Math.abs(interviewerPeerGap)}점 수준으로 확인되었습니다.`;

  return {
    id: req.id,
    candidate: {
      name: req.candidate.name,
      position: req.candidate.position,
      company: req.candidate.company
    },
    jobType: req.jobType,
    createdAt: req.createdAt,
    overall,
    selfScore,
    peerAverageScore,
    interviewerScore,
    consistencyScore,
    selfPeerGap: Math.round(selfPeerGap),
    selfInterviewerGap: Math.round(selfInterviewerGap),
    peerDeviation,
    interviewerPeerGap: Math.round(interviewerPeerGap),
    riskLevel,
    recommendation,
    strengths: strengths.slice(0, 3),
    warnings: warnings.slice(0, 3),
    gapData,
    aiSummary,
    categoryScores,
    answersDetail,
    penalties: {
      selfPeerGap: Math.round(selfPeerGapPenalty),
      selfInterviewerGap: Math.round(selfInterviewerGapPenalty),
      peerInconsistency: Math.round(peerInconsistencyPenalty),
      interviewerConflict: Math.round(interviewerConflictPenalty),
      positiveBias: Math.round(positiveBiasPenalty)
    }
  };
}

export const demoReport: ReferenceReport = {
  id: "demo",
  candidate: { name: "홍길동", position: "프로덕트 매니저 (PM)", company: "트라이체크" },
  jobType: "pm",
  createdAt: "2026-05-22",
  overall: 89,
  selfScore: 94,
  peerAverageScore: 90,
  interviewerScore: 86,
  consistencyScore: 92,
  selfPeerGap: 4,
  selfInterviewerGap: 8,
  peerDeviation: 4.5,
  interviewerPeerGap: -4,
  riskLevel: "낮음",
  recommendation: "강력 추천",
  strengths: [
    "다기능 부서 협업 및 공감 기반 소통 조율 역량 탁월",
    "잠재적 일정 지연 리스크의 뛰어난 사전 예방 설계",
    "조직 지향성이 견고하고 업무 주도성이 매우 훌륭함"
  ],
  warnings: [
    "완벽 기한 고수로 인해 가속화가 필요할 때 완급 조절 조언",
    "자기평가(94점)가 면접관 평가(86점) 대비 소폭 높은 경향",
    "전반적인 하드웨어 지식에 대한 직무전문성 보완 요소"
  ],
  gapData: [
    { label: "업무성향", self: 90, peer: 88, interviewer: 85 },
    { label: "조직적합성", self: 92, peer: 89, interviewer: 84 },
    { label: "협업성향", self: 96, peer: 92, interviewer: 88 },
    { label: "리스크 대응", self: 95, peer: 91, interviewer: 86 },
    { label: "커뮤니케이션", self: 98, peer: 92, interviewer: 90 },
    { label: "직무전문성", self: 88, peer: 85, interviewer: 82 }
  ],
  categoryScores: {
    "업무성향": { self: 90, peer: 88, interviewer: 85 },
    "조직적합성": { self: 92, peer: 89, interviewer: 84 },
    "협업성향": { self: 96, peer: 92, interviewer: 88 },
    "리스크 대응": { self: 95, peer: 91, interviewer: 86 },
    "커뮤니케이션": { self: 98, peer: 92, interviewer: 90 },
    "직무전문성": { self: 88, peer: 85, interviewer: 82 }
  },
  aiSummary: "홍길동 PM 후보자는 전반적인 다면 교차조사 결과 종합 89점의 고성과 군에 포지셔닝되었습니다. 특히 협업 성향과 감성 커뮤니케이션 부문에서 타 추천인들의 강력한 정서적 지지 평판을 얻었습니다. 추천인 간 평가 격차가 4.5점으로 대단히 낮아 주변 동료들이 평가하는 장단점이 일관적으로 수렴됩니다. 면접관과의 정렬 수준 역시 무리가 없는 범위 내이나, 후보자 스스로의 긍정 평가(94)가 면접관 수치(86) 대비 약간 높은 편이므로 위 보완점을 검토하십시오.",
  answersDetail: [
    {
      id: "pm_1",
      category: "우선순위 판단",
      title: "프로덕트 범위 조율",
      question: "한정된 개발/디자인 자원 속에서 기능 출시를 앞두고 있을 때, 후보자가 더 선호하는 우선순위 판단 기준은 무엇입니까?",
      type: "ab",
      selfAnswerText: "비즈니스 기여도와 핵심 사용자 경험 중심의 기능만 남기고 불필요한 스펙을 단호히 제외(Cut-off)하는 방식",
      peerAnswerTexts: [
        "비즈니스 기여도와 핵심 사용자 경험 중심의 기능만 남기고 불필요한 스펙을 단호히 제외(Cut-off)하는 방식",
        "비즈니스 기여도와 핵심 사용자 경험 중심의 기능만 남기고 불필요한 스펙을 단호히 제외(Cut-off)하는 방식",
        "다양한 유관 부서의 니즈와 잠재 요구사항을 조율하여 리스크를 예방하고 점진적인 기획 수정을 수렴해가는 방식"
      ],
      interviewerAnswerText: "비즈니스 기여도와 핵심 사용자 경험 중심의 기능만 남기고 불필요한 스펙을 단호히 제외(Cut-off)하는 방식"
    },
    {
      id: "pm_2",
      category: "문제 정의",
      title: "고객 페인포인트 규명",
      question: "막연한 기능 추가 요청을 수동적으로 처리하기보다, 데이터나 정성적 피드백에서 진짜 사용자의 불편 핵심을 기획안으로 구조화해 내나요?",
      type: "scale",
      selfAnswerText: "5점 (5점 만점)",
      peerAnswerTexts: ["5점", "4점", "5점"],
      interviewerAnswerText: "4점 (5점 만점)"
    },
    {
      id: "pm_3",
      category: "데이터 기반 의사결정",
      title: "지표 지향성",
      question: "신규 기능 출시 후 성과 검증 및 전략 변경 시, 후보자가 판단 근거로 가장 중요시하는 것은 무엇입니까?",
      type: "ab",
      selfAnswerText: "A/B 테스트 결과, 코호트 유지율 등 수치화된 정량 지표와 통계적 정합성 분석",
      peerAnswerTexts: [
        "A/B 테스트 결과, 코호트 유지율 등 수치화된 정량 지표와 통계적 정합성 분석",
        "핵심 고객 FGI, 유관 부서 세일즈 현장의 소리 등 정성적인 사용자 정서와 시장 맥락",
        "A/B 테스트 결과, 코호트 유지율 등 수치화된 정량 지표와 통계적 정합성 분석"
      ],
      interviewerAnswerText: "A/B 테스트 결과, 코호트 유지율 등 수치화된 정량 지표와 통계적 정합성 분석"
    },
    {
      id: "pm_4",
      category: "크로스펑셔널 협업",
      title: "타 부서 이해 조율력",
      question: "디자이너, 개발자, 비즈니스 영업 등 언어와 이해관계가 완전히 다른 직군 사이에서 원활한 가교 역할을 수행하고 팀 시너지를 이끌어냅니까?",
      type: "scale",
      selfAnswerText: "5점 (5점 만점)",
      peerAnswerTexts: ["5점", "5점", "4점"],
      interviewerAnswerText: "4점 (5점 만점)"
    },
    {
      id: "pm_5",
      category: "실행 관리",
      title: "프로젝트 진행 통제와 소통",
      question: "복잡한 프로덕트 개발 중 기획 변경이나 예상치 못한 기술 장애에 대처하고 무사히 런칭을 관리했던 구체적 성과는 무엇입니까?",
      type: "short",
      selfAnswerText: "스프린트 기획 스콥이 늘어나 지연될 뻔했으나 백로그 정리를 철저히 하고 우선순위 조정 회의를 통해 일정 내 런칭했습니다.",
      peerAnswerTexts: [
        "기획 변경이 잦았으나 개발진과의 원활한 소통을 통해 기능 스펙을 유연하게 줄여 정시에 제품을 배포했습니다.",
        "프로젝트 일정 지연 가능성을 감지했을 때 빠르게 대체 업무 분배와 소통을 실행하여 런칭 일정을 지켰습니다.",
        "개발자, 디자이너들과 격의 없이 스펙을 논의하고 타 부서의 출시 일정을 고려하여 병목을 효과적으로 해소했습니다.",
      ],
      interviewerAnswerText: "현장 소통에 무리가 없으며 기술적 장애 발생 시 신속히 복구를 돕고 유관 부서에 즉시 안내하여 혼선을 최소화했습니다."
    }
  ],
  penalties: {
    selfPeerGap: 0,
    selfInterviewerGap: 2.0,
    peerInconsistency: 1.5,
    interviewerConflict: 0,
    positiveBias: 4.0
  }
};

export function getAppMode(): 'real' | 'demo' {
  if (typeof window === "undefined") return 'real';
  const mode = localStorage.getItem("tricheck_mode");
  return mode === 'demo' ? 'demo' : 'real';
}

export function setAppMode(mode: 'real' | 'demo'): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("tricheck_mode", mode);
  // Dispatch custom event to notify listeners
  window.dispatchEvent(new Event("tricheck_mode_change"));
}
