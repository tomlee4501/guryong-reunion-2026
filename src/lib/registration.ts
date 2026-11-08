const endpoint = import.meta.env.VITE_RSVP_ENDPOINT?.trim() ?? '';
export const registrationEnabled = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(endpoint);
export type Registration = {name:string;phone:string;consent:boolean;requestId:string;honeypot:string};
export async function sendRegistration(data:Registration):Promise<void> {
  if (!registrationEnabled) throw new Error('신청 접수 준비 중입니다.');
  // Apps Script cross-origin responses are opaque. A resolved request does NOT prove row persistence.
  await fetch(endpoint, {method:'POST', mode:'no-cors', redirect:'follow',
    headers:{'Content-Type':'text/plain;charset=UTF-8'},
    body:JSON.stringify({...data,source:'guryong-reunion-2026'})});
}
