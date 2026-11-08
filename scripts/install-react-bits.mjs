import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const commit='4dc7b5b7772e1217c8fb8d2a7aa074302180e5b4';
const base='https://raw.githubusercontent.com/DavidHDev/react-bits/'+commit+'/src/ts-default/Backgrounds/PixelSnow/';
const dest=join(process.cwd(),'src','components','reactbits');
await mkdir(dest,{recursive:true});
for(const name of ['PixelSnow.tsx','PixelSnow.css']){
  const response=await fetch(base+name,{signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw Error('Cannot download React Bits '+name+': '+response.status);
  const contents=await response.text();
  if(contents.length<100)throw Error('Invalid React Bits file '+name);
  await writeFile(join(dest,name),contents,'utf8');
  console.log('Installed official React Bits '+name+' @ '+commit.slice(0,7));
}
