export type QuestionCategory = "업무성향" | "조직적합성" | "협업성향" | "리스크 대응" | "커뮤니케이션";

export type QuestionType = "ab" | "scale" | "short";
export type QuestionTarget = "self" | "peer" | "interviewer" | "all";

export interface SurveyQuestion {
  id: string;
  category: QuestionCategory;
  title: string;
  question: string;
  type: QuestionType;
  optionA?: string;
  optionB?: string;
  target: QuestionTarget;
}

export type JobTypeKey =
  | "general"
  | "backend_developer"
  | "frontend_developer"
  | "fullstack_developer"
  | "data_analyst"
  | "product_manager"
  | "product_designer"
  | "graphic_designer"
  | "sales_manager"
  | "b2b_sales_executive"
  | "hr_recruiter"
  | "hr_business_partner"
  | "accountant"
  | "financial_analyst"
  | "marketing_manager"
  | "performance_marketer"
  | "operations_manager";

export interface SurveyTemplate {
  id: string;
  name: string;
  jobType: JobTypeKey;
  description: string;
  weights: Record<QuestionCategory, number>;
  questions: SurveyQuestion[];
}

export const defaultQuestions: SurveyQuestion[] = [
  // 1. 업무성향 (work_1 ~ work_4)
  {
    id: "work_1",
    category: "업무성향",
    title: "업무 추진 방식",
    question: "장기적인 성과를 극대화하기 위해 후보자가 지향하는 핵심 업무 추진 기조는 무엇입니까?",
    type: "ab",
    optionA: "초기 기획과 기술 설계에 충분한 시간을 들여 예외와 오류 발생을 사전에 최소화하려는 방식",
    optionB: "우선 시제품이나 MVP를 빠르게 출시하고 현장 반응에 따라 신속히 반복 보완해가는 실행 중심 방식",
    target: "all"
  },
  {
    id: "work_2",
    category: "업무성향",
    title: "자기 주도성 및 실행력",
    question: "상세한 업무 매뉴얼이나 가이드라인이 주어지지 않은 상황에서도 주도적으로 필요 과업을 정의하고 완수해 냅니까?",
    type: "scale",
    target: "all"
  },
  {
    id: "work_3",
    category: "업무성향",
    title: "성과 집착 및 몰입력",
    question: "대내외적 장애 요인이 발생하거나 자원이 부족한 상황에서도 목표 성과를 이끌어내기 위해 몰입합니까?",
    type: "scale",
    target: "all"
  },
  {
    id: "work_4",
    category: "업무성향",
    title: "핵심 성과 기여도",
    question: "이전 프로젝트 중 가장 성공적인 비즈니스 임팩트를 창출했던 경험과 본인의 구체적인 기여 방안을 서술해주세요.",
    type: "short",
    target: "all"
  },

  // 2. 조직적합성 (org_1 ~ org_4)
  {
    id: "org_1",
    category: "조직적합성",
    title: "의사결정 상충 대처",
    question: "본인의 실무적 신념이 직속 상사의 강력한 결정이나 경영 방향성과 상치될 때 주로 어떻게 처신합니까?",
    type: "ab",
    optionA: "조직의 조화와 실행 속도를 위해 상사의 지시를 수용하고 완벽한 실행을 돕는 데 집중",
    optionB: "리스크를 방지하기 위해 객관적 설득 근거를 추가로 마련하여 지속적인 제안과 논쟁을 감수",
    target: "all"
  },
  {
    id: "org_2",
    category: "조직적합성",
    title: "규정 및 컴플라이언스 준수",
    question: "기업의 사내 보안 수칙, 지적재산권 관리, 행정 프로세스를 철저히 숙지하고 준수하는 편입니까?",
    type: "scale",
    target: "all"
  },
  {
    id: "org_3",
    category: "조직적합성",
    title: "조직에 미치는 정서적 기여",
    question: "조직 내 비판적 회의주의보다 긍정적인 신뢰 문화를 불어넣으며 사기 진작에 정서적으로 기여합니까?",
    type: "scale",
    target: "all"
  },
  {
    id: "org_4",
    category: "조직적합성",
    title: "지향하는 이상적 조직문화",
    question: "후보자가 가장 장기 근속하며 몰입할 수 있는 이상적인 기업 문화와 추구하는 가치는 무엇입니까?",
    type: "short",
    target: "all"
  },

  // 3. 협업성향 (collab_1 ~ collab_4)
  {
    id: "collab_1",
    category: "협업성향",
    title: "협업 시 갈등 중재 스타일",
    question: "동료 간 의견 대립이나 다자 협의체에서 이해관계 충돌이 격화될 때 주로 어떻게 갈등을 풀어갑니까?",
    type: "ab",
    optionA: "비즈니스 최종 목표와 데이터 등 계량 지표를 바탕으로 객관적인 원칙에 서서 논리적 조율",
    optionB: "상대방의 정서적 입장과 심리적 상처를 케어하며 신뢰를 잃지 않는 타협점 도출 선호",
    target: "all"
  },
  {
    id: "collab_2",
    category: "협업성향",
    title: "피드백 수용 및 개방성",
    question: "본인의 업무적 미흡점이나 개선 방안에 대한 동료의 객관적 지적(피드백)을 방어벽 없이 수용합니까?",
    type: "scale",
    target: "all"
  },
  {
    id: "collab_3",
    category: "협업성향",
    title: "이타적 지원 및 지식 공유",
    question: "자신의 과업이 과부하된 상황에서도 팀의 공통 지연이나 동료의 병목 해결을 위해 적극적으로 발 벗고 나섭니까?",
    type: "scale",
    target: "all"
  },
  {
    id: "collab_4",
    category: "협업성향",
    title: "팀워크 상 장단점",
    question: "협업했던 동료들이 주로 언급하는 후보자의 성격적 매력과 협업 시 주의가 필요한 부분이 있다면 기재해 주세요.",
    type: "short",
    target: "all"
  },

  // 4. 리스크 대응 (risk_1 ~ risk_4)
  {
    id: "risk_1",
    category: "리스크 대응",
    title: "불확실성 리스크 태도",
    question: "위험 요소가 완벽히 검증되지 않은 새로운 비즈니스 시도나 기술 도입 결정에 대해 주로 어떻게 조율합니까?",
    type: "ab",
    optionA: "예상치 못한 손실과 신인도 하락을 피하기 위해 리스크가 제거될 때까지 신중히 검토 및 대기",
    optionB: "기회 손실 리스크가 더 크므로 가용한 대비책만 수립한 뒤 과감하게 진입하고 사후 수습",
    target: "all"
  },
  {
    id: "risk_2",
    category: "리스크 대응",
    title: "선제적 위험 감지 지능",
    question: "프로젝트 수행 계획 설계 단계에서 발생 가능한 병목, 일정 지연 요인, 기술 결함을 입체적으로 파악하나요?",
    type: "scale",
    target: "all"
  },
  {
    id: "risk_3",
    category: "리스크 대응",
    title: "정보 보안 및 자산보호 의식",
    question: "고객 데이터나 기밀 사내 정보를 취급할 때, 접근 제어 및 비밀 유출 방지를 체화하고 실천합니까?",
    type: "scale",
    target: "all"
  },
  {
    id: "risk_4",
    category: "리스크 대응",
    title: "에러 방지를 위한 루틴",
    question: "자주 수행하는 루틴 업무에서 휴먼 에러나 전산 실수를 줄이기 위해 후보자님이 고안한 본인만의 체크리스트는 무엇입니까?",
    type: "short",
    target: "all"
  },

  // 5. 커뮤니케이션 (comm_1 ~ comm_4)
  {
    id: "comm_1",
    category: "커뮤니케이션",
    title: "보고 및 공유 채널 선호",
    question: "업무 진행 상황이나 주요 변경 사항을 상사 및 팀에 보고할 때 선호하는 소통 스타일은 무엇입니까?",
    type: "ab",
    optionA: "슬랙 스레드, 주간 문서 등 텍스트 중심의 정교한 정리와 비동기 기록 소통",
    optionB: "짧은 티타임, 유선 전화, 대면 미팅 등 신속하고 감정 교류가 동반되는 실시간 구두 소통",
    target: "all"
  },
  {
    id: "comm_2",
    category: "커뮤니케이션",
    title: "논리적 구체성과 메시지 정제",
    question: "본인이 설득하고자 하는 기획이나 아이디어를 감정을 걷어내고 타당한 정량적 근거에 입각해 전달하나요?",
    type: "scale",
    target: "all"
  },
  {
    id: "comm_3",
    category: "커뮤니케이션",
    title: "경청 및 맥락 파악력",
    question: "타 부서나 동료의 기획 요건을 들을 때 표면적 단어 너머의 진짜 업무적 비즈니스 맥락(Context)을 짚어내나요?",
    type: "scale",
    target: "all"
  },
  {
    id: "comm_4",
    category: "커뮤니케이션",
    title: "소통 시 아쉬운 점 피드백",
    question: "후보자의 뛰어난 소통 기술에도 불구하고 가끔 급하거나 스트레스를 받을 때 노출되는 커뮤니케이션 상의 개선점을 적어주세요.",
    type: "short",
    target: "all"
  }
];

export const defaultTemplates: Record<JobTypeKey, SurveyTemplate> = {
  general: {
    id: "template_general",
    name: "기본 레퍼런스 체크 템플릿",
    jobType: "general",
    description: "업무성향, 조직적합성, 협업성향, 리스크 대응, 커뮤니케이션을 균형 있게 평가하는 표준 템플릿입니다.",
    weights: {
      "업무성향": 0.20,
      "조직적합성": 0.20,
      "협업성향": 0.20,
      "리스크 대응": 0.20,
      "커뮤니케이션": 0.20
    },
    questions: [...defaultQuestions]
  },
  backend_developer: {
    id: "template_backend_developer",
    name: "백엔드 개발자 템플릿",
    jobType: "backend_developer",
    description: "서버 설계 안정성, 예외 처리, 비동기 커뮤니케이션, 시스템 장애 리스크 예방을 집중 평가하는 템플릿입니다.",
    weights: {
      "업무성향": 0.25,
      "조직적합성": 0.15,
      "협업성향": 0.15,
      "리스크 대응": 0.30,
      "커뮤니케이션": 0.15
    },
    questions: [...defaultQuestions]
  },
  frontend_developer: {
    id: "template_frontend_developer",
    name: "프론트엔드 개발자 템플릿",
    jobType: "frontend_developer",
    description: "UI/UX 디테일, 크로스 브라우징 리스크, 기민한 컴포넌트 협업 및 일정 준수 수준을 중점 분석합니다.",
    weights: {
      "업무성향": 0.20,
      "조직적합성": 0.15,
      "협업성향": 0.20,
      "리스크 대응": 0.25,
      "커뮤니케이션": 0.20
    },
    questions: [...defaultQuestions]
  },
  fullstack_developer: {
    id: "template_fullstack_developer",
    name: "풀스택 개발자 템플릿",
    jobType: "fullstack_developer",
    description: "전체 벨류체인 아키텍처 이해도, 멀티 태스킹 주도성, 유연한 R&R 협업 소통력을 다각도로 검증합니다.",
    weights: {
      "업무성향": 0.25,
      "조직적합성": 0.15,
      "협업성향": 0.20,
      "리스크 대응": 0.25,
      "커뮤니케이션": 0.15
    },
    questions: [...defaultQuestions]
  },
  data_analyst: {
    id: "template_data_analyst",
    name: "데이터 분석가 템플릿",
    jobType: "data_analyst",
    description: "계량화 문제 규명, 데이터 해석력, 비즈니스 가설 검증 신뢰도와 논리적 보고서 작성을 중점 평가합니다.",
    weights: {
      "업무성향": 0.30,
      "조직적합성": 0.15,
      "협업성향": 0.15,
      "리스크 대응": 0.20,
      "커뮤니케이션": 0.20
    },
    questions: [...defaultQuestions]
  },
  product_manager: {
    id: "template_product_manager",
    name: "프로덕트 매니저(PM) 템플릿",
    jobType: "product_manager",
    description: "우선순위 판단 비즈니스 모델, 다기능 부서 갈등 중재, 강력한 스토리텔링 설득력과 리스크 통제를 분석합니다.",
    weights: {
      "업무성향": 0.15,
      "조직적합성": 0.15,
      "협업성향": 0.25,
      "리스크 대응": 0.20,
      "커뮤니케이션": 0.25
    },
    questions: [...defaultQuestions]
  },
  product_designer: {
    id: "template_product_designer",
    name: "프로덕트 디자이너(UX/UI) 템플릿",
    jobType: "product_designer",
    description: "사용자 중심 정성 조사, 피그마 가이드라인 공유 방식, 피드백 수용성과 일정 내 퀄리티 준수를 진단합니다.",
    weights: {
      "업무성향": 0.20,
      "조직적합성": 0.15,
      "협업성향": 0.25,
      "리스크 대응": 0.15,
      "커뮤니케이션": 0.25
    },
    questions: [...defaultQuestions]
  },
  graphic_designer: {
    id: "template_graphic_designer",
    name: "그래픽 디자이너 템플릿",
    jobType: "graphic_designer",
    description: "독창적 심미성 트렌드 감각, 마케팅 부서와의 협업 커뮤니케이션 및 시한 임박 속 완성도를 검증합니다.",
    weights: {
      "업무성향": 0.25,
      "조직적합성": 0.20,
      "협업성향": 0.20,
      "리스크 대응": 0.15,
      "커뮤니케이션": 0.20
    },
    questions: [...defaultQuestions]
  },
  sales_manager: {
    id: "template_sales_manager",
    name: "영업 관리자 템플릿",
    jobType: "sales_manager",
    description: "영업 쿼타 수립, 계약 마진 방어 협상력, 팀원 모티베이션 정서 케어와 실적 압박 복원력을 진단합니다.",
    weights: {
      "업무성향": 0.25,
      "조직적합성": 0.15,
      "협업성향": 0.15,
      "리스크 대응": 0.15,
      "커뮤니케이션": 0.30
    },
    questions: [...defaultQuestions]
  },
  b2b_sales_executive: {
    id: "template_b2b_sales_executive",
    name: "B2B 영업 대표 템플릿",
    jobType: "b2b_sales_executive",
    description: "고부가가치 리드 질적 공략, 고객사 컴플레인 완숙 대처, 딜 클로징 추진력과 대고객 커뮤니케이션을 평가합니다.",
    weights: {
      "업무성향": 0.30,
      "조직적합성": 0.10,
      "협업성향": 0.15,
      "리스크 대응": 0.15,
      "커뮤니케이션": 0.30
    },
    questions: [...defaultQuestions]
  },
  hr_recruiter: {
    id: "template_hr_recruiter",
    name: "채용 리크루터 템플릿",
    jobType: "hr_recruiter",
    description: "우수 인재 발굴 네트워킹, 대외 브랜드 전파, 채용 프로세스 규정 준수와 부서 간 일정 소통력을 분석합니다.",
    weights: {
      "업무성향": 0.20,
      "조직적합성": 0.20,
      "협업성향": 0.20,
      "리스크 대응": 0.15,
      "커뮤니케이션": 0.25
    },
    questions: [...defaultQuestions]
  },
  hr_business_partner: {
    id: "template_hr_business_partner",
    name: "HRBP 템플릿",
    jobType: "hr_business_partner",
    description: "인사 고충 중립 상담력, 조직 개편 변화 수용 조율, 경영 전략 정렬 및 사내 기밀 유출 보안 관리를 검증합니다.",
    weights: {
      "업무성향": 0.15,
      "조직적합성": 0.25,
      "협업성향": 0.20,
      "리스크 대응": 0.15,
      "커뮤니케이션": 0.25
    },
    questions: [...defaultQuestions]
  },
  accountant: {
    id: "template_accountant",
    name: "회계 담당자 템플릿",
    jobType: "accountant",
    description: "증빙 검토 1원 대조 정확성, 세법 컴플라이언스 준수, 월말 마감 시한 압박 대응력을 엄격히 진단합니다.",
    weights: {
      "업무성향": 0.25,
      "조직적합성": 0.20,
      "협업성향": 0.10,
      "리스크 대응": 0.35,
      "커뮤니케이션": 0.10
    },
    questions: [...defaultQuestions]
  },
  financial_analyst: {
    id: "template_financial_analyst",
    name: "재무 분석가 템플릿",
    jobType: "financial_analyst",
    description: "투자 예산 시나리오 설계, 외환/금리 유동성 모니터링, 재무 보고서 투명성과 데이터 의사결정을 검증합니다.",
    weights: {
      "업무성향": 0.30,
      "조직적합성": 0.15,
      "협업성향": 0.10,
      "리스크 대응": 0.30,
      "커뮤니케이션": 0.15
    },
    questions: [...defaultQuestions]
  },
  marketing_manager: {
    id: "template_marketing_manager",
    name: "마케팅 매니저 템플릿",
    jobType: "marketing_manager",
    description: "브랜드 가치 스토리텔링, 마케팅 예산 효율 통제, 유관 에이전시 협업 조율 및 캠페인 적시 실행력을 진단합니다.",
    weights: {
      "업무성향": 0.20,
      "조직적합성": 0.15,
      "협업성향": 0.20,
      "리스크 대응": 0.15,
      "커뮤니케이션": 0.30
    },
    questions: [...defaultQuestions]
  },
  performance_marketer: {
    id: "template_performance_marketer",
    name: "퍼포먼스 마케터 템플릿",
    jobType: "performance_marketer",
    description: "정량적 매체 ROI 데이터 최적화, 기동적 가설 A/B 테스트, 매체 예산 소진 리스크 관리력을 엄밀히 분석합니다.",
    weights: {
      "업무성향": 0.30,
      "조직적합성": 0.10,
      "협업성향": 0.15,
      "리스크 대응": 0.25,
      "커뮤니케이션": 0.20
    },
    questions: [...defaultQuestions]
  },
  operations_manager: {
    id: "template_operations_manager",
    name: "오퍼레이션 매니저 템플릿",
    jobType: "operations_manager",
    description: "운영 프로세스 병목 규명, 서비스 가용성 장애 통제, R&R 경계 허무는 협조력 및 매뉴얼 예외 대응을 검증합니다.",
    weights: {
      "업무성향": 0.20,
      "조직적합성": 0.20,
      "협업성향": 0.20,
      "리스크 대응": 0.25,
      "커뮤니케이션": 0.15
    },
    questions: [...defaultQuestions]
  }
};

export const jobProfiles = defaultTemplates;
