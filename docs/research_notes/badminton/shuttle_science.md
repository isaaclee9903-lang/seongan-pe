# 셔틀콕과 배드민턴의 과학 (체육 × 과학, 중2 융합 읽기자료용 리서치 노트)

작성일: 2026-10-08. 표기: **[1차]** = 원 논문·규정·공식 기록 페이지에서 직접 확인 / **[2차]** = 언론·해설·상업 사이트 등 재인용. "추론"은 출처 수치로 직접 계산한 값.

교육과정 매핑 메모(전체 공통):
- 중학교 범위(2022 개정, 힘의 작용·운동·기체): 중력(셔틀이 떨어짐), 마찰력/공기 저항을 "운동을 방해하는 힘"으로 정성적 설명, 탄성력(라켓 줄·샤프트), 힘의 표현(화살표: 크기·방향·작용점), 속력 = 거리 ÷ 시간(km/h ↔ m/s 환산), 기체(온도가 오르면 공기 밀도가 작아짐 → 기체 단원 입자 운동과 연결).
- 중학교 범위를 넘는 개념(정성적으로만): 항력 ∝ v²(빠를수록 저항이 훨씬 커짐), 종단 속도, 토크(돌림힘), 질량중심·압력중심, 지수함수적 감속, 항력계수 C_D, 레이놀즈 수, 감쇠 진동.

## 1. 셔틀콕은 왜 항상 코르크가 앞으로 날아가나 (뒤집힘, turnover / self-righting)

### Takeaway
무거운 코르크(머리) 쪽에 질량중심이 있고, 공기 저항은 넓은 깃털 치마(뒤쪽)에 주로 작용하기 때문에, 저항력이 셔틀을 "돌려 세우는" 방향으로 작용한다. 라켓에 맞아 거꾸로 출발해도 약 15~35 ms(0.015~0.035초) 안에 뒤집히고, 약 0.1~0.2초 안에 안정된다.

### Cited Findings
- 논문 정보: C. Cohen, B. Darbois Texier, D. Quéré, C. Clanet, "The physics of badminton", *New Journal of Physics* 17, 063001 (2015), LadHyX, École Polytechnique. 오픈 액세스. **[1차]** — [IOP NJP](https://iopscience.iop.org/article/10.1088/1367-2630/17/6/063001); [IP Paris 연구 포털](https://researchportal.ip-paris.fr/en/publications/the-physics-of-badminton/)
- 셔틀 기본값(논문 모델): 질량 M = 5 g, 길이 L = 10 cm, 지름 D = 6 cm, 거위 깃털 16개를 코르크에 꽂음. **[1차]** — [NJP 2015](https://iopscience.iop.org/article/10.1088/1367-2630/17/6/063001)
- 원리: 코르크는 무겁고(모델 3.0 g) 치마는 가벼워(모델 2.0 g) 질량중심이 코르크 근처에 있고, 압력중심(공기 힘이 모이는 점)과 떨어져 있다. 그래서 항력이 코르크를 앞으로 돌리는 "복원 토크"로 작용한다. 질량중심–압력중심 거리 약 3.0 cm(Cooke의 추정치 인용). **[1차]** — [NJP 2015](https://iopscience.iop.org/article/10.1088/1367-2630/17/6/063001)
- 시간 척도: 라켓과의 접촉 약 1 ms, 뒤집힘 보통 약 20 ms. 예시 (a) 출발 속력 약 18.6 m/s: 뒤집힘 약 15 ms, 진동 약 80 ms, 약 130 ms 후 정렬. 예시 (b) 약 10.4 m/s: 뒤집힘 약 35 ms, 진동 약 120 ms, 약 180 ms 후 안정. 즉 느리게 칠수록 뒤집히는 데 더 오래 걸린다. **[1차]** — [NJP 2015](https://iopscience.iop.org/article/10.1088/1367-2630/17/6/063001)
- 결론부: 상업용 셔틀 모양은 경험적으로 뒤집힘·안정 시간이 짧도록 정해졌다. 선수들은 네트 앞 헤어핀(net shot)으로 안정을 늦춰 상대가 깨끗하게 치기 어렵게 만든다. **[1차]** — [NJP 2015](https://iopscience.iop.org/article/10.1088/1367-2630/17/6/063001)
- 같은 연구진의 APS 2011 발표: 셔틀은 늘 머리 쪽이 앞으로 날기 때문에 맞은 뒤 반드시 돌아서야 하며, 돌아서 진동하다가 안정된다(감쇠 진동). 민들레 씨앗·낙하산병과 비교. **[1차, 학회 초록]** — [APS DFD 2011 Part 2: Turn around](https://meetings-archive.aps.org/dfd/2011/r10/6/); [Part 1: aerodynamics](https://meetings-archive.aps.org/dfd/2011/m10/8/)
- 후속 연구(SAGE, 2015): 뒤집힘 각도 반응을 감쇠가 적은 2차 시스템으로 모델링, 깃털 셔틀이 감쇠비가 가장 크고 시간 상수가 가장 작아 뒤집힘 안정성이 가장 좋음. **[2차, 검색 요약 기반]** — [SAGE, Proc. IMechE Part P](https://journals.sagepub.com/doi/10.1177/1754337115596481)
- 뒤집힘의 유동장 메커니즘은 아직 완전히 이해되지 않았다는 연구도 있다. **[2차]** — [ISPIV21 Flow Field around the Badminton Shuttlecock during Flipping Motion](https://ispiv21.library.iit.edu/index.php/ISPIV/article/view/94)

### Inferences
- 교실 비유: 다트·화살·배드민턴 셔틀 모두 "무거운 앞 + 넓은 뒤(꼬리깃)" 구조. 화살 깃이 뒤에 있는 이유와 같다. 중학생용 표현: "공기는 넓은 깃털 쪽을 더 세게 뒤로 잡아당기고, 무거운 코르크는 계속 앞으로 가려 하니까 저절로 머리가 앞을 향한다."
- 힘의 표현(화살표) 활동: 코르크에 중력 화살표, 깃털 치마에 공기 저항 화살표(뒤쪽 방향)를 그리게 하면 중학교 범위 안에서 설명 가능. "돌림힘/토크·압력중심"이라는 용어는 심화 박스로만.
- 데모 수치: 20 ms 동안 18.6 m/s로 가면 약 0.37 m 이동 → "라켓을 떠나 약 40 cm 안에 뒤집힌다"(추론, 수평 속력 일정 가정의 대략값).

### Gaps
- 뒤집히는 동안 이동하는 거리를 논문이 직접 cm로 제시했는지 확인 못함(위 0.37 m는 추론값).
- Lighthill의 셔틀 관련 원저는 찾지 못함.

## 2. 급격한 감속과 비대칭 궤적 (스매시 속도, 종단 속도, 삼각형 궤적)

### Takeaway
셔틀은 질량에 비해 공기 저항이 매우 커서 종단 속도가 약 6.7 m/s(약 24 km/h)에 불과하다. 그래서 빠른 스매시도 몇 m만 날아가면 속력이 절반 이하로 떨어지고, 높이 친 클리어는 포물선이 아니라 "삼각형"처럼 거의 수직으로 뚝 떨어진다.

### Cited Findings
- 공기역학적 길이 𝓛 = 2M/(ρSC_D): 모델 셔틀 4.6 m(M = 5.0 g, C_D = 0.65±0.05). 측정값 깃털 약 4.04 m, 플라스틱 약 4.48 m(플라스틱 5.3 g). 종단 속도 U∞ = √(g𝓛) ≈ 6.7 m/s. 단면적 S = 28 cm². 항력계수 깃털 0.65±0.05, 플라스틱 0.68±0.05, 상업용 0.6~0.7. **[1차]** — [NJP 2015](https://iopscience.iop.org/article/10.1088/1367-2630/17/6/063001)
- 기록된 최고 속도 137 m/s(약 493 km/h)에서도 최대 도달 거리는 13.8 m뿐이며, 코트 길이 13.4 m와 비슷하다. 출발 속도가 종단 속도보다 훨씬 크면 거리가 더 늘지 않고 𝓛에 비례하는 값으로 "포화"된다. 느린 출발에서는 일반 포물선 공식 x = U₀² sin2θ / g. **[1차]** — [NJP 2015](https://iopscience.iop.org/article/10.1088/1367-2630/17/6/063001)
- 비교: 테니스공 최대 도달 거리 약 66.9 m(코트 24 m). 랠리당 타구 수: 정상급 배드민턴 13.5회 vs 테니스 3.5회. **[1차]** — [NJP 2015](https://iopscience.iop.org/article/10.1088/1367-2630/17/6/063001)
- 궤적: 대부분의 타구에서 궤적은 "거의 삼각형". 깃털 셔틀이 플라스틱보다 더 삼각형에 가깝다. 클리어는 거의 수직으로 떨어지며 끝난다. **[1차]** — [NJP 2015](https://iopscience.iop.org/article/10.1088/1367-2630/17/6/063001)
- 실내 경기 이유: 클리어의 마지막 낙하가 거의 수직이라 바람에 매우 민감. 옆바람 1 m/s, 발사각 60°일 때 낙하 지점이 약 8 cm 움직이며 이는 셔틀 크기보다 크다. 그래서 경기 배드민턴은 실내에서 한다. **[1차]** — [NJP 2015](https://iopscience.iop.org/article/10.1088/1367-2630/17/6/063001)
- 속도 감쇠 실측(2026 arXiv 프리프린트, E. Collet): 고속 카메라로 엘리트 선수 촬영. 깃털 셔틀은 속도가 지수적으로 감소하며, 500 km/h를 넘는 초기 속력도 약 3.35 m마다 절반으로 줄어든다(셔틀 "스피드 지수"에 따라 다름). 서론 예시: 약 240 km/h(67 m/s)가 약 0.6초 안에 약 25 km/h(6.9 m/s)로. 플라스틱 셔틀은 고속에서 변형되어 항력계수가 줄어 고수 경기에 부적합. 왼손잡이의 슬라이스(또는 오른손잡이의 리버스 슬라이스)로 생긴 회전은 셔틀을 더 느리게 한다. **[1차이나 동료심사 전 프리프린트]** — [arXiv:2601.01412](https://arxiv.org/abs/2601.01412)
- 종단 속도 비교(물리 프리프린트 표): 테니스공 22 m/s, 셔틀 6.7 m/s; 저항 계수 k 테니스공 0.002, 셔틀 0.022 s²/m². 원 출처는 불명확. **[2차]** — [arXiv:2103.11111](https://arxiv.org/pdf/2103.11111)
- 셔틀 항력계수 측정값은 연구마다 넓게 다름(깃털 0.48 < C_D < 0.74), 풍동 장치 차이 때문. Cooke(1999, *Sports Engineering* 2(2):85–96)는 3~44 m/s 범위에서 항력·양력·피칭모멘트 측정, 합성 셔틀이 치마 변형 때문에 대체로 C_D가 낮다는 결과(후속 연구 요약). **[2차]** — [Cooke 관련 기록](https://www.worldbadminton.com/reference/research/documents/5084354.pdf); [Aerodynamics of a Badminton Shuttlecock](https://www.worldbadminton.com/reference/research/documents/Aerodynamics_of_a_Badminton_Shuttlecock.pdf)
- 기온·습도 영향(NJP 부록 B): 0→40 °C에서 공기 밀도 1.293→1.127 kg/m³, 𝓛 4.60→5.28 m, 최대 거리 13.1→14.7 m(약 10% 증가). 습도 15%→92%에서 깃털 셔틀 질량 5.16→5.46 g, 최대 거리 14.4→15.1 m(최대 약 5%). 선수들은 더운 날 가벼운 셔틀 선택, 깃털 끝 조정, 셔틀을 미리 습기에 노출하는 식으로 보정. **[1차]** — [NJP 2015](https://iopscience.iop.org/article/10.1088/1367-2630/17/6/063001)

### Inferences (데모용 간단 수치, 모두 추론)
- 단위 환산: 6.7 m/s × 3.6 ≈ 24 km/h(자전거 정도). 565 km/h ÷ 3.6 ≈ 157 m/s.
- "절반 규칙" 데모(Collet의 3.35 m 반감 거리 사용): 565 km/h → 3.35 m 후 약 283 km/h → 6.7 m 후 약 141 km/h → 10 m 후 약 71 km/h. 단식 코트 한쪽 끝에서 반대쪽(13.4 m)까지는 훨씬 더 느려진다. NJP 𝓛 ≈ 4.6 m로 계산한 반감 거리 𝓛·ln2 ≈ 3.2 m와도 잘 맞음(수평에 가까운 고속 비행, 중력 무시 근사).
- 테니스공 𝓛 대략값: 질량 57 g, 지름 6.7 cm, C_D ≈ 0.55 가정 시 𝓛 ≈ 49 m, √(9.8×49) ≈ 22 m/s → 셔틀보다 약 10배 긴 "감속 거리", 종단 속도 약 3배. 위 22 m/s 표와 일치(가정값 사용 추론).
- 중학교 설명: "공기 저항은 빠를수록 엄청 커진다(심화: 속력의 제곱에 비례)" → 빠른 셔틀일수록 브레이크가 세게 걸림. 종단 속도 = "떨어질 때 중력과 공기 저항이 같아져서 더 이상 빨라지지 않는 속력"으로 정성적 제시. 기체 단원 연결: 따뜻한 공기 = 입자 간격이 넓어 밀도 작음 → 저항 작음 → 더 멀리 감.
- 인터랙티브 데모 파라미터 제안: g = 9.8 m/s², 𝓛 = 4.6 m(깃털), 테니스공 𝓛 ≈ 49 m, 가속도 a = −g ĵ − (|v|/𝓛)·v. 0.01 s 스텝 오일러 적분이면 충분.

### Gaps
- "Tartaglia 곡선" 표현은 NJP 본문 가져온 부분에서 직접 확인 못함(논문은 "거의 삼각형(nearly triangular)"이라는 표현 사용). Tartaglia의 16세기 포탄 궤적 그림과 비교하는 내용은 Cohen et al.의 다른 글에 있다는 기억이 있으나 이번에 확인 못했으므로 쓰려면 "삼각형 궤적"으로 표현 권장.
- 스매시가 상대 코트에 도착할 때의 실측 속도(단일 수치)는 찾지 못함. 2026 프리프린트의 반감 거리로 추론해야 함.
- 2026 arXiv 논문은 동료심사 여부 미확인.

## 3. 세계 기록 스매시 속도 (기네스)

### Takeaway
남자 기록 565 km/h(Satwiksairaj Rankireddy, 인도), 여자 기록 438 km/h(Tan Pearly, 말레이시아), 둘 다 2023년 4월 14일 일본 Yonex 공장 체육관에서 측정. 이전 남자 기록은 Tan Boon Heong(말레이시아)의 493 km/h(2013). 모두 "라켓을 막 떠난 순간" 속도이며 실제 경기 중 기록이 아님.

### Cited Findings
- 남자: 565 km/h(351.07 mph), Satwiksairaj Rankireddy(인도), 2023-04-14, 일본 사이타마현 소카시 Yonex 시설. 초당 40,000프레임 NAC 초고속 카메라로 임팩트 직후 속도 측정, 라켓 Yonex NANOFLARE 1000 Z. 이전 기록 493 km/h(Tan Boon Heong)보다 72 km/h 빠름. **[1차: 기네스 페이지 + 2차 언론]** — [Guinness World Records: Fastest badminton hit (male)](https://www.guinnessworldrecords.de/world-records/92507-fastest-badminton-hit-male); [News on AIR](https://newsonair.gov.in/indian-shuttler-satwiksairaj-rankireddy-sets-guinness-world-record-for-fastest-badminton-shot); [Onmanorama](https://www.onmanorama.com/sports/other-sports/2023/07/18/satwiksairaj-rankireddy-breaks-world-record-for-fastest-hit-by-a-shuttler.amp.html)
- 여자: 438 km/h(약 272 mph), Tan Pearly(말레이시아), 2023-04-14, Yonex 도쿄 공장 체육관(소카), 같은 라켓·같은 측정법. 이 부문 최초의 여자 기네스 보유자. 발표는 2023년 7월. **[1차: 기네스 페이지 + 2차]** — [Guinness World Records: Fastest badminton hit (female)](https://guinnessworldrecords.com/world-records/437656-fastest-hit-of-a-badminton-shuttlecock-female); [Malay Mail](https://www.malaymail.com/news/sports/2023/07/18/pearly-tan-sets-world-record-for-fastest-badminton-smash/80475)
- NJP 2015는 기록된 최고 셔틀 속도로 137 m/s(= 약 493 km/h, Tan Boon Heong 기록과 일치)를 사용. **[1차]** — [NJP 2015](https://iopscience.iop.org/article/10.1088/1367-2630/17/6/063001)
- 실제 경기 기록(참고): Lakshya Sen 2023 BWF 캐나다 오픈 결승 420 km/h(남자 단식). **[2차, 검색 요약]** — [The Bridge](https://thebridge.in/badminton/satwik-smashes-guinness-world-record-fastest-badminton-shot-43045)
- F1 비교는 출처마다 수치가 다름(372.6 km/h vs 397.36 km/h) → 수업에서 쓰지 않거나 "F1 자동차 최고속도보다 빠르다" 정도로만. **[2차]** — [Tabla](https://www.tabla.com.sg/lifestyle/sports-fitness/satwike28099s-smash-faster-than-f1-car-1321415)

### Inferences
- 565 km/h = 약 157 m/s. 이 속도면 13.4 m를 0.085초에 가겠지만, 실제로는 감속 때문에 훨씬 오래 걸림 → "속력 = 거리 ÷ 시간" 계산 후 "왜 실제와 다를까?" 토론 소재.
- 기록은 통제된 환경(실내, 선수가 셔틀을 위로 띄워 치는 방식 등)에서 측정한 "출발 속도"임을 강조.

### Gaps
- 2023년 이후(2024~2026) 기록 경신 여부는 기네스 사이트에서 확인되지 않음(검색 범위에서 경신 보도 없음). 최종본 전 기네스 페이지 재확인 권장.

## 4. 셔틀콕의 구조 (BWF 규칙 2·3조), 깃털, 합성 셔틀, 스피드 번호

### Takeaway
규정 셔틀은 깃털 16개, 깃털 길이 62~70 mm, 깃털 끝 원 지름 58~68 mm, 코르크 지름 25~28 mm, 무게 4.74~5.50 g. 속도 시험은 뒤쪽 라인에서 언더핸드로 힘껏 쳐서 반대편 뒤쪽 라인보다 530~990 mm 짧게 떨어지면 합격. 기온·고도·습도에 따라 공기 밀도가 달라 서로 다른 "스피드" 셔틀을 고른다.

### Cited Findings
- BWF Laws(2016년 6월 개정본 텍스트, worldbadminton 사본) **[1차 규정 사본]** — [Laws of Badminton booklet (2017-02-16)](https://worldbadminton.com/laws/documents/20170216_rulesBooklet.pdf); [BWF 원본 PDF(2016)](https://system.bwfbadminton.com/documents/folder_1_81/Regulations/Laws/Part%20II%20Section%201A%20-%20Laws%20of%20Badminton%20-%20June%202016%20Revised.pdf)
  - 2.1 천연·합성 재료 모두 가능하되 비행 특성은 얇은 가죽으로 싼 코르크에 천연 깃털을 꽂은 셔틀과 대체로 비슷해야 함.
  - 2.2.1 깃털 16개 / 2.2.2 깃털 길이 62~70 mm(끝에서 베이스 위까지) / 2.2.3 깃털 끝은 지름 58~68 mm 원 위 / 2.2.5 베이스 지름 25~28 mm, 바닥은 둥글게 / 2.2.6 무게 4.74~5.50 g.
  - 2.3.3 비깃털(합성) 셔틀: 같은 치수·무게 기준이되, 재료 비중 차이 때문에 최대 10% 오차 허용.
  - 2.4 고도나 기후 때문에 표준 셔틀이 맞지 않는 곳에서는 회원 협회 승인으로 규격 변경 가능(디자인·속도·비행이 같다는 조건).
  - 3.1 시험: 뒤쪽 경계선 위에서 셔틀을 맞히는 완전한 언더핸드 스트로크, 위쪽 각도로, 사이드라인과 평행하게. 3.2 정상 속도 셔틀은 반대편 뒤쪽 경계선보다 530 mm 이상, 990 mm 이하 짧게 떨어짐.
- 2016 텍스트 기준이며 최신 판에서 바뀌었는지는 BWF 사이트(접속 403) 확인 불가. 검색 결과상 2006·2016·2017 판 모두 같은 수치. **[주의]** — [worldbadminton 2006 Laws](https://worldbadminton.com/laws/rules_2006.htm)
- NJP 2015: 깃털이 서로 겹쳐 꽂혀 있어 축 대칭이 완벽하지 않으므로 공기 흐름 속에서 셔틀이 자기 축으로 회전. 깃털 셔틀이 회전이 빨라 세차(흔들림)를 줄이고, 항력이 커서 세게 쳐도 코트 밖으로 덜 나가므로 숙련자가 선호. **[1차]** — [NJP 2015](https://iopscience.iop.org/article/10.1088/1367-2630/17/6/063001)
- 왼쪽 날개 vs 오른쪽 날개: BWF 부회장 Paisan Rangsikitpho 인용 — 왼쪽 날개 깃털 16개로 만들면 스매시 때 시계 방향, 오른쪽 날개면 반시계 방향으로 회전(날개 곡률 차이). 두 날개를 섞으면 흔들림. Yonex도 한 셔틀에 양쪽 날개를 섞지 않는다고 함. 다만 "왼쪽 날개만 쓴다"는 BWF 규정은 없고, 1996년 공학 교재는 오른쪽 날개라고 기술하는 등 상충. **[2차, 상충 있음]** — [Inverse (2016)](https://www.inverse.com/article/19768-2016-rio-olympics-goose-geese-left-wing-badminton-shuttlecock); [Improbable Research](https://improbable.com/2013/01/23/shuttlecock-aerodynamics-part-4-an-emigma/)
- 거위 vs 오리: 오리 깃털이 덜 튼튼해 거위 셔틀을 선호하기도 함. **[2차, 상업 블로그]** — [Badminton Bites](https://badmintonbites.com/why-do-badminton-shuttlecocks-have-16-feathers/)
- 합성 셔틀 승인 역사:
  - 2020년 1월 BWF, 2021년부터 모든 등급 국제 대회에 합성 깃털 셔틀 사용 승인(첫 제품 Yonex 기술 협력). 더 튼튼하고 경제적, 셔틀 사용량 최대 25% 절감. **[2차, 언론의 BWF 발표 보도]** — [Free Malaysia Today](https://www.freemalaysiatoday.com/category/sports/2020/01/20/bwf-approves-synthetic-feather-shuttlecocks-from-2021); [OCA](https://oca.asia/news/377-badminton-approves-use-of-synthetic-feather-shuttlecocks.html)
  - 2026년 4월 BWF, VICTOR New Carbon Sonic Max(SC-NCS-MAX-12)와 YONEX CROSSWIND 70 합성 셔틀을 BWF Grade 3 대회·주니어 국제대회에서 시범 사용 승인, 비행 특성·일관성 데이터 수집 후 상위 대회 도입 검토. 동물 보호 단체들은 살아 있는 새에서 깃털을 뽑는 관행을 오랫동안 비판. **[2차]** — [IANS](https://ianslive.in/bwf-approves-use-of-synthetic-shuttlecocks-at-select-events--20260408173722); [Insider Sport (2026-04-09)](https://insidersport.com/2026/04/09/badminton-tests-life-beyond-feathers/)
- 나일론(플라스틱) 셔틀: NJP 측정 플라스틱 5.3 g, C_D 0.68, 𝓛 ≈ 4.48 m(깃털 4.04 m보다 김 = 덜 감속), 궤적이 덜 삼각형. 고속에서 치마가 변형되어 항력이 줄어듦. **[1차]** — [NJP 2015](https://iopscience.iop.org/article/10.1088/1367-2630/17/6/063001); [arXiv:2601.01412](https://arxiv.org/abs/2601.01412)
- 스피드 번호: 숫자가 작을수록 느린 셔틀(더운 곳·저지대·습한 곳), 클수록 빠른 셔틀(추운 곳·고지대·건조한 곳). 판매 가이드 표: 75 더운 홀, 76 평균, 77 평균(보통), 78 추운 홀, 79 매우 추운 홀. Yonex 1~5 번호는 75~79에 대응하는 것으로 보임(가이드 간 불일치). 나일론은 캡 색(초록 느림, 파랑 중간, 빨강 빠름). **[2차, 판매/쇼핑 가이드 — Yonex 공식 표 미확인]** — [Shopee MY 가이드](https://shopee.com.my/blog/best-shuttlecock-malaysia/); [Lazada SG 가이드](https://sports.lazada.sg/how-to-choose-the-right-yonex-shuttlecock-for-your-skill-level-and-playing-conditions-sg/)

### Inferences
- 활동 아이디어: 규정 수치(16개, 62~70 mm, 4.74~5.50 g)를 실제 셔틀로 자·저울 측정 → "규정 안에 드나?" 확인(측정·오차 개념).
- 왜 더운 날 느린 셔틀을? 기체 단원: 온도↑ → 공기 밀도↓ → 공기 저항↓ → 셔틀이 더 멀리 감 → 이를 상쇄하려 "느린(무거운/저항 큰)" 셔틀 선택. NJP의 0→40 °C 거리 +10% 수치로 뒷받침.
- 속도 시험(3조)은 "같은 힘으로 쳤을 때 도달 거리로 셔틀의 빠르기를 비교"하는 공정한 실험 설계 사례로 소개 가능.

### Gaps
- 스피드 번호가 내부적으로 무엇(무게 등 "grain")에 해당하는지 Yonex 공식 자료 미확인.
- 오리 깃털 셔틀의 날개 방향 규칙 자료 없음.
- 최신(2024~2026) BWF Laws 원문은 403으로 직접 확인 불가.

## 5. 라켓 줄과 탄성 (장력, 트램펄린 효과, 라켓 무게)

### Takeaway
줄은 탄성체다. 장력이 낮으면 줄이 더 늘어났다가 되돌아오며 셔틀을 밀어주는 "트램펄린 효과"로 힘(반발)이 커지고, 장력이 높으면 줄면이 평평하게 유지되어 방향 조절(컨트롤)이 쉬워진다. 라켓은 줄 없이 대략 75~90 g(4U ≈ 80~84.9 g)으로 매우 가볍다.

### Cited Findings
- 장력 낮음 → 줄이 더 늘어났다 빨리 되돌아가 셔틀에 속도를 더함; 장력 높음 → 늘어날 여지가 적어 트램펄린 효과는 작지만 줄면이 평평해 방향 조절 쉬움. 너무 높으면 프레임·줄 파손, 너무 낮으면 컨트롤·파워 모두 손실. **[2차, 줄 제조사(Ashaway) 설명]** — [Ashaway Badminton Tip](https://www.ashawayusa.com/BadmintonTip2.php)
- Mahidol 대학 연구 요약: 낮은 장력이 파워를 높임; 접촉(dwell) 시간이 길어지는 것이 기제. 와이오밍 대학 연구 요약: 전문가는 장력이 달라도 비슷한 품질의 샷을 치지만 높은 장력을 선호. **[2차, 해설 블로그의 요약 — 원 논문 미확인]** — [Badminton Bites: String tension](https://badmintonbites.com/string-tension/)
- 줄은 매긴 다음 날 사용하지 않아도 장력이 약 10% 떨어진다는 주장. **[2차, 출처 약함]** — [Badminton Bites](https://badmintonbites.com/string-tension/)
- NJP 2015도 "샤프트와 줄의 강성이 발사 속도에 어떻게 최적화되는가"를 미해결 질문으로 남김 — 즉 과학적으로도 아직 연구 중. **[1차]** — [NJP 2015](https://iopscience.iop.org/article/10.1088/1367-2630/17/6/063001)
- 라켓 무게 등급(Yonex U 표기, 줄 없는 상태): 3U 약 85~89.9 g(평균 88 g), 4U 약 80~84.9 g(평균 83 g), 5U 약 75~79.9 g(평균 78 g). 줄을 매면 3~5 g 추가. **[2차, 판매점 가이드]** — [Central Sports UK](https://centralsports.co.uk/blogs/badminton-blog/badminton-racket-weight-guide-uk-3u-vs-4u-vs-5u); [Decathlon 제품 표기 4U (80-84 g)](https://www.decathlon.mt/p/998894794-503572-kids-badminton-racket-muscle-power-2-junior-yellow.html)
- 라켓 규격(BWF 4조): 전체 길이 680 mm 이하, 폭 230 mm 이하; 줄면 길이 280 mm·폭 220 mm 이하(목 부분으로 확장 시 총 330 mm 이하). 줄 패턴은 가운데가 다른 곳보다 덜 촘촘하면 안 됨. **[1차 규정 사본]** — [Laws booklet](https://worldbadminton.com/laws/documents/20170216_rulesBooklet.pdf)
- 라켓 관성(swingweight) 연구: 스윙웨이트 5 kg·cm² 증가당 라켓 헤드 속도 평균 0.7 m/s 감소, 그러나 셔틀 속도는 느려지지 않음. 타점이 평균에서 1 표준편차 범위만 벗어나도 셔틀 속도가 최대 5.3% 감소. **[1차, Scientific Reports 2023 / 관련 연구, 검색 요약]** — [PMC: racket moment of inertia](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10462755/); [Effect of racket-shuttlecock impact location (USW)](https://oars.uos.ac.uk/1325/1/Effect%20of%20racket-shuttlecock%20impact%20location.pdf)

### Inferences
- 중학교 탄성력 단원과 직결: 고무줄·용수철처럼 "늘어난 줄이 원래대로 돌아가려는 힘"이 셔틀을 밀어냄. 트램펄린 비유가 적절.
- 셔틀(약 5 g)과 라켓(약 85 g)의 질량 비교(약 1:17)로 "가벼운 물체가 왜 그렇게 빨라질 수 있나" 토론 가능.

### Gaps
- 일반적 장력 범위(예: 20~30 lbf)를 1차 출처로 확인 못함. 수업에선 "선수일수록 더 팽팽하게 매는 경향" 정도로만 쓰거나 Yonex 라켓 권장 장력 표기(라켓 샤프트에 인쇄)를 직접 사진으로 활용 권장.
- Mahidol·Wyoming 원 논문 미확인.

## 6. 네트·코트·실내 경기

### Takeaway
네트 높이는 가운데 1.524 m, 기둥 1.55 m. 셔틀의 마지막 낙하가 거의 수직이라 약한 바람에도 크게 흔들리므로 경기는 실내에서 한다.

### Cited Findings
- 1.4 기둥 높이 1.55 m / 1.7 네트 깊이 760 mm, 폭 6.1 m 이상 / 1.6 그물코 15~20 mm / 1.10 네트 윗면 높이 가운데 1.524 m, 복식 사이드라인 위 1.55 m / 라인 폭 40 mm / 코트 대각선 14.723 m. **[1차 규정 사본]** — [Laws booklet](https://worldbadminton.com/laws/documents/20170216_rulesBooklet.pdf)
- 코트 13.4 m × 5.2 m(단식 폭), 네트 1.55 m(논문 표기). 바람 1 m/s → 낙하점 약 8 cm 이동 → 실내 경기 이유. **[1차]** — [NJP 2015](https://iopscience.iop.org/article/10.1088/1367-2630/17/6/063001)
- 네트 높이가 아래로 치는 샷의 비율을 정한다: 기하학적 추정 0.26, 올림픽 결승 4회 분석에서 하향 샷 비율 0.28(스매시 0.14, 드롭 0.12, 킬 0.02). 결정타의 54%가 스매시(표 1). **[1차]** — [NJP 2015](https://iopscience.iop.org/article/10.1088/1367-2630/17/6/063001)

### Inferences
- 실내 체육관의 에어컨·환풍기 바람도 같은 이유로 문제가 됨(추론; BWF 공식 공조 규정 문서는 이번에 확인 못함).

### Gaps
- BWF의 경기장 공조/풍속 관련 공식 규정(대회 운영 매뉴얼) 미확인.

## 7. 재미있는 역사 (기원, 제기, 올림픽, 한국 메달)

### Takeaway
배드민턴이라는 이름은 1873년 보퍼트 공작의 영국 글로스터셔 "배드민턴 하우스"에서 왔고, 인도 "푸나(Poona)" 놀이를 영국 장교들이 들여왔다는 설이 가장 널리 받아들여진다. 깃털 공을 발로 차는 중국 건자(毽子)·한국 제기차기와는 계통이 다르지만 "깃털 달린 무거운 머리"라는 셔틀 구조를 공유한다. 1992 바르셀로나에서 정식 종목, 2024 파리에서 안세영이 여자 단식 금메달.

### Cited Findings
- 1873년 9대 보퍼트 공작이 영지 Badminton House(글로스터셔) 파티에서 소개, 영지 이름을 따 'badminton'. 인도에 있던 육군 장교들이 전파한 것으로 추정. 첫 규칙은 1877년 Bath Badminton Club이라는 설(1873년이라는 저품질 자료도 있음 — 상충). 국제기구는 1934년 IBF(현 BWF). **[2차, 혼합 품질]** — [Live History India: Poona](https://livehistoryindia.com/story/places/poona-where-badminton-was-invented); [ac-normandie: A brief history of badminton](https://anglais.ac-normandie.fr/IMG/pdf/a_brief_history_of_badminton.pdf); [SAYS](https://says.com/my/lifestyle/how-did-badminton-get-its-name)
- NJP 2015 서론: 깃털 셔틀 놀이는 기원전 2500년 아시아에서 시작되었다고 기술, 중국 ti-jian-zi(踢毽子, 병사들이 깃털 셔틀을 발로 참) 언급, 현대 배드민턴은 영국 식민지인들이 변형한 인도 놀이에서 유래. **[1차 논문의 서술이나 역사 연구는 아님]** — [NJP 2015](https://iopscience.iop.org/article/10.1088/1367-2630/17/6/063001)
- 건자(jianzi)는 고대 중국 축국(蹴鞠)에서 파생된 것으로 알려짐, 명나라 17세기 초 베이징 풍속서에 겨울 놀이로 등장. 현재 네트를 사이에 둔 배드민턴 비슷한 경기 규칙이 있음. **[2차]** — [Localiiz](https://www.localiiz.com/post/culture-history-guide-jianzi-chinese-shuttlecock-sport); [Scroll.in](https://scroll.in/article/844603/a-guide-to-jianzi-a-chinese-game-with-a-shuttlecock-but-no-racket)
- 올림픽: 1972 뮌헨 시범 종목, 1985년 IOC 총회에서 1992 정식 종목 결정, 1988 서울 시범(전시) 종목, 1992 바르셀로나 4개 종목(남녀 단·복식), 1996 애틀랜타 혼합복식 추가. **[1차, BWF 올림픽 사이트]** — [BWF Olympic Badminton history](https://olympics.bwfbadminton.com/history/)
- 안세영: 2024-08-05 파리 라 샤펠 아레나 여자 단식 결승, 중국 허빙자오에 21-13, 21-16(52분) 승. 1996 애틀랜타 방수현 이후 28년 만의 한국 여자 단식 금메달(한국 두 번째). 한국 배드민턴 금메달은 2008 베이징 혼합복식 이용대·이효정 이후 처음. 무릎 부상을 안고 출전. **[1차: Olympics.com + 2차 언론]** — [Olympics.com](https://olympics.com/en/news/paris-2024-badminton-women-singles-wrap); [Korea JoongAng Daily](https://www.koreajoongangdaily.com/sports/22-year-old-an-se-young-wins-historic-gold-beating-he-bingjiao-2-0/12275733); [Wikipedia](https://en.wikipedia.org/wiki/Badminton_at_the_2024_Summer_Olympics_%E2%80%93_Women%27s_singles)
- 방수현: 1992 바르셀로나 은, 1996 애틀랜타 금. **[2차]** — [Korea JoongAng Daily](https://www.koreajoongangdaily.com/sports/an-se-young-sets-up-koreas-first-womens-singles-badminton-medal-since-1996/12081210)

### Inferences
- 제기 활용: "제기도 무거운 엽전(머리)+가벼운 종이/깃털 술(꼬리) → 차 올리면 무거운 쪽이 아래로 향해 떨어진다"는 같은 원리(질량중심과 공기 저항 위치)로 연결 가능. 단, 제기와 배드민턴의 역사적 직접 연관성을 보여주는 출처는 없음 → "기원이 같다"가 아니라 "원리가 같다"로 서술해야 함.
- 1992 바르셀로나 한국 금메달(남자복식 박주봉·김문수, 여자복식 황혜영·정소영)은 기억상 사실이나 이번 검색에서 출처 확인 못함 → 사용 시 확인 필요.

### Gaps
- 1992 한국 복식 금메달 출처 미확인(위 참조).
- 한국 과학 잡지(어린이과학동아 등)의 셔틀콕 기사는 검색하지 못함.
- 배드민턴 기원 연도(1873 소개 vs 1877 규칙)와 Poona 유래는 2차 자료끼리 세부가 다름.
