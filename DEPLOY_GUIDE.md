# 모바일 청첩장 프로젝트 및 배포 가이드

## 프로젝트 개요

진욱·한슬의 모바일 청첩장입니다. 현재 예식 정보는 **2027년 6월 5일 토요일 오전 11시, 루클라비 수원 라비에벨 홀**로 입력되어 있습니다. Next.js 16 App Router, React 19, TypeScript로 만들었고, 참석 여부는 Supabase에 저장합니다. 사진은 Cloudinary에서 불러오며 네이버 지도와 카카오톡 공유 기능을 사용합니다.

화면 순서는 **첫 화면 → 신랑·신부 소개 → 예식 일정 → 우리의 순간 → 안내사항 → 오시는 길 → 참석 여부 전달 → 마음 전하실 곳 → 공유/링크 복사**입니다. 모바일 폭을 기준으로 한 단일 페이지입니다.

| 기능 | 현재 동작 |
| --- | --- |
| 우리의 순간 | 사진을 3열로 배치하고 처음 9장만 표시합니다. 10장 이상일 때만 `더보기`가 나타납니다. 사진을 누르면 크게 볼 수 있고, 이전/다음 버튼·키보드 방향키·모바일 터치 스와이프·PC 마우스 드래그로 이동합니다. 자동 넘김은 없습니다. |
| 참석 여부 전달 | 페이지 안의 양식에서 이름, 신랑/신부 측, 참석 여부, 동행 인원을 받아 `/api/rsvp`로 전송합니다. |
| 마음 전하실 곳 | 신랑/신부 측 계좌를 펼쳐 보고 계좌번호를 복사할 수 있습니다. |
| 오시는 길 | 예식장 주소, 네이버 지도, 교통편과 주차 안내를 표시합니다. 지도 키가 없으면 네이버 지도 링크를 여는 대체 화면이 나타납니다. |
| 카카오톡 공유 | 페이지 하단 공유 버튼은 사진과 `청첩장 보기` 버튼이 포함된 메시지를 보냅니다. URL만 붙여 넣어 공유하면 `app/layout.tsx`의 Open Graph 정보가 사용됩니다. |

축하 메시지 입력란과 별도의 방명록 화면은 현재 주석 처리되어 있습니다. `/api/guestbook` API와 `guestbook` 테이블 정의는 남아 있습니다. **안내사항 세 문구는 임시 예시**이므로 실제 안내로 교체해야 합니다.

## 주요 파일

| 파일 | 역할 |
| --- | --- |
| `app/page.tsx` | 섹션 순서와 지도·카카오 키 전달 |
| `app/layout.tsx` | 페이지 제목, 설명, 카카오톡 URL 미리보기용 Open Graph 사진 |
| `app/components/GallerySection.tsx` | 사진 그리드와 크게 보기 |
| `app/api/gallery/route.ts` | Cloudinary 사진 파일 목록 및 URL 생성 |
| `app/components/LocationSection.tsx` | 예식장 주소, 지도, 교통 안내 |
| `app/components/NoticeSection.tsx` | 임시 안내사항 세 문구 |
| `app/components/RsvpSection.tsx`, `app/api/rsvp/route.ts` | 참석 양식과 저장 API |
| `app/components/AccountSection.tsx` | 계좌 정보 |
| `app/components/KakaoShareButton.tsx` | 카카오톡 공유 메시지의 제목·사진·버튼 |
| `app/lib/supabase-server.ts`, `supabase-schema.sql` | Supabase 연결과 테이블 정의 |

## 환경변수

프로젝트 루트에 `.env.local`을 만들고 아래 값을 설정합니다. `.env.local`은 Git에서 제외되어 있으며 Vercel에 자동으로 전달되지 않습니다. 배포 환경에도 **동일한 이름으로** 별도 등록해야 합니다.

```dotenv
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_ANON_KEY=<supabase-anon-key>
CLOUDINARY_CLOUD_NAME=dhtvrg2js
NAVER_MAP_CLIENT_ID=<naver-maps-client-id>
KAKAO_JAVASCRIPT_KEY=<kakao-javascript-key>
```

| 이름 | 용도 | 필요 여부 |
| --- | --- | --- |
| `SUPABASE_URL` | 참석 여부·방명록 API의 Supabase 프로젝트 URL | 참석 여부 저장에 필수 |
| `SUPABASE_ANON_KEY` | 위 API에서 사용하는 Supabase anon/publishable key | 참석 여부 저장에 필수 |
| `CLOUDINARY_CLOUD_NAME` | `/api/gallery`에서 사진 URL 생성에 사용 | 갤러리에 필수 |
| `NAVER_MAP_CLIENT_ID` | 네이버 지도 JavaScript SDK 로드 | 선택; 없으면 지도 링크 화면 표시 |
| `KAKAO_JAVASCRIPT_KEY` | 카카오톡 공유 JavaScript SDK 초기화 | 선택; 없으면 카카오 공유 버튼 숨김 |

현재 코드는 `NEXT_PUBLIC_` 접두사가 붙은 변수나 예전 `VITE_*` 변수를 읽지 않습니다. 지도 Client ID와 카카오 **JavaScript 키**는 서버에서 클라이언트 컴포넌트로 전달되어 브라우저에서 볼 수 있습니다. 이름에 `NEXT_PUBLIC_`이 없더라도 비밀 값으로 취급하면 안 됩니다. 반대로 네이버 Client Secret, 카카오 REST API 키, Cloudinary API Secret은 브라우저로 전달하지 마세요. 로컬 `.env.local`에 `CLOUDINARY_API_KEY`와 `CLOUDINARY_API_SECRET`이 있더라도 현재 갤러리 코드는 사용하지 않습니다.

## 외부 서비스 준비

### Supabase

1. Supabase 프로젝트를 만들고 SQL Editor에서 [`supabase-schema.sql`](supabase-schema.sql)을 실행합니다.
2. 프로젝트 URL과 anon/publishable key를 `SUPABASE_URL`, `SUPABASE_ANON_KEY`에 넣습니다.
3. 참석 양식을 한 번 전송한 뒤 `rsvps` 테이블에 행이 추가됐는지 확인합니다. 스키마는 `rsvps`와 `guestbook` 테이블 및 anon 읽기/쓰기 RLS 정책을 만듭니다.

### Cloudinary 사진

1. 사진을 Cloudinary에 **공개(public)** 이미지로 업로드합니다.
2. [`app/api/gallery/route.ts`](app/api/gallery/route.ts)의 `PHOTO_FILES`에 실제 파일명 또는 public ID를 **확장자까지 포함해** 원하는 순서대로 입력합니다. 현재 10개 항목은 `wedding1.jpg`와 `KakaoTalk_20260928_161605_kksaxi.jpg` 두 파일을 반복해서 채운 상태입니다.
3. `/api/gallery`를 열어 URL 배열을 확인하고, 반환된 사진 URL을 브라우저에서 직접 열어 정상 표시되는지 확인합니다.

현재 갤러리는 Cloudinary의 원본 공개 URL을 사용합니다. 이전에 `c_fill,f_auto,q_auto,w_600` 변환 URL이 배포 환경에서 **401 Unauthorized**를 반환한 적이 있으므로, Cloudinary의 변환 허용 설정을 확인하기 전에는 이 변환을 다시 추가하지 마세요. `GallerySection`의 `next/image`도 `unoptimized`로 원본 URL을 사용합니다.

### 네이버 지도

[NAVER Cloud Platform Maps 애플리케이션](https://guide.ncloud-docs.com/docs/maps-app)에서 **Web Dynamic Map**을 사용하도록 설정하고, 실제 배포 주소를 Web 서비스 URL에 등록합니다. 발급받은 지도 Client ID를 `NAVER_MAP_CLIENT_ID`로 설정합니다. Preview 주소에서도 지도를 확인하려면 해당 주소의 허용 설정을 확인하세요.

### 카카오톡 공유

[Kakao Developers의 카카오톡 공유 설정](https://developers.kakao.com/docs/ko/kakaotalk-share/js-link)에서 앱의 JavaScript 키를 확인하고 `KAKAO_JAVASCRIPT_KEY`로 설정합니다. [JavaScript SDK 도메인과 제품 링크용 웹 도메인](https://developers.kakao.com/docs/ko/kakaotalk-share/faq)에 배포 주소를 등록합니다. 하단 **카카오톡으로 공유** 버튼을 누르면 `app/components/KakaoShareButton.tsx`의 피드 메시지와 `청첩장 보기` 버튼이 사용됩니다.

대표 사진은 현재 `KakaoTalk_20260928_161605_kksaxi.jpg`입니다. URL을 직접 붙여 넣을 때의 썸네일은 `app/layout.tsx`의 Open Graph 이미지, 사이트 버튼으로 공유할 때의 이미지는 `app/components/KakaoShareButton.tsx`의 `imageUrl`에서 각각 설정합니다. 사진을 바꾸면 두 곳을 함께 수정하세요. 이전 미리보기가 남으면 [카카오 URL 메타데이터 관리 도구](https://developers.kakao.com/docs/ko/tool/common)에서 캐시를 갱신합니다.

## 로컬 실행

```bash
npm install
npm run dev
```

개발 서버의 `http://localhost:3000`에서 확인합니다. 배포 전에는 `npm run build`로 빌드가 되는지 확인할 수 있습니다. 참석 여부 저장은 Supabase 환경변수와 테이블 설정을 완료해야 동작합니다.

## Vercel 배포

1. 저장소를 GitHub에 올리고 Vercel에서 **Add New → Project**로 가져옵니다. Framework Preset은 **Next.js**, Root Directory는 저장소 루트로 둡니다.
2. Vercel 프로젝트의 **Settings → Environment Variables**에 위 표의 변수 이름과 값을 등록합니다. 공개 배포에는 **Production** 환경을 선택하고, Preview 배포에서도 기능을 시험할 계획이면 **Preview**에도 등록합니다. `.env.local` 파일을 업로드하거나 저장소에 커밋할 필요는 없습니다.
3. 배포한 주소를 네이버 지도 Web 서비스 URL과 카카오 JavaScript SDK·제품 링크 도메인 설정에 반영합니다.
4. 배포 후 아래 항목을 확인합니다. [Vercel 환경변수](https://vercel.com/docs/environment-variables)를 수정한 경우 기존 배포에 소급 적용되지 않으므로 **새 배포**를 실행합니다.

## 배포 후 확인

- 첫 화면, 예식 일정, 안내사항, 오시는 길, 참석 여부, 계좌, 공유 버튼의 내용과 순서를 확인합니다.
- `/api/gallery`가 사진 URL 배열을 반환하는지, 각 URL이 직접 열리는지, 첫 9장과 `더보기`·크게 보기의 이전/다음 화살표·터치/마우스 넘김이 동작하는지 확인합니다.
- 참석 여부를 실제로 한 건 제출하고 Supabase `rsvps` 테이블에 저장됐는지 확인합니다.
- 지도 SDK가 보이는지 확인합니다. 지도 키를 넣지 않았다면 네이버 지도 링크 화면이 나오는 것이 정상입니다.
- 카카오톡 공유 버튼으로 보낸 메시지의 사진과 `청첩장 보기` 버튼을 확인하고, 배포 URL을 직접 붙여 넣었을 때의 미리보기도 별도로 확인합니다.

사진이 보이지 않으면 먼저 `/api/gallery` 응답에 `https://res.cloudinary.com/<cloud-name>/image/upload/<filename>` 형태의 URL이 있는지 확인하세요. URL 직접 열기에서 401이면 Cloudinary의 공개 설정·변환 제한을 확인하고, 404이면 파일명/public ID와 확장자를 확인하세요. 참석 여부 전송이 실패하면 Vercel의 Supabase 환경변수와 `supabase-schema.sql` 적용 상태를 확인하세요.

## 배포 전 내용 점검

예식 정보나 사진을 수정할 때는 한 곳만 바꾸지 않도록 다음 위치를 함께 확인합니다.

| 내용 | 수정 위치 |
| --- | --- |
| 예식 날짜·시간 및 문구 | `HeroSection.tsx`, `CalendarSection.tsx`, `FooterSection.tsx`, `app/layout.tsx`, `KakaoShareButton.tsx` |
| 예식장 주소·교통편·지도 좌표 | `LocationSection.tsx`, `app/layout.tsx`, `KakaoShareButton.tsx` |
| 갤러리 사진 목록 | `app/api/gallery/route.ts` |
| 카카오톡 대표 사진 | `app/layout.tsx`, `KakaoShareButton.tsx` |
| 안내사항 임시 문구 | `NoticeSection.tsx` |
| 계좌 및 예금주 | `AccountSection.tsx` |

계좌번호와 교통·주차 정보에는 실제 운영 전 확인이 필요한 값이 포함되어 있으므로, 공개 배포 전에 당사자와 예식장 정보로 최종 확인하세요.
