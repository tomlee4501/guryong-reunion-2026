/**
 * 2026 구룡중 동창회 — private Google Sheets RSVP backend.
 * Open the dedicated private attendance spreadsheet > Extensions > Apps Script, then run setup().
 * Then Deploy > Web app > Execute as me > Who has access: Anyone.
 * This publicly accessible endpoint requires spam/abuse monitoring.
 */
var SHEET_NAME='참석자';
var DASHBOARD_NAME='운영 요약';
var HEADERS=['신청일시','이름','연락처','회비 납부(Y/N)','메모','요청 ID'];
var ZONE='Asia/Seoul';
var DELETE_AFTER='2027-01-25T18:00:00+09:00';

function setup(){
  // IMPORTANT: Open this script via the private attendance spreadsheet's
  // Extensions > Apps Script menu. Never create a second spreadsheet.
  var book=SpreadsheetApp.getActiveSpreadsheet();
  if(!book)throw Error('Google Sheets > 확장 프로그램 > Apps Script에서 실행해 주세요.');
  var sheet=book.getSheetByName(SHEET_NAME);
  var dashboard=book.getSheetByName(DASHBOARD_NAME);
  if(!sheet||!dashboard)throw Error('참석자 및 운영 요약 탭을 확인해 주세요.');
  var headers=sheet.getRange(1,1,1,HEADERS.length).getDisplayValues()[0];
  if(headers[0]!==HEADERS[0]||headers[1]!==HEADERS[1]||headers[2]!==HEADERS[2]
    ||headers[3]!==HEADERS[3]||headers[4]!==HEADERS[4]
    ||headers[5]!=='요청 ID (자동)'){
      throw Error('시트 열 이름이 일치하지 않습니다. 원본 Google Sheets 구조를 유지해 주세요.');
  }
  PropertiesService.getScriptProperties().setProperty('SHEET_ID',book.getId());
  installCleanupTrigger_();
  Logger.log('연결된 비공개 참석자 시트: '+book.getUrl());
  return book.getUrl();
}
function doPost(e){
  try{
    if(!e||!e.postData||!e.postData.contents)return json_({ok:false,message:'empty'});
    var body=JSON.parse(e.postData.contents);
    if(body.honeypot)return json_({ok:true,ignored:true});
    if(body.source!=='guryong-reunion-2026'||body.consent!==true)return json_({ok:false,message:'invalid'});
    var name=String(body.name||'').trim().replace(/\s+/g,' ');
    var phone=String(body.phone||'').replace(/\D/g,'');
    var requestId=String(body.requestId||'').trim();
    if(name.length<2||name.length>40||!/^[^=+\-@]/.test(name)||!/^01[016789]\d{7,8}$/.test(phone)||!/^[a-zA-Z0-9-]{24,64}$/.test(requestId))
      return json_({ok:false,message:'invalid fields'});
    if(new Date()>new Date(DELETE_AFTER))return json_({ok:false,message:'closed'});
    var lock=LockService.getScriptLock();lock.waitLock(10000);
    try{
      var id=PropertiesService.getScriptProperties().getProperty('SHEET_ID');
      if(!id)throw Error('Run setup() first');
      var sheet=SpreadsheetApp.openById(id).getSheetByName(SHEET_NAME);
      if(!sheet)throw Error('Missing attendee sheet');
      var last=sheet.getLastRow();
      if(last>1){
        var rows=sheet.getRange(2,2,last-1,5).getDisplayValues();
        for(var i=0;i<rows.length;i++){
          if(rows[i][1]===phone||rows[i][4]===requestId)return json_({ok:true,duplicate:true});
        }
      }
      var timestamp=Utilities.formatDate(new Date(),ZONE,'yyyy-MM-dd HH:mm:ss');
      sheet.appendRow([timestamp,name,phone,'N','',requestId]);
      return json_({ok:true,saved:true});
    }finally{lock.releaseLock()}
  }catch(err){console.error('RSVP server error');return json_({ok:false,message:'server error'})}
}
function doGet(){return json_({service:'Guryong Reunion RSVP',status:'ready'})}
function json_(data){return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON)}
function installCleanupTrigger_(){
  var name='purgeAttendeeData';var triggers=ScriptApp.getProjectTriggers();
  if(triggers.some(function(t){return t.getHandlerFunction()===name}))return;
  ScriptApp.newTrigger(name).timeBased().at(new Date(DELETE_AFTER)).create();
}
function purgeAttendeeData(){
  var id=PropertiesService.getScriptProperties().getProperty('SHEET_ID');if(!id)return;
  var sheet=SpreadsheetApp.openById(id).getSheetByName(SHEET_NAME);
  if(sheet&&sheet.getLastRow()>1)sheet.getRange(2,1,sheet.getLastRow()-1,6).clearContent();
  ScriptApp.getProjectTriggers().filter(function(t){return t.getHandlerFunction()==='purgeAttendeeData'})
    .forEach(function(t){ScriptApp.deleteTrigger(t)});
}
