# Changelog

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
