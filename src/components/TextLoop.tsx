import { useEffect, useState } from 'react';
import { LOOP_LINES } from '../lib/constants';

export default function TextLoop() {
  const [active,setActive]=useState(0);
  const [reduced,setReduced]=useState(false);
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setReduced(media.matches); update();
    media.addEventListener('change',update);
    return ()=>media.removeEventListener('change',update);
  },[]);
  useEffect(()=>{
    if(reduced) return;
    const timer=window.setInterval(()=>{if(!document.hidden) setActive(i=>(i+1)%LOOP_LINES.length)},3200);
    return ()=>window.clearInterval(timer);
  },[reduced]);
  return <section className="loop-section" aria-label="동창회 주요 정보">
    <div className="container loop-inner">
      <span className="kicker">EVENT INFORMATION / 2026</span>
      <div className="loop-motion" aria-live="off"><div className="loop-current" key={active}>{LOOP_LINES[active]}</div></div>
      <div className="loop-pagination" role="group" aria-label="행사 정보 선택">
        {LOOP_LINES.map((text,i)=><button className={'loop-dot'+(active===i?' active':'')} type="button"
          key={text} aria-label={text+' 보기'} aria-pressed={active===i} onClick={()=>setActive(i)} />)}
      </div>
      <span className="sr-only">{LOOP_LINES.join('. ')}</span>
    </div>
  </section>;
}
