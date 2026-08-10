# Changelog

## v2.7.0 (2026-08-09)
- "여행 준비물 체크" 범용 쿠팡 슬롯을 계절(현재 월)·대륙별 로테이션 구조로 전환: `COUPANG_CONFIG.byContinent`/`bySeason`/`fallback` (전부 빈 배열 — 실제 상품 데이터 없이 구조만 마련, 사람이 나중에 채움). 국가별 추천(country-recommendations.json) 섹션과는 완전히 별개 시스템으로 유지
- 성능 최적화(대용량 지역 데이터 지연 로딩) 실적용은 보류: 1단계 점검에서 확인한 대로 SVG 경로 렌더링(DOM 생성)은 이미 `requestIdleCallback` 청크 분할로 처리 중이었으나, 남은 병목은 26개국 상세지도 JSON 자체를 페이지 로드 시 한꺼번에 `JSON.parse`하는 부분. 이걸 실제로 지연 로딩하려면 데이터를 국가별 파일로 분리하고, `ALL_REGIONS`/`BY_CODE`를 전제로 하는 검색·통계·업적·탐색 패널 등 코드 전반이 "일부만 로드된 상태"를 견디도록 구조 변경이 필요해 위험도가 높다고 판단, 이번엔 보류하고 구체적 이유만 기록함

## v2.6.0 (2026-08-09)
- 관리자 도구(admin-country-recs.html) 일괄 등록 기능 추가: 콤마/탭 구분 텍스트를 여러 줄 붙여넣으면 국가별로 파싱해 한 번에 JSON 생성 (단건 입력과 동일한 검증 + 국가 코드 존재 여부 검증 추가), 검색엔진 노출 차단 규칙은 그대로 유지
- 지도 상단에 "탐색" 버튼 추가: 대륙별 필터 + 완료율/이름 정렬로 국가 목록을 보고 바로 이동 가능 (기존 검색창은 그대로 유지, 별도 확장). GA 이벤트 추가: map_filter_used, map_sort_used
- 버그 수정: 검색 결과·탐색 목록 클릭 시 사이드바가 열리자마자 즉시 닫히던 기존 버그 발견 및 수정 (전역 "바깥 클릭 시 사이드바 닫기" 리스너로 클릭 이벤트가 버블링되던 문제, stopPropagation 추가)

## v2.5.0 (2026-08-09)
- 첫 방문자 온보딩 카드 추가: `localStorage`에 방문 기록(`onboardingSeen` 플래그, 저장된 방문 상태)이 전혀 없는 진짜 신규 방문자에게만 3단계 이내의 가벼운 카드 노출 (전체 화면 모달 아님, 언제든 닫기 가능, 한 번 닫으면 다시 안 뜸)
  - GA 이벤트 추가: onboarding_shown, onboarding_dismissed, onboarding_completed
- SEO: `<head>`에 WebApplication JSON-LD 구조화 데이터 추가 (기존 OG/Twitter 메타 태그와 동일한 name/description/url, 평점·리뷰 등 허위 정보 없음, JSON 문법 검증 완료)
- 접근성: 아이콘만 있던 버튼 중 aria-label이 빠져있던 사이드바 닫기 버튼, 체크리스트 항목 삭제 버튼에 aria-label 보강
- 성능/접근성 점검 결과 (수정 없이 보고만): 이미지 alt 속성 전수 점검 완료(문제 없음, 국기 이미지는 인접 텍스트와 중복 방지를 위해 의도적으로 alt=""), 5개 테마 전체의 텍스트 색상 대비 WCAG AA 기준 통과 확인(조정 불필요), 지도 렌더링은 이미 기본 지역은 즉시·상세 지역(줌 필요)은 requestIdleCallback으로 분할 렌더링 중임을 확인 — 남은 개선 여지는 페이지 로드 시 26개국 상세지도 JSON을 한꺼번에 파싱하는 부분으로, 필요한 국가만 지연 로딩하려면 데이터 구조 자체를 별도 파일로 분리해야 해서 이번 작업 범위를 벗어나 별도 작업으로 남겨둠

## v2.4.0 (2026-08-09)
- 국가 추천 데이터 입력 보조 도구 추가: `admin-country-recs.html` (관리자 전용, 메인 사이트와 완전히 분리된 별도 파일)
  - `index.html`의 실제 `WORLD_DATA`/`DETAIL_ARRAYS`(BLOB_NAMES) 데이터를 그대로 읽어와 국가 드롭다운 구성 (오타·잘못된 코드 방지, 새 코드 체계 없음)
  - 국가 선택 → 상품/문화 정보 입력 → `country-recommendations.json` 형식의 JSON 조각 생성 → 클립보드 복사
  - 검증: 국가 미선택 차단, 상품·문화 정보 둘 다 공란이면 차단, URL이 http/https로 시작하지 않으면 차단
  - 파일을 직접 수정하지 않음 — 사람이 복사해서 `country-recommendations.json`에 붙여넣는 방식
  - 이미 등록된 국가 목록을 하단에 표시 (중복 작업 방지), 선택한 국가가 이미 등록돼 있으면 경고 표시
  - `robots.txt`에 Disallow 추가, `<meta name="robots" content="noindex,nofollow">` 적용, sitemap.xml·내비게이션 어디에도 링크하지 않음 — 검색엔진/일반 방문자에게 노출되지 않음

## v2.3.0 (2026-08-09)
- 국가별 맞춤 추천 시스템 추가: 사이드바에 "이 나라를 여행한다면" 섹션 (기존 범용 "여행 준비물 체크"와는 별개, 시각적으로 구분됨)
  - 그 나라이기 때문에 특별히 필요한 상품 1개 + 잘 알려지지 않은 문화/주의사항 글 1개를 국가 코드(ISO 3166-1 alpha-2)로 매핑
  - 데이터는 `country-recommendations.json`으로 분리 (index.html 수정 없이 이 파일만 고치면 국가 추가 가능)
  - 몽골(MN) 샘플 1건만 포함, 나머지 국가는 데이터 없음 → 해당 국가는 섹션 자동 숨김
  - fetch 실패/JSON 깨짐/필드 누락에도 사이트 나머지 기능은 정상 동작 (콘솔 경고만, 에러 없음)
  - GA 이벤트 추가: country_product_view, country_product_click, country_culture_click
  - 작성 가이드: `country-recommendations-guide.md`

## v2.2.0 (2026-08-09)
- SEO 메타 태그(OG, Twitter Card, description) 추가
- robots.txt, sitemap.xml 추가
- PWA 지원 (manifest, 홈 화면에 추가 유도 배너, 서비스워커 오프라인 앱 셸 캐싱)
- 지도 공유 요약 카드에 사이트 주소 워터마크 추가 (기존 공유 카드 기능 보강)
- 쿠팡파트너스 연동 슬롯 준비 (사이드바 "여행 준비물 체크" 접이식 섹션 + 설정 객체)
- GA 이벤트 추가: region_click, region_complete, data_export, share_click, pwa_prompt_shown, pwa_prompt_accepted
- 기능별 on/off 스위치(FEATURE_FLAGS) 도입

참고: 데이터 내보내기/가져오기(JSON 백업/복원)와 지도 요약 카드 공유 기능은 이번 버전 이전부터
이미 구현되어 있던 기능으로 확인되어, 이번 작업에서는 새로 만들지 않고 공유 카드에 워터마크만 추가했습니다.
