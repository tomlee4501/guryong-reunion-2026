import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('Guryong factual info, account and separate GitHub Pages base',()=>{
  const c=read('src/lib/constants.ts'),vite=read('vite.config.ts');
  for(const s of ['2026-12-26','오후 6시','50_000','937702-00-089624','유승배']) assert.ok(c.includes(s));
  assert.match(vite,/guryong-reunion-2026/);assert.doesNotMatch(vite,/invited\.kr|invited-staging/i);
});
test('RSVP disabled before endpoint configuration',()=>{
  assert.match(read('src/lib/registration.ts'),/registrationEnabled/);
  assert.match(read('src/lib/registration.ts'),/mode:'no-cors'/);
  assert.doesNotMatch(read('src/App.tsx'),/신청 접수 준비 중/);
});
test('Apps Script validation, duplicate suppression and default N',()=>{
  const data=[['신청일시','이름','연락처','회비 납부(Y/N)','메모','요청 ID']];
  const sheet={getLastRow:()=>data.length,getRange:(row,col,count,cols)=>({getDisplayValues:()=>data.slice(row-1,row-1+count).map(r=>r.slice(col-1,col-1+cols))}),appendRow:r=>data.push(r)};
  const ctx={console,PropertiesService:{getScriptProperties:()=>({getProperty:()=> 'sheet'})},SpreadsheetApp:{openById:()=>({getSheetByName:()=>sheet})},LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},ContentService:{MimeType:{JSON:'json'},createTextOutput:s=>({setMimeType:()=>s})},Utilities:{formatDate:()=> '2026-11-08 12:00:00'},Date};
  runInNewContext(read('apps-script/Code.gs'),ctx);
  const post=b=>JSON.parse(ctx.doPost({postData:{contents:JSON.stringify(b)}}));
  const base={source:'guryong-reunion-2026',name:'홍길동',phone:'01012345678',consent:true,requestId:'a7a7a7a7-9999-4999-8999-a7a7a7a7a7a7',honeypot:''};
  assert.equal(post(base).saved,true);assert.equal(data[1][3],'N');assert.equal(data[1][2],"'01012345678");assert.equal(data.length,2);
  assert.equal(post({...base,requestId:'b7a7a7a7-9999-4999-8999-a7a7a7a7a7a7'}).duplicate,true);assert.equal(data.length,2);
  assert.equal(post({...base,name:'=IMPORTXML("evil")',phone:'01099887766'}).ok,false);
});

test('React Bits ribbon fits the section and preserves global Pixel Snow',()=>{
  const css=read('src/styles.css'),loop=read('src/components/TextLoop.tsx');
  assert.match(css,/\.loop-section\{[^}]*background:transparent/);
  assert.match(css,/\.loop-ribbon-stage \.text-loop-svg\{[^}]*clamp\(960px,100%,1800px\)/);
  assert.match(css,/mask-image:linear-gradient/);
  assert.match(css,/\.loop-section\{height:190px\}/);
  assert.match(loop,/curviness=\{24\}/);
  assert.match(loop,/ribbonWidth=\{52\}/);
  assert.match(loop,/fontSize=\{32\}/);
  assert.match(loop,/text=\{LOOP_LINES\.join/);
});

test('Mobile ribbon adjusts glyph baseline, not the ribbon or desktop canvas',()=>{
  const vendor=read('src/components/reactbits/TextLoop.tsx');
  const wrapper=read('src/components/TextLoop.tsx');
  assert.match(vendor,/textBaselineOffset\?: number/);
  assert.match(vendor,/dy=\{textBaselineOffset\}/);
  assert.doesNotMatch(vendor,/<tspan dy=\{textBaselineOffset\}>/);
  assert.match(vendor,/mobileSafeSpacing \? Math\.floor : Math\.round/);
  assert.match(wrapper,/mobileSafeSpacing=\{isMobile\}/);
  assert.match(wrapper,/textBaselineOffset=\{isMobile \? 11 : 0\}/);
  assert.match(wrapper,/max-width: 760px/);
  assert.match(wrapper,/shape="wave"/);
});

test('Apps Script setup binds current private sheet instead of making a second workbook',()=>{
  const code=read('apps-script/Code.gs');
  assert.match(code,/SpreadsheetApp\.getActiveSpreadsheet\(\)/);
  assert.doesNotMatch(code,/SpreadsheetApp\.create\(/);
  assert.match(code,/setProperty\('SHEET_ID',book\.getId\(\)\)/);
});

test('RSVP endpoint is configured after successful leading-zero integration check',()=>{
  const workflow=read('.github/workflows/deploy.yml');
  const script=read('apps-script/Code.gs');
  const registration=read('src/lib/registration.ts');
  assert.match(workflow,/VITE_RSVP_ENDPOINT: https:\/\/script\.google\.com\/macros\/s\/AKfycb/);
  assert.doesNotMatch(workflow,/--post-test/);
  assert.match(script,/"'"\+phone/);
  assert.match(registration,/registrationEnabled/);
});

test('Confirmed venue opens exact Naver Place without changing event date or payment',()=>{
 const c=read('src/lib/constants.ts'),app=read('src/App.tsx');
 assert.match(c,/언디파인 파티룸 강남본점/);
 assert.match(c,/서울 강남구 강남대로96길 18, 4층/);
 assert.match(c,/2052323320/);
 assert.match(app,/rel="noopener noreferrer"/);
 assert.match(app,/네이버 지도에서 보기/);
});

test('22nd cohort branding, requested message and updated form copy',()=>{
  const app=read('src/App.tsx'),data=read('src/lib/constants.ts'),loop=read('src/components/TextLoop.tsx'),html=read('index.html'),css=read('src/styles.css'),og=read('public/og-preview.svg');
  assert.match(data,/구룡중 22기 동창회/);
  assert.match(loop,/구룡중 22기 동창회/);
  assert.match(app,/22기 동창회/);
  for(const exact of ["22기 구룡중학교 졸업생 여러분~ 다들 잘 지내고 있길 바래 !","어느덧 세월이 흘러 본격적인 30대를 앞두고 있네. 10대와 20대를 지나오며 쌓아온 수많은 경험들이 이제는 각자의 삶을 만들어가는 소중한 자산이 되어가고 있는 것 같아.","그런 의미에서 하루쯤은 바쁜 일상도, 각자의 고민도 잠시 내려놓고 우리의 10대를 추억해 보는 건 어떨까?","그때 그 시절로 돌아가 별것 아닌 이야기에도 웃고 떠들며, 오랜만에 실컷 수다 한번 떨어보자~"]) assert.ok(app.includes(exact),'Missing an invitation paragraph');
  assert.match(app,/원활한 동창회 준비를 위해 회비는 아래 계좌로 입금 부탁해!/);
  assert.match(app,/참석 신청은 이름과 연락처만 남겨주면 돼/);
  assert.match(html,/<title>구룡중 22기 동창회/);
  assert.match(og,/22기 동창회/);
  assert.match(css,/\.hero-message/);
});

test('Mobile wave uses safe repeat spacing and direct SVG text baseline',()=>{
 const vendor=read('src/components/reactbits/TextLoop.tsx');
 const wrapper=read('src/components/TextLoop.tsx');
 const labels=read('src/lib/constants.ts');
 assert.match(vendor,/mobileSafeSpacing \? Math\.floor : Math\.round/);
 assert.match(vendor,/\[d, crossD, unit, fontSize, fontWeight, letterSpacing, mobileSafeSpacing\]/);
 assert.doesNotMatch(vendor,/<tspan dy=/);
 assert.match(wrapper,/mobileSafeSpacing=\{isMobile\}/);
 assert.match(labels,/구룡중 22기 동창회/);
 assert.match(labels,/2026년 12월 26일 오후 6시/);
});
