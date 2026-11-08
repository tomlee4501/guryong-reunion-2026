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

## Google Sheets 신청 접수 (라이브 연결 완료)

**보안:** 실제 이름과 연락처는 GitHub에 올리지 않습니다. Google Sheets 파일은 비공개로 유지하고, 운영진 이메일에만 편집 권한을 부여합니다.

비공개 Google Sheets와 Apps Script를 연결했고, 가상 신청 1건으로 `010` 앞자리 보존 및 기본 `N` 저장을 검증했습니다. 테스트 행은 삭제했습니다. 향후 유지보수 절차는 다음과 같습니다.

1. Google Sheets 메뉴 **확장 프로그램 → Apps Script**를 클릭합니다. **새 독립 Apps Script 프로젝트가 아니라 이 시트에 연결된 프로젝트**여야 합니다.
2. `apps-script/Code.gs` 전체를 기존 `Code.gs`에 붙여넣고 저장합니다.
3. 상단 함수 목록에서 `setup`을 선택하고 **실행** → Google 권한 승인. 기존 시트 2개를 검증하며 **새 시트를 생성하지 않습니다**.
4. **배포 → 새 배포 → 유형: 웹 앱**을 선택하고 '실행 사용자: 나', '액세스 권한: 모든 사용자'로 설정하여 배포합니다.
5. 웹앱 `/exec` URL은 GitHub Actions의 전용 `VITE_RSVP_ENDPOINT` 빌드 설정에 연결돼 있습니다. URL은 공개 프런트엔드에도 포함되므로 비밀 키를 넣지 마세요.
6. Apps Script 배포를 수정하거나 URL을 바꿀 때만 GitHub Actions 설정을 수정하여 재배포합니다.
7. 운영자가 비공개 시트에서 신규 신청, 중복 방지, 회비 `Y/N` 변경 여부를 정기적으로 확인합니다.

관리 시트 구성: `참석자` 탭의 신청일시 / 이름 / 연락처 / 회비 납부(Y/N) / 메모 / 숨겨진 요청 ID, `운영 요약` 탭의 신청 인원 · 입금 인원 · 미입금 인원 · 입금 총액 · 납부율. Apps Script는 새 행의 회비를 기본 N으로 기록합니다.

브라우저에서 Apps Script로 `mode: no-cors` 요청을 보내기 때문에 프런트엔드는 응답 본문을 확인할 수 없습니다. 따라서 웹사이트의 전송 완료 메시지는 **서버의 시트 저장 보증이 아닙니다**. 서버의 실저장 검증은 완료했으나, 브라우저별 제출 동작에 대해서는 별도 실기기 QA가 필요합니다. 공개 Apps Script URL은 봇/스팸 대상이 될 수 있으므로 소규모 초대 대상자에게만 링크를 배포하고 시트 접근권한을 제한하세요. Apps Script의 `purgeAttendeeData` 트리거는 행사 30일 후 개인 정보를 자동 삭제하도록 설계되었습니다.

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

### 2026-11-08 검증 결과

Apps Script 실제 E2E 테스트에서는 Google Sheets가 숫자처럼 보이는 연락처의 첫 0을 제거하는 동작을 확인했습니다. 수정된 `apps-script/Code.gs`는 전화번호를 텍스트로 기록하도록 조정했습니다. 스크립트를 다시 배포하고 휴대전화 번호가 온전히 저장되는지 재검증하기 전까지 `VITE_RSVP_ENDPOINT`는 의도적으로 비워 실제 신청 버튼을 막습니다. 일회성 테스트 스텝은 GitHub Actions에서 제거했습니다.

최신 배포의 연락처 문자열 저장 수정이 적용된 Apps Script에서, 실제 테스트 신청의 전화번호가 **01000000000**으로 온전히 표시되고 기본 회비 상태가 **N**인지 확인한 뒤 테스트 행을 삭제했습니다. 동일 테스트를 자동 배포마다 반복하지 않도록 일회성 검증 스텝을 제거했습니다. 웹사이트 신청 폼은 공개 상태이지만 Apps Script `no-cors` 구조상 전송 완료 표시는 시트 저장을 확정해 주지 않습니다.
