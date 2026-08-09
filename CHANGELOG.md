# Changelog

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
