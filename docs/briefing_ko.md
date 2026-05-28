# 한국어 브리핑 가이드 (Korean Briefing Guide)

Project Brain Skilltree 프로젝트에 오신 것을 환영합니다! 이 문서는 한국어 독자와 미래의 AI 에이전트들이 본 프로젝트의 존재 이유, 아키텍처 구조, 핵심 역할 및 작업 절차를 명확하게 이해할 수 있도록 돕기 위해 작성되었습니다.

---

## 1. Project Brain Skilltree란 무엇인가?

Project Brain Skilltree는 AI 에이전트(Antigravity/Gemini, Codex, Claude Code)가 다양한 코딩 및 기획 태스크를 수행할 때 따르는 **휴대용 실행 스킬트리 운영체제**입니다.

다양한 AI 도구마다 프롬프트 지시사항을 따로 관리하면 파일이 쪼개지고 버전 관리가 어려워집니다. 이 시스템은 단 하나의 **단일 원천 소스(Canonical Source)**만 수정하고, 빌드 도구를 통해 각 에이전트 런타임에 최적화된 **어댑터(Generated Adapters)**를 자동으로 컴파일 및 포맷팅해 냅니다.

---

## 2. 아키텍처: 소스(`source/`) vs 어댑터(`adapters/`)

*   **원천 소스 (`source/`)**: 인간 또는 관리 에이전트가 직접 수정하는 유일한 소스 디렉토리입니다. 스킬의 원본 정의(`SKILL.md`)들이 여기에 위치합니다.
*   **생성된 어댑터 (`adapters/`)**: 빌드 도구를 통해 자동 생성되는 결과물입니다. **절대로 이 디렉토리 하위의 파일을 직접 수정해서는 안 됩니다.** 만약 어댑터와 소스 간에 불일치가 발생하면 품질 게이트(`npm run check`)에서 빌드 실패로 차단됩니다.

---

## 3. 4대 주요 역할 매핑

프로젝트 제어와 품질 검증을 수행하는 4대 코어 역할 및 한국어 스킬 이름과 공식 영어 명칭/슬러그 매핑 정보입니다.

| 한국어 스킬 명칭 | 공식 영어 명칭 (Official English Name) | 생성된 어댑터 슬러그 (Slug) | 주요 역할 및 책임 |
| :--- | :--- | :--- | :--- |
| **총괄매니저** | Project Manager (PM) | `project-manager` | 다중 에이전트 태스크를 조율하고, 세션 파일(`_context.md`, `_order.md`)을 관리 및 완료 검수합니다. |
| **코딩가이드** | Coding Guide | `coding-guide` | 작업을 수행하고, 디자인 토큰을 준수하며, 기술적 문제를 해결/에스컬레이션하는 시공 주체입니다. |
| **암행어사** | Inspector | `inspector` | 코드, 아키텍처, 디자인, 스킬트리의 논리적 허점과 리스크, 불필요한 코드를 감찰하고 절대 칭찬하지 않습니다. |
| **출시점검** | Launch Check | `launch-check` | 배포 직전 테스트와 빌드를 실행하고 코드 품질을 평가하는 최종 관문(GO/NO-GO) 역할을 수행합니다. |

*전체 스킬 목록과 매핑 세부 정보는 [Bilingual Terminology Guidance](terminology.md)에서 확인하실 수 있습니다.*

---

## 4. 핵심 운영 용어 및 절차

*   **작업 지시서 (`_order.md`)**: 에이전트가 수행해야 할 단일 태스크의 범위와 목표를 명시하는 임시 제어 파일입니다.
*   **플레이북 (`_playbook.md`)**: 여러 단계로 구성된 복합 배치 작업을 순차적으로 실행하기 위한 가이드입니다.
*   **세션 컨텍스트 (`_context.md`)**: 진행 중인 세션 상태를 빠르게 동기화하기 위한 롤링 요약 문서(30줄 이하로 유지)입니다.
*   **품질 게이트 (`npm run check`)**: 어댑터 빌드, 차이 비교(diff), 자동 테스트, 링크/비밀번호 검증, 코드 위생 진단을 수행하는 통합 빌드 파이프라인입니다.
*   **순방향 테스트 (`npm run test:forward`)**: 샌드박스 환경에서 에이전트의 예외/압박 상황 대응 시나리오를 시뮬레이션하고 검증합니다.

---

## 5. 시작하기 (Quickstart)

1.  **안전 로컬 데모 실행 (추천)**:
    시스템에 영향이 없는 가상 샌드박스를 임시 생성하여 빌드 및 설치 동작을 테스트해 봅니다.
    ```bash
    npm run demo
    ```
2.  **전체 품질 검증**:
    코드 변경 사항이 모든 품질 기준을 통과하는지 검증합니다.
    ```bash
    npm run check
    ```
3.  **에이전트에 배포 (Dry-run 포함)**:
    반드시 `--dry-run`을 주어 변경되는 파일을 미리 확인하고 설치하는 것을 권장합니다. 백업은 자동으로 생성됩니다.
    ```bash
    # Antigravity/Gemini 어댑터 설치 예시
    node tools/install-adapter.js antigravity /path/to/gemini/skills --dry-run
    node tools/install-adapter.js antigravity /path/to/gemini/skills
    ```
4.  **원상 복구 (Rollback)**:
    새로 배포한 어댑터를 지우고 이전 상태로 완전히 롤백하려면 아래 명령을 사용합니다.
    ```bash
    node tools/restore-adapter.js antigravity /path/to/gemini/skills
    ```
