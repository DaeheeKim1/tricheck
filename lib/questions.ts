export type QuestionCategory = string;

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
  | "developer"
  | "designer"
  | "hr"
  | "accounting"
  | "finance"
  | "sales"
  | "pm";

export interface SurveyTemplate {
  id: string;
  name: string;
  jobType: JobTypeKey;
  description: string;
  weights: Record<string, number>;
  questions: SurveyQuestion[];
}

export const defaultQuestions: SurveyQuestion[] = [
  // 1. 업무성향
  {
    id: "work_1",
    category: "업무성향",
    title: "업무 접근 방식",
    question: "후보자님은 장기적으로 더 큰 성과를 만드는 업무 접근이 무엇이라고 보십니까?",
    type: "ab",
    optionA: "초기에는 속도가 다소 늦어지더라도 기초 구조와 방향을 충분히 설계한 뒤 수정·재작업을 최소화하는 방식",
    optionB: "빠르게 실행에 옮기고 시행착오를 거치더라도 개선점을 지속 반영하며 완성도를 끌어올리는 방식",
    target: "all"
  },
  {
    id: "work_2",
    category: "업무성향",
    title: "주도성과 가이드라인",
    question: "명확한 가이드라인이 부족한 상황에서 주도적으로 과업을 발굴하고 책임감 있게 완료하는 역량을 보유하고 있습니까?",
    type: "scale",
    target: "all"
  },
  // 2. 조직적합성
  {
    id: "org_1",
    category: "조직적합성",
    title: "의사결정 상충",
    question: "자신의 실무적 의견이 직속 상사의 결정이나 회사 지침과 강하게 상충할 때 어떻게 대응하는 편입니까?",
    type: "ab",
    optionA: "상사의 판단을 신뢰하여 일단 지시사항을 군더더기 없이 충실하게 실행하고 지원하는 성향",
    optionB: "합리적 근거가 확보될 때까지 상대방을 설득하기 위해 논리적 논쟁과 대안 제안을 지속하는 성향",
    target: "all"
  },
  {
    id: "org_2",
    category: "조직적합성",
    title: "조직 규정 및 체계 준수",
    question: "조직 내부의 프로세스, 행정 규정, 사내 보안 가이드라인을 철저하게 준수하고 신뢰하는 편입니까?",
    type: "scale",
    target: "all"
  },
  // 3. 협업성향
  {
    id: "collab_1",
    category: "협업성향",
    title: "갈등 해결 스타일",
    question: "동료 간 의견 대립이 심화되거나 부서 간 갈등이 발생했을 때 갈등을 조정하는 핵심 행동 양식은 무엇입니까?",
    type: "ab",
    optionA: "상대방의 입장과 신뢰 관계를 보호하기 위해 정서적 공감대를 형성하고 상호 타협을 유도하는 방식",
    optionB: "공통의 비즈니스 목표에 기반하여 객관적 원칙을 분별하고 명확한 합의 규칙을 세우는 방식",
    target: "all"
  },
  {
    id: "collab_2",
    category: "협업성향",
    title: "피드백 수용성",
    question: "동료의 생산성 향상을 위한 객관적인 비판이나 따끔한 피드백을 열린 마음으로 경청하고 업무 개선에 적극 반영합니까?",
    type: "scale",
    target: "all"
  }
];

export const defaultTemplates: Record<JobTypeKey, SurveyTemplate> = {
  general: {
    id: "template_general",
    name: "기본 레퍼런스 체크 템플릿",
    jobType: "general",
    description: "업무성향, 조직적합성, 협업성향을 균형 있게 평가하는 기본 템플릿입니다.",
    weights: {
      "업무성향": 0.34,
      "조직적합성": 0.33,
      "협업성향": 0.33
    },
    questions: [...defaultQuestions]
  },
  developer: {
    id: "template_developer",
    name: "개발자 채용 템플릿",
    jobType: "developer",
    description: "문제 해결력, 업무 신뢰도, 협업 방식, 코드 리뷰/피드백 수용, 일정 관리를 중점적으로 검증하는 템플릿입니다.",
    weights: {
      "문제 해결력": 0.20,
      "업무 신뢰도": 0.20,
      "협업 방식": 0.20,
      "코드 리뷰/피드백 수용": 0.20,
      "일정 관리": 0.20
    },
    questions: [
      {
        id: "dev_1",
        category: "문제 해결력",
        title: "문제 해결 접근법",
        question: "복잡한 기술 부채나 버그 직면 시, 후보자가 선호하는 문제 해결 방식은 무엇입니까?",
        type: "ab",
        optionA: "근본적인 원인이 규명될 때까지 코드 베이스를 깊이 분석하고 구조적 리팩토링을 감행하는 방식",
        optionB: "우선 기민하게 우회 기법(Workaround)을 적용해 장애를 해결한 뒤, 점진적으로 구조를 보완해가는 방식",
        target: "all"
      },
      {
        id: "dev_2",
        category: "업무 신뢰도",
        title: "예외 처리 및 코드 신뢰도",
        question: "작성한 코드에 대한 예외 처리와 테스트 커버리지를 철저히 챙겨 배포 후 장애율을 최소화하는 편입니까?",
        type: "scale",
        target: "all"
      },
      {
        id: "dev_3",
        category: "협업 방식",
        title: "지식 공유와 커뮤니케이션",
        question: "개발 과정에서 기술적 공유와 협업 시, 더 효과적이라고 생각하는 방식은 무엇입니까?",
        type: "ab",
        optionA: "API 문서화, Wiki 작성 등 텍스트와 비동기 프로세스 중심의 체계적인 아카이빙 공유 방식",
        optionB: "슬랙 통화나 대면 회의 등 실시간 질의응답과 기민한 상호 인터랙션을 중시하는 공유 방식",
        target: "all"
      },
      {
        id: "dev_4",
        category: "코드 리뷰/피드백 수용",
        title: "코드 리뷰 태도",
        question: "코드 리뷰 시 동료들의 다양한 설계 개선 제안이나 비판적 의견을 열린 자세로 경청하고 수용하는 편입니까?",
        type: "scale",
        target: "all"
      },
      {
        id: "dev_5",
        category: "일정 관리",
        title: "일정 준수와 리스크 공유",
        question: "개발 예측 일정을 준수하고, 지연 리스크 발생 시 팀에 미리 공유하여 조율을 이끌어 낸 구체적인 사례는 무엇입니까?",
        type: "short",
        target: "all"
      }
    ]
  },
  designer: {
    id: "template_designer",
    name: "디자이너 채용 템플릿",
    jobType: "designer",
    description: "사용자 관점, 피드백 수용, 협업 커뮤니케이션, 창의성과 실행 균형, 일정 내 산출물 완성도를 중점적으로 분석합니다.",
    weights: {
      "사용자 관점": 0.20,
      "피드백 수용": 0.20,
      "협업 커뮤니케이션": 0.20,
      "창의성과 실행 균형": 0.20,
      "일정 내 산출물 완성도": 0.20
    },
    questions: [
      {
        id: "des_1",
        category: "사용자 관점",
        title: "디자인 의사결정 기준",
        question: "사용자 경험(UX) 개선안 도출 시, 후보자가 더 중요시하는 접근법은 무엇입니까?",
        type: "ab",
        optionA: "정량적 데이터 분석, 사용자 인터뷰 등 객관적 조사 결과와 프레임워크를 기반으로 도출하는 방식",
        optionB: "디자이너로서 축적한 전문적 심미성, UI 직관, 트렌드 감각에 입각해 독창적으로 설계하는 방식",
        target: "all"
      },
      {
        id: "des_2",
        category: "피드백 수용",
        title: "비즈니스/개발 피드백 수용성",
        question: "기획자나 개발자로부터 디자인 수정 요구나 예외 케이스 누락 피드백을 받았을 때, 유연하게 디자인을 조정하고 타협안을 도출하나요?",
        type: "scale",
        target: "all"
      },
      {
        id: "des_3",
        category: "협업 커뮤니케이션",
        title: "디자인 가이드 제공 방식",
        question: "타 직군과의 협업에서 선호하는 커뮤니케이션 스타일은 무엇입니까?",
        type: "ab",
        optionA: "피그마 가이드라인, 컴포넌트 시스템 등 명확한 디자인 규칙과 리소스를 정교하게 구성해 넘겨주는 스타일",
        optionB: "수시로 회의를 가지며 실시간 조율을 거치고 유동적으로 디자인 스펙을 협의하며 맞춰가는 스타일",
        target: "all"
      },
      {
        id: "des_4",
        category: "창의성과 실행 균형",
        title: "제한 조건 속 크리에이티브",
        question: "촉박한 개발 일정이나 플랫폼 환경(iOS/AOS)의 제약 조건 내에서도 최적의 심미성과 완성도를 구현해내는 편입니까?",
        type: "scale",
        target: "all"
      },
      {
        id: "des_5",
        category: "일정 내 산출물 완성도",
        title: "일정 관리 및 퀄리티",
        question: "프로젝트 진행 과정에서 비즈니스 일정에 맞춰 디자인 완성본을 공급했던 주요 방식이나 성과는 무엇입니까?",
        type: "short",
        target: "all"
      }
    ]
  },
  hr: {
    id: "template_hr",
    name: "인사/HR 채용 템플릿",
    jobType: "hr",
    description: "커뮤니케이션, 신뢰성, 조직문화 이해, 민감정보 처리 태도, 갈등 조율을 다면적으로 평가합니다.",
    weights: {
      "커뮤니케이션": 0.20,
      "신뢰성": 0.20,
      "조직문화 이해": 0.20,
      "민감정보 처리 태도": 0.20,
      "갈등 조율": 0.20
    },
    questions: [
      {
        id: "hr_1",
        category: "커뮤니케이션",
        title: "사내 커뮤니케이션 톤",
        question: "직원들과의 고충 상담이나 정책 전파 시, 후보자가 주로 지향하는 태도는 무엇입니까?",
        type: "ab",
        optionA: "친근하고 정서적인 공감대를 우선 형성하여 심리적 안정감을 제공하는 수평적 커뮤니케이션",
        optionB: "회사의 규정 및 객관적 인사 가이드라인에 근거하여 명확하고 단호하게 대안을 설명하는 중심적 커뮤니케이션",
        target: "all"
      },
      {
        id: "hr_2",
        category: "신뢰성",
        title: "구성원과의 신뢰 형성",
        question: "인사 담당자로서 중립적인 태도를 지키고, 현업 직원들과 경영진 모두에게 신뢰를 받는 편입니까?",
        type: "scale",
        target: "all"
      },
      {
        id: "hr_3",
        category: "조직문화 이해",
        title: "조직문화 정렬 우선순위",
        question: "조직 문화 프로그램을 기획하거나 실행할 때 중시하는 지향점은 무엇입니까?",
        type: "ab",
        optionA: "경영진의 사업 전략과 방향성에 발맞춰 구성원들이 기여할 수 있도록 정렬하는 방식",
        optionB: "직원들의 복리후생, 애로사항 해소에 집중하여 정서적인 직장 만족도를 극대화하는 방식",
        target: "all"
      },
      {
        id: "hr_4",
        category: "민감정보 처리 태도",
        title: "기밀 유지 및 정보 보안",
        question: "평가 결과, 연봉 정보, 핵심 인재 퇴사설 등 민감하고 중요한 기밀 정보를 철저하고 안전하게 취급합니까?",
        type: "scale",
        target: "all"
      },
      {
        id: "hr_5",
        category: "갈등 조율",
        title: "부서간 갈등/노사 중재 사례",
        question: "사내 부서 간 R&R 갈등이나 구성원의 인사 불만 이슈를 합리적으로 중재하고 조율했던 경험은 무엇입니까?",
        type: "short",
        target: "all"
      }
    ]
  },
  accounting: {
    id: "template_accounting",
    name: "회계 채용 템플릿",
    jobType: "accounting",
    description: "정확성, 규정 준수, 반복 업무 신뢰도, 마감 대응, 세부사항 검토 역량을 집중 진단합니다.",
    weights: {
      "정확성": 0.20,
      "규정 준수": 0.20,
      "반복 업무 신뢰도": 0.20,
      "마감 대응": 0.20,
      "세부사항 검토": 0.20
    },
    questions: [
      {
        id: "acc_1",
        category: "정확성",
        title: "전표 검토 기준",
        question: "비용 정산이나 전표 처리를 할 때, 오류를 예방하기 위해 취하는 주요 태도는 무엇입니까?",
        type: "ab",
        optionA: "소액 전표라도 증빙과 영수증 규정을 1원 단위까지 완벽하게 대조하고 반려 사유가 있으면 엄격히 통제하는 방식",
        optionB: "비즈니스의 진행 속도를 고려하여 중대 오류가 없다면 적정한 선에서 융통성 있게 빠르게 승인 처리하는 방식",
        target: "all"
      },
      {
        id: "acc_2",
        category: "규정 준수",
        title: "회계기준 및 세법 준수",
        question: "기업 회계 기준 및 관련 세법 등 복잡한 제도적 규정을 철저하게 분석하고 준수하여 컴플라이언스 리스크를 통제합니까?",
        type: "scale",
        target: "all"
      },
      {
        id: "acc_3",
        category: "반복 업무 신뢰도",
        title: "업무 생산성 향상 방식",
        question: "지속적이고 정형화된 회계 업무 처리를 진행할 때, 주로 추구하는 방식은 무엇입니까?",
        type: "ab",
        optionA: "기존에 구축된 수동 검증 프로세스를 우직하고 정확하게 실행하여 예상 가능한 안정성을 가져가는 방식",
        optionB: "엑셀 매크로, ERP 기능 최적화 등을 이용해 반복 수작업을 자동화하고 시스템을 고도화하려는 방식",
        target: "all"
      },
      {
        id: "acc_4",
        category: "마감 대응",
        title: "마감 일정 및 스트레스 조절",
        question: "월말/연말 마감 집중 기간에 발생하는 시한 압박 및 업무 부하 상태에서도 일정에 지체 없이 고도화된 계산 업무를 수행하나요?",
        type: "scale",
        target: "all"
      },
      {
        id: "acc_5",
        category: "세부사항 검토",
        title: "회계/세무 오류 발견 사례",
        question: "과거 재무제표나 결산 자료 검토 중 숨겨진 중대한 회계 처리 오류나 세무 상의 문제점을 조기에 식별해 보완했던 경험은 무엇입니까?",
        type: "short",
        target: "all"
      }
    ]
  },
  finance: {
    id: "template_finance",
    name: "재무 채용 템플릿",
    jobType: "finance",
    description: "데이터 기반 판단, 리스크 관리, 전략적 사고, 보고서 작성, 의사결정 지원 능력을 평가합니다.",
    weights: {
      "데이터 기반 판단": 0.20,
      "리스크 관리": 0.20,
      "전략적 사고": 0.20,
      "보고서 작성": 0.20,
      "의사결정 지원": 0.20
    },
    questions: [
      {
        id: "fin_1",
        category: "데이터 기반 판단",
        title: "자금 운용 의사결정",
        question: "유휴 자금 운용이나 신규 예산 승인 시, 후보자가 더 신뢰하는 기조는 무엇입니까?",
        type: "ab",
        optionA: "보수적 시나리오를 바탕으로 현금 확보와 원금 보장률이 극대화되는 극단의 안정 추구 전략",
        optionB: "시장 성장 기회를 포착하기 위해 가용 범위 내에서 다소 공격적으로 예산을 투자하고 회수율을 극대화하는 전략",
        target: "all"
      },
      {
        id: "fin_2",
        category: "리스크 관리",
        title: "외환/금리 및 유동성 리스크 통제",
        question: "대내외 거시 경제 변동이나 자금 시장 냉각 등 예기치 못한 재무 리스크를 예측하고 유동성 비율을 계획적으로 관리하나요?",
        type: "scale",
        target: "all"
      },
      {
        id: "fin_3",
        category: "전략적 사고",
        title: "재무 시나리오 수립",
        question: "회사 재무 전략 수립 시, 어떠한 관점을 더 자주 활용합니까?",
        type: "ab",
        optionA: "과거 집행 추이 분석과 부서별 상세 예산 통제(부텀업)를 통한 밀착형 관리 방식",
        optionB: "중장기 사업 목표 달성을 위해 주요 성장 드라이버(매출/자금)의 미래 시나리오(탑다운)를 설계하는 방식",
        target: "all"
      },
      {
        id: "fin_4",
        category: "보고서 작성",
        title: "재무 리포팅 투명성과 구조화",
        question: "주주사나 경영진 등 핵심 관계자에게 제공할 재무 성과 리포트를 왜곡 없이 객관적으로 구조화하여 가독성 있게 표현하나요?",
        type: "scale",
        target: "all"
      },
      {
        id: "fin_5",
        category: "의사결정 지원",
        title: "자금 조달/예산 조정 성공 경험",
        question: "투자를 유치하거나 금융권 자금을 성공적으로 조달했던 경험, 혹은 큰 규모의 부서 간 예산 조정 조율 사례가 있다면 공유해주세요.",
        type: "short",
        target: "all"
      }
    ]
  },
  sales: {
    id: "template_sales",
    name: "영업 채용 템플릿",
    jobType: "sales",
    description: "실행력, 커뮤니케이션, 목표 달성, 고객 대응, 회복탄력성을 균형 있게 평가합니다.",
    weights: {
      "실행력": 0.20,
      "커뮤니케이션": 0.20,
      "목표 달성": 0.20,
      "고객 대응": 0.20,
      "회복탄력성": 0.20
    },
    questions: [
      {
        id: "sal_1",
        category: "실행력",
        title: "고객 발굴 접근법",
        question: "신규 영업 기회(리드) 발굴을 위해 후보자가 더 많이 실천하는 방식은 무엇입니까?",
        type: "ab",
        optionA: "타겟 목록을 빠르게 추출하여 다수의 잠재 고객에게 콜드 메일/전화 영업을 기동성 있게 시도하는 양적 확장 방식",
        optionB: "소수의 고부가가치 타겟을 선별하고 고객의 페인 포인트를 심층 리서치한 후 맞춤형 파트너십을 제안하는 질적 공략 방식",
        target: "all"
      },
      {
        id: "sal_2",
        category: "커뮤니케이션",
        title: "고객 요구 파악 및 제안력",
        question: "단순 판매 피칭을 넘어, 대화를 통해 고객사의 실질적 고민을 정확히 끌어내고 자사의 강점을 매력적으로 매칭해 설득해냅니까?",
        type: "scale",
        target: "all"
      },
      {
        id: "sal_3",
        category: "목표 달성",
        title: "딜 클로징 지향성",
        question: "거래를 성공적으로 성사시키기 위해 후보자가 더 중점을 두는 의사결정은 무엇입니까?",
        type: "ab",
        optionA: "추가 할인이나 파격 조건 등을 유연하게 제공해서라도 당월 쿼타 및 단기 영업 목표를 돌파하는 방식",
        optionB: "마진 구조와 장기적 관계 유지(LTV)를 보호하기 위해 무리한 조건 합의는 지양하고 협상의 주도권을 유지하는 방식",
        target: "all"
      },
      {
        id: "sal_4",
        category: "고객 대응",
        title: "컴플레인 및 까다로운 계약 협상",
        question: "계약 진행 도중 중대한 요구 변경을 하거나, 도입 후 불만을 제기하는 까다로운 고객을 감정 소모 없이 원숙하게 대처해 우호 관계로 전환하나요?",
        type: "scale",
        target: "all"
      },
      {
        id: "sal_5",
        category: "회복탄력성",
        title: "영업 압박 극복 및 재도전",
        question: "연이은 거절 상황이나 극심한 실적 압박 상태를 슬기롭게 마인드 컨트롤하여 극복하고 재도전했던 성공 사례는 무엇입니까?",
        type: "short",
        target: "all"
      }
    ]
  },
  pm: {
    id: "template_pm",
    name: "PM/기획 채용 템플릿",
    jobType: "pm",
    description: "우선순위 판단, 문제 정의, 데이터 기반 의사결정, 크로스펑셔널 협업, 실행 관리를 면밀히 진단합니다.",
    weights: {
      "우선순위 판단": 0.20,
      "문제 정의": 0.20,
      "데이터 기반 의사결정": 0.20,
      "크로스펑셔널 협업": 0.20,
      "실행 관리": 0.20
    },
    questions: [
      {
        id: "pm_1",
        category: "우선순위 판단",
        title: "프로덕트 범위 조율",
        question: "한정된 개발/디자인 자원 속에서 기능 출시를 앞두고 있을 때, 후보자가 더 선호하는 우선순위 판단 기준은 무엇입니까?",
        type: "ab",
        optionA: "비즈니스 기여도와 핵심 사용자 경험 중심의 기능만 남기고 불필요한 스펙을 단호히 제외(Cut-off)하는 방식",
        optionB: "다양한 유관 부서의 니즈와 잠재 요구사항을 조율하여 리스크를 예방하고 점진적인 기획 수정을 수렴해가는 방식",
        target: "all"
      },
      {
        id: "pm_2",
        category: "문제 정의",
        title: "고객 페인포인트 규명",
        question: "막연한 기능 추가 요청을 수동적으로 처리하기보다, 데이터나 정성적 피드백에서 진짜 사용자의 불편 핵심을 기획안으로 구조화해 내나요?",
        type: "scale",
        target: "all"
      },
      {
        id: "pm_3",
        category: "데이터 기반 의사결정",
        title: "지표 지향성",
        question: "신규 기능 출시 후 성과 검증 및 전략 변경 시, 후보자가 판단 근거로 가장 중요시하는 것은 무엇입니까?",
        type: "ab",
        optionA: "A/B 테스트 결과, 코호트 유지율 등 수치화된 정량 지표와 통계적 정합성 분석",
        optionB: "핵심 고객 FGI, 유관 부서 세일즈 현장의 소리 등 정성적인 사용자 정서와 시장 맥락",
        target: "all"
      },
      {
        id: "pm_4",
        category: "크로스펑셔널 협업",
        title: "타 부서 이해 조율력",
        question: "디자이너, 개발자, 비즈니스 영업 등 언어와 이해관계가 완전히 다른 직군 사이에서 원활한 가교 역할을 수행하고 팀 시너지를 이끌어냅니까?",
        type: "scale",
        target: "all"
      },
      {
        id: "pm_5",
        category: "실행 관리",
        title: "프로젝트 진행 통제와 소통",
        question: "복잡한 프로덕트 개발 중 기획 변경이나 예상치 못한 기술 장애에 대처하고 무사히 런칭을 관리했던 구체적 성과는 무엇입니까?",
        type: "short",
        target: "all"
      }
    ]
  }
};

export const jobProfiles = defaultTemplates;
