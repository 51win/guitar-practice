import { getStore } from '@netlify/blobs';

const ALLOWED_ORIGINS = new Set([
  'https://51win.github.io',
  'https://guitar-practice-chat-51win.netlify.app',
  'http://127.0.0.1:4173',
  'http://localhost:4173',
]);

export function validateMessage(value) {
  const nickname = typeof value?.nickname === 'string' ? value.nickname.replace(/\s+/g, ' ').trim() : '';
  const message = typeof value?.message === 'string' ? value.message.replace(/\r\n?/g, '\n').trim() : '';
  const client = typeof value?.client === 'string' && /^[a-z0-9-]{8,80}$/i.test(value.client) ? value.client : '';
  if (nickname.length < 1 || nickname.length > 20) throw Error('닉네임은 1~20자로 입력해주세요.');
  if (message.length < 1 || message.length > 300) throw Error('메시지는 1~300자로 입력해주세요.');
  if (!client) throw Error('브라우저 식별값을 확인할 수 없습니다.');
  return { nickname, message, client };
}

function headers(origin) {
  const result = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', vary: 'Origin' };
  if (ALLOWED_ORIGINS.has(origin)) result['access-control-allow-origin'] = origin;
  return result;
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), { status, headers: headers(origin) });
}

export default async function chat(request) {
  const origin = request.headers.get('origin') || '';
  if (request.method === 'OPTIONS') {
    if (!ALLOWED_ORIGINS.has(origin)) return json({ error: '허용되지 않은 화면입니다.' }, 403, origin);
    return new Response(null, { status: 204, headers: { ...headers(origin), 'access-control-allow-methods': 'GET, POST, OPTIONS', 'access-control-allow-headers': 'content-type' } });
  }
  if (origin && !ALLOWED_ORIGINS.has(origin)) return json({ error: '허용되지 않은 화면입니다.' }, 403, origin);

  const store = getStore({ name: 'guitar-practice-chat', consistency: 'strong' });
  if (request.method === 'GET') {
    const { blobs } = await store.list({ prefix: 'messages/' });
    const recent = blobs.sort((a, b) => a.key.localeCompare(b.key)).slice(-100);
    const messages = (await Promise.all(recent.map(async ({ key }) => {
      try { return JSON.parse(await store.get(key)); } catch { return null; }
    }))).filter(Boolean);
    return json({ messages }, 200, origin);
  }
  if (request.method !== 'POST') return json({ error: '지원하지 않는 요청입니다.' }, 405, origin);
  if (!ALLOWED_ORIGINS.has(origin)) return json({ error: '허용되지 않은 화면입니다.' }, 403, origin);

  let value;
  try { value = validateMessage(await request.json()); }
  catch (error) { return json({ error: error.message || '입력을 확인해주세요.' }, 400, origin); }
  const createdAt = new Date().toISOString(), id = `${Date.now()}-${crypto.randomUUID()}`;
  const record = { id, ...value, createdAt };
  await store.set(`messages/${id}`, JSON.stringify(record));
  return json({ message: record }, 201, origin);
}

export const config = {
  path: '/api/chat',
  rateLimit: { windowLimit: 90, windowSize: 60, aggregateBy: ['ip', 'domain'] },
};
