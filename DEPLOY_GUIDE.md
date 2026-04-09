# 웨딩 초대장 - 배포 가이드

## 로컬 실행

```bash
npm install
npm run dev
```

## Supabase 설정

1. [supabase.com](https://supabase.com) → New Project (Seoul 리전)
2. SQL Editor에서 `supabase-schema.sql` 실행
3. Settings → API에서 URL / anon key 복사
4. `.env.example`을 `.env`로 복사 후 값 입력

## Vercel 배포

```bash
npm i -g vercel
vercel --prod
```

또는 GitHub 연동 후 Vercel Dashboard에서 Environment Variables 설정:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_NAVER_MAP_CLIENT_ID` (선택)

## 기술 스택
- Vite + React + TypeScript
- Supabase (PostgreSQL)
- Naver Map (선택)
- Vercel 배포
