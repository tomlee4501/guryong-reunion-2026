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
  assert.match(read('src/App.tsx'),/신청 접수 준비 중/);
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
  assert.match(vendor,/<tspan dy=\{textBaselineOffset\}>\{loopText\}<\/tspan>/);
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

test('RSVP stays disabled until corrected Apps Script is deployed and verified',()=>{
  const workflow=read('.github/workflows/deploy.yml');
  const script=read('apps-script/Code.gs');
  assert.match(workflow,/VITE_RSVP_ENDPOINT: ''/);
  assert.doesNotMatch(workflow,/--post-test/);
  assert.match(script,/"'"\+phone/);
});
