// 배포 전 가벼운 자동 점검 스크립트. 프레임워크 없이 node만으로 실행.
// 사용법: node verify-deploy.js
"use strict";
const fs = require("fs");
const path = require("path");
const root = __dirname;

let failed = 0;
function check(label, fn){
  try{
    const ok = fn();
    if(ok){
      console.log("PASS  " + label);
    } else {
      console.log("FAIL  " + label);
      failed++;
    }
  }catch(e){
    console.log("FAIL  " + label + "  (" + e.message + ")");
    failed++;
  }
}
function read(file){
  return fs.readFileSync(path.join(root, file), "utf8");
}
function exists(file){
  return fs.existsSync(path.join(root, file));
}

const html = read("index.html");

// --- 필수 파일 존재 ---
["index.html", "country-recommendations.json", "manifest.json", "robots.txt", "sitemap.xml",
 "service-worker.js", "admin-country-recs.html", "CHANGELOG.md"].forEach(f=>{
  check("파일 존재: " + f, ()=> exists(f));
});

// --- JSON 파일 유효성 ---
check("country-recommendations.json 유효한 JSON", ()=>{
  JSON.parse(read("country-recommendations.json"));
  return true;
});
check("manifest.json 유효한 JSON", ()=>{
  JSON.parse(read("manifest.json"));
  return true;
});

// --- index.html 핵심 DOM 요소 존재 (id 기준) ---
const requiredIds = [
  "sidebar", "krMap", "zoomLayer", "searchInput", "explorePanel", "exploreContinent", "exploreSort",
  "sbCountryRecs", "sbCountryProduct", "sbCountryCultureLink", "sbPrepSection", "sbPrepSlots",
  "onboardingCard", "appVersion", "pwaBanner", "statsOverlay", "challengeOverlay", "passportOverlay"
];
requiredIds.forEach(id=>{
  check('index.html에 id="' + id + '" 존재', ()=> html.includes('id="' + id + '"'));
});

// --- index.html 핵심 함수 정의 존재 ---
const requiredFns = [
  "openSidebar", "closeSidebar", "renderSidebar", "buildMap", "loadState", "saveState", "trackEvent",
  "renderCountryRecs", "loadCountryRecommendations", "countryCodeOf", "renderPrepSlots", "pickPrepWidgets",
  "currentSeason", "initOnboarding", "renderExploreList", "buildExploreCountries", "continentOf",
  "makeLabel", "pathBBoxFromD", "updateLabels"
];
requiredFns.forEach(fn=>{
  check("index.html에 function " + fn + " 정의됨", ()=> new RegExp("function\\s+" + fn + "\\s*\\(").test(html));
});

// --- 메인 <script> 블록이 중간에 잘리지 않았는지 (과거 실제로 겪은 버그: 주석 안의 "</script>" 문자열이
//     HTML 파서 레벨에서 진짜 스크립트 태그를 조기 종료시킴). 파일 마지막 부분에 있는 함수가
//     실제로 스크립트 태그 안에서 발견되는지로 간접 검증한다. ---
check("메인 스크립트가 도중에 잘리지 않음 (초기화 호출부 존재)", ()=>{
  return html.includes("loadState();") && html.includes("initOnboarding();");
});

// --- 관리자 도구는 검색엔진/내비게이션에 노출되지 않아야 함 ---
check("index.html이 admin-country-recs.html을 링크하지 않음", ()=> !html.includes("admin-country-recs.html"));
check("sitemap.xml이 admin-country-recs.html을 포함하지 않음", ()=> !read("sitemap.xml").includes("admin-country-recs"));
check("robots.txt가 admin-country-recs.html을 차단함", ()=> /Disallow:\s*\/admin-country-recs\.html/.test(read("robots.txt")));
check("admin-country-recs.html에 noindex 메타 태그 존재", ()=> read("admin-country-recs.html").includes('name="robots"') && read("admin-country-recs.html").toLowerCase().includes("noindex"));

// --- 버전 일관성: index.html의 appVersion과 CHANGELOG.md 최상단 버전이 같은지 ---
check("appVersion과 CHANGELOG.md 최신 버전이 일치함", ()=>{
  const verMatch = html.match(/id="appVersion"[^>]*>v([\d.]+)</);
  const changelog = read("CHANGELOG.md");
  const chMatch = changelog.match(/##\s*v([\d.]+)/);
  if(!verMatch || !chMatch) return false;
  return verMatch[1] === chMatch[1];
});

// --- 서비스워커 캐시 버전: index.html의 appVersion과 반드시 같이 올라가야 이전 캐시가 무효화됨 ---
check("service-worker.js의 캐시 버전이 appVersion과 일치함 (안 맞으면 배포해도 이전 버전이 캐시에 남음)", ()=>{
  const verMatch = html.match(/id="appVersion"[^>]*>v([\d.]+)</);
  const sw = read("service-worker.js");
  const swMatch = sw.match(/APP_VERSION\s*=\s*"([\d.]+)"/);
  if(!verMatch || !swMatch) return false;
  return verMatch[1] === swMatch[1];
});
check("service-worker.js의 CACHE_NAME이 APP_VERSION을 포함함", ()=>{
  const sw = read("service-worker.js");
  return /CACHE_NAME\s*=\s*"[^"]+"\s*\+\s*APP_VERSION/.test(sw);
});
check("index.html에 새 버전 감지 시 갱신 안내 배너(swUpdateBanner)가 있음", ()=> html.includes('id="swUpdateBanner"') && html.includes("updatefound"));

console.log("");
if(failed){
  console.log(failed + "개 항목 실패");
  process.exit(1);
} else {
  console.log("전체 통과");
  process.exit(0);
}
