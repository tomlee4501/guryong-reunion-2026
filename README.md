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

## Google Sheets 신청 접수 (아직 미연결)

**신청 버튼은 Google Apps Script API 설정 전까지 비활성화됩니다.** 실제 동창생 이름/연락처는 절대로 GitHub에 올리지 마세요.

1. 동창회 담당자의 Google 계정에서 새 Google Apps Script 프로젝트를 만들고 `apps-script/Code.gs`를 붙여넣습니다.
2. `setup()`을 한 번 실행하고 인증하면, 비공개 Google Sheets를 생성합니다. 실행 로그에 시트 주소가 나옵니다.
3. 앱 스크립트를 Web app으로 배포합니다 (실행: Me, 접근: Anyone).
4. GitHub repo **Settings → Secrets and variables → Actions → Variables**에 `VITE_RSVP_ENDPOINT`를 웹앱 /exec URL로 등록합니다. 이 변수는 브라우저에 공개되므로 비밀 토큰은 넣지 않습니다.
5. Actions workflow를 수동으로 재실행한 뒤 테스트 신청이 비공개 시트에 들어가는지 확인합니다.

시트의 열: 신청일시 / 이름 / 연락처 / **회비 납부(Y/N)** / 메모 / 요청 ID(숨김). 새 신청은 기본 N이며, 친구가 Y로 바꾸면 운영 요약 탭의 입금자 수와 입금 총액에 반영됩니다. 중복 연락처와 중복 요청 ID를 거부합니다. 자동 보유기간 종료 트리거: 2027-01-25.

**주의:** GitHub Pages의 브라우저에서 Apps Script에 `no-cors`로 보내면 응답 성공 여부를 알 수 없습니다. 따라서 사이트에서는 제출 성공을 단정하지 않고 '정보가 전송되었습니다. 운영진 확인 전 접수 확정 아님'이라고 안내합니다. 실서비스 접수 전에는 실제 구글 시트 저장 검증, 스팸/남용 방지, 운영진의 개인정보 동의 및 삭제 정책 확인이 필요합니다. 신뢰 가능한 접수 상태 확인이 필요하다면 별도 무료 서버리스 API를 권장합니다.

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
