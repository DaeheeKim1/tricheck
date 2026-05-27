import { defaultQuestions, defaultTemplates, JobTypeKey, QuestionCategory, SurveyQuestion, SurveyTemplate, jobProfiles } from "./questions";

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
  risks?: string[];
  considerations?: string[];
}

const STORAGE_KEY_CASES = "tricheck_cases";
const STORAGE_KEY_TEMPLATES = "tricheck_custom_templates";
const STORAGE_KEY_REPORTS = "tricheck_reports";

const isBrowser = typeof window !== "undefined";

let isInitializing = false;

// 1. Compile 50-length Answers Helper
function compileAnswers(
  scaleVals: number[], // 20 values
  abVals: string[],    // 20 values
  shortVals: string[]  // 10 values
): string[] {
  const ans: string[] = [];
  let sIdx = 0;
  let abIdx = 0;
  let shIdx = 0;

  defaultQuestions.forEach((q) => {
    if (q.type === "scale") {
      ans.push(String(scaleVals[sIdx++] || 4));
    } else if (q.type === "ab") {
      ans.push(abVals[abIdx++] || "A");
    } else {
      ans.push(shortVals[shIdx++] || "해당 사항 없음.");
    }
  });
  return ans;
}

export function getDemoCaseRequest(id: string): ReferenceRequest | null {
  const today = new Date().toISOString().split('T')[0];

  switch (id) {
    case "demo_overconfident": // 자신감 과다형: 김민수
      return {
        id: "demo_overconfident",
        candidate: {
          name: "김민수",
          email: "minsu.kim@example.com",
          position: "백엔드 개발자 (Backend Developer)",
          company: "카카오 테크"
        },
        referees: [
          { name: "김도현", email: "dohyun@example.com", relation: "추천인 1 (전 직장 직속 상사)" },
          { name: "이수진", email: "sujin@example.com", relation: "추천인 2 (전 직장 동료)" },
          { name: "박지훈", email: "jihun@example.com", relation: "추천인 3 (협업 팀원)" }
        ],
        interviewer: {
          name: "김성훈 팀장",
          email: "sunghoon@example.com",
          title: "개발팀 리드"
        },
        jobType: "backend_developer",
        templateId: "template_backend_developer",
        customQuestions: [...defaultQuestions],
        createdAt: today,
        status: "completed",
        selfAnswers: compileAnswers(
          Array(10).fill(5),
          Array(5).fill("B"),
          [
            "서버 백엔드 아키텍처 설계를 주도해 단 하나의 예외 상황도 허용하지 않도록 완벽히 완료했습니다.",
            "의사결정 시 논쟁이 발생하더라도 근본적인 백엔드 정합성이 증명될 때까지 토론하여 해결합니다.",
            "각자의 분업 영역을 깔끔히 보장하는 것이 협업 효율을 가장 높인다고 생각합니다.",
            "시스템 장애 가능성을 0%로 줄이기 위해 촘촘한 에러 핸들링과 로그 아카이빙을 설계했습니다.",
            "이슈 발생 즉시 데이터와 메신저 채널을 통해 빈틈없이 동료들과 아카이빙했습니다."
          ]
        ),
        peerAnswers: {
          "0": compileAnswers(
            [4,4,4,4, 4,4,4,4, 4,4],
            Array(5).fill("A"),
            [
              "설계 속도가 약간 늦어지더라도 구조 분석과 예외 처리에 신경을 썼던 백엔드 개발자입니다.",
              "실무적인 의견 대립이 있을 때 본인의 소신을 끝까지 설득하려 노력했습니다.",
              "동료들과 서면 및 위키 아카이빙을 충실하게 공유했습니다.",
              "배포 후 장애율을 예방하는 꼼꼼한 테스트 작성을 완료했습니다.",
              "부정적인 리스크나 장애 요인을 선제적으로 공유해 수습을 도왔습니다."
            ]
          ),
          "1": compileAnswers(
            [3,4,3,3, 3,4,3,3, 3,3],
            Array(5).fill("A"),
            [
              "속도보다는 구조와 안정성을 다소 중시하는 성향이었습니다.",
              "본인의 업무 영역에만 책임감을 주로 한정하는 성향이 있습니다.",
              "갈등 조율 시 논쟁보다는 정서적인 선에서 타협을 유도했습니다.",
              "기본적인 전산 데이터 보안 수칙을 지켰습니다.",
              "필요한 의견을 명확히 전달하지만 타 부서 제안을 수용하는 데는 다소 완곡했습니다."
            ]
          ),
          "2": compileAnswers(
            [3,3,3,2, 3,3,2,3, 3,3],
            Array(5).fill("B"),
            [
              "아키텍처 완성도에 너무 고집하여 간혹 일정 배포 속도가 지연되기도 했습니다.",
              "결정 사항에 대해 자신의 개발 논리가 받아들여질 때까지 의견 개진을 멈추지 않아 회의가 길어졌습니다.",
              "동료의 설계 피드백이나 비판적 의견을 다소 방어적으로 수용하곤 했습니다.",
              "기밀 데이터 유출 위험 징후를 예방하는 루틴은 평이했습니다.",
              "소통 스타일이 다소 직설적이라 주니어 팀원들이 대화에 부담을 느끼기도 했습니다."
            ]
          )
        },
        interviewerAnswers: compileAnswers(
          [4,3,4,3, 4,3,3,4, 4,3],
          Array(5).fill("A"),
          [
            "설계 능력이 확실하고 백엔드 하드스킬 수준은 평균 이상으로 판단됩니다.",
            "의견 상충 시 상사의 지시를 수용하면서도 속으로는 반발을 가질 여지가 엿보였습니다.",
            "코드 리뷰에 대한 개선안을 경청하겠다고 하나 다소 주관이 강함이 드러납니다.",
            "데이터 보안 인프라 구축 경험이 준수합니다.",
            "메시지 전달의 논리적 구체성은 우수하나 스토리텔링 공감은 약했습니다."
          ]
        )
      };

    case "demo_stable": // 안정형: 이지훈 (Product Manager)
      return {
        id: "demo_stable",
        candidate: {
          name: "이지훈",
          email: "jihun.lee@example.com",
          position: "프로덕트 매니저 (PM)",
          company: "네이버 웍스"
        },
        referees: [
          { name: "최민재", email: "minjae@example.com", relation: "추천인 1 (전 직장 직속 상사)" },
          { name: "강예린", email: "yerin@example.com", relation: "추천인 2 (전 직장 동료)" },
          { name: "조현수", email: "hyunsoo@example.com", relation: "추천인 3 (협업 팀원)" }
        ],
        interviewer: {
          name: "이지은 매니저",
          email: "jieun@example.com",
          title: "HR 파트장"
        },
        jobType: "product_manager",
        templateId: "template_product_manager",
        customQuestions: [...defaultQuestions],
        createdAt: today,
        status: "completed",
        selfAnswers: compileAnswers(
          Array(10).fill(4),
          Array(5).fill("A"),
          [
            "기능의 핵심 ROI와 사용자 페인포인트를 파악해 범위와 일정을 조율했습니다.",
            "전체 비즈니스 방향성에 맞춰 개인 일일 업무를 연계했습니다.",
            "동료들의 정기적인 피드백을 귀담아듣고 프로세스 개선에 충실히 반영했습니다.",
            "사내 기밀 데이터 정보 보안 수칙을 엄격하게 준수했습니다.",
            "사용자 페인포인트를 정량/정성적으로 설득해 경영진 승인을 받았습니다."
          ]
        ),
        peerAnswers: {
          "0": compileAnswers(
            [4,4,4,4, 4,5,4,4, 4,4],
            Array(5).fill("A"),
            [
              "유관 부서의 니즈를 폭넓게 경청하고 우선순위를 정돈해 내는 PM입니다.",
              "동료들의 고충을 배려하며 온화한 정서적 네트워킹을 이끌었습니다.",
              "기꺼이 동료를 지원하고 노하우를 활발하게 전파했습니다.",
              "보안 및 기밀 유출 통제 수칙을 신뢰할 수 있게 실행했습니다.",
              "비즈니스 스토리를 설득력 있게 가시화하는 역량이 우수했습니다."
            ]
          ),
          "1": compileAnswers(
            [4,4,4,4, 4,3,4,4, 4,4],
            Array(5).fill("A"),
            [
              "기획 스펙과 개발 리소스 조율에서 안정적인 완급을 유지했습니다.",
              "비즈니스 지향성이 일치했고 업무 규정을 모범 준수했습니다.",
              "동료의 조언을 열린 마음으로 경청하고 반영했습니다.",
              "안전한 사내 정보 취급 수칙을 모범적으로 지켰습니다.",
              "논리적 메시지 구성과 정성적 가치가 고르게 정제되었습니다."
            ]
          ),
          "2": compileAnswers(
            [4,4,3,4, 4,4,4,4, 4,4],
            Array(5).fill("A"),
            [
              "개발 일정 병목을 원활히 사전 소통하여 런칭 성공에 크게 기여했습니다.",
              "수평적 네트워킹을 통해 부서 간 장벽을 허물어 주었습니다.",
              "노하우의 적극적 공유와 이타적 기여가 팀 전체에 긍정적이었습니다.",
              "개인 데이터 기밀 준수를 엄격히 적용했습니다.",
              "경청 능력이 훌륭하고 상대방의 숨은 맥락을 빠르게 짚었습니다."
            ]
          )
        },
        interviewerAnswers: compileAnswers(
          [4,4,4,4, 4,4,4,4, 4,4],
          Array(5).fill("A"),
          [
            "프로세스 매니징과 크로스펑셔널 소통 지능이 대단히 고르고 안정적입니다.",
            "개인과 회사의 목표 통합을 객관화하여 대답했습니다.",
            "타 직군 피드백을 유연하게 수용할 준비가 확인되었습니다.",
            "보안 의식이 뚜렷하여 신뢰할 수 있습니다.",
            "메시지의 전달력과 온화함이 잘 균형 잡혀 있습니다."
          ]
        )
      };

    case "demo_inconsistent": // 평가 불일치형: 박서연 (Product Designer)
      return {
        id: "demo_inconsistent",
        candidate: {
          name: "박서연",
          email: "seoyeon.park@example.com",
          position: "프로덕트 디자이너 (UX/UI)",
          company: "토스 스튜디오"
        },
        referees: [
          { name: "임다은", email: "daeun@example.com", relation: "추천인 1 (전 직장 직속 상사)" },
          { name: "신재원", email: "jaewon@example.com", relation: "추천인 2 (전 직장 동료)" },
          { name: "김도현", email: "dohyun@example.com", relation: "추천인 3 (협업 팀원 - 개발자)" }
        ],
        interviewer: {
          name: "박준영 실장",
          email: "junyoung@example.com",
          title: "디자인 디렉터"
        },
        jobType: "product_designer",
        templateId: "template_product_designer",
        customQuestions: [...defaultQuestions],
        createdAt: today,
        status: "completed",
        selfAnswers: compileAnswers(
          [4,4,5,4, 4,4,4,4, 4,4],
          Array(5).fill("B"),
          [
            "디자인의 독창적 비주얼 퀄리티와 사용자 페인포인트를 기획안으로 구조화했습니다.",
            "토스 스튜디오의 혁신 지향 가치에 제 디자인을 정렬했습니다.",
            "실무 파트너 피드백을 유연하게 수렴하여 기획에 맞춰 디자인을 보정했습니다.",
            "사내 핵심 디자인 에셋 기밀 준수를 성실히 준수했습니다.",
            "디자인 시나리오의 비전을 스토리텔링 방식으로 매력적으로 설득했습니다."
          ]
        ),
        peerAnswers: {
          "0": compileAnswers(
            [5,5,5,5, 4,4,5,4, 5,5],
            Array(5).fill("B"),
            [
              "디자인실 내부에서 독창성과 visual 완성도로 크게 인정받은 PM급 디자이너입니다.",
              "회사의 디자인 문화를 이끌며 애사심이 아주 컸습니다.",
              "디자이너들의 성장을 적극 돕고 든든한 멘토가 되어주었습니다.",
              "중요 디자인 정보 보안을 모범적으로 다스렸습니다.",
              "경영진 보고 시 스토리텔링 and 비주얼 설득이 대단히 강했습니다."
            ]
          ),
          "1": compileAnswers(
            [4,4,4,4, 4,4,4,4, 4,4],
            Array(5).fill("B"),
            [
              "심미성 퀄리티와 트렌드 감각에 뛰어난 감각을 보였습니다.",
              "조직 비전과 디자인 정렬이 무리 없이 이뤄졌습니다.",
              "협업 동료의 비판 제안을 온화하게 수용했습니다.",
              "기본 데이터 유출 방지 수칙을 이행했습니다.",
              "의견 개진 시 논리성과 비주얼 전달력이 훌륭했습니다."
            ]
          ),
          "2": compileAnswers(
            [2,3,2,2, 3,2,2,3, 2,2],
            Array(5).fill("A"),
            [
              "디자인 퀄리티는 좋으나 개발 가능성이나 플랫폼 가이드를 종종 무시해 코딩 마찰이 잦았습니다.",
              "R&R을 개발팀과 너무 선을 그어 유연한 협조가 아쉬웠습니다.",
              "개발진의 기술적 한계 피드백이나 예외 누락 지적을 다소 무시하고 강행하려 했습니다.",
              "보안 및 행정 수칙 준수가 귀찮을 땐 소홀히 처리했습니다.",
              "소통 스타일이 지나치게 직설적이어서 의견 대립 시 감정적 갈등을 유발했습니다."
            ]
          )
        },
        interviewerAnswers: compileAnswers(
          [4,4,4,4, 4,4,4,4, 4,3],
          Array(5).fill("B"),
          [
            "디자인 포트폴리오의 심미성과 하드스킬 수준은 의심의 여지가 없습니다.",
            "당사 성장 비전과 얼라인하려는 노력이 보였습니다.",
            "동료 피드백에 대해 개방적이나 논리적으로 설득하려는 고집도 확인됩니다.",
            "보안 서약 준수를 긍정적으로 서술했습니다.",
            "스토리텔링과 논리 정제의 균형이 매력적이었습니다."
          ]
        )
      };

    case "demo_conflict": // 면접관 충돌형: 최현우 (B2B Sales Executive)
      return {
        id: "demo_conflict",
        candidate: {
          name: "최현우",
          email: "hyunwoo.choi@example.com",
          position: "B2B 영업 대표 (Sales Executive)",
          company: "쿠팡 비즈니스"
        },
        referees: [
          { name: "강예린", email: "yerin@example.com", relation: "추천인 1 (전 직장 직속 상사)" },
          { name: "조현수", email: "hyunsoo@example.com", relation: "추천인 2 (전 직장 동료)" },
          { name: "임다은", email: "daeun@example.com", relation: "추천인 3 (협업 팀원)" }
        ],
        interviewer: {
          name: "최수진 리드",
          email: "sujin.choi@example.com",
          title: "영업본부 리드"
        },
        jobType: "b2b_sales_executive",
        templateId: "template_b2b_sales_executive",
        customQuestions: [...defaultQuestions],
        createdAt: today,
        status: "completed",
        selfAnswers: compileAnswers(
          [5,5,4,5, 4,4,4,4, 4,4],
          Array(5).fill("A"),
          [
            "양적 리드 발굴과 타겟팅 제안을 통해 대형 계약을 다수 유치해 냈습니다.",
            "회사의 수수료 규정과 계약 프로세스를 철저히 정렬했습니다.",
            "유관 부서와 정기 미팅을 갖고 긴밀하게 요건을 조율했습니다.",
            "고객 데이터 보안 및 파트너 계약 비밀 누설 금지 규정을 이행했습니다.",
            "경영진 및 고객사에게 수학적 통계 모델 기반의 정밀 설득을 실천했습니다."
          ]
        ),
        peerAnswers: {
          "0": compileAnswers(
            [4,4,4,4, 4,4,4,4, 4,5],
            Array(5).fill("A"),
            [
              "목표 지향적 성과가 매우 우수하고, 딜 클로징 추진력이 돋보이는 영업대표입니다.",
              "사내 행정 기준과 계약 지침을 무난히 따랐습니다.",
              "이해관계 조율 시 부드러운 타협 매너를 보여주었습니다.",
              "비밀 엄수 및 중요 계약 보안에 투명했습니다.",
              "협상 스피치가 깔끔하고 요점이 정제되었습니다."
            ]
          ),
          "1": compileAnswers(
            [4,4,4,4, 4,4,4,4, 4,4],
            Array(5).fill("A"),
            [
              "신규 거래처 확보를 위해 콜드콜 등 공격적인 발굴을 잘 해내더군요.",
              "부서 간 R&R 분업 협력을 정직하게 이행했습니다.",
              "동료의 제안이나 피드백을 감정 소모 없이 유연 수렴했습니다.",
              "기밀 서약 보안을 준수했습니다.",
              "경청 및 협상력이 뛰어나 고객 관계가 좋았습니다."
            ]
          ),
          "2": compileAnswers(
            [4,4,3,4, 4,3,4,4, 4,4],
            Array(5).fill("A"),
            [
              "계약 물량 검토 시 타 부서의 행정 리소스를 충분히 조율해 런칭했습니다.",
              "내부 영업 정책 변경 흐름에 원활히 탑승했습니다.",
              "동료들의 기여를 인정하고 노하우를 투명히 전파했습니다.",
              "데이터 비밀 유지 정책을 존중했습니다.",
              "회의 리드 시 시간 관리가 깔끔했습니다."
            ]
          )
        },
        interviewerAnswers: compileAnswers(
          [2,3,2,3, 3,2,2,3, 3,3],
          Array(5).fill("B"),
          [
            "영업 쿼타 수치는 높으나, 당사 영업본부가 지향하는 장기적 신뢰 관계보다는 단기 마진 타협 기조가 강해 보입니다.",
            "사내 규제나 영업 컴플라이언스 우회 가능성을 옹호하는 듯한 위험한 면접 답변을 하였습니다.",
            "자신의 영업 단점에 대한 피드백 질문을 회피하거나 극도로 방어적으로 해명했습니다.",
            "보안 수칙이나 귀찮은 행정 규정 이행에 대한 중요도 인식이 타당치 않았습니다.",
            "의사소통 기조에서 경청 매너가 흔들리며 본인 피칭 위주의 태도를 고수해 불합격 등급을 내렸습니다."
          ]
        )
      };

    case "demo_specialized": // 편향된 역량형: 정유진 (Performance Marketer)
      return {
        id: "demo_specialized",
        candidate: {
          name: "정유진",
          email: "yujin.jung@example.com",
          position: "퍼포먼스 마케터 (Performance Marketer)",
          company: "배달의민족"
        },
        referees: [
          { name: "신재원", email: "jaewon@example.com", relation: "추천인 1 (전 직장 직속 상사)" },
          { name: "김도현", email: "dohyun@example.com", relation: "추천인 2 (전 직장 동료)" },
          { name: "이수진", email: "sujin@example.com", relation: "추천인 3 (협업 팀원)" }
        ],
        interviewer: {
          name: "정우성 디렉터",
          email: "woosung@example.com",
          title: "마케팅 본부장"
        },
        jobType: "performance_marketer",
        templateId: "template_performance_marketer",
        customQuestions: [...defaultQuestions],
        createdAt: today,
        status: "completed",
        selfAnswers: compileAnswers(
          [5,5,5,5, 3,3,3,3, 4,4],
          ["B", "B", "B", "B", "A"],
          [
            "광고 매체 ROI 데이터 및 가설 A/B 테스트 최적화를 통해 리드 단가를 30% 개선했습니다.",
            "조직 규정과 전산 결재 라인이 느슨할 땐 유동적으로 행동했습니다.",
            "노하우와 신규 스펙 데이터 문서를 팀 내에 적극 공유하여 개선을 도왔습니다.",
            "반복적이고 전형적인 전산 마감 행정 수칙은 최소화해 기동성을 높였습니다.",
            "부정적 이슈 발생 시 지체 없이 얼리 워닝 공유를 실천했습니다."
          ]
        ),
        peerAnswers: {
          "0": compileAnswers(
            [5,5,4,5, 2,3,2,3, 4,4],
            ["B", "B", "B", "B", "A"],
            [
              "수치와 데이터에 기반한 마케팅 퍼포먼스는 경이로운 수준을 낸 마케터입니다.",
              "그러나 증빙 영수증 정산 및 ERP 품의서 마감 수칙을 너무 소홀히 여겨 잔소리를 많이 들었습니다.",
              "갈등 시 비즈니스 전환율 수치를 들이밀며 차분히 합의를 이끌어 냈습니다.",
              "정산 행정이나 행정 프로세스를 귀찮아하며 회피하는 심각한 단점이 있습니다.",
              "데이터 시나리오를 논리정연하게 구조화해 보고하는 소통력이 훌륭했습니다."
            ]
          ),
          "1": compileAnswers(
            [5,4,5,5, 3,2,2,3, 4,4],
            ["B", "B", "B", "B", "A"],
            [
              "매체 데이터 분석 하드 스킬이 압도적이며 성과 검증 능력이 좋습니다.",
              "경영 가치 정렬 및 공식 네트워킹은 다소 수동적인 편이었습니다.",
              "R&R을 유연하게 넘나들며 기술적 공유를 해주는 지원 태도는 고마웠습니다.",
              "품의서 승인 결재 라인을 번번이 누락하거나 뒤늦게 수습하는 에러 루틴이 있었습니다.",
              "메시지 전달 매너가 간결하고 비즈니스 팩트 중심으로 뚜렷했습니다."
            ]
          ),
          "2": compileAnswers(
            [4,5,4,5, 2,2,3,2, 3,4],
            ["B", "B", "B", "B", "A"],
            [
              "스마트하고 ROI 지표 지향성이 탁월하여 함께 일하면 실무적으로 믿음직합니다.",
              "하지만 정산 서류 제출이나 행정적 컴플라이언스 수칙을 자주 회피하고 우회하려 했습니다.",
              "마케팅 에셋 및 매체 전략을 동료들과 긴밀히 문서로 주고받았습니다.",
              "전산 에러 방지를 위한 체계적 매뉴얼 이행은 미흡하여 수동 개입이 잦았습니다.",
              "회의 중 요점 정리가 신속하고 합의 의사결정을 기동성 있게 도출했습니다."
            ]
          )
        },
        interviewerAnswers: compileAnswers(
          [5,4,5,5, 3,3,2,3, 4,4],
          ["B", "B", "B", "B", "A"],
          [
            "퍼포먼스 지표 기획력과 데이터 해석 하드스킬은 마케팅 디렉터급으로 최상위 수준입니다.",
            "다만 조직 규정 및 회계 증빙 수칙에 대해 다소 유동적으로 해석하려는 태도가 면접 시 노출되었습니다.",
            "피드백에 개방적이나 논리가 견고해 본인 지향이 확고합니다.",
            "행정적 체크리스트를 번거로워하는 성향이 인지되어 철저한 온보딩이 요구됩니다.",
            "구체적 데이터 설득 및 메시지의 가독성이 아주 뛰어납니다."
          ]
        )
      };

    default:
      return null;
  }
}

// 3. Dynamic getDemoReport Helper (Includes high-quality Risks & Considerations overrides)
export function getDemoReportData(caseId: string, baseReport: ReferenceReport): ReferenceReport {
  // Deep copy the base report
  const report = JSON.parse(JSON.stringify(baseReport)) as ReferenceReport;

  switch (caseId) {
    case "demo_overconfident":
      report.overall = 66; // Calibrated score
      report.recommendation = "조건부 추천";
      report.riskLevel = "보통";
      report.consistencyScore = 74;
      report.strengths = [
        "시스템 인프라 설계에 있어 기초 구조와 안정성을 깊게 탐구하는 학구적 전문성",
        "서버 배포 프로세스의 표준 보안 규정 및 컴플라이언스를 우직하게 준수하는 성실성",
        "서면 기반의 아카이빙 및 API 문서화 작성을 꼼꼼히 이행하는 공유 태도"
      ];
      report.warnings = [
        "자가 인식(96점)과 추천인 평균(74점) 간의 심각한 인식 격차 조율 필요",
        "코드 리뷰 과정에서 타 직군의 설계 수정 요청을 방어적으로 수용하려는 태도",
        "비즈니스 기기 임박 시 기능 범위 조율에서 다소 경직된 R&R 고수 성향"
      ];
      report.risks = [
        "본인의 하드 스킬 및 아키텍처 설계 역량을 실제 기여도보다 과도하게 과대평가하는 경향이 있음 (과대포장 리스크).",
        "피어 평가 및 코드 리뷰 과정에서 타인의 피드백을 방어적으로 수용하거나 수용을 지연시킬 리스크 발견.",
        "R&R이 불명확한 상황에서 주도적으로 문제를 풀기보다 본인의 설계 영역에만 과업을 구획화하여 대처할 우려."
      ];
      report.considerations = [
        "입사 초기 온보딩 기간 동안 명확한 R&R과 객관적인 KPI를 수립하여 주기적인 성과 동기화 세션을 가질 것을 권장함.",
        "정기적인 1on1 미팅을 통해 상호 피드백을 투명하게 교환하며 자기 객관화 수준을 고정해 나갈 필요가 있음.",
        "동료들과의 협업 프로세스 정착을 위해 초기에 문서화된 가이드라인과 결재 라인을 비교적 촘촘히 지원할 필요."
      ];
      report.aiSummary = "김민수 백엔드 개발자 후보자는 기술적 하드스킬 수준 및 보안 준수성은 평균 이상으로 확인되나, 자가 진단(96점)과 전 직장 추천인들의 평균 평판(74점) 간 격차가 22점 수준으로 극도로 높은 양상을 보입니다. 전반적인 기획 단계 타협도 및 코드 리뷰 수용성 부문에서 동료들과의 의견 차이가 드러납니다. 입사 시 자기 객관화를 도울 수 있는 밀착 피드백 멘토링 장치가 반드시 요구되어 '조건부 추천' 등급을 최종 산출합니다.";
      break;

    case "demo_stable":
      report.overall = 83;
      report.recommendation = "추천";
      report.riskLevel = "낮음";
      report.consistencyScore = 95;
      report.strengths = [
        "다기능 부서 간의 원만한 갈등 중재 및 정서적 공감대 형성 역량 탁월",
        "일정 지연 리스크가 감지되었을 때 즉각적인 조기 경보 및 투명한 진척 공유",
        "비즈니스 최종 목표에 부합하도록 프로덕트의 우선순위를 기민하게 조율하는 가교 역할"
      ];
      report.warnings = [
        "비즈니스 런칭 속도 확보를 위해 기술 부채나 품질적인 부분의 완급 조절 조언 필요",
        "개인적 성장 욕구 대비 기존의 검증된 프레임워크와 안정적 업무 시스템을 선호하는 경향",
        "과감한 리스크 테이킹이 필요한 파괴적 프로덕트 피벗 시 의사결정 속도가 다소 정체될 가능성"
      ];
      report.risks = [
        "도전적인 리스크 테이킹이나 파괴적인 혁신보다는, 안정적인 지표 관리와 예측 가능한 성과를 지향하는 보수적 경향.",
        "단기적인 일정 단축을 위해 개발 품질과 일시적으로 타협을 조율하는 과정에서 엔지니어링 파트와 마찰 가능성 존재.",
        "여러 유관 부서의 니즈를 폭넓게 조율하는 과정에서 간혹 완급 조절이 지연되어 기획 확정이 늦어질 리스크."
      ];
      report.considerations = [
        "기존의 정돈된 프로세스를 운영하는 매니징 능력은 탁월하나, 제로투원(0 to 1) 신사업 기획 시에는 과감한 목표 설정을 지원해야 함.",
        "디자이너 및 개발자 직군과의 협업에서 기술적 전문성을 존중하는 대화 방식을 지속 유지하도록 멘토링 권장.",
        "분기별로 정성적 고객 FGI 외에 정량 데이터 분석 툴의 하드 스킬 숙련을 장려하는 교육 기회 제공 필요."
      ];
      report.aiSummary = "이지훈 PM 후보자는 자가 평가(84점), 동료 평판 평균(83점), 면접관 관찰(82점)이 아주 견고하게 정렬되어 신뢰 일치율이 95%로 극히 높은 수준에 속합니다. 협업 갈등 조율 매너와 얼리 워닝 보고 시스템이 우수하여 채용 시 특별한 리스크 징후가 식별되지 않는 모범적인 성향의 인재입니다.";
      break;

    case "demo_inconsistent":
      report.overall = 62;
      report.recommendation = "조건부 추천";
      report.riskLevel = "높음";
      report.consistencyScore = 52;
      report.strengths = [
        "디자인 전문적 완성도와 심미성, 최신 트렌드를 이끄는 탁월한 비주얼 구현력",
        "상사 및 디자인실 내부 구성원들과의 견고한 패밀리십과 강한 소속감",
        "주관이 뚜렷하고 디자인 전략 방향을 주도적으로 기획해 제안하는 역량"
      ];
      report.warnings = [
        "협업 직군(개발팀) 추천인의 평가가 디자인 부서 대비 극도로 불일치함 (평가 불일치 🚨)",
        "피그마 가이드 배포 시 개발 가능 제약 조건에 대한 검토가 다소 부족하다는 피드백",
        "회의 중 자신의 비주얼 철학 관철을 위해 상대방을 직설적으로 반박하여 협업 마찰 유발 가능성"
      ];
      report.risks = [
        "디자인실 내부(상사, 동료) 평판은 매우 우수하나, 협업 개발 부서 평판이 극도로 저조하여 부서 간 칸막이 협업 우려.",
        "본인의 디자인 심미적 철학을 고수하며 개발 가능성 및 플랫폼 가이드를 다소 무시한다는 지적 식별 (기술 제약 무시).",
        "회의 과정에서 본인의 주장을 직설적으로 개진하여 타 부서에 감정적인 피로감을 남길 가능성이 높음."
      ];
      report.considerations = [
        "입사 후 개발 리드와의 조기 매칭 및 시스템 컴포넌트 표준 규격에 대한 명확한 온보딩 가이드 제공 권장.",
        "타 부서와의 갈등 발생 시 중재할 수 있는 중간 매니저의 밀착 모니터링 및 주기적인 협업 만족도 체크 필요.",
        "정기적인 피드백 세션 시, 설득 매너와 상대방의 의견에 대한 경청 태도 개선을 주요 코칭 포인트로 설정."
      ];
      report.aiSummary = "박서연 프로덕트 디자이너 후보자는 디자인 전문성은 업계 최상위권이나, 디자인 부서 동료들(평균 88점)과 협업 개발자 동료(52점) 간의 평가 편차가 극도로 벌어지는 불일치 양상(신뢰도 52%)을 보입니다. 개발 가능 조건 준수력 및 협업 시의 반대 의견 개진 매너에서 현저히 부정적인 평판이 포착되었습니다. 칸막이 협업 리스크 제어가 불가피하므로 협조 만족도에 대한 보완책 수립과 함께 '조건부 추천' 등급을 매깁니다.";
      break;

    case "demo_conflict":
      report.overall = 58;
      report.recommendation = "보류";
      report.riskLevel = "높음";
      report.consistencyScore = 64;
      report.strengths = [
        "목표 쿼타 돌파를 위해 기동성 있게 양적 리드를 발굴하는 폭발적인 영업 실행력",
        "이전 직장에서 동료 및 협업 부서 담당자들과 마찰 없이 원만히 소통해 온 신뢰 관계",
        "거절 상황이나 계약 불발 압박에서도 빠르게 마인드를 극복해 내는 강력한 회복탄력성"
      ];
      report.warnings = [
        "면접관 평가(54점)와 전 직장 동료 평판(86점) 간의 심각한 인식 충돌 (면접관 갈등 🚨)",
        "당사 면접관과의 질의응답 시 다소 방어적이거나 과대포장하려는 듯한 대화 스타일 노출",
        "영업 성사를 위해 때때로 마진율을 낮추거나 무리한 특약 조항을 조율하려는 경향 검토 필요"
      ];
      report.risks = [
        "면접 단계에서 면접관이 관찰한 업무 태도 및 진정성 점수가 동료 평판 대비 현저히 낮은 불일치 발생 (대면 신뢰 갈등).",
        "면접 시 지나치게 단기 쿼타 달성만을 피칭하여 당사 영업 본부의 장기 신뢰(LTV) 지향 가치와 충돌 우려.",
        "구두 면접 소통에서 나타난 후보자의 다소 공격적인 협상 스타일이 현업 팀워크에 유해할 리스크 보고."
      ];
      report.considerations = [
        "실제 실무 평판은 대단히 우수하므로, 면접관의 부정 관찰이 일시적인 긴장이나 스타일 오해였는지 2차 추가 심층 면접 권장.",
        "입사 초기 B2B 고객사 클로징 시 주도권을 다소 강하게 잡는 스타일을 당사 영업 매뉴얼에 맞춰 순화할 필요가 있음.",
        "단기 성과 촉진 외에 장기 계약 프로세스 준수율에 가중치를 둔 인센티브 모델을 설계하여 조율 지원."
      ];
      report.aiSummary = "최현우 영업대표 후보자는 전 직장 상사 및 협업 동료 평균 평판(86점)은 매우 안정적이나, 당사 1차 면접관 관찰 평가(54점)와 극심한 인지 충돌(격차 32점)을 나타내어 최종 보정 점수가 58점인 '채용 보류' 군에 귀속되었습니다. 면접관과의 대화 시 노출된 방어적인 포장 태도 및 당사 장기 가치관과의 정합성 마찰에 대해 보강 인터뷰나 추가 레퍼런스 검증을 필히 권유합니다.";
      break;

    case "demo_specialized":
      report.overall = 65;
      report.recommendation = "조건부 추천";
      report.riskLevel = "보통";
      report.consistencyScore = 85;
      report.strengths = [
        "정량적 데이터 분석 및 매체 ROI 지표를 최적화해 내는 경이로운 데이터 마케팅 실행력",
        "정량 데이터를 논리적으로 가시화하고 경영진을 막힘없이 설득해 내는 발표 역량",
        "문제를 인지하자마자 실시간으로 투명하게 공유하여 대책을 이끌어내는 공유력"
      ];
      report.warnings = [
        "조직 규정 및 보안 컴플라이언스 준수 점수가 현저히 낮은 위험 성향 (조직 리스크 🚨)",
        "시장 타이밍과 지표 달성을 위해 법률적/행정적 회색 영역을 의도적으로 방치하는 경향",
        "영수증 정산, 결산 보고 등 정형화된 반복 행정 업무에 대한 회피 및 성실도 미흡 피드백"
      ];
      report.risks = [
        "특정 역량(업무 추진력, 데이터 최적화)은 최고 수준이나, 조직 보안 가이드라인 준수 및 행정 절차 우회 성향이 매우 강함.",
        "마케팅 예산 소진 및 성과 지표 도출 시 법적 컴플라이언스나 회색 규제를 감수하려 하는 하이 리스크 테이킹 기조.",
        "사내 복잡한 결재 라인이나 결산 전표 증빙 처리에 대단히 태만하며 소홀히 대응할 위험 식별."
      ];
      report.considerations = [
        "업무적 퍼포먼스는 뛰어나므로, 반드시 재무/회계 부서와의 공식 가이드라인 준수를 강제하는 프로세스적 장치 정비.",
        "광고 집행 전 사내 법률 자문을 필수로 거치도록 사전 컴플라이언스 절차를 수동 지정할 것을 권장.",
        "행정 수칙 및 보안 규정 위반 시 인센티브 고과 감점 등 사내 룰을 사전에 명확히 주지시키고 온보딩 시 통제 지원."
      ];
      report.aiSummary = "정유진 퍼포먼스 마케터 후보자는 데이터 분석력 및 마케팅 캠페인 추진력(평균 94점) 영역은 당사 핵심 고성과자 레벨에 버금가나, 사내 규정 준수성 및 결산 행정 성실도(평균 48점) 영역에서 심각한 평판 불량이 감지되었습니다. 지표 달성을 위해 규정 및 프로세스 우회를 자인하는 위험 추구형 성향이 보고되어 컴플라이언스 안전장치를 강제하기 위한 보직 배치 및 모니터링 합의가 선제 조율되어야 합니다.";
      break;

    default:
      break;
  }

  return report;
}

export function initializeDemoData(): void {
  if (!isBrowser) return;
  const initialized = localStorage.getItem("tricheck_demo_initialized");
  if (initialized === "true" || isInitializing) return;

  isInitializing = true;
  try {
    // Save 5 demo cases requests in the storage CASES list
    const demoIds = ["demo_overconfident", "demo_stable", "demo_inconsistent", "demo_conflict", "demo_specialized"];
    const demoRequestsList: ReferenceRequest[] = [];

    demoIds.forEach(id => {
      const req = getDemoCaseRequest(id);
      if (req) demoRequestsList.push(req);
    });

    // Merge with any existing cases
    const stored = localStorage.getItem(STORAGE_KEY_CASES);
    const existing: ReferenceRequest[] = stored ? JSON.parse(stored) : [];
    const filtered = existing.filter(c => !demoIds.includes(c.id));
    localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify([...demoRequestsList, ...filtered]));

    // Also populate reports in reports list for these cases
    const reportsStored = localStorage.getItem(STORAGE_KEY_REPORTS);
    const reportsObj: Record<string, ReferenceReport> = reportsStored ? JSON.parse(reportsStored) : {};

    demoRequestsList.forEach(req => {
      const rep = analyzeSurveyAnswers(req);
      reportsObj[req.id] = getDemoReportData(req.id, rep);
    });

    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reportsObj));
    localStorage.setItem("tricheck_demo_initialized", "true");
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
  if (id === "demo") {
    const activeCaseId = isBrowser ? localStorage.getItem("tricheck_active_demo_case") || "demo_stable" : "demo_stable";
    return getDemoCaseRequest(activeCaseId);
  }
  const cases = getAllRequests();
  return cases.find(c => c.id === id) || null;
}

export function deleteRequest(id: string): void {
  if (!isBrowser) return;
  const cases = getAllRequests();
  const filtered = cases.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(filtered));
}

// App Mode Storage Helpers
export function getAppMode(): 'real' | 'demo' {
  if (!isBrowser) return 'real';
  return (localStorage.getItem("tricheck_app_mode") as 'real' | 'demo') || 'real';
}

export function setAppMode(mode: 'real' | 'demo'): void {
  if (!isBrowser) return;
  localStorage.setItem("tricheck_app_mode", mode);
  window.dispatchEvent(new Event("tricheck_mode_change"));
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
  if (id === "demo") {
    const req = getRequest("demo");
    if (!req) return null;
    const baseRep = analyzeSurveyAnswers(req);
    const activeCaseId = isBrowser ? localStorage.getItem("tricheck_active_demo_case") || "demo_stable" : "demo_stable";
    return getDemoReportData(activeCaseId, baseRep);
  }
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
  const template = getTemplateById(req.templateId) || defaultTemplates[req.jobType] || defaultTemplates.general;
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
      const matchesTarget = q.target === "all" || q.target === role;
      if (!matchesTarget) return;
      if (q.type === "short") return;

      const answer = answers[idx] || (q.type === "scale" ? "3" : "A");
      const score = getQuestionScore(q, answer);
      totals[q.category] = (totals[q.category] || 0) + score;
      counts[q.category] = (counts[q.category] || 0) + 1;
    });

    const scores: Record<string, number> = {};
    categories.forEach(cat => {
      const total = totals[cat] || 0;
      const count = counts[cat] || 0;
      scores[cat] = count > 0 ? Math.round(total / count) : 80;
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
    selfPeerGapPenalty = Math.min(15, (selfPeerGap - 5) * 0.8);
  }

  // B. Self-Interviewer gap penalty (> 5)
  let selfInterviewerGapPenalty = 0;
  if (selfInterviewerGap > 5) {
    selfInterviewerGapPenalty = Math.min(10, (selfInterviewerGap - 5) * 0.5);
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
        if (spread >= 2) disagreementCount += (spread - 1);
      }
    }
  });
  const peerInconsistencyPenalty = Math.min(15, disagreementCount * 1.2);

  // D. Interviewer Conflict Penalty
  const intConflict = Math.abs(interviewerScore - peerAverageScore);
  let interviewerConflictPenalty = 0;
  if (intConflict > 8) {
    interviewerConflictPenalty = Math.min(15, (intConflict - 8) * 0.6);
  }

  // E. Positive Response Bias
  let perfectSelfCount = 0;
  selfAns.forEach((ans, idx) => {
    if (questions[idx]?.type === "scale" && ans === "5") {
      perfectSelfCount++;
    }
  });
  const totalScaleQuestions = questions.filter(q => q.type === "scale").length;
  const perfectSelfRatio = perfectSelfCount / (totalScaleQuestions || 1);
  let positiveBiasPenalty = 0;
  if (perfectSelfRatio > 0.7) {
    positiveBiasPenalty = Math.min(8, (perfectSelfRatio - 0.7) * 20);
  }

  // Calibrate final score
  let overall = peerAverageScore - selfPeerGapPenalty - selfInterviewerGapPenalty - peerInconsistencyPenalty - interviewerConflictPenalty - positiveBiasPenalty;
  overall = Math.round(Math.max(40, Math.min(95, overall)));

  // Recommendation Tier
  let recommendation: '강력 추천' | '추천' | '조건부 추천' | '보류';
  if (overall >= 85) recommendation = '강력 추천';
  else if (overall >= 70) recommendation = '추천';
  else if (overall >= 60) recommendation = '조건부 추천';
  else recommendation = '보류';

  // Risk Level
  const totalPenalties = selfPeerGapPenalty + selfInterviewerGapPenalty + peerInconsistencyPenalty + interviewerConflictPenalty + positiveBiasPenalty;
  let riskLevel: '낮음' | '보통' | '높음';
  if (totalPenalties > 15 || overall < 60) riskLevel = '높음';
  else if (totalPenalties > 7 || overall < 70) riskLevel = '보통';
  else riskLevel = '낮음';

  // Consistency Score
  let consistencyScore = Math.round(100 - (peerDeviation * 2.0) - (peerInconsistencyPenalty * 2.5) - (positiveBiasPenalty * 1.2));
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

    if (pVal >= 85) {
      if (cat === "업무성향") strengths.push("주도적인 태도와 책임감 있는 과업 수행력");
      if (cat === "조직적합성") strengths.push("조직 문화에 긍정적인 태도와 조화력");
      if (cat === "협업성향") strengths.push("팀 내 소통과 원활한 갈등 조정 해결 역량");
      if (cat === "리스크 대응") strengths.push("체계적인 관리력 기반의 잠재적 리스크 예방 능력");
      if (cat === "커뮤니케이션") strengths.push("데이터 및 감성 설득을 아우르는 탁월한 대화 기술");
    }

    if (pVal < 70) {
      if (cat === "업무성향") warnings.push("기동력 있는 속도 조절 및 추진력이 제한될 여지");
      if (cat === "조직적합성") warnings.push("전통적인 수직 체계 및 사내 절차 준수에 저조함");
      if (cat === "협업성향") warnings.push("협업 시 다소 보수적인 R&R 구획과 경직된 대응 우려");
    }

    if (sVal - pVal > 8) {
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

export const demoReport = {
  // Kept as fallback, but getReport("demo") will fetch the localStorage selected case!
  id: "demo",
  candidate: { name: "이지훈", position: "프로덕트 매니저 (PM)", company: "네이버 웍스" },
  jobType: "product_manager" as JobTypeKey,
  createdAt: "2026-05-23",
  overall: 83,
  selfScore: 84,
  peerAverageScore: 83,
  interviewerScore: 82,
  consistencyScore: 95,
  selfPeerGap: 1,
  selfInterviewerGap: 2,
  peerDeviation: 1.5,
  interviewerPeerGap: -1,
  riskLevel: "낮음" as const,
  recommendation: "추천" as const,
  strengths: [
    "다기능 부서 간의 원만한 갈등 중재 및 정서적 공감대 형성 역량 탁월",
    "일정 지연 리스크가 감지되었을 때 즉각적인 조기 경보 및 투명한 진척 공유",
    "비즈니스 최종 목표에 부합하도록 프로덕트의 우선순위를 기민하게 조율하는 가교 역할"
  ],
  warnings: [
    "비즈니스 런칭 속도 확보를 위해 기술 부채나 품질적인 부분의 완급 조절 조언 필요",
    "개인적 성장 욕구 대비 기존의 검증된 프레임워크와 안정적 업무 시스템을 선호하는 경향",
    "과감한 리스크 테이킹이 필요한 파괴적 프로덕트 피벗 시 의사결정 속도가 다소 정체될 가능성"
  ],
  gapData: [
    { label: "업무성향", self: 85, peer: 83, interviewer: 82 },
    { label: "조직적합성", self: 82, peer: 80, interviewer: 80 },
    { label: "협업성향", self: 88, peer: 85, interviewer: 84 },
    { label: "리스크 대응", self: 80, peer: 82, interviewer: 80 },
    { label: "커뮤니케이션", self: 85, peer: 85, interviewer: 84 }
  ],
  categoryScores: {
    "업무성향": { self: 85, peer: 83, interviewer: 82 },
    "조직적합성": { self: 82, peer: 80, interviewer: 80 },
    "협업성향": { self: 88, peer: 85, interviewer: 84 },
    "리스크 대응": { self: 80, peer: 82, interviewer: 80 },
    "커뮤니케이션": { self: 85, peer: 85, interviewer: 84 }
  },
  aiSummary: "이지훈 PM 후보자는 자가 평가(84점), 동료 평판 평균(83점), 면접관 관찰(82점)이 아주 견고하게 정렬되어 신뢰 일치율이 95%로 극히 높은 수준에 속합니다. 협업 갈등 조율 매너와 얼리 워닝 보고 시스템이 우수하여 채용 시 특별한 리스크 징후가 식별되지 않는 모범적인 성향의 인재입니다.",
  answersDetail: [],
  penalties: {
    selfPeerGap: 0,
    selfInterviewerGap: 0,
    peerInconsistency: 0,
    interviewerConflict: 0,
    positiveBias: 0
  }
};
