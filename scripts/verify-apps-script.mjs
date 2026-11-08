/**
 * One-time synthetic E2E check for Google Apps Script.
 * No real attendee data is sent. Must not remain in automatic deploy steps.
 */
import { randomUUID } from 'node:crypto';

const endpoint = process.env.VITE_RSVP_ENDPOINT?.trim() ?? '';
if (!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(endpoint)) {
  throw new Error('VITE_RSVP_ENDPOINT is absent or malformed');
}
async function request(url, options = {}) {
  const response = await fetch(url, { ...options, redirect: 'follow', signal: AbortSignal.timeout(25000) });
  const content = await response.text();
  let payload;
  try { payload = JSON.parse(content); } catch { throw new Error('Expected JSON from Apps Script; received HTTP ' + response.status); }
  if (!response.ok) throw new Error('Apps Script HTTP status: ' + response.status);
  return payload;
}
const status = await request(endpoint);
if (status.service !== 'Guryong Reunion RSVP' || status.status !== 'ready') {
  throw new Error('Unexpected Apps Script health response');
}
console.log('Apps Script GET health: PASS');
if (process.argv.includes('--post-test')) {
  const requestId = 'guryong-e2e-' + (process.env.GITHUB_SHA || randomUUID()).slice(0,40);
  const body = {
    source:'guryong-reunion-2026',
    name:'연동테스트',
    phone:'01000000000',
    consent:true,
    honeypot:'',
    requestId
  };
  const result = await request(endpoint, {
    method:'POST',
    headers:{ 'Content-Type':'text/plain;charset=UTF-8' },
    body: JSON.stringify(body)
  });
  if (!(result.ok === true && (result.saved === true || result.duplicate === true))) {
    throw new Error('Apps Script POST did not confirm persistence: ' + JSON.stringify(result));
  }
  console.log('Apps Script POST synthetic RSVP: PASS (verify and delete row in private Sheet)');
}
