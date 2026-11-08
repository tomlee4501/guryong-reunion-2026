/**
 * 2026 구룡중 동창회 — private Google Sheets RSVP backend.
 * Execute setup() in a dedicated organizer-owned Google Apps Script account.
 * Then Deploy > Web app > Execute as me > Who has access: Anyone.
 * This publicly accessible endpoint requires spam/abuse monitoring.
 */
var SHEET_NAME='참석자';
var DASHBOARD_NAME='운영 요약';
var HEADERS=['신청일시','이름','연락처','회비 납부(Y/N)','메모','요청 ID'];
var ZONE='Asia/Seoul';
var DELETE_AFTER='2027-01-25T18:00:00+09:00';

function setup(){
  var props=PropertiesService.getScriptProperties();
  var existingId=props.getProperty('SHEET_ID');
  var book=existingId?SpreadsheetApp.openById(existingId):SpreadsheetApp.create('2026 구룡중 동창회 참석자 관리');
  if(!existingId) props.setProperty('SHEET_ID',book.getId());
  var sheet=book.getSheetByName(SHEET_NAME)||book.insertSheet(SHEET_NAME);
  sheet.getRange(1,1,1,HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
  sheet.getRange('A1:F1').setBackground('#17188f').setFontColor('#ffffff').setFontWeight('bold');
  sheet.setColumnWidth(1,175);sheet.setColumnWidth(2,135);sheet.setColumnWidth(3,145);sheet.setColumnWidth(4,155);sheet.setColumnWidth(5,220);
  sheet.getRange('C2:C10000').setNumberFormat('@');
  sheet.getRange('D2:D10000').setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['Y','N'],true).setAllowInvalid(false).build());
  sheet.hideColumns(6);
  var dashboard=book.getSheetByName(DASHBOARD_NAME)||book.insertSheet(DASHBOARD_NAME);
  dashboard.getRange('A1:B5').setValues([
    ['구룡중학교 동창회 / 회비 관리',''],
    ['신청자 수',"=COUNTA('참석자'!B2:B)"],
    ['입금 완료(Y)',"=COUNTIF('참석자'!D2:D,\"Y\")"],
    ['미입금(N)',"=COUNTIF('참석자'!D2:D,\"N\")"],
    ['입금 총액 (원)','=B3*50000']
  ]);
  dashboard.getRange('A1:B1').setBackground('#17188f').setFontColor('#ffffff').setFontWeight('bold');
  dashboard.setColumnWidth(1,240);dashboard.setColumnWidth(2,190);
  installCleanupTrigger_();
  Logger.log('운영진용 스프레드시트: '+book.getUrl());
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
