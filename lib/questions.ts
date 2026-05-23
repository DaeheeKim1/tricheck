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
  // 1. 업무성향 (work_1 ~ work_10)
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
    title: "과업 목표 설정 기조",
    question: "업무 목표를 설정하고 관리할 때 후보자가 선호하는 수준과 방향은 무엇입니까?",
    type: "ab",
    optionA: "달성 가능성이 다소 낮더라도 한계를 돌파하기 위한 높은 수준의 도전적 목표를 지향",
    optionB: "기존 데이터와 실무 리소스를 냉정히 고려하여 정합성이 높은 안정적 목표 달성을 지향",
    target: "all"
  },
  {
    id: "work_4",
    category: "업무성향",
    title: "성과 집착 및 몰입력",
    question: "대내외적 장애 요인이 발생하거나 자원이 부족한 상황에서도 목표 성과를 이끌어내기 위해 몰입합니까?",
    type: "scale",
    target: "all"
  },
  {
    id: "work_5",
    category: "업무성향",
    title: "문제 분석 기법",
    question: "복잡한 업무 현안이나 원인 분석이 모호한 트러블에 직면했을 때 주로 채택하는 해결 기법은 무엇입니까?",
    type: "ab",
    optionA: "이론적 프레임워크나 내부 시스템 로그, 정량 데이터를 면밀히 교차 분석해 근본 원인을 규명",
    optionB: "현업 담당자 인터뷰 및 현장 피드백을 신속히 확보하여 직관적이고 실용적인 대안을 우선 수립",
    target: "all"
  },
  {
    id: "work_6",
    category: "업무성향",
    title: "기한 준수 및 품질 관리",
    question: "촉박한 프로젝트 일정 하에서도 산출물의 완성도와 핵심 품질 기준을 양보하지 않고 기한 내 완료합니까?",
    type: "scale",
    target: "all"
  },
  {
    id: "work_7",
    category: "업무성향",
    title: "전문성 개발 방향",
    question: "후보자가 지향하는 커리어 성장 모델 및 전문성 확보의 영역은 어느 쪽에 가깝습니까?",
    type: "ab",
    optionA: "특정 도메인이나 한 분야의 고유한 기술을 극도로 깊게 파고드는 스페셜리스트 경로",
    optionB: "기획, 사업, 운영 등 비즈니스 벨류체인의 여러 영역을 넓게 소화하는 제너럴리스트 경로",
    target: "all"
  },
  {
    id: "work_8",
    category: "업무성향",
    title: "신규 기술 및 도구 수용력",
    question: "직무 관련 새로운 트렌드나 생산성 제고용 협업 툴(AI 등)을 거부감 없이 신속히 체득하여 실무에 반영합니까?",
    type: "scale",
    target: "all"
  },
  {
    id: "work_9",
    category: "업무성향",
    title: "장애 봉착 시 극복 사례",
    question: "과업 수행 과정에서 가장 극적인 예측 불가능한 병목이나 난관을 마주했을 때 어떻게 극복했는지 설명해주세요.",
    type: "short",
    target: "all"
  },
  {
    id: "work_10",
    category: "업무성향",
    title: "핵심 성과 기여도",
    question: "이전 프로젝트 중 가장 성공적인 비즈니스 임팩트를 창출했던 경험과 본인의 구체적인 기여 방안을 서술해주세요.",
    type: "short",
    target: "all"
  },

  // 2. 조직적합성 (org_1 ~ org_10)
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
    title: "동기부여의 핵심 요인",
    question: "후보자가 가장 강력하게 업무 몰입을 느끼며 에너지를 얻는 보상의 축은 어느 것입니까?",
    type: "ab",
    optionA: "성과에 비례한 확실한 정량적 금전 보상 및 투명한 고과 피드백",
    optionB: "자유로운 업무 환경 속 의사결정 권한의 전폭적인 위임과 도전 기회",
    target: "all"
  },
  {
    id: "org_4",
    category: "조직적합성",
    title: "회사 비전과의 정렬",
    question: "회사의 장기 비전 및 비즈니스 미션을 이해하고, 개인의 일일 업무 목표를 이에 올바르게 연계시킵니까?",
    type: "scale",
    target: "all"
  },
  {
    id: "org_5",
    category: "조직적합성",
    title: "바람직한 동료 모델",
    question: "조직 안에서 동료 간의 바람직한 관계 및 성장 방식에 대해 어떻게 생각하십니까?",
    type: "ab",
    optionA: "개인 간 성과 경쟁과 명확한 전문성 비교를 통해 시너지를 창출하고 성장하는 방식",
    optionB: "패밀리십을 바탕으로 끈끈한 심리적 안전감을 다지고 공동의 소속감을 공유하며 성장하는 방식",
    target: "all"
  },
  {
    id: "org_6",
    category: "조직적합성",
    title: "조직에 미치는 정서적 기여",
    question: "조직 내 비판적 회의주의보다 긍정적인 신뢰 문화를 불어넣으며 사기 진작에 정서적으로 기여합니까?",
    type: "scale",
    target: "all"
  },
  {
    id: "org_7",
    category: "조직적합성",
    title: "조직 환경 선호 기조",
    question: "가장 안정감 있게 실력을 발휘할 수 있는 회사의 체계와 성장 단계는 어디입니까?",
    type: "ab",
    optionA: "R&R이 정교히 규정되고 결재 체계와 승인 구조가 확실히 잡힌 안정적인 중견/대기업형 시스템",
    optionB: "R&R이 유동적이며 시장 변화에 맞춰 잦은 피벗과 변동을 견뎌야 하는 애자일한 스타트업 시스템",
    target: "all"
  },
  {
    id: "org_8",
    category: "조직적합성",
    title: "부서간 소통 및 네트워킹",
    question: "공식 협업 외에 사내 캐주얼 티타임이나 크로스 기능 간 교류에 관심을 갖고 능동적으로 참여합니까?",
    type: "scale",
    target: "all"
  },
  {
    id: "org_9",
    category: "조직적합성",
    title: "과도기적 스트레스 대처",
    question: "인수합병, 경영진 교체, 전략 피벗 등 조직의 급변기나 과도기 상황에서 흔들림 없이 페이스를 유지했는지 서술해주세요.",
    type: "short",
    target: "all"
  },
  {
    id: "org_10",
    category: "조직적합성",
    title: "지향하는 이상적 조직문화",
    question: "후보자가 가장 장기 근속하며 몰입할 수 있는 이상적인 기업 문화와 추구하는 가치는 무엇입니까?",
    type: "short",
    target: "all"
  },

  // 3. 협업성향 (collab_1 ~ collab_10)
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
    title: "시너지 창출 방식",
    question: "후보자가 생각하는 가장 이상적인 크로스펑셔널(TF) 협업 의사소통 방식은 무엇입니까?",
    type: "ab",
    optionA: "각자의 파트를 명확히 쪼갠 후, 결과물 결합 전까지 간섭을 최소화하는 분업형 밀도 유지",
    optionB: "기획 초기 단계부터 공동 아이데이션과 정기 미팅을 자주 가져 싱크율을 높이는 밀착 소통형 유지",
    target: "all"
  },
  {
    id: "collab_4",
    category: "협업성향",
    title: "이타적 지원 및 지식 공유",
    question: "자신의 과업이 과부하된 상황에서도 팀의 공통 지연이나 동료의 병목 해결을 위해 적극적으로 발 벗고 나섭니까?",
    type: "scale",
    target: "all"
  },
  {
    id: "collab_5",
    category: "협업성향",
    title: "협업 요건 조율 기조",
    question: "타 부서나 실무 파트너에게 리소스를 요청하거나 요구사항을 전달할 때 중시하는 태도는 무엇입니까?",
    type: "ab",
    optionA: "합의된 프로세스와 템플릿에 맞추어 정확한 R&R 범위 내에서 공식 요청하는 방식",
    optionB: "느슨한 경계를 인정하고, 신속한 진행을 위해 유선 소통 및 유동적 협력을 도모하는 방식",
    target: "all"
  },
  {
    id: "collab_6",
    category: "협업성향",
    title: "감정 통제 및 위기 관리",
    question: "예산 삭감이나 프로젝트 중단 등 극단적인 스트레스 환경에서도 격앙되지 않고 평정심을 유지하며 소통합니까?",
    type: "scale",
    target: "all"
  },
  {
    id: "collab_7",
    category: "협업성향",
    title: "피드백 제공 스타일",
    question: "함께 일하는 팀원이나 동료의 성장을 위해 주로 어떠한 방식으로 피드백을 건네는 편입니까?",
    type: "ab",
    optionA: "발전을 가로막는 병목과 실수를 명확히 짚어주어 실질적 개선을 유도하는 직설적 피드백",
    optionB: "장점과 가능성을 부각해 사기를 높이고 자발적인 동기를 자극하는 완곡하고 지지적인 피드백",
    target: "all"
  },
  {
    id: "collab_8",
    category: "협업성향",
    title: "다자간 협상 및 조율력",
    question: "이해관계가 판이하게 갈리는 여러 유관 조직 간의 줄다리기 협상에서 원만한 Win-Win 합의를 설계하나요?",
    type: "scale",
    target: "all"
  },
  {
    id: "collab_9",
    category: "협업성향",
    title: "의견 대립 해결 경험",
    question: "함께 업무를 수행하며 의견 차이로 대립했던 상대방을 본인만의 방식으로 조율하고 협업을 완료한 경험을 설명해주세요.",
    type: "short",
    target: "all"
  },
  {
    id: "collab_10",
    category: "협업성향",
    title: "팀워크 상 장단점",
    question: "협업했던 동료들이 주로 언급하는 후보자의 성격적 매력과 협업 시 주의가 필요한 부분이 있다면 기재해 주세요.",
    type: "short",
    target: "all"
  },

  // 4. 리스크 대응 (risk_1 ~ risk_10)
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
    title: "장애 발생 시 해결 기조",
    question: "비즈니스에 치명적인 장애나 운영상 사고가 터졌을 때 후보자가 가장 중요시하는 후속 수습의 축은 무엇입니까?",
    type: "ab",
    optionA: "추가 피해 예방과 서비스 조기 복구를 위해 임시 조치를 신속히 처리하는 비상 수습 중심",
    optionB: "원인 규명이 먼저이므로 철저한 히스토리 추적과 사고 원인 규명을 끝낸 뒤 수정을 집행하는 구조 중심",
    target: "all"
  },
  {
    id: "risk_4",
    category: "리스크 대응",
    title: "역경 대응 및 회복 탄력성",
    question: "대형 고객사 이탈이나 중대한 비즈니스 컴플레인 직면 시, 심리적으로 붕괴되지 않고 이성적으로 대처하나요?",
    type: "scale",
    target: "all"
  },
  {
    id: "risk_5",
    category: "리스크 대응",
    title: "품질 기준 타협 여부",
    question: "비즈니스의 속도나 출시 기한 압박이 있을 때, 내부 가이드라인 및 코드/설계 품질과의 타협을 어떻게 조절합니까?",
    type: "ab",
    optionA: "출시가 지연되더라도 사내 표준 퀄리티 바(QA)를 절대 통과해야 하는 품질 지향 기조",
    optionB: "시장의 타이밍이 중요하므로 기술적 부채나 일부 운영상 결함을 감수하더라도 출시하는 속도 지향 기조",
    target: "all"
  },
  {
    id: "risk_6",
    category: "리스크 대응",
    title: "정기적 리스크 검토 습관",
    question: "자신의 업무 영역 및 소속 부서 내에서 발생할 수 있는 보안적, 재무적, 프로세스적 위험 요소를 정기 체크합니까?",
    type: "scale",
    target: "all"
  },
  {
    id: "risk_7",
    category: "리스크 대응",
    title: "규제(컴플라이언스) 민감도",
    question: "비즈니스 확장을 시도할 때 법률적 규제나 가이드라인에 대한 대응은 어느 방향에 가깝습니까?",
    type: "ab",
    optionA: "사후 행정 처분이나 소송을 방지하기 위해 엄격한 사전 법적 자문과 보수적 유권해석 준수",
    optionB: "혁신과 적시 대응을 위해 다소 회색 영역에 있더라도 우회 방안을 고안해 적극적으로 돌파",
    target: "all"
  },
  {
    id: "risk_8",
    category: "리스크 대응",
    title: "정보 보안 및 자산보호 의식",
    question: "고객 데이터나 기밀 사내 정보를 취급할 때, 접근 제어 및 비밀 유출 방지를 체화하고 실천합니까?",
    type: "scale",
    target: "all"
  },
  {
    id: "risk_9",
    category: "리스크 대응",
    title: "위기 극복 및 복구 성공기",
    question: "본인의 과업이나 팀 전체의 프로젝트가 좌초될 뻔했던 중대 리스크 상황에서 활약하여 정상화시킨 경험을 적어주세요.",
    type: "short",
    target: "all"
  },
  {
    id: "risk_10",
    category: "리스크 대응",
    title: "에러 방지를 위한 루틴",
    question: "자주 수행하는 루틴 업무에서 휴먼 에러나 전산 실수를 줄이기 위해 후보자님이 고안한 본인만의 체크리스트는 무엇입니까?",
    type: "short",
    target: "all"
  },

  // 5. 커뮤니케이션 (comm_1 ~ comm_10)
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
    title: "부정적 이슈 보고 시점",
    question: "과업 수행 도중 지연 리스크나 실수 등 부정적인 보고 사안이 감지되었을 때 언제 소통하는 편입니까?",
    type: "ab",
    optionA: "자체적으로 수습 대안과 해결 방안을 명확히 수립하여 대책과 함께 최종 보고",
    optionB: "문제가 인지된 즉시 투명하게 얼리 워닝(Early Warning) 형태로 즉시 공유하여 머리를 맞댐",
    target: "all"
  },
  {
    id: "comm_4",
    category: "커뮤니케이션",
    title: "경청 및 맥락 파악력",
    question: "타 부서나 동료의 기획 요건을 들을 때 표면적 단어 너머의 진짜 업무적 비즈니스 맥락(Context)을 짚어내나요?",
    type: "scale",
    target: "all"
  },
  {
    id: "comm_5",
    category: "커뮤니케이션",
    title: "핵심 관계자 설득 스타일",
    question: "경영진을 대상으로 기획 예산안을 설득하거나 승인을 받아낼 때 채택하는 전략은 무엇입니까?",
    type: "ab",
    optionA: "시장의 철저한 경쟁 데이터, 시뮬레이션 수치 모델 등 수학적 증명을 앞세운 정밀 설득",
    optionB: "우리가 해결하고자 하는 고객 페인포인트와 시장 지배 시나리오의 비전을 앞세운 스토리텔링형 설득",
    target: "all"
  },
  {
    id: "comm_6",
    category: "커뮤니케이션",
    title: "회의 리드 및 합의점 도출력",
    question: "회의 진행 시 삼천포로 빠지는 논의를 신속히 정돈하고 제한 시간 내에 핵심 합의 사항(Action Item)을 이끌어 냅니까?",
    type: "scale",
    target: "all"
  },
  {
    id: "comm_7",
    category: "커뮤니케이션",
    title: "반대 의견 제기 매너",
    question: "동료의 아이디어가 부적합하다고 판단되어 반박을 하고자 할 때 어떤 톤을 유지하나요?",
    type: "ab",
    optionA: "결론의 오류를 비즈니스적 기준에서 명확히 짚어주어 시간 소모 없는 건설적 끝장 토론 유도",
    optionB: "의견 중 일부 긍정적 측면을 충분히 인정하고 존중한 후 조심스럽게 타협 대안을 제안하는 톤",
    target: "all"
  },
  {
    id: "comm_8",
    category: "커뮤니케이션",
    title: "비언어적 공감 및 배려",
    question: "동료의 고충을 들을 때 정서적 공감 능력을 보여주며 동료들이 속내를 털어놓을 수 있는 편안한 대화 환경을 만듭니까?",
    type: "scale",
    target: "all"
  },
  {
    id: "comm_9",
    category: "커뮤니케이션",
    title: "비협조자 설득 성공담",
    question: "이전 프로젝트 추진 중 지극히 비협조적이거나 무관심했던 파트너를 소통으로 설득하여 동참시킨 성공담을 알려주세요.",
    type: "short",
    target: "all"
  },
  {
    id: "comm_10",
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
