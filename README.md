# 운동 일지 (Workout Log)

상현 님을 위한 모바일 운동 일지 + 통증 일지 PWA.

- 1주차(2026-11-23 ~ 11-29) 주간 운동 계획 기본 내장, 이후 날짜는 자유 기록
- 세트별 체크 · 무게/메모 기록, 60초/75초 휴식 타이머(비프음·진동)
- 시간이 있는 동작(스트레칭 30초, 플랭크, 유산소 등)은 카드의 ⏱ 버튼으로 바로 시작
- 타이머 패널에서 휴식(60·75초) 외에 동작·스트레칭 프리셋(20초~20분) 선택
- 통증 일지(부위·정도·증상·조치) 월별 캘린더
- localStorage 자동 저장, JSON 내보내기/불러오기
- 단일 index.html (이미지·스타일·스크립트 모두 내장) + manifest + service worker

## 배포

GitHub Pages에 이 폴더를 그대로 올리면 됩니다.

```bash
git init
git add .
git commit -m "운동 일지 PWA"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

저장소 Settings > Pages 에서 Branch: main / (root) 선택.
