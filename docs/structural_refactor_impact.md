# Structural Refactor Impact Analysis Report

- **Date:** 2026-05-26
- **Phase:** Phase 4 Structural Refactor Candidates
- **Status:** Complete (1st Draft)

---

## 1. Executive Summary

본 보고서는 Project Brain Skilltree의 Phase 4 구조적 리팩토링 후보군인 **(1) 암행어사/출시점검의 통합 및 경계 분리**, **(2) `source/` 디렉터리의 core/plugins 구조 분리**에 대해 1차 영향도를 평가하고, 향후 추진 방향을 제안하기 위해 작성되었습니다.

### 핵심 결론
현재 시점에서는 **B안 (경계 명확화 및 구조적 리팩토링 보류)**을 최종 권장합니다.
- **이유**: 스킬 통합이나 디렉터리 분리는 catalog 스키마, 빌드/차분 도구, 설치기(installer) 세션 보호 로직, 그리고 `SKILL_INDEX` 라우팅에 파급 효과가 매우 큽니다. 특히 로컬 설치본(Codex, Antigravity)의 기존 경로 명칭이 깨지면서 중복 복제(drift)와 유실 리스크가 크게 발생하므로, 즉각적인 변경 대신 **문서상 경계 정의**와 **구조 변경 전 검토 게이트(Refactoring Gate) 보강**만으로 안전하게 처리하는 것이 가장 효율적입니다.

---

## 2. 암행어사와 출시점검의 비교 (중복과 차이)

| 비교 항목 | [암행어사 (Secret Inspector)](../source/암행어사/SKILL.md) | [출시점검 (Launch Check)](../source/출시점검/SKILL.md) |
|---|---|---|
| **기본 페르소나** | 감찰관 (Inspector / 비판적 시선) | DevOps / QA 리드 (QA Engineer) |
| **목적** | 프로젝트 전반(아이디어/설계/문서/코드)의 **논리적 모순, 설계 결함, 가비지(엔트로피) 탐색** | 배포 가능한 상태인지에 대한 **구동적/기술적 검증 및 품질의 정량적 평가** |
| **주요 역할** | - 7대 공격 벡터를 통한 논리/전략 취약점 공격<br>- 전문가 렌즈(Mode C) 기반 갭 분석 및 성숙도 진단<br>- 스킬트리 자체의 아키텍처 감사 (Mode D) | - 빌드/린트/타입 체크 및 dev 서버 런타임 스모크 테스트 실행<br>- 7대 정밀 평가에 기초한 100점 점수화<br>- GO/NO-GO 배포 가부 판단 |
| **출력 산출물** | `_audit_YYYY-MM-DD.md` | `_launch_check.md` |
| **실제 중복 영역** | 코드 내 취약점(하드코딩, 미사용 파일/데드코드 등) 탐색 시 출시점검의 코드 위생/디자인 토큰 검사와 일부 개념적 오버랩 발생 |
| **핵심 차이점** | 코드를 고치거나 빌드 테스트를 **직접 돌리지 않고**, 제3자 입장에서의 리스크 규명 및 가이드라인 제시에 중점 | 실제 도구(`npm run build` 등)를 구동하여 **구동 무결성을 실시간 점검**하고 정량 평가를 수립함 |

---

## 3. 두 스킬 통합 시 리스크 및 깨지는 항목

만약 `암행어사`와 `출시점검`을 단일 스킬로 통합할 경우 발생하는 구체적 영향 범위는 다음과 같습니다.

1. **Catalog 정합성 (`catalog/skills.yaml`)**
   - `catalog/skills.yaml`에서 기존 `id: inspector`와 `id: launch-check`가 하나로 합쳐져야 하며, 이는 카탈로그 메타데이터의 소스 정합성 처리에 영향을 줍니다.
2. **Adapter Folder Name (Slugs)**
   - generated adapters 디렉터리 구조가 바뀝니다. `adapters/codex/skills/inspector/` 와 `adapters/codex/skills/launch-check/` 가 유실되고 단일 슬러그로 합쳐집니다.
3. **SKILL_INDEX Routing**
   - `SKILL_INDEX.md`의 Primary Router와 Pipeline, Verification Layers에 등록된 두 역할 구분이 붕괴됩니다. "허점 리스크 탐색"과 "배포 판정"이 한 곳으로 라우팅되어 AI 세션이 용도별 트리거를 분기하기 어려워집니다.
4. **Install/Update Flow & Local Preservation**
   - `install-adapter.js` 설치기는 기본적으로 목적지에 존재하는 다른 파일들을 "보존(Preservation)"하도록 설계되어 있습니다.
   - 따라서 스킬이 통합/삭제되면, 기존에 설치되어 있던 구버전 폴더가 찌꺼기로 남거나, 강제로 덮어씌우는 과정에서 예기치 못한 유저 파일 유실(Drift)이 발생할 수 있습니다.
5. **사용자 습관 (UX)**
   - "찢어줘/검증해줘"를 통한 아키텍처 비판 요청과 "배포해도 돼/몇 점이야?"를 통한 안정성 수치화 요청은 입력 시점과 심리적 기대를 달리하므로, 이를 단일 스킬로 묶으면 세션 대화 효율이 저하됩니다.

---

## 4. 경계 명확화(Boundary Clarification) 최소 수정안

두 스킬을 통합하지 않고 경계만 깔끔하게 유지하기 위한 최소 수정 방안입니다.

- **역할 정의 엄격 분리**:
  - `암행어사`는 기획/설계/문서/스킬의 리스크 식별(Audit) 및 엔트로피 방지 정돈 가이드라인 제시에만 주력하고, **직접 도구 구동(npm run dev/build) 및 배포 가부(GO/NO-GO) 판단은 수행하지 않는다**고 명시합니다.
  - `출시점검`은 DevOps 및 빌드/런타임 구동성 판단에 주력하고, **설계/기획 단계의 비즈니스적 갭 분석이나 스킬 아키텍처 감사는 수행하지 않는다**고 선언합니다.
- **출력 구분**:
  - `암행어사`는 오직 `_audit_YYYY-MM-DD.md`만 쓰며, `출시점검`은 오직 `_launch_check.md`만 관리하도록 설계합니다.

---

## 5. Core / Plugins 분리의 영향 범위

`source/`를 `source/core/`와 `source/plugins/`로 분리할 때 영향을 받는 구성 요소들입니다.

1. **Catalog (`catalog/skills.yaml`)**
   - `source` 속성의 디렉터리 경로(예: `"source": "총괄매니저"` -> `"source": "core/총괄매니저"`)가 전면 수정되어야 합니다.
2. **Build / Diff Tools (`tools/build-adapters.js`, `tools/diff-adapters.js`)**
   - `source` 필드의 깊이(depth)가 달라지므로, 경로 조인 및 복사 루프 로직에 대한 패치가 요구됩니다.
3. **SKILL_INDEX Routing Links**
   - `SKILL_INDEX.md` 내에 등록된 마크다운 상대 링크 경로(예: `총괄매니저/SKILL.md` -> `core/총괄매니저/SKILL.md`)를 일체 갱신해야 합니다.
4. **Local Install / Update Flow**
   - Antigravity 어댑터는 소스의 폴더 명칭을 그대로 보존하여 배포하므로, 로컬 설치 경로가 `skills/core/총괄매니저/` 구조로 중첩됩니다.
   - 이 경우 에디터의 스킬 스캔 메커니즘이 재귀 스캔을 완벽히 지원하는지 검증되지 않았다면, 이메일/블로그 등 하위 스킬의 **자동 발견(Discovery)이 먹통이 되는 치명적인 배포 사고**로 번질 수 있습니다.

---

## 6. 권장 로드맵 (Action Items)

구조적 리팩토링의 안정성을 검증하기 위해 다음과 같이 단계를 나누어 추진할 것을 제안합니다.

*   **P0 (안전 조치 및 경계 확립 - 즉시 실행)**
    - 실제 폴더 이동이나 스킬 통합은 보류합니다.
    - [암행어사/SKILL.md](../source/암행어사/SKILL.md)와 [출시점검/SKILL.md](../source/출시점검/SKILL.md)의 책임 범위를 규정하는 최소 패치를 작성합니다.
    - `docs/ARCHITECTURE.md` 및 `docs/ADAPTER_CONTRACT.md` 내에 구조적 리팩토링 전 사전 점검해야 할 **"Structural Refactoring Gates (구조 변경 전 검토 기준)"**를 공식 등재합니다.
*   **P1 (태스크 및 마일스톤 동기화 - 즉시 실행)**
    - [PROJECT_TASKS.md](../PROJECT_TASKS.md)의 Phase 4 태스크 목록을 구체적으로 세분화하여, 현 분석 보고서 제출 및 결정 보강 단계를 반영합니다.
*   **P2 (자동 검증 및 로컬 커밋 - 즉시 실행)**
    - 어댑터 빌드 및 `npm run check`를 전면 통과시키고, 로컬 git 커밋을 작성하여 해시값을 보고합니다.
