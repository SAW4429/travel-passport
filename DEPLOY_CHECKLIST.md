# 배포 전 체크리스트

매번 push하기 전에 확인합니다. 자동으로 검증 가능한 항목은 `node verify-deploy.js`로 한 번에 돌려볼 수 있습니다 (아래 각 항목에 🤖 표시).

```bash
node verify-deploy.js
```

## 0. 배포 파이프라인
- [ ] `git remote -v`로 `origin`이 `https://github.com/SAW4429/travel-passport.git`인지 확인 (CLAUDE.md 참고)
- [ ] 커밋만 하지 말고 `git push`까지 완료
- [ ] 실제 배포 URL(`https://saw4429.github.io/travel-passport/`)에서 반영 확인 (GitHub Pages CDN 캐시로 몇 분 지연될 수 있음 — `?cachebust=n` 쿼리로 우회 확인)

## 1. 지도 핵심 기능
- [ ] 🤖 `sidebar`, `krMap`, `zoomLayer` DOM 존재
- [ ] 지역 클릭 시 사이드바가 열리고 닫힘 없이 유지됨 (검색/탐색 결과 클릭 포함)
- [ ] 방문/예정/미방문 상태 변경 시 지도 색이 바뀜
- [ ] 검색창에 지명 입력 시 결과가 뜨고 클릭 시 이동함
- [ ] 필터 칩(전체/미방문/방문예정/방문완료) 동작

## 2. 여권 UI / 통계 / 챌린지
- [ ] 🤖 `passportOverlay`, `statsOverlay`, `challengeOverlay` DOM 존재
- [ ] 여권 열기 → 국내/해외/업적/기록 탭 전환 동작
- [ ] 통계 모달 열림, 숫자가 실제 방문 데이터와 맞음

## 3. 내보내기 / 가져오기 / 공유
- [ ] 내보내기 클릭 시 JSON 파일 다운로드
- [ ] 가져오기로 방금 내보낸 파일을 다시 불러오면 데이터 복원됨
- [ ] 요약 카드 공유 시 워터마크(사이트 주소) 포함된 이미지 생성

## 4. PWA
- [ ] 서비스워커 등록 성공 (콘솔에 404/에러 없음)
- [ ] `manifest.json`, `icon.svg` 정상 로드
- [ ] "홈 화면에 추가" 배너가 조건 충족 시 뜨고, 닫으면 다시 안 뜸
- [ ] 🤖 **매 배포마다**: `service-worker.js`의 `APP_VERSION`을 `index.html`의 `appVersion`과 동일하게 올렸는지 확인 (안 올리면 이전 캐시가 안 지워지고 사용자가 구버전을 봄)
- [ ] 이미 열려있는 탭에서 새 버전 배포 시 "새 버전이 있어요" 배너가 뜨고, 새로고침하면 최신 버전이 반영됨

## 5. 국가별 추천 섹션 (country-recommendations.json)
- [ ] 🤖 `country-recommendations.json` 유효한 JSON
- [ ] 🤖 `sbCountryRecs`, `sbCountryProduct`, `sbCountryCultureLink` DOM 존재
- [ ] 데이터 있는 국가(예: 몽골)에서 상품/문화 섹션 노출, 제휴 고지 문구 표시
- [ ] 데이터 없는 국가는 섹션 자체가 안 보임 (에러 없음)

## 6. 쿠팡 위젯
- [ ] 🤖 `sbPrepSection`, `sbPrepSlots` DOM 존재
- [ ] "여행 준비물 체크" 섹션이 `FEATURE_FLAGS.coupangWidgets`에 따라 노출/숨김 됨
- [ ] 로테이션(`COUPANG_CONFIG.byContinent`/`bySeason`/`fallback`)이 비어있어도 에러 없이 빈 상태로 렌더링됨
- [ ] 국가별 추천 섹션과 서로 간섭하지 않음 (같은 사이드바에서 둘 다 확인)

## 7. 온보딩
- [ ] 🤖 `onboardingCard` DOM 존재
- [ ] `localStorage` 완전 초기화 후 첫 진입 시 카드가 뜸 (기존 방문 기록 있으면 안 뜸)
- [ ] 닫기/완료 후 새로고침해도 다시 안 뜸

## 8. SEO / 구조화 데이터
- [ ] `<script type="application/ld+json">`가 유효한 JSON이고 name/description/url이 메타 태그와 일치
- [ ] `sitemap.xml`, `robots.txt` 정상 접근 가능

## 9. 접근성
- [ ] 아이콘 전용 버튼에 `aria-label` 존재 (새 아이콘 버튼 추가 시 특히 확인)
- [ ] 새로 추가한 텍스트가 배경과 충분한 색 대비를 가짐 (5개 테마 전부 확인 권장)

## 10. 관리자 도구 (admin-country-recs.html)
- [ ] 🤖 `index.html`, `sitemap.xml`에 `admin-country-recs.html` 링크 없음
- [ ] 🤖 `robots.txt`에 `Disallow: /admin-country-recs.html`
- [ ] 🤖 `admin-country-recs.html`에 `noindex` 메타 태그
- [ ] 단건 등록: 국가 선택 → 입력 → JSON 생성 → 복사 동작
- [ ] 일괄 등록: 여러 줄 붙여넣기 → 국가 코드/URL 검증 → JSON 생성 동작
- [ ] "이미 등록된 국가" 목록이 실제 `country-recommendations.json`과 일치

## 11. 지도 탐색 (필터/정렬)
- [ ] 🤖 `explorePanel`, `exploreContinent`, `exploreSort` DOM 존재
- [ ] 대륙 필터, 완료율/이름 정렬 변경 시 목록이 바뀌고 GA 이벤트(`map_filter_used`/`map_sort_used`) 발생
- [ ] 목록 항목 클릭 시 지도 이동 + 사이드바 정상 오픈 (닫히지 않고 유지)

## 12. 에러 모니터링
- [ ] 콘솔에 의도적으로 에러를 발생시켰을 때 GA로 `js_error` 이벤트가 전송되는지 확인 (예: `throw new Error("test")`를 콘솔에서 실행)

## 13. 버전 / 문서
- [ ] 🤖 `appVersion` 표시값과 `CHANGELOG.md` 최상단 버전이 일치
- [ ] `CHANGELOG.md`에 이번 변경 내역 기록
