import { kv } from '@vercel/kv';
import crypto from 'crypto';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Set CORS headers
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    switch (req.method) {
      case 'GET':
        return await getEntries(req, res);
      case 'POST':
        return await createEntry(req, res);
      case 'DELETE':
        return await deleteEntry(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Guestbook API error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
}

/**
 * GET /api/guestbook
 * 방명록 목록 조회 (최신순)
 */
async function getEntries(req, res) {
  const entries = await kv.lrange('guestbook:entries', 0, -1);

  // 각 엔트리 조회
  const results = [];
  for (const id of entries) {
    const entry = await kv.hgetall(`guestbook:entry:${id}`);
    if (entry) {
      results.push({
        id,
        name: entry.name,
        message: entry.message,
        createdAt: entry.createdAt,
      });
    }
  }

  return res.status(200).json({ entries: results });
}

/**
 * POST /api/guestbook
 * 방명록 등록
 */
async function createEntry(req, res) {
  const { name, password, message } = req.body;

  if (!name || !password || !message) {
    return res.status(400).json({ error: '이름, 비밀번호, 메시지를 모두 입력해주세요' });
  }

  if (name.length > 20 || message.length > 500) {
    return res.status(400).json({ error: '입력 길이를 초과했습니다' });
  }

  const id = crypto.randomUUID();
  const hashedPw = hashPassword(password);
  const now = new Date().toISOString();

  // 엔트리 저장
  await kv.hset(`guestbook:entry:${id}`, {
    name,
    message,
    password: hashedPw,
    createdAt: now,
  });

  // 목록의 앞에 추가 (최신순)
  await kv.lpush('guestbook:entries', id);

  return res.status(201).json({
    id,
    name,
    message,
    createdAt: now,
  });
}

/**
 * DELETE /api/guestbook?id=xxx
 * 방명록 삭제 (비밀번호 확인)
 */
async function deleteEntry(req, res) {
  const { id } = req.query;
  const { password } = req.body;

  if (!id || !password) {
    return res.status(400).json({ error: 'ID와 비밀번호가 필요합니다' });
  }

  const entry = await kv.hgetall(`guestbook:entry:${id}`);
  if (!entry) {
    return res.status(404).json({ error: '메시지를 찾을 수 없습니다' });
  }

  const hashedPw = hashPassword(password);
  if (entry.password !== hashedPw) {
    return res.status(403).json({ error: '비밀번호가 일치하지 않습니다' });
  }

  // 삭제
  await kv.del(`guestbook:entry:${id}`);
  await kv.lrem('guestbook:entries', 0, id);

  return res.status(200).json({ success: true });
}
