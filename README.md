# Guryong Reunion 2026

2026 구룡중학교 동창회 신청 사이트. **Invited 앱과 저장소, Supabase, Vercel 또는 도메인을 공유하지 않는 완전히 별도의 프로젝트**입니다.

- Figma: https://www.figma.com/design/GPPvySOhB3JL03rt1tWawv?node-id=10-2
- 일정: 2026년 12월 26일 토요일 오후 6시 · 장소 추후 공지
- 회비: 50,000원 · KB국민은행 937702-00-089624 · 예금주 유승배
- 디자인: React 19 + TypeScript + Vite + CSS, React Bits Pixel Snow
- 운영 주소(배포 후): https://tomlee4501.github.io/guryong-reunion-2026/

## 개발

```bash
npm install
npm run setup:reactbits
npm run dev
npm test
npm run build
```

React Bits Pixel Snow는 `scripts/install-react-bits.mjs`로 [공식 React Bits 저장소](https://github.com/DavidHDev/react-bits)의 고정된 커밋에서 설치합니다. GitHub Actions는 배포 빌드 전에 해당 설치를 실행합니다. 로컬 백업 컴포넌트는 공식 컴포넌트가 설치되지 않았을 때를 위한 것이며, React Bits 라이선스(MIT + Commons Clause)를 준수해야 합니다. Text Loop는 React Bits의 공식 SVG 곡선 리본 마키 컴포넌트를 `src/components/reactbits/TextLoop.tsx`에 고정 커밋 `4dc7b5b` 기준으로 포함한 것이며, `src/components/TextLoop.tsx`는 행사 정보 및 사이트 팔레트를 적용합니다. 문구는 ‘구룡중학교 동창회’와 ‘2026년 12월 26일 오후 6시’ 두 개만 계속 반복합니다. 모션 축소 설정에서는 정적 행사 정보를 표시합니다.

## GitHub Pages 배포

1. Repository **Settings → Pages → Build and deployment → Source: GitHub Actions**로 변경합니다.
2. Actions 탭의 **Deploy Guryong Reunion to GitHub Pages**가 완료될 때까지 기다리고 결과를 확인합니다.
3. 페이지가 뜨는지, 모바일 레이아웃과 Pixel Snow가 정상인지 확인합니다.

## Google Sheets 신청 접수 (웹 앱 연결 검사 중)

**보안:** 실제 이름과 연락처는 GitHub에 올리지 않습니다. Google Sheets 파일은 비공개로 유지하고, 운영진 이메일에만 편집 권한을 부여합니다.

이미 전용 Google Sheets 파일을 생성했습니다. Google 계정에서 해당 **비공개 시트**를 열어 다음과 같이 진행합니다.

1. Google Sheets 메뉴 **확장 프로그램 → Apps Script**를 클릭합니다. **새 독립 Apps Script 프로젝트가 아니라 이 시트에 연결된 프로젝트**여야 합니다.
2. `apps-script/Code.gs` 전체를 기존 `Code.gs`에 붙여넣고 저장합니다.
3. 상단 함수 목록에서 `setup`을 선택하고 **실행** → Google 권한 승인. 기존 시트 2개를 검증하며 **새 시트를 생성하지 않습니다**.
4. **배포 → 새 배포 → 유형: 웹 앱**을 선택하고 '실행 사용자: 나', '액세스 권한: 모든 사용자'로 설정하여 배포합니다.
5. 배포된 `https://script.google.com/macros/s/.../exec` 주소를 복사합니다. GitHub 저장소의 **Settings → Secrets and variables → Actions → Variables**에서 `VITE_RSVP_ENDPOINT` 값을 설정합니다. 이 변수는 공개 브라우저에 노출되므로 비밀 토큰이 아닙니다.
6. GitHub **Actions → Deploy Guryong Reunion to GitHub Pages → Run workflow**를 실행합니다.
7. 사이트에서 **가상의 시험 신청 1건**을 전송하고 비공개 시트에서 정확히 1행 추가 및 회비 'N', 관리 요약 1명 계산을 검증한 뒤 테스트 행을 삭제합니다. 실운영 전 정상 동작을 꼭 확인합니다.

관리 시트 구성: `참석자` 탭의 신청일시 / 이름 / 연락처 / 회비 납부(Y/N) / 메모 / 숨겨진 요청 ID, `운영 요약` 탭의 신청 인원 · 입금 인원 · 미입금 인원 · 입금 총액 · 납부율. Apps Script는 새 행의 회비를 기본 N으로 기록합니다.

브라우저에서 Apps Script로 `mode: no-cors` 요청을 보내기 때문에 프런트엔드는 응답 본문을 확인할 수 없습니다. 따라서 웹사이트의 전송 완료 메시지는 **서버의 시트 저장 보증이 아닙니다**. 시트에서 실제 저장을 검증하기 전에는 실접수를 시작하지 마세요. 공개 Apps Script URL은 봇/스팸 대상이 될 수 있으므로 소규모 초대 대상자에게만 링크를 배포하고 시트 접근권한을 제한하세요. Apps Script의 `purgeAttendeeData` 트리거는 행사 30일 후 개인 정보를 자동 삭제하도록 설계되었습니다.

## 테스트

```bash
npm test
```

정적 설정 및 Apps Script 데이터 검증 테스트 3개 포함. GitHub Actions에서 빌드·테스트 자동 검증. 개인 정보 및 시트 ID/접근 토큰을 Git에 저장하지 않습니다.

## React Bits Text Loop 구현

- 출처: https://reactbits.dev/text-animations/text-loop
- 원본: `DavidHDev/react-bits` / `src/ts-default/TextAnimations/TextLoop` @ `4dc7b5b` (원본 컴포넌트와 CSS)
- 효과: wave shape + #DFFF7A lime ribbon + #15171E text / 행사정보 2개를 연속 마키
- 원래의 문장 전환/페이지네이션 UI는 제거하였습니다.

Google Apps Script 웹앱 주소는 공개 신청 API이며 GitHub Pages 정적 번들에 포함됩니다. 비밀키는 넣지 않습니다. 허가 없는 대량 등록이나 테스트 요청은 금지되며, 연동 테스트용 가상 신청 행은 확인 후 삭제합니다.
