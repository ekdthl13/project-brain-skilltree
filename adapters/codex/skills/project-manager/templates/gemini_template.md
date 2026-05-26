# {{프로젝트명}}

## 프로젝트 개요
[PRD/PROJECT_BRIEF에서 추출한 한 줄 설명]

## 기술 스택
- 프레임워크: [Next.js / React / Vue 등]
- 스타일: [Tailwind / CSS변수 / styled-components]
- 백엔드: [Supabase / Firebase 등]
- 배포: [Vercel / Netlify 등]

## 핵심 문서 위치
- 결정 로그: `./DECISION_LOG.md`
- PRD: `./PRD_v1.x.md`
- 디자인: `./DESIGN_SYSTEM.md`
- 진행현황: `./PROJECT_TASKS.md`
- 작업상태: `./_context.md`

## 현재 단계
[기획 완료 → 디자인 완료 → 개발 중 등]

## 코딩 규칙
- 컬러 하드코딩 금지 — CSS 변수/토큰 사용
- 간격: 4px 배수만 사용
- 접근성: WCAG AA 대비비 필수
- [프로젝트별 추가 규칙]

## 금기사항
- [절대 하면 안 되는 것들]

## 문서 우선순위
충돌 시 `AGENTS.md`/프로젝트 지침 → `DECISION_LOG.md` → `PRD_*.md` → 운영/브랜드/디자인 문서 → 외부 `SKILL.md` → `_order.md` → 채팅 순서로 판단한다.
장기 결정은 `DECISION_LOG.md`에 기록한다.

## 운영 안정성 규칙
- 대시보드보다 운영 로그를 먼저 만든다.
- 스킬 수정 시 최소 출력 기준을 확인한다.
- 스킬이 길어지면 `SKILL.md` / `REFERENCES.md` / `CHECKLIST.md` 분리를 검토한다.
