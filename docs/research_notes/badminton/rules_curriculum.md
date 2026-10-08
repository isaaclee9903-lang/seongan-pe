# 배드민턴 공식 규칙(BWF/KBA) + 2022 개정 중학교 체육과 교육과정 연계 — 심판 로직 구현용 리서치 노트

작성일: 2026-10-08. 표기: **[1차]** = 규칙/교육과정 원문(또는 원문 PDF에서 직접 추출)으로 확인, **[2차]** = 요약·블로그·언론 등 2차 자료, **[계산]** = 1차 수치로부터 산술 도출, **[추론]** = 근거 기반 판단(검증 안 됨).

> ⚠️ 가장 중요한 시점 이슈: BWF는 2026-04-25 연례총회(AGM)에서 **3×15점제**를 채택, **2027-01-04 시행**. 2026-10 현재는 아직 **2025 Laws(21점제)** 가 유효. 시뮬레이터는 "현행(21점) / 2027 신규(15점) / 학교 수업용" 세 프리셋을 분리해 두는 것을 권장.

---

## Q1. 코트 규격 (Law 1)

### Takeaway
코트는 13.40 × 6.10 m(복식) / 5.18 m(단식 폭), 라인 폭 40 mm이며 **모든 라인은 그 라인이 둘러싸는 구역에 포함(라인 위 = 인)**. 네트 높이는 중앙 1.524 m, 복식 사이드라인 위 1.55 m. 단식 서비스 코트는 "길고 좁고", 복식 서비스 코트는 "짧고 넓다".

### Cited Findings
- [1차] "The court shall be a rectangle marked out with lines 40 mm wide as shown in Diagram A." / "All the lines shall form part of the area which they define." — [BWF Statutes Section 4.1 Laws of Badminton, In force 29/05/2023 V2.1 (PDF 사본)](https://cob.org/wp-content/uploads/Section-4.1-Laws-of-Badminton-29-May-2023-V2.1.pdf)
- [1차] 포스트 높이 1.55 m, 포스트는 단식·복식 관계없이 복식 사이드라인 위에 설치. 네트 깊이 760 mm, 폭 최소 6.1 m, 상단 백색 테이프 75 mm. 네트 상단 높이 **중앙 1.524 m, 복식 사이드라인 위 1.55 m** (Law 1.4–1.10) — 위 BWF PDF; 2027 시행본 HTML도 동일 — [worldbadminton.com Laws (2027-01-04 시행본, 2026-04-25 채택)](https://worldbadminton.com/laws/index.html)
- [1차] Diagram A 주석: 전체 코트 대각선 = 14.723 m; 같은 코트를 단식·복식 겸용 — 위 BWF PDF. (Diagram A의 개별 치수는 이미지라 텍스트 추출 불가)
- [2차] 전장 13.40 m(13.41 m로 표기하기도 함, 44 ft), 복식 폭 6.10 m, 단식 폭 5.18 m, 쇼트 서비스 라인은 네트로부터 1.98 m, 복식 롱 서비스 라인은 뒤 경계선으로부터 0.76 m 안쪽; "External dimensions (13.40 × 6.10) includes width of lines, other dimensions are measurements between lines" — [Wikibooks: Badminton/Playing court dimensions](https://en.wikibooks.org/wiki/Badminton/Playing_court_dimensions); 13.40/5.18/6.10 확인 — [reportworld 배드민턴 경기 규칙](https://www.reportworld.co.kr/art/a10155968)
- [계산] 대각선 검증: √(13.40² + 6.10²) = √(179.56+37.21) = √216.77 = 14.723 m → BWF Diagram A 주석(14.723 m)과 정확히 일치하므로 13.40 × 6.10 m는 1차 수치와 정합.
- [계산] 사이드 앨리(복식 사이드라인–단식 사이드라인) = (6.10−5.18)/2 = 0.46 m. 반코트 깊이 = 6.70 m. 서비스 코트 깊이: 단식 = 6.70−1.98 = **4.72 m**(쇼트 서비스 라인 ~ 뒤 경계선), 복식 = 4.72−0.76 = **3.96 m**(쇼트 서비스 라인 ~ 복식 롱 서비스 라인). 서비스 코트 폭: 단식 5.18/2 = 2.59 m, 복식 6.10/2 = 3.05 m (센터라인 기준).

### 구현 메모 (서비스 코트 = 판정 영역)
| 구분 | 앞 경계 | 뒤 경계 | 옆 경계 | 형태 |
|---|---|---|---|---|
| 단식 서비스 | 쇼트 서비스 라인 | **뒤 경계선(백바운더리)** | **단식 사이드라인**, 센터라인 | 길고 좁음 |
| 복식 서비스 | 쇼트 서비스 라인 | **복식 롱 서비스 라인**(뒤에서 0.76 m) | **복식 사이드라인**, 센터라인 | 짧고 넓음 |
| 단식 랠리 | 네트 | 뒤 경계선 | 단식 사이드라인 | |
| 복식 랠리 | 네트 | 뒤 경계선 | 복식 사이드라인 | 서비스 후엔 전체 사용 |
- 인/아웃 판정: 셔틀 접지점(코르크 접촉점)이 라인의 어느 부분에라도 닿으면 IN. 좌표 판정 시 `x ≥ 경계선 바깥쪽 모서리` 기준이 아니라 **라인 바깥 가장자리까지 IN**으로 처리(라인 폭 0.04 m 포함).

### Inferences
- [추론] 시뮬레이션 좌표계: 원점 = 네트 중앙, y축 = 네트 수직(0~6.70 m), x축 = 좌우(−3.05~+3.05). 라인 폭 40 mm를 렌더링에 반영하면 "라인 위 = 인" 오개념 교정 퀴즈에 활용 가능.

### Gaps
- Diagram A 원본 수치를 BWF PDF 텍스트로는 추출하지 못함(이미지). 수치는 2차 자료 + 대각선 계산으로 교차 검증함.

---

## Q2. 점수 체계 (Law 7, 8, 16) — 현행 21점 vs 2027 15점

### Takeaway
2026년 현재(2025 Laws): 랠리포인트 21점, 20-20부터 2점 차, 29-29면 30점 선취 승, 3게임 2선승, 11점에서 60초 인터벌, 3게임 11점에서 코트 교체, 게임 승자가 다음 게임 첫 서브. 2027-01-04부터: 15점, 14-14부터 2점 차, 20-20이면 21점 선취 승, 인터벌·코트 교체 8점.

### Cited Findings
- [1차] (2023 V2.1, 2025 Laws와 동일 체계) 7.1 best of three games; 7.2 first scores 21 points; 7.3 랠리를 이긴 편이 득점(상대 폴트 또는 셔틀이 상대 코트 안 바닥에 닿음); 7.4 "If the score becomes 20-all, the side which gains a two point lead first, shall win"; 7.5 "If the score becomes 29-all, the side scoring the 30th point shall win"; 7.6 게임 승자가 다음 게임 첫 서브 — [BWF Laws 2023 V2.1](https://cob.org/wp-content/uploads/Section-4.1-Laws-of-Badminton-29-May-2023-V2.1.pdf)
- [1차] 코트 교체(Law 8): 1게임 종료 후, 3게임이 있으면 2게임 종료 후, 3게임에서 한 편이 먼저 11점 도달 시. 교체를 놓치면 발견 즉시(셔틀 인플레이 아닐 때) 교체, 점수 유지 — 같은 PDF
- [1차] 인터벌(Law 16.2.1): 각 게임 리딩 스코어가 11점 도달 시 60초 이내; 16.2.2 게임 사이 120초 이내 — 같은 PDF
- [1차] **2027 시행본**: 7.2 "first reaches 15 points", 7.4 14-all → 2점 차, 7.5 20-all → 21점째 득점자 승; 16.2.1 리딩 스코어 **8점**에서 60초 인터벌; 8.1.3 3게임에서 먼저 **8점** 도달 시 코트 교체; "effective 4JAN2027 – until then the 2025 Laws apply", "amended and adopted by the BWF 25APR2026" — [worldbadminton.com Laws (2027 시행본)](https://worldbadminton.com/laws/index.html), [worldbadminton.com/rules](https://worldbadminton.com/rules) (주: 제3자 HTML 렌더링이며 오류 가능성 고지 있음)
- [2차] AGM(덴마크 호르센스, 2026-04-25)에서 198–43으로 3×15 승인, 2027-01-04 발효; 2021년 5×11안은 2/3 미달로 부결 — [Malay Mail](https://www.malaymail.com/news/sports/2026/04/26/gamechanger-for-badminton-bwf-approves-15point-system-ending-twodecade-reign-of-21point-matches/217703), [NST](https://www.nst.com.my/amp/sports/badminton/2026/04/1425988/bwf-approves-switch-3x15-scoring-system-next-year), [BWF Corporate: Council proposal 3x15](https://corporate.bwfbadminton.com/news-single/2026/02/12/council-proposal-3x15-scoring-system-for-decision-at-bwf-agm-2026/) (BWF 페이지는 403으로 본문 미확인), [BWF Corporate: AGM 2026 decisions](https://corporate.bwfbadminton.com/news-single/2026/05/08/members-forum-2026-bwf-agm-2026-follow-up-agm-decisions-agm-voting-record/) (403)
- [2차] 국내 보도: 2027년 1월부터 국제대회 적용, 21점제는 2006년 도입 후 20년 유지 — [위키트리](https://www.wikitree.co.kr/articles/1133653), [노컷뉴스](https://www.nocutnews.co.kr/news/6508138)
- [1차] **대안 규칙(Alternative Laws, BWF Statutes 4.1.4, In force 04 January 2027 V2.0)**: 사전 합의 시 ① 21점 1게임(11점에서 코트 교체), ② 21점 3게임(20-all 2점 차, 29-all 30점; 3게임 11점 코트 교체; 문서상 인터벌 16.2.1은 "8 points"로 기재), ③ **11점 5게임**(5게임에서 6점에 코트 교체·60초 인터벌, 게임 간 120초) 허용 — [Section 4.1.4 Alternative Laws 2027 V2.0 PDF (가나협회 게시 사본)](https://ghanabadminton.org/wp-content/uploads/Section-4.1.4-Alternative-Laws-of-Badminton-04-January-2027-V2.0.pdf). 11점 5게임안의 듀스 규정은 문서에 별도 기재 없음(=11점 선취로 종료로 읽힘).
- [2차] KBA 요약(2017 규칙 기반): 21점(초등부 17점), 20:20(초등부 16:16)부터 2점 차, 29:29(초등부 24:24)이면 30점(초등부 25점) 선취; 3게임 11점(초등부 9점)에서 코트 교체 및 인터벌 — [인천공항 배드민턴 경기규칙 요약 PDF](https://airport.kr/sites/sm/down/sm_rule_01.pdf)

### 구현 의사코드 (점수 판정)
```
gameWon(a, b, cfg):  // cfg = {target, deuceAt, cap}
  if a >= cfg.cap: return true                   // 21점제 cap=30, 15점제 cap=21
  return a >= cfg.target && a - b >= 2
// 21점: {target:21, cap:30}; 15점: {target:15, cap:21}
// 인터벌/코트교체 트리거: 21점=11, 15점=8 (리딩 스코어가 처음 도달 시)
```

### Inferences
- [추론] KBA 국내대회의 15점제 적용 시점은 미확인. 학교 수업에서는 공식 변경 이슈를 "규칙은 바뀔 수 있다(스포츠 규칙의 역사·특성 탐색 = [9체02-16])" 수업 소재로 활용 가능.
- [추론] 2027 대안 규칙 문서의 21점 3게임안 인터벌 "8 points" 기재는 오기일 가능성이 있음(코트 교체는 11점) — 원문 확인 필요.

### Gaps
- BWF 공식 사이트(corporate.bwfbadminton.com)는 403으로 직접 열람 불가. 2027 본문은 worldbadminton.com(제3자 HTML) + 대안 규칙 PDF 사본으로 확인.
- KBA(koreabadminton.org) 최신 경기규칙 원문 및 15점제 국내 도입 일정 미확인.

---

## Q3. 서비스 (Law 9)

### Takeaway
정확한 서비스 = 셔틀이 위로 날아 네트를 넘어 리시버의 서비스 코트(라인 포함)에 떨어질 것 + 9.1.1~9.1.8 조건. 핵심은 **타구 순간 셔틀 전체가 코트 바닥에서 1.15 m 미만**(고정 높이, 2018 시험 도입 후 본 규칙화). 사전 합의 시 "허리(최하단 갈비뼈) 아래 + 라켓 샤프트·헤드 하향" 대안 규칙 사용 가능 — 학교 수업에 적합.

### Cited Findings
- [1차] Law 9.1: "the flight of the shuttle shall be upwards from the server's racket to pass over the net so that, if not intercepted, it shall land in the receiver's service court (i.e. on or within the boundary lines)" — [BWF Laws 2023 V2.1](https://cob.org/wp-content/uploads/Section-4.1-Laws-of-Badminton-29-May-2023-V2.1.pdf)
- [1차] 9.1.1 준비 후 부당한 지연 금지; 9.1.2 백스윙 완료 후 지연 = 부당 지연; 9.1.3 서버·리시버는 **대각선** 서비스 코트 안에, **경계선을 밟지 않고** 선다; 9.1.4 서버·리시버 **양발 일부가 바닥에 닿은 채 정지**(서비스 시작~완료); 9.1.5 라켓이 **셔틀 베이스(코르크)를 먼저** 친다; 9.1.6 "the whole shuttle shall be below 1.15 metres from the surface of the court at the instant of being hit"; 9.1.7 라켓 움직임은 서비스 시작부터 완료까지 **계속 앞으로**; 9.1.8 헛스윙 금지 — 같은 PDF
- [1차] 9.2 서비스 시작 = 준비 후 라켓 헤드의 첫 전방 움직임; 9.3 서비스 완료 = 셔틀 타격 또는 헛스윙; 9.4 리시버 준비 전 서브 금지, 단 리시버가 리턴을 시도하면 준비된 것으로 간주; 9.5 복식 파트너는 상대 서버·리시버 시야를 가리지 않는 한 자기 코트 어디든 위치 가능 — 같은 PDF
- [1차] 2023 판에서 "서버는 회전을 주지 않고 셔틀을 놓는다(release without adding spin)"는 파리 2024 패럴림픽까지의 **시험 변형(Experimental Variation)** 이었고 — 같은 PDF; 2027 시행본 HTML에서는 9.1.5 본문에 "releases the shuttle without adding spin" 포함 — [worldbadminton.com Laws](https://worldbadminton.com/laws/index.html) (스핀 서브 금지의 정식화로 보임)
- [2차] 고정 높이 서비스는 2018년 12월부터 상위 레벨 대회 의무화; 다른 수준의 경기는 높이 미지정이나 구 규정이 삭제되어 적용된다고 간주 — [worldbadminton.com Laws 주석](https://worldbadminton.com/laws/index.html); 2018 시험 규칙 보도 — [Scroll.in](https://scroll.in/field/859666/scroll_in)
- [1차] 대안 서비스 규칙 9.1.6 (a) "the whole shuttle shall be below the server's waist … level with the lowest part of the server's bottom rib"; (b) 타구 순간 라켓 **샤프트와 헤드가 아래쪽**을 향할 것 — [Alternative Laws 2027 V2.0](https://ghanabadminton.org/wp-content/uploads/Section-4.1.4-Alternative-Laws-of-Badminton-04-January-2027-V2.0.pdf)
- [2차] KBA 요약(구 규칙): "셔틀 전체가 서버의 허리보다 밑", 허리 = 마지막 갈비뼈 위치, 라켓 샤프트 아래 방향, 라켓은 계속 앞으로 — [인천공항 경기규칙 요약](https://airport.kr/sites/sm/down/sm_rule_01.pdf)

### 서비스 폴트 체크리스트 (시뮬/퀴즈용 enum)
1. `HEIGHT` 타구 순간 셔틀 일부라도 1.15 m 이상 (학교: 허리/갈비뼈 이상)
2. `FEET_MOVE` 발이 떨어지거나 끌림 (서버·리시버 모두 해당)
3. `ON_LINE_STANDING` 서버/리시버가 서비스 코트 경계선을 밟음
4. `NOT_DIAGONAL` / `WRONG_COURT` (→ Law 12 서비스 코트 에러로 처리)
5. `NOT_BASE_FIRST` 깃털 먼저 타격
6. `BROKEN_MOTION` 전방 동작 중단(페인트/멈칫), 백스윙 후 지연
7. `MISS` 헛스윙
8. `SHORT` 쇼트 서비스 라인 앞에 떨어짐 / `LONG`·`WIDE` 서비스 코트 밖
9. `NET_SUSPENDED` 서브가 네트 위에 걸림 / `CAUGHT_IN_NET` 넘어간 후 네트에 걸림 (서비스 중엔 **폴트**, 랠리 중엔 **렛**)
10. `RECEIVER_PARTNER_HIT` 리시버 파트너가 리턴
11. 리시버 미준비 → **렛**(폴트 아님), 단 리시버가 리턴 시도 시 준비로 간주

### Gaps
- 1.15 m 규칙이 동호인·학교 수준에도 "본규칙"으로 적용되는지 해석이 갈림(worldbadminton 주석 vs 일부 2차 자료의 "국제대회만"). 학교 수업에서는 대안 규칙(허리) 채택이 공식적으로 허용됨.

---

## Q4. 서비스 코트 결정 (Law 10, 11, 12)

### Takeaway
단식: **서버 자신의 점수** 짝수(0 포함)=오른쪽, 홀수=왼쪽. 복식: **서비스 편의 점수** 짝/홀로 좌우 결정, 서비스 편이 득점할 때만 같은 서버가 파트너와 자리 바꿔 반대 코트에서 계속 서브. 리시브 편은 자리 이동 없음. 리시버는 서버의 대각선 선수.

### Cited Findings
- [1차] 10.1.1 서버 점수 0 또는 짝수 → 양 선수 오른쪽 서비스 코트에서 서브·리시브; 10.1.2 홀수 → 왼쪽; 10.3.1 서버 승 → 득점 후 반대 코트에서 다시 서브; 10.3.2 리시버 승 → 득점 후 새 서버 — [worldbadminton.com Laws](https://worldbadminton.com/laws/index.html), [BWF Laws 2023 V2.1](https://cob.org/wp-content/uploads/Section-4.1-Laws-of-Badminton-29-May-2023-V2.1.pdf)
- [1차] 11.1.1/11.1.2 서비스 편 점수 짝수=오른쪽, 홀수=왼쪽; 11.1.3 리시브 편 선수는 직전에 서브/리시브한 코트에 그대로, 파트너는 반대; 11.1.4 리시버 = 서버의 대각선 선수; 11.1.5 서비스 편이 득점해야만 코트 변경; 11.3.1 서비스 편 승 → 득점, **같은 서버**가 반대 코트에서 서브; 11.3.2 리시브 편 승 → 득점, 서비스권 이동 — 같은 출처
- [1차] 11.4 서비스 순서: 최초 서버(오른쪽) → 최초 리시버의 파트너 → 최초 서버의 파트너 → 최초 리시버 → 최초 서버…; 11.5 순서 위반·연속 2회 리시브 금지(Law 12 예외); 11.6 다음 게임에서 승리 편의 누구든 첫 서브, 패배 편의 누구든 첫 리시브 가능 — 같은 출처
- [1차] Law 12: 순서 틀린 서브/리시브, 틀린 코트에서 서브/리시브 = 서비스 코트 에러 → **셔틀이 인플레이가 아닐 때 정정, 점수는 유지**(재경기·폴트 아님) — [BWF Laws 2023 V2.1](https://cob.org/wp-content/uploads/Section-4.1-Laws-of-Badminton-29-May-2023-V2.1.pdf)
- [2차] KBA 요약의 복식 진행 예시(A·B vs C·D, 0-0 A→C, 1-0 A가 왼쪽에서 D에게, 1-1 D가 왼쪽에서 A에게, 2-1 B가 오른쪽에서 C에게 …)가 위 원칙과 일치 — [인천공항 경기규칙 요약](https://airport.kr/sites/sm/down/sm_rule_01.pdf)

### 구현 의사코드 (복식 상태 머신)
```
state: score[S0,S1], servingSide, pos[side] = {right: playerId, left: playerId}
serverCourt = score[servingSide] % 2 == 0 ? 'right' : 'left'
server   = pos[servingSide][serverCourt]
receiver = pos[other][serverCourt]          // 대각선 = 같은 'right/left' 라벨
onRally(winner):
  score[winner]++
  if winner == servingSide: swap(pos[servingSide].right, pos[servingSide].left)  // 같은 서버 계속
  else: servingSide = winner                // 아무도 이동 안 함; 새 서버 = pos[winner][parity]
// 단식: pos 대신 점수 parity만으로 서버/리시버 코트 결정
```
- 검증: 위 로직은 "서버가 바뀔 때 아무도 움직이지 않는다", "새 서버는 자기 편 점수 parity에 맞는 칸에 서 있는 선수"를 자동 보장 — Law 11.4 순서와 동치 [추론, KBA 예시표로 수작업 검증함].

### Gaps
- 없음(원문 확인 완료).

---

## Q5. 폴트(Law 13)와 렛(Law 14)

### Takeaway
폴트는 ①잘못된 서비스 ②서비스 중 셔틀 네트 걸림/리시버 파트너 타구 ③인플레이 셔틀 관련(아웃, 네트 미통과, 천장·벽, 선수 몸·옷, 코트 밖 물체, 슬링, 더블히트, 파트너 연속타, 라켓에 닿고 상대 코트로 안 감) ④선수 행위(네트 터치, 오버 네트 침범—단 자기 쪽 타구 후 팔로스루 허용, 언더 네트 방해, 방해, 고의 소음·제스처) ⑤반복 비신사 행위. 렛은 리시버 미준비, 서버·리시버 동시 폴트, 리턴 후 네트 걸림, 예기치 못한 상황 등.

### Cited Findings (원문 조항)
- [1차] 13.1 서비스가 정확하지 않음(9.1) — [BWF Laws 2023 V2.1](https://cob.org/wp-content/uploads/Section-4.1-Laws-of-Badminton-29-May-2023-V2.1.pdf)
- [1차] 13.2 서비스 중 셔틀이: 13.2.1 네트 위에 걸려 머묾; 13.2.2 넘어간 후 네트에 걸림; 13.2.3 리시버의 파트너가 침 — 같은 PDF
- [1차] 13.3 인플레이 셔틀이: 13.3.1 경계 밖 착지("not on or within the boundary lines"); 13.3.2 네트를 넘지 못함; 13.3.3 천장·측벽 접촉; 13.3.4 선수 몸·옷 접촉; 13.3.5 코트 밖 다른 물체·사람 접촉; 13.3.6 라켓에 잡혀 있다가 던져짐(sling); 13.3.7 같은 선수가 연속 2회 타구 — 단 **한 스트로크에서 헤드와 스트링에 함께 맞는 것은 폴트 아님**; 13.3.8 선수와 파트너가 연속 타구; 13.3.9 라켓에 닿고 상대 코트 방향으로 가지 않음 — 같은 PDF
- [1차] 13.4 인플레이 중 선수가: 13.4.1 라켓·몸·옷으로 네트나 지지대 접촉; 13.4.2 라켓·몸으로 네트 위로 상대 코트 침범 — **단 첫 타점이 자기 쪽이면 팔로스루로 라켓이 넘어가는 것은 허용**; 13.4.3 네트 아래로 침범해 상대를 방해·현혹; 13.4.4 상대의 정당한 스트로크 방해(네트 너머로 따라온 셔틀 상황); 13.4.5 고함·제스처로 고의 방해 — 같은 PDF
- [1차] 13.5 Law 16의 극심/반복/지속적 위반(비신사 행위) — [worldbadminton.com Laws](https://worldbadminton.com/laws/index.html)
- [1차] Law 14 렛: 14.1 주심(주심 없으면 선수)이 선언; 14.2.1 리시버 준비 전 서브; 14.2.2 서비스에서 서버·리시버 동시 폴트; 14.2.3 리턴 이후 셔틀이 네트 위에 걸림; 14.2.4 리턴 이후 넘어간 셔틀이 네트에 걸림; 14.2.5 코치 방해; 14.2.6 선심 시야 가림 + 주심·IRS 판정 불가; 14.2.7 예기치 않은/우발적 상황; 14.3 렛이면 직전 서비스 이후 플레이 무효, 직전 서버가 다시 서브 — 같은 출처
- [2차] 한국어 요약: "셔틀이 네트를 넘어오기 전에 네트를 넘어 셔틀을 치거나 헛쳤을 경우" 반칙, "넘어왔을 경우 셔틀을 치고 상대편 코트로 넘어가는 것은 허용", 다른 코트 셔틀 유입 시 레트 — [인천공항 경기규칙 요약](https://airport.kr/sites/sm/down/sm_rule_01.pdf)

### 퀴즈용 판정 표 (상황 → 결과)
| 상황 | 판정 |
|---|---|
| 셔틀이 라인 위에 떨어짐 | IN (득점) |
| 셔틀이 네트 맞고 넘어가 코트 안 착지(랠리 중) | IN, 계속 |
| 서브가 네트 맞고 서비스 코트 안 착지 | 정상 서브(인플레이) |
| 서브가 네트 위에 걸려 멈춤 | 서버 폴트 |
| 랠리 중 셔틀이 네트 위에 걸려 멈춤 | 렛 |
| 셔틀이 내 몸/옷에 맞음(코트 밖으로 나가는 중이어도) | 내 폴트 → 상대 득점 |
| 라켓 프레임+스트링 한 번 스윙에 맞음 | 폴트 아님 |
| 복식에서 나→파트너 연속 타구 | 폴트 |
| 자기 쪽에서 친 뒤 팔로스루로 라켓이 네트 위로 넘어감(네트 무접촉) | 폴트 아님 |
| 팔로스루 중 라켓이 네트에 닿음 | 폴트(13.4.1) |
| 상대 쪽에 있는 셔틀을 네트 넘어가 침 | 폴트 |
| 다른 코트 셔틀이 굴러 들어옴 | 렛 |
| 리시버가 준비 안 됐는데 서브(리시버 리턴 시도 안 함) | 렛 |
| 서비스 순서/코트가 틀린 것을 랠리 후 발견 | 정정, 점수 유지 |

### Gaps
- 없음(원문 확인).

---

## Q6. 학생 흔한 오개념 (학교 배드민턴)

### Takeaway
오개념에 관한 국내 실증 연구 자료는 찾지 못함. 아래는 규칙 원문과 대조해 "흔히 틀릴 수 있는 지점"을 정리한 [추론] 목록이며, 각 항목의 정답 근거 조항은 1차 확인됨.

### Cited Findings (정답 근거)
- 라인 위 = 아웃? → **인**. "All the lines shall form part of the area which they define" — [BWF Laws 2023](https://cob.org/wp-content/uploads/Section-4.1-Laws-of-Badminton-29-May-2023-V2.1.pdf)
- 서브는 쇼트 서비스 라인만 넘으면 된다? → 단식은 뒤 경계선·단식 사이드라인, 복식은 롱 서비스 라인·복식 사이드라인 안쪽까지, **대각선** 서비스 코트 안이어야 함(9.1, 9.1.3) — 같은 출처
- 서브 높이 = 어깨 아래면 OK? → 1.15 m(또는 대안 규칙: 최하단 갈비뼈 높이의 허리) 아래, 라켓 헤드 하향(대안) — [BWF Laws](https://cob.org/wp-content/uploads/Section-4.1-Laws-of-Badminton-29-May-2023-V2.1.pdf), [Alternative Laws 2027](https://ghanabadminton.org/wp-content/uploads/Section-4.1.4-Alternative-Laws-of-Badminton-04-January-2027-V2.0.pdf)
- 복식에서 득점하면 서버가 파트너에게 넘긴다 / 매번 번갈아 서브한다? → 서비스 편이 득점하면 **같은 서버**가 자리 바꿔 계속 서브; 실점 시 서비스권이 상대에게(11.3) — [worldbadminton.com Laws](https://worldbadminton.com/laws/index.html)
- 리시브 편도 득점하면 자리를 바꾼다? → 아님. 서비스 편이 서브로 득점할 때만 이동(11.1.5) — 같은 출처
- 복식 서브 순서를 "A→B→C→D" 식으로 외움? → 점수 parity로 결정되며 최초 서버(오른쪽)→리시버 파트너→서버 파트너→최초 리시버(11.4) — 같은 출처
- 팔로스루에 라켓이 네트 넘어가면 무조건 폴트? → 첫 타점이 자기 쪽이고 네트를 안 건드리면 허용(13.4.2); 네트를 건드리면 폴트(13.4.1) — [BWF Laws 2023](https://cob.org/wp-content/uploads/Section-4.1-Laws-of-Badminton-29-May-2023-V2.1.pdf)
- 셔틀이 몸에 맞으면 친 사람 실점? → 맞은 선수의 폴트(13.3.4). 아웃될 공이 몸에 맞아도 맞은 쪽 폴트 — 같은 출처
- 네트에 맞고 넘어간 서브는 렛(테니스식)? → 배드민턴은 서비스 렛 없음; 서비스 코트 안에 떨어지면 정상 — 9.1 비교 [추론, 테니스 규칙과의 혼동]
- 단식·복식 라인 혼동: 단식은 안쪽 사이드라인 + 맨 뒤 라인, 복식 랠리는 바깥 사이드라인 + 맨 뒤 라인(복식 롱 서비스 라인은 **서브 때만**) — Q1 표 참조
- 셔틀 프레임 맞음/두 번 맞은 소리 = 더블히트? → 한 스트로크에 헤드+스트링 동시 접촉은 폴트 아님(13.3.7)

### Gaps
- 국내 학생 오개념 실태 조사·연구 논문 미발견. 수업 사전 진단 퀴즈로 데이터 수집을 권장.

---

## Q7. 2022 개정 체육과 교육과정 연계 (중학교)

### Takeaway
2022 개정 중학교 체육은 학년 구분 없이 **1~3학년군** 성취기준으로 제시. 배드민턴은 **스포츠 영역 → 전략형 스포츠 → 네트형 스포츠**에 해당하며 성취기준은 **[9체02-16]~[9체02-18]**(사용자 제시 13~15는 **필드형**이므로 정정 필요), 태도 성취기준은 **[9체02-25]~[9체02-27]**(특히 [9체02-26] 경기 예절·정정당당).

### Cited Findings
- [2차, 원문 인용 정리] 네트형: "[9체02-16] 네트형 스포츠의 역사와 특성을 탐색하고 비교한다." / "[9체02-17] 네트형 스포츠의 수행 원리를 적용하여 경기 기능을 수행하고 향상한다." / "[9체02-18] 네트형 스포츠의 경기 방법을 이해하고 경기 전략을 활용하며 안전하게 경기한다." — [브런치 '2022 개정 교육과정: 체육과 교육과정'](https://brunch.co.kr/@sobong3/113)
- [2차] 전략형 코드 체계: 영역형 [9체02-10~12], 필드형 [9체02-13~15], 네트형 [9체02-16~18]; 동작형 01~03, 기록형 04~06, 투기형 07~09, 생활환경형 19~21, 자연환경형 22~24 — 같은 출처
- [2차] 태도: "[9체02-25] 스포츠의 연습과 경기 과정에서 인내심을 발휘하여 적극적으로 도전한다." / "[9체02-26] 스포츠의 연습과 경기 과정에서 구성원 간에 서로 신뢰하며 팀 목표를 달성하기 위해 노력하고 경기 예절을 갖추며 정정당당하게 참여한다." / "[9체02-27] 스포츠 환경에 대한 친화적 태도와 지속가능한 스포츠 환경을 만들기 위한 공동체 의식을 발휘한다." — 같은 출처
- [2차] 평가 안내: "전략형 스포츠에서는 개인 및 팀의 경기 수행 능력을 실제 경기를 통해 평가하고, 공동체 활동에 필요한 바람직한 태도를 평가한다." / "디지털 도구를 활용하여 학습자의 학습 과정과 결과를 누적하여 기록함으로써 신체활동 역량을 종합적으로 평가한다." — 같은 출처
- [2차] 전략형은 영역형·필드형·네트형으로 구성, 네트형은 "팀원과 호흡하며 공격과 수비를 빠르게 전환하는 것에 중점" — [공주대 김원정, 2022 개정 체육과 교육과정 연수자료(교육청 게시 PDF)](https://www.jge.go.kr/upload/open/na/bbs_297/ntt_5129782/doc_5a0e4c31-a382-4b1d-859f-758f0abb76a21732a2500b54458.pdf) (파일이 10MB 초과로 본문 직접 열람 실패, 검색 스니펫 기반)
- [2차] 2022 개정 총론의 개정 중점 중 하나로 "디지털 교육환경 조성" — [한국 vs 중국 2022 개정 중학교 체육과 교육과정 비교(경상국립대)](https://scholarworks.gnu.ac.kr/item/1c28f62c-e06b-425c-82a8-155f90d8e90f)

### Inferences
- [추론] 시뮬레이터 매핑: 코트·인아웃·폴트 퀴즈 → [9체02-18](경기 방법 이해·안전); 서비스 코트/점수 시뮬레이터 → [9체02-18]; 규칙 변천(21→15점, 1.15 m 서비스) 탐구 → [9체02-16](역사와 특성); 셀프 저지(자기 판정) 정직성 → [9체02-26](경기 예절·정정당당); 디지털 누적 기록 평가 안내와 직접 연결.
- [추론, 일반지식] 2022 개정 교육과정은 중학교 1학년 2025년, 2학년 2026년부터 적용 → 2026년 중2는 2022 개정 적용 대상(교육부 적용 일정 원문 미확인).

### Gaps
- NCIC/교육부 고시 제2022-33호 [별책 11] 원문 PDF를 직접 열람하지 못함 → 성취기준 문구는 블로그 인용(원문과 일치할 가능성 높으나 **원문 대조 필요**). 성취기준별 '해설'과 '적용 시 고려사항'의 네트형 관련 정확한 문구(간이 게임·변형 규칙·디지털 도구 언급) 미확인.
- 2022 개정 중학교 체육 검정 교과서(출판사별) 네트형 단원의 배드민턴 수록 여부 미확인.

---

## Q8. 학교 수업용 기본 규칙(권장안) — 공식 규칙과 분리

### Takeaway
BWF 대안 규칙이 **사전 합의 시 11점 게임과 허리(갈비뼈) 서비스 규칙을 공식 허용**하므로, 학교 기본안은 "11점 또는 15점 단판, 허리 서비스, 랠리포인트·서비스 코트 규칙은 공식 그대로"가 근거 있는 선택. 국내 학교 수업 관행에 관한 1차/공신력 자료는 찾지 못함.

### Cited Findings
- [1차] 11점 게임(5게임제) 및 21점 단판, 허리(최하단 갈비뼈)+라켓 하향 서비스 규칙을 대안 규칙으로 허용 — [Alternative Laws 2027 V2.0](https://ghanabadminton.org/wp-content/uploads/Section-4.1.4-Alternative-Laws-of-Badminton-04-January-2027-V2.0.pdf)
- [1차] 2027 본규칙 15점제(14-all 2점 차, 21점 상한, 8점 인터벌) — [worldbadminton.com Laws](https://worldbadminton.com/laws/index.html)
- [2차] KBA 요약은 초등부 17점제(16:16 듀스, 25점 상한, 9점 코트 교체)를 별도 운영 — [인천공항 경기규칙 요약](https://airport.kr/sites/sm/down/sm_rule_01.pdf)

### 권장 학교 기본 프리셋 [추론 — 공식 아님, 교사 선택용]
| 항목 | 공식(현행 2025) | 공식(2027~) | **학교 기본안(권장)** |
|---|---|---|---|
| 게임 점수 | 21점, 3게임 2선승 | 15점, 3게임 2선승 | **11점 단판**(수업 1차시 다회전) 또는 15점 단판 |
| 듀스(세팅) | 20-20→2점 차, 30점 상한 | 14-14→2점 차, 21점 상한 | **없음(11점 선취 승)** 또는 옵션: 10-10→2점 차, 15점 상한 |
| 득점 방식 | 랠리포인트 | 랠리포인트 | 랠리포인트(동일) |
| 서비스 높이 | 1.15 m | 1.15 m | **허리(최하단 갈비뼈) 아래 + 라켓 헤드 하향**(대안 규칙) |
| 서비스 코트 | 짝우홀좌 | 동일 | 동일(학습 목표) |
| 코트 교체/인터벌 | 11점 | 8점 | 6점(11점제) 또는 생략 |
| 판정 | 주심·선심 | 동일 | 셀프 저지 + 이견 시 렛(재경기) ※ |
| 네트 터치 | 폴트 | 폴트 | 폴트(안전 교육과 연계) |
- ※ 셀프 저지 이견 시 렛 처리는 BWF 14.1("주심이 없으면 선수가 렛 선언")에 기반한 운영안 [추론].
- 시뮬레이터 설계 권장: `ruleset = OFFICIAL_2025 | OFFICIAL_2027 | SCHOOL` 토글, UI에 "공식 규칙 / 수업 규칙" 배지 명시.

### Gaps
- 국내 중학교 배드민턴 수업의 점수제 관행(11점/15점 등) 실태 자료 미발견 — 교사 커뮤니티(인디스쿨 등) 추가 조사 필요.

---

## Q9. 한국어 용어

### Takeaway
아래 용어는 국내 통용 표기. KBA 공식 용어집 원문은 미확인.

### Cited Findings
- [2차] 폴트(반칙), 레트/렛(Lets, 경기중단 및 무효), 서비스/서버/리시버, 서비스 코트, 랠리포인트제, 인터발 — [인천공항 경기규칙 요약](https://airport.kr/sites/sm/down/sm_rule_01.pdf)

### 용어 대응표 (영문 ↔ 한국어) [통용 표기, 대부분 2차/일반지식]
- Short service line ↔ 쇼트(숏) 서비스 라인 / Long service line for doubles ↔ (복식) 롱 서비스 라인 / Back boundary line ↔ 백 바운더리 라인(뒤 경계선) / Centre line ↔ 센터 라인 / Side line for singles·doubles ↔ 단식·복식 사이드라인
- Service court ↔ 서비스 코트 / Fault ↔ 폴트 / Let ↔ 렛(레트) / Rally point ↔ 랠리포인트 / Setting·Deuce ↔ 세팅·듀스(20-20 이후 연장) / Interval ↔ 인터벌
- Strokes: High clear ↔ 하이클리어 / Drop ↔ 드롭 / Smash ↔ 스매시 / Hairpin(net shot) ↔ 헤어핀 / Drive ↔ 드라이브 / Short serve·Long(high) serve ↔ 숏 서비스·롱(하이) 서비스

### Gaps
- "세팅" 용어: 구 규칙(15점 서브득점제)의 선택적 연장 제도 명칭이 일상적으로 듀스 의미로 쓰임 — 현행 규칙에는 '세팅' 선택권이 없고 자동 연장(20-all)임 [일반지식, 1차 비교 미실시].
