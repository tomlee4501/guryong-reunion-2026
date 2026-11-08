import {useEffect,useRef,type HTMLAttributes} from 'react';
import './PixelSnow.css';
export type PixelSnowProps=HTMLAttributes<HTMLDivElement>&{color?:string;variant?:'snowflake'|'square'|'round';density?:number;speed?:number;wind?:number;sway?:number;flakeSize?:number;pixelSize?:number;opacity?:number;glow?:number;paused?:boolean;depth?:number;accumulate?:boolean;mouseInteraction?:boolean};
export default function PixelSnow({color='#fff',density=.28,speed=.5,wind=.15,sway=.35,pixelSize=3,opacity=.65,paused=false,className='',variant: _variant,flakeSize:_flakeSize,glow:_glow,depth:_depth,accumulate:_accumulate,mouseInteraction:_mouseInteraction,...rest}:PixelSnowProps){
  void _variant;void _flakeSize;void _glow;void _depth;void _accumulate;void _mouseInteraction;
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{const canvas=ref.current;if(!canvas)return;const ctx=canvas.getContext('2d');if(!ctx)return;
    let frame=0,width=0,height=0,flakes:{x:number;y:number;size:number}[]=[];
    const resize=()=>{width=canvas.clientWidth;height=canvas.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);flakes=Array.from({length:Math.min(140,Math.round(width*height/18000*density*4))},()=>({x:Math.random()*width,y:Math.random()*height,size:1+Math.random()*2}));};
    const obs=new ResizeObserver(resize);obs.observe(canvas);resize();
    const draw=()=>{ctx.clearRect(0,0,width,height);ctx.fillStyle=color;ctx.globalAlpha=opacity;
      for(const f of flakes){f.y+=speed*(.4+f.size*.35);f.x+=wind*.03+Math.sin(f.y*.01)*sway*.1;if(f.y>height){f.y=-4;f.x=Math.random()*width}ctx.fillRect(Math.round(f.x),Math.round(f.y),Math.max(1,Math.round(pixelSize*f.size*.25)),Math.max(1,Math.round(pixelSize*f.size*.25)))}
      if(!paused)frame=requestAnimationFrame(draw);};draw();return()=>{cancelAnimationFrame(frame);obs.disconnect();};
  },[color,density,speed,wind,sway,pixelSize,opacity,paused]);
  return <div className={'pixel-snow-container '+className} {...rest}><canvas className="pixel-snow-canvas" ref={ref} aria-hidden="true"/></div>;
}
