# 폰트

Pretendard · Pretendard JP — **SIL Open Font License 1.1**
Copyright (c) 2021 Kil Hyung-jin, with Reserved Font Name Pretendard.
https://github.com/orioncactus/pretendard

상업적 이용·웹 임베딩 허용. 저작권 표기(LICENSE 파일)를 함께 배포해야 한다.

| 파일 | 용량 | 쓰임 |
| --- | --- | --- |
| `PretendardVariable.woff2` | 2.0MB | 한국어판 · 영어판 (Latin 이 JP판과 동일) |
| `PretendardJPVariable.woff2` | 5.1MB | 일본어판 (`<html lang="ja">` 일 때만 내려받음) |

가변 폰트 한 파일로 45–920 굵기를 모두 덮는다. 앱은 400·500·700·900 을 쓴다.

## 용량을 더 줄이려면

지금은 로컬·오프라인 실행을 전제로 가변 폰트를 쓴다. 웹에 올려서
네트워크로 받게 할 거라면 정적 서브셋이 더 작다:

    Pretendard-1/web/static/woff2-subset/  (굵기당 261KB × 4 = 약 1MB)

원본 배포본(`Pretendard-1/`, `PretendardJP-1/`, 합계 205MB)은
여기 복사한 파일만 있으면 지워도 앱은 돈다.
