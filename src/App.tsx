import {useEffect,useRef,useState,type FormEvent,type ReactNode} from 'react';
import PixelSnow from './components/reactbits/PixelSnow';
import TextLoop from './components/TextLoop';
import {EVENT} from './lib/constants';
import {registrationEnabled,sendRegistration} from './lib/registration';

const fee=EVENT.fee.toLocaleString('ko-KR')+'원';
function SnowBackground(){
  const [reduce,setReduce]=useState(false);
  useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const change=()=>setReduce(media.matches);change();media.addEventListener('change',change);return()=>media.removeEventListener('change',change);},[]);
  return <div className="snow-background" aria-hidden="true"><PixelSnow color="#ffffff" variant="snowflake" density={0.28} speed={0.5} wind={0.15} sway={0.35} flakeSize={0.7} pixelSize={3} depth={0.6} glow={0.25} opacity={0.65} accumulate={false} mouseInteraction={false} paused={reduce}/></div>;
}
function JumpButton({children,className=''}:{children:ReactNode;className?:string}){return <a className={className} href="#rsvp">{children}</a>}
function DateCard(){return <aside className="date-card" aria-label="동창회 일정">
  <div className="date-label">SAVE THE DATE</div>
  <div className="date-large">12.26</div><div className="date-time">SATURDAY / 6 PM</div>
  <div className="date-rule"></div>
  <div className="date-info"><span>VENUE</span><a className="venue-link" href={EVENT.venueUrl} target="_blank" rel="noopener noreferrer">{EVENT.venue} ↗</a><span>FEE</span><strong>{fee}</strong></div>
</aside>}
function BankInfo({compact=false}:{compact?:boolean}){
  const [copied,setCopied]=useState(false);const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
  const copy=async()=>{try{await navigator.clipboard.writeText(EVENT.accountNumber);setCopied(true);if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>setCopied(false),2200)}catch{window.prompt('아래 계좌번호를 복사해 주세요.',EVENT.accountNumber)}};
  return <article className={'bank-card'+(compact?' compact-bank':'')}>
    {!compact&&<span className="section-id">02 / BANK TRANSFER</span>}
    <h3>{compact?'회비 입금':'회비 입금 안내'}</h3>
    {!compact&&<p className="bank-intro">회비는 아래 계좌로 입금해 주세요.</p>}
    <div className="bank-inner"><span className="bank-name">{EVENT.bank}</span><strong className="bank-account">{EVENT.accountNumber}</strong><span className="bank-owner">예금주&nbsp; {EVENT.accountHolder}</span></div>
    <button className="copy-button" type="button" onClick={copy}>{copied?'복사 완료 ✓':'계좌번호 복사 ↗'}</button>
  </article>
}
function Registration(){
  const [name,setName]=useState(''),[phone,setPhone]=useState(''),[consent,setConsent]=useState(false),[trap,setTrap]=useState('');
  const [state,setState]=useState<'idle'|'sending'|'sent'>('idle'),[error,setError]=useState('');
  const request=useRef('');
  const submit=async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();if(!registrationEnabled||state==='sending')return;
    const cleaned=name.trim().replace(/\s+/g,' '),digits=phone.replace(/\D/g,'');
    if(cleaned.length<2||cleaned.length>40){setError('이름을 2~40자로 입력해 주세요.');return}
    if(!/^01[016789]\d{7,8}$/.test(digits)){setError('연락처를 확인해 주세요.');return}
    if(!consent){setError('개인정보 수집·이용 동의가 필요합니다.');return}
    if(trap)return;
    if(!request.current)request.current=crypto.randomUUID();
    setError('');setState('sending');
    try{await sendRegistration({name:cleaned,phone:digits,consent,requestId:request.current,honeypot:trap});setState('sent');}
    catch{setState('idle');setError('전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');}
  };
  if(state==='sent')return <section className="sent-section" id="rsvp" aria-live="polite">
    <div className="sent-tick">✓</div><span className="section-id">RSVP REQUEST SENT</span><h2>신청 정보가 전송되었습니다.</h2>
    <p>운영진이 신청 명단을 확인하기 전까지 접수가 확정된 것은 아닙니다.<br/>회비는 아래 계좌로 입금해 주세요.</p>
    <BankInfo compact/><p className="fine">입금 여부는 운영진이 별도로 확인합니다.</p>
    <button className="return-btn" type="button" onClick={()=>{setState('idle');setName('');setPhone('');setConsent(false);request.current=''}}>새로 신청하기 ↗</button>
  </section>;
  return <section className="rsvp container" id="rsvp" aria-labelledby="rsvp-heading">
    <span className="section-id">03 / RSVP</span><h2 id="rsvp-heading">참석 신청</h2>
    <p className="intro">이름과 연락처만 남기면 됩니다.</p>
    <form onSubmit={submit} noValidate>
      <div className="form-grid">
        <label className="field">이름<input name="name" autoComplete="name" maxLength={40} placeholder="이름을 입력해 주세요" value={name} onChange={e=>setName(e.target.value)} required/></label>
        <label className="field">연락처<input type="tel" inputMode="tel" name="phone" autoComplete="tel" maxLength={16} placeholder="010-0000-0000" value={phone} onChange={e=>setPhone(e.target.value)} required/></label>
      </div>
      <label className="honeypot" aria-hidden="true">회사명<input tabIndex={-1} autoComplete="off" value={trap} onChange={e=>setTrap(e.target.value)}/></label>
      <label className="privacy-check"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>개인정보 수집·이용에 동의합니다 (필수)</span></label>
      <p className="privacy-copy">수집 항목: 이름·연락처 · 목적: 동창회 참석자 확인 및 행사 안내 · 보유 기간: 행사 종료 후 30일 이내 삭제 · 동의 거부 가능(거부 시 신청 불가)</p>
      {error&&<p className="error" role="alert">{error}</p>}
      <button className="submit-btn" type="submit" disabled={!registrationEnabled||state==='sending'}>{state==='sending'?'전송 중…':registrationEnabled?'참석 신청 보내기 ↗':'신청 기능 점검 중'}</button>
      <p className="fine">※ 회비 납부는 운영진이 별도로 확인합니다. 참석자 연락처는 공개하지 않습니다.</p>
    </form>
  </section>;
}
export default function App(){
  const logo=import.meta.env.BASE_URL+'guryong-logo.svg';
  return <>
    <SnowBackground/>
    <div className="site">
      <header className="header container">
        <a href="#top" className="brand"><span className="brand-logo"><img src={logo} alt="구룡중학교 로고"/></span><span className="brand-copy"><strong>GURYONG / REUNION 2026</strong><small>구룡중학교 동창회</small></span></a>
        <span className="header-date">SATURDAY · 26 DEC · 2026</span>
      </header>
      <main id="top">
        <div className="hero container">
          <div className="hero-left"><span className="pill">WINTER REUNION / 2026</span>
            <h1>구룡중 <span>동창회</span></h1>
            <p className="hero-caption">2026년 12월 26일 (토)<br/>오후 6시 · 강남역</p>
            <div className="hero-actions"><JumpButton className="cta">참석 신청하기 <span>↗</span></JumpButton><span className="scroll-text">SCROLL FOR DETAILS</span></div>
          </div>
          <DateCard/>
        </div>
        <TextLoop/>
        <div className="details container">
          <section className="details-content"><span className="section-id">01 / THE DETAILS</span><h2>행사 안내</h2>
            <dl className="detail-rows"><div><dt>일시</dt><dd>{EVENT.dateLabel} · {EVENT.timeLabel}</dd></div><div><dt>장소</dt><dd className="venue-detail"><a href={EVENT.venueUrl} target="_blank" rel="noopener noreferrer" className="venue-link">{EVENT.venue} ↗</a><span className="venue-address">{EVENT.venueAddress}</span><a className="venue-map-link" href={EVENT.venueUrl} target="_blank" rel="noopener noreferrer">네이버 지도에서 보기 <span aria-hidden="true">↗</span></a></dd></div><div><dt>회비</dt><dd>{fee}</dd></div></dl>
          </section>
          <BankInfo/>
        </div>
        <Registration/>
      </main>
      <footer className="footer container"><strong>GURYONG REUNION 2026</strong><span>2026.12.26 / SATURDAY / 18:00</span></footer>
    </div>
  </>;
}
