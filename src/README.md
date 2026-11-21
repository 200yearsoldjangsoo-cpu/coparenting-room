# 소스 (여기를 고치고 빌드)

index.html은 빌드 결과물이야. index.html을 직접 고치면 다음 빌드 때 덮어써져.

1. src/p_tpl.html, src/*.js 를 고친다
2. `python3 src/build.py` → 루트 index.html, version.txt 생성
3. 문법 확인 후 커밋·푸시 (Vercel 자동 배포)
