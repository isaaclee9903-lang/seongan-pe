# 태그럭비 수업용 YouTube 영상 리서치 (중2 체육 웹수업용)

조사일: 2026-10-08. 확인 방법:
- 메타데이터: 시청 페이지의 `ytInitialPlayerResponse`(제목, 채널, 길이(초), publishDate, playableInEmbed, captionTracks)
- 임베드 가능 여부: `https://www.youtube.com/oembed?url=...&format=json`. 아래 영상은 모두 **HTTP 200**을 받았고, 플레이어 응답도 `playableInEmbed: True`, `status: OK`였다.
- 자막 텍스트: YouTube innertube player API(IOS 클라이언트)가 돌려준 자막 트랙 URL에서 받았다. 표시한 타임스탬프는 **실제 자동 자막(ASR)의 시작 시각**이다. 한국어 ASR은 오인식이 많아서(예: "태노프", "간조"=간주, "업사이드"=오프사이드), 아래 인용은 뜻이 통하도록 다듬은 의역이다. 원문 ASR 문자열이 아니다.
- 업로드 날짜는 YouTube microformat 값(미국 태평양 시간)이라 한국 날짜와 하루 차이 날 수 있다.

## 1. 한국어 영상 후보 (우선순위 순)

### Takeaway
가장 믿을 만한 한국어 자료는 대한럭비협회(Korea Rugby Union) 공식 채널의 「유소년스포츠기반구축사업 태그럭비」 강의 3편(제1강 용품·착용, 제2강 경기방법·규칙, 제3강 심판법·안전수칙, 각 2.5~3.5분)과 애니메이션 「알쏭달쏭 럭비이야기 제10장 몸싸움 없는 태그럭비」(3분)다. 모두 임베드할 수 있고 한국어 자동 자막이 있어서 타임스탬프 퀴즈를 만들 수 있다. 「인천 태그럭비 교육영상」(12:23)은 규칙이 잘 정리되어 있지만 길고, 업로더가 개인 채널이다.

### Cited Findings

#### [K1] 제1강 – 태그럭비 용품 및 경기장 (대한럭비협회) — 자막 확인됨
- 제목: [유소년스포츠기반구축사업 태그럭비] (설명란: "🎥 제1강 📢 태그럭비 용품 및 경기장") / 채널: Korea Rugby Union / ID: `fh8ZwtY01ZU` / 3:20(200초) / 한국어 / 2025-11-26 / oEmbed 200, 임베드 가능 / 자막: ko·en-US 자동 — [YouTube](https://www.youtube.com/watch?v=fh8ZwtY01ZU)
- 0:29–0:46: 준비물은 럭비공, 꼬깔콘(마커콘), 색깔이 다른 태그 벨트와 태그, 색깔이 다른 조끼(두 벌씩)다. — [YouTube](https://www.youtube.com/watch?v=fh8ZwtY01ZU)
- 0:46–1:01: 경기장은 꼬깔콘으로 표시하고, 학년에 맞춰 줄이거나 넓혀서 쓴다. — [YouTube](https://www.youtube.com/watch?v=fh8ZwtY01ZU)
- 1:20–1:50: 착용 순서는 조끼(번호가 뒤로 가게) → 태그 벨트를 허리에 맞게 조이기 → 태그는 양쪽 **골반**에 단다. — [YouTube](https://www.youtube.com/watch?v=fh8ZwtY01ZU)
- 2:15–2:39: 잘못된 착용 1. 벨트를 먼저 차고 그 위에 조끼를 입으면 태그가 가려져 뗄 수 없다. — [YouTube](https://www.youtube.com/watch?v=fh8ZwtY01ZU)
- 2:42–3:11: 잘못된 착용 2. 태그를 골반이 아닌 앞이나 뒤에 다는 것, 한쪽 골반에 두 개를 다는 것, 양쪽 두 개가 아니라 하나만 달고 경기하는 것도 모두 잘못된 착용이다. — [YouTube](https://www.youtube.com/watch?v=fh8ZwtY01ZU)

#### [K2] 제2강 – 경기방법 및 규칙 (대한럭비협회) — 자막 확인됨, 수업 핵심 영상
- 제목: [유소년스포츠기반구축사업 태그럭비] (설명란: "🎥 제2강 📢 경기방법 및 규칙") / Korea Rugby Union / ID: `tGVKW_utmGM` / 3:17(197초) / 한국어 / 2025-11-26 / oEmbed 200 / 자막: ko·en-US 자동 — [YouTube](https://www.youtube.com/watch?v=tGVKW_utmGM)
- 0:27–0:47: 공을 가진 선수가 상대 팀 인골라인을 넘어가 공을 그라운딩하면 득점한다. 수비는 공격자의 태그를 떼어 막는다. — [YouTube](https://www.youtube.com/watch?v=tGVKW_utmGM)
- 0:47–0:51: 가장 중요한 규칙은 크게 세 가지다. — [YouTube](https://www.youtube.com/watch?v=tGVKW_utmGM)
- 0:51–1:08: 규칙 1(녹온). 공을 잡다가 상대 인골 쪽(앞)으로 놓치면 "녹온" 반칙이고, 상대 팀 공이 된다. — [YouTube](https://www.youtube.com/watch?v=tGVKW_utmGM)
- 1:08–1:18: 앞이 아니라 옆이나 뒤로 공을 떨어뜨리면 **플레이온**(경기 계속)이다. — [YouTube](https://www.youtube.com/watch?v=tGVKW_utmGM)
- 1:21–1:40: 규칙 2(포워드 패스). 공보다 앞에 있는 같은 팀 선수에게 패스하면 포워드 패스이고, 상대 팀 공이 된다. — [YouTube](https://www.youtube.com/watch?v=tGVKW_utmGM)
- 1:42–1:51: 규칙 3. 수비는 "태그!"라고 외치면서 공 가진 선수의 태그를 뗀다. — [YouTube](https://www.youtube.com/watch?v=tGVKW_utmGM)
- 1:51–2:11: 태그 뒤 수비는 **뒤로 3m** 물러나야 한다. 물러나지 않고 경기를 이어가면 오프사이드 반칙이다(ASR 표기는 "업사이드"). — [YouTube](https://www.youtube.com/watch?v=tGVKW_utmGM)
- 2:11–2:29: 재시작은 두 가지 방식이다. 태그된 뒤 **프리패스**로 시작하거나, 태그 뒤 **탭**(발로 공 톡 차기)으로 시작한다. — [YouTube](https://www.youtube.com/watch?v=tGVKW_utmGM)
- 2:31–2:56: 공격 측 금지 행동은 ① 공으로 상대를 밀치거나 태그를 못 떼게 막기 ② 손으로 수비 밀기(핸드오프) ③ 자기 태그를 손으로 잡고 달리기다. 셋 다 페널티다. — [YouTube](https://www.youtube.com/watch?v=tGVKW_utmGM)
- 2:59–3:06: 수비 측 금지 행동은 옷을 잡고 태그를 떼는 것이며, 페널티다. — [YouTube](https://www.youtube.com/watch?v=tGVKW_utmGM)

#### [K3] 제3강 – 심판법 및 안전수칙 (대한럭비협회) — 자막 확인됨
- 제목: [유소년스포츠기반구축사업 태그럭비] (설명란: "🎥 제3강 📢 심판법 및 안전수칙") / Korea Rugby Union / ID: `XVfzDKMikTU` / 2:32(152초) / 한국어 / 2025-11-26 / oEmbed 200 / 자막: ko·en-US 자동 — [YouTube](https://www.youtube.com/watch?v=XVfzDKMikTU)
- 0:27–0:36: 지도 내용은 학교 상황에 맞춰 태그 횟수(3번 또는 5번), 실내 또는 운동장으로 구성한다. — [YouTube](https://www.youtube.com/watch?v=XVfzDKMikTU)
- 0:36–0:53: 경기장 규격은 저학년·고학년에 맞춰 정한다. 최소 20×30, 최대 50×70(단위는 m로 추정). — [YouTube](https://www.youtube.com/watch?v=XVfzDKMikTU)
- 0:49–0:57: 인원은 최소 4명, 최대 7명이다. — [YouTube](https://www.youtube.com/watch?v=XVfzDKMikTU)
- 0:57–1:06: 경기 시간은 최소 5분에서 최대 10분이다. — [YouTube](https://www.youtube.com/watch?v=XVfzDKMikTU)
- 1:44–1:54: 안전이 최우선이다. 비접촉 태그럭비에서는 접촉하는 순간 모두 페널티다. — [YouTube](https://www.youtube.com/watch?v=XVfzDKMikTU)
- 1:54–2:04: 실내외 모두 슬라이딩(넘어지면서 태그 떼기, 넘어지면서 그라운딩·트라이)을 주의시킨다. — [YouTube](https://www.youtube.com/watch?v=XVfzDKMikTU)
- 2:04–2:22: 규칙은 유연하게 정하고, 첫 번째 목표는 **즐거움**이다. — [YouTube](https://www.youtube.com/watch?v=XVfzDKMikTU)

#### [K4] 알쏭달쏭 럭비이야기 제10장 몸싸움 없는 태그럭비 (대한럭비협회, 애니메이션) — 자막 확인됨
- 제목: [알쏭달쏭 럭비이야기] 제 10장 몸싸움 없는 태그럭비 / Korea Rugby Union / ID: `_yUm6wbp6DI` / 3:00(180초) / 한국어 / 2024-04-23 / oEmbed 200 / 자막: ko·en-US 자동 — [YouTube](https://www.youtube.com/watch?v=_yUm6wbp6DI)
- 0:35–0:48: 태그럭비는 1990년부터 있었다. 영국 체육교사 **닉 레오날드**가 학교 체육 수업에 럭비를 쓰려고 만들었다. — [YouTube](https://www.youtube.com/watch?v=_yUm6wbp6DI)
- 0:56–1:13: 몸싸움 대신 태그를 뗀다. 태그가 떼여도 아웃은 아니다. 대신 그 자리에 멈춰야 하고, 공을 들고 있었다면 그 자리에서 패스해야 한다. — [YouTube](https://www.youtube.com/watch?v=_yUm6wbp6DI)
- 1:16–1:22: 태그는 두 개만 있으면 된다. 뗀 태그는 바로 돌려줘야 한다. — [YouTube](https://www.youtube.com/watch?v=_yUm6wbp6DI)
- 1:28–1:40: 럭비와 같은 점은 전진 패스를 못 한다는 것이다. "측면으로만" 패스한다. — [YouTube](https://www.youtube.com/watch?v=_yUm6wbp6DI)
- 1:40–1:50: 다른 점은 득점 방법이 양손으로 공을 내려놓는 것 하나뿐이라는 것이다(킥 득점 없음). — [YouTube](https://www.youtube.com/watch?v=_yUm6wbp6DI)
- 1:54–2:06: 공수교대 룰이 있다. 태그를 정해진 횟수만큼 떼이거나(ASR "사회" → '4회'로 추정, 확인 필요), 공을 땅에 떨어뜨리거나, 터치라인 밖으로 나가면 공수교대다. — [YouTube](https://www.youtube.com/watch?v=_yUm6wbp6DI)
- 2:22–2:30: 대한럭비협회가 태그럭비를 쉽고 재미있게 배우도록 안내하고 있다고 언급한다. — [YouTube](https://www.youtube.com/watch?v=_yUm6wbp6DI)

#### [K5] 인천 태그럭비 교육영상 (개인 채널 duzzzing du) — 자막 확인됨, 길이 12분
- 제목: 인천 태그럭비 교육영상 / 채널: duzzzing du / ID: `XlbxBQ1Udvs` / 12:23(743초) / 한국어 내레이션(자막형 영상) / 2026-03-04 / oEmbed 200 / 자막: ko 자동 — [YouTube](https://www.youtube.com/watch?v=XlbxBQ1Udvs)
- 같은 영상이 다른 채널(siie jidm)에도 `5diYLGqeDb8`(12:23)로 올라와 있다. 검색 결과에서만 확인했고 oEmbed는 검사하지 않았다. — [YouTube 검색](https://www.youtube.com/results?search_query=%ED%83%9C%EA%B7%B8%EB%9F%AD%EB%B9%84+%EA%B5%90%EC%9C%A1)
- 0:05–0:30: 공을 앞으로 던질 수 없어서 늘 뒤를 돌아본다. 그래서 럭비는 "함께 가는 방법"을 배우는 스포츠다. — [YouTube](https://www.youtube.com/watch?v=XlbxBQ1Udvs)
- 0:42–2:27: 15인제 럭비를 소개한다(15명, 스크럼, 라인아웃, 태클에도 규칙과 존중이 있다). — [YouTube](https://www.youtube.com/watch?v=XlbxBQ1Udvs)
- 2:39–2:54: 15인제에서 트라이는 5점, 컨버전 킥은 2점, 합계 7점이다. — [YouTube](https://www.youtube.com/watch?v=XlbxBQ1Udvs)
- 3:09: 7인제 럭비는 아시안게임 정식 종목이다. — [YouTube](https://www.youtube.com/watch?v=XlbxBQ1Udvs)
- 3:15–5:12: 터치럭비. 트라이는 1점, 공격권 6회, 터치 후 수비는 7m 후퇴, 어느 방향이든 공을 떨어뜨리면 턴오버다. — [YouTube](https://www.youtube.com/watch?v=XlbxBQ1Udvs)
- 6:23–6:31: 태그럭비에서도 인골라인 안에 공을 찍으면 심판이 "트라이"를 외치고 **1득점**이다. — [YouTube](https://www.youtube.com/watch?v=XlbxBQ1Udvs)
- 6:36: 태그럭비 규칙은 **공격권 5회**다. — [YouTube](https://www.youtube.com/watch?v=XlbxBQ1Udvs)
- 6:54–6:58: 공을 뒤로 놓치는 것은 인플레이(경기 계속)다. — [YouTube](https://www.youtube.com/watch?v=XlbxBQ1Udvs)
- 7:00–7:08: 태그를 당하면 즉시 동료에게 패스해야 한다. 계속 달리면 페널티로 턴오버다. — [YouTube](https://www.youtube.com/watch?v=XlbxBQ1Udvs)
- 7:18–7:27: 수비는 항상 **5m(다섯 발자국)** 물러나 수비해야 한다. 어기면 오프사이드(ASR "업사이드") 반칙이고 턴오버다. — [YouTube](https://www.youtube.com/watch?v=XlbxBQ1Udvs)
- 8:06–8:11: 던진 패스(전진 패스)는 즉시 턴오버이고, 녹온도 즉시 턴오버다. — [YouTube](https://www.youtube.com/watch?v=XlbxBQ1Udvs)
- 9:39–9:56: 수비는 태그를 떼면 손을 들고 "태그"를 외친 뒤, 태그를 해당 선수에게 정중히 돌려준다. 태그된 공격수는 옆 친구에게 즉시 패스하고, 하지 않으면 페널티로 턴오버다. — [YouTube](https://www.youtube.com/watch?v=XlbxBQ1Udvs)
- 10:50–11:15: 빠른 사람이 아니라 서로 믿는 팀, 규칙을 지키는 팀이 이긴다(가치·태도 영역). — [YouTube](https://www.youtube.com/watch?v=XlbxBQ1Udvs)

#### [K6] [아이스크림 체육 5학년-럭비형 게임 최종] 태그 럭비 게임 해보기 (재미수집가, 교사 채널) — 자막과 설명란 확인됨
- ID: `S3cXIfFr_d0` / 6:40(400초) / 한국어 / 2025-06-09 / oEmbed 200 / 자막: ko 자동 — [YouTube](https://www.youtube.com/watch?v=S3cXIfFr_d0)
- 설명란 규칙: 공을 패스하거나 들고 달려서 상대 골라인까지 가져가면 1점이다. 공 가진 친구가 태그를 뺏기거나 패스하다 놓친 공을 수비가 잡으면 공수교대다. 공수교대 때 수비는 뒤로 다섯 걸음 물러선다. 전진 패스는 파울이고, 패스는 옆이나 뒤로만 할 수 있다. — [YouTube 설명란](https://www.youtube.com/watch?v=S3cXIfFr_d0)
- 0:51–1:40: 22명을 11명씩 나눈 뒤 4·4·3명 팀으로 편성한다. 체육관에서는 4대4(8명)가 적당하다. — [YouTube](https://www.youtube.com/watch?v=S3cXIfFr_d0)
- 1:45–2:22: 공을 놓치거나 태그를 빼앗기면 심판이 휘슬을 불고, 수비가 다섯 걸음 물러나면 공을 건넨다. — [YouTube](https://www.youtube.com/watch?v=S3cXIfFr_d0)
- 3:31–3:48: 좁은 공간으로 돌진하면 잡히니 넓은 공간을 공략한다(전술 퀴즈 소재). — [YouTube](https://www.youtube.com/watch?v=S3cXIfFr_d0)
- 5:30–5:40: 실제 경기에서 전진 패스 장면이 나오고 "파울"이라고 설명한다(장면 기반 퀴즈에 좋음). — [YouTube](https://www.youtube.com/watch?v=S3cXIfFr_d0)
- 5:40–5:56: 골라인 전 슬라이딩은 부상 위험이 있어 파울로 처리했다. — [YouTube](https://www.youtube.com/watch?v=S3cXIfFr_d0)
- 이 규칙은 원래 태그럭비 규칙이 아니라 초등 수준으로 단순화한 버전이다. 태그 1회에 바로 공수교대하고, 프리패스는 심판이 공을 건네는 방식이다.

#### [K7] 기타 확인된 한국어 영상 (보조용 또는 비추천)
- 제2회 경기도럭비협회장배 태그럭비대회 하이라이트 / 학교체육tv / `ZkPYZ2kuGjg` / 6:02 / 2024-05-29 / oEmbed 200 / **자막 없음**. 학교스포츠클럽 대회 장면이라 "실제 경기 보기"용으로만 쓸 수 있다. 내용은 확인하지 않았다. — [YouTube](https://www.youtube.com/watch?v=ZkPYZ2kuGjg)
- 대한럭비협회 대회 스케치 영상(내레이션 거의 없음, 자막 퀴즈에는 부적합): `InMHYs-oze8`(3:10, 2025 유소년사업 현장 스케치), `fMhfnCX0Ti0`(3:07, 2025-11-15 인천 남동아시아드럭비경기장 대회), `jn1HtmQBzdI`(2:53, 2025 청소년스포츠한마당), `ObZiH7Krt0g`(2:25, 2024-08-24 용산 어린이정원), `evkQglXYGKI`(1:44, 2024-11-16 남동아시아드). 모두 oEmbed 200이다. — [YouTube](https://www.youtube.com/watch?v=InMHYs-oze8), [YouTube](https://www.youtube.com/watch?v=fMhfnCX0Ti0), [YouTube](https://www.youtube.com/watch?v=jn1HtmQBzdI), [YouTube](https://www.youtube.com/watch?v=ObZiH7Krt0g), [YouTube](https://www.youtube.com/watch?v=evkQglXYGKI)
- 신체접촉 없는 안전한 스포츠 태그럭비(tag rugby) | 위밋업 여성 럭비 클래스, 서보희 강사의 이야기! / 위밋업스포츠 / `0Iv9noxR_qg` / 3:15 / 2022-05-27 / oEmbed 200 / ko 자동 자막. 전 여자럭비 국가대표(2011~2019) 강사 인터뷰다. 1:32–1:40에 허리 벨트의 태그를 떼면 태클로 인정된다는 설명이 있지만, 규칙 설명보다는 동기부여용이다. — [YouTube](https://www.youtube.com/watch?v=0Iv9noxR_qg)
- 온라인 체육수업) 플래그 풋볼 & 태그럭비 1차시 … (중학교2학년) / 노워노쌤 '체육' / `vnTElIt7wKo` / 11:56 / 2021-09-03 / oEmbed 200 / ko 자동 자막. 자막을 확인해 보니 내용 대부분이 **플래그 풋볼**(장비 착용, 꼬리잡기)이고 음질과 ASR 품질이 낮다. 비추천. — [YouTube](https://www.youtube.com/watch?v=vnTElIt7wKo)
- 5학년 스포츠 영역형 럭비형게임 중요 규칙 설명 / 인의예지신초등 체육 / `X9pLOtlo2ns` / 6:04 / 2026-04-12 / oEmbed 200 / ko 자동 자막. **태그럭비 규칙과 충돌한다**(아래 3절 참고). 비추천. — [YouTube](https://www.youtube.com/watch?v=X9pLOtlo2ns)
- [아이스크림 체육 5학년-럭비형 게임 1차시] 태그럭비를 위한 몸풀기 활동 / 재미수집가 / `2CvR5kcQ3OM` / 3:04 / 2025-05-08 / oEmbed 200 / ko 자동 자막(자막 텍스트는 받지 않음). 설명란에 달리기, 1대1 꼬리 빼앗기, 공 배달하기 리드업 활동이 나오고 "옆이나 뒤쪽 동료에게 패스"라고 적혀 있다. 준비운동이나 리드업용이다. — [YouTube](https://www.youtube.com/watch?v=2CvR5kcQ3OM)
- 럭비형게임 기능연습1 / 열정기백쌤 / `cpd5U8vi8OU` / 3:10 / 2024-09-07 / oEmbed 200. 설명란 챕터는 00:00 활동 소개, 00:41 활동 방법 안내, 01:46 실제 활동 모습이다. 기능 연습 게임이고 천재교과서(2022 개정) 탑재 활동이라고 적혀 있다. 자막 텍스트는 받지 않았다. — [YouTube](https://www.youtube.com/watch?v=cpd5U8vi8OU)

### Inferences
- 수업 메인 영상 조합은 K2(규칙) → K1(장비·착용) → K3(안전·심판)을 권장한다. 도입(흥미·역사)은 K4로 한다. 4편 합계 약 12분이고 모두 협회 공식 채널이라 출처 신뢰도가 높다.
- K5는 규칙 요약이 가장 체계적이다(5회 공격권, 5m 후퇴, 1점, 즉시 패스). 다만 12분으로 길어서 6:10~10:30 구간만 쓰는 편이 좋다(임베드 시 `?start=370&end=630`).
- 대한럭비협회 영상 3편은 제목이 모두 같은 "[유소년스포츠기반구축사업 태그럭비]"이므로, 페이지에서는 반드시 ID로 구분하고 표시 제목을 "제1강/제2강/제3강"으로 붙여야 한다.

### Gaps
- EBS 태그럭비 전용 영상은 검색 결과("EBS 태그럭비")에서 찾지 못했다. 결과는 모두 대한럭비협회나 개인 영상이었다.
- 대한럭비협회 제2강의 "3m"는 ASR 판독값이다("뒤로 3m를 물려놔야"). 숫자 자체는 비교적 명확하지만 실제 영상 화면 자막과 대조하지는 못했다.
- K4의 공수교대 태그 횟수(ASR "사회")는 '4회'인지 다른 말인지 확인하지 못했다. 퀴즈에 쓰기 전에 영상을 직접 확인해야 한다.

## 2. 영어 영상 후보

### Takeaway
영어권 정식 태그럭비(성인·리그형) 규칙을 가장 깔끔하게 설명하는 영상은 "How to play TAG RUGBY and the rules EXPLAINED!"(Tag Rugby Coach, 4:11)와 "How to Play Tag Rugby"(Try Tag Rugby, 1:57)다. 학교용으로는 "How to Play Tag Rugby- Primary School PE"(Moving Matters, 1:23)가 짧고, 한국어 자동 자막 트랙까지 있다. 모두 oEmbed 200이다.

### Cited Findings

#### [E1] How to play TAG RUGBY and the rules EXPLAINED! — Tag Rugby Coach — 자막 확인됨
- ID `v7e8Y8g3sGY` / 4:11(251초) / 영어 / 2019-09-10 / oEmbed 200 / 자동 자막: en, de, es, fr, it, id, pt, hi(ko 없음) — [YouTube](https://www.youtube.com/watch?v=v7e8Y8g3sGY)
- 0:11: 태그럭비는 태클이 없는 최소 접촉 럭비다. 0:15: 보통 한 팀 5·6·7명이다. — [YouTube](https://www.youtube.com/watch?v=v7e8Y8g3sGY)
- 0:28–0:39: 양쪽 엉덩이에 벨크로로 태그 2개를 단다. 태그 크기는 38cm×6cm다. — [YouTube](https://www.youtube.com/watch?v=v7e8Y8g3sGY)
- 0:42–0:49: 경기장은 정규 럭비장 절반 크기이고 골대는 필요 없다. 0:54: 전후반 각 20분(성인 기준)이다. — [YouTube](https://www.youtube.com/watch?v=v7e8Y8g3sGY)
- 1:03–1:15: 앞으로 달리거나 앞으로 차는 것은 되지만, 패스는 뒤나 옆으로만 한다. 전진 패스를 하면 상대에게 공격권이 간다. — [YouTube](https://www.youtube.com/watch?v=v7e8Y8g3sGY)
- 1:18–1:23: 점수는 트라이로만 얻고 트라이는 1점이다(혼성 경기의 여자 트라이는 2점). 1:32: 태그 거리 안에 상대가 있으면 다이빙 트라이는 금지다. 1:37: 컨버전이 없다. — [YouTube](https://www.youtube.com/watch?v=v7e8Y8g3sGY)
- 1:51–2:03: 공격은 6번의 태그(플레이) 안에 득점해야 하고, 못 하면 공격권이 넘어간다. — [YouTube](https://www.youtube.com/watch?v=v7e8Y8g3sGY)
- 2:16–2:25: 태그 후에는 태그당한 지점에서 공을 땅에 놓고 발로 뒤로 굴린다("roll ball"). — [YouTube](https://www.youtube.com/watch?v=v7e8Y8g3sGY)
- 2:45–2:59: 공격자는 수비에 일부러 부딪치면 안 되고, 수비자는 공격자의 진로로 갑자기 끼어들면 안 된다. 접촉을 일으킨 쪽이 벌칙을 받는다. — [YouTube](https://www.youtube.com/watch?v=v7e8Y8g3sGY)
- 3:01–3:15: 태그를 손·팔꿈치·공으로 가리거나 수비 손을 쳐내면 안 된다(태그 보호 금지). 3:33–3:48: 녹온이면 상대 팀에 페널티가 주어진다. — [YouTube](https://www.youtube.com/watch?v=v7e8Y8g3sGY)

#### [E2] How to Play Tag Rugby — Try Tag Rugby — 자막 확인됨
- ID `S41yp2DYrvg` / 1:57(117초) / 영어 / 2024-04-16 / oEmbed 200 / en 자동 — [YouTube](https://www.youtube.com/watch?v=S41yp2DYrvg)
- 0:10: 킥오프로 시작한다. 0:16–0:21: 트라이 라인 너머에 공을 내려놓으면 트라이다. 0:23–0:27: 패스는 뒤로만 한다. — [YouTube](https://www.youtube.com/watch?v=S41yp2DYrvg)
- 0:35–0:52: 수비는 태그 하나를 떼어 땅에 떨어뜨리고, 그 자리(마커 위치)에 선다. 공격자는 태그된 지점으로 돌아가 발로 공을 살짝 뒤로 굴린다("play the ball"). — [YouTube](https://www.youtube.com/watch?v=S41yp2DYrvg)
- 1:11–1:23: 안전 규칙. 공격은 "run at spaces not faces"(사람이 아니라 빈 곳으로 달려라), 수비는 상대 진로로 들어가지 않는다, 태그를 가리거나 밀쳐내지 않는다. — [YouTube](https://www.youtube.com/watch?v=S41yp2DYrvg)

#### [E3] How to Play Tag Rugby- Primary School PE — Moving Matters — 자막 확인됨
- ID `cjrFEOooe7g` / 1:23(83초) / 영어 / 2021-04-09 / oEmbed 200 / 자동 자막 21개 언어(ko 자동번역 트랙 포함) — [YouTube](https://www.youtube.com/watch?v=cjrFEOooe7g)
- 0:04–0:13: 트라이 존 두 곳, 하프웨이 라인, 6~7인제다. 0:13–0:18: 태그당하지 않고 상대 트라이 존에 공을 놓으면 트라이다. — [YouTube](https://www.youtube.com/watch?v=cjrFEOooe7g)
- 0:20–0:32: 시작과 태그 후 재시작은 발로 공을 뒤 "더미 하프"에게 굴리고, 더미 하프는 반드시 패스한다. — [YouTube](https://www.youtube.com/watch?v=cjrFEOooe7g)
- 0:32–0:46: 공격 기회는 5번이고, 5번 태그되면 공수교대(턴오버)다. — [YouTube](https://www.youtube.com/watch?v=cjrFEOooe7g)
- 0:49–0:57: 녹온, 전진 패스, 경기장 밖으로 나가는 경우에도 턴오버다. — [YouTube](https://www.youtube.com/watch?v=cjrFEOooe7g)
- 1:02–1:13: 태그 후 수비 팀은 5m 물러나 더미 하프의 패스를 기다린다. 어기면 오프사이드이고, 상대가 태그 5회를 다시 받는다. — [YouTube](https://www.youtube.com/watch?v=cjrFEOooe7g)

#### [E4] Tag Rugby - An Introduction — Irish Rugby (IRFU 공식) — 자막 확인됨
- ID `Kk-v2uNLDro` / 2:33 / 영어 / 2012-05-09 / oEmbed 200 / en 자동. 아일랜드 대표팀 코치 Les Kiss가 소개한다. — [YouTube](https://www.youtube.com/watch?v=Kk-v2uNLDro)
- 0:52–1:02: 남녀 모든 수준이 하고, 팀은 7명(남 4, 여 3)이며 엄격한 무접촉 원칙이다. 1:05–1:18: 태그 2개, 태그는 태클을 대신하고, 6번의 태그 안에 득점하지 못하면 턴오버다. — [YouTube](https://www.youtube.com/watch?v=Kk-v2uNLDro)
- 1:18–1:37: 하프웨이 라인에서 드롭킥으로 시작·재시작한다. 킥은 머리 높이 아래로 한다. 1:50–1:55: 남자 트라이는 1점, 여자 트라이는 3점(IRFU 성인 리그 규정)이다. — [YouTube](https://www.youtube.com/watch?v=Kk-v2uNLDro)
- 성인 소셜 리그 홍보 영상이라 중학생 퀴즈용으로는 우선순위가 낮다.

#### [E5] What is Tag Rugby? — Try Tag Rugby — 자막 확인됨
- ID `id_38veBEls` / 2:33 / 2020-08-19 / oEmbed 200 / en 자동. 0:02–0:08: 14세 이상 대상(성인 리그 홍보)이다. 0:40: 경기장 약 70m×45m. 1:07: 공격은 6번의 플레이를 갖는다. 1:24–1:34: 상위 리그에는 "보너스 박스"(폭 5m, 깊이 3m, +1점)가 있다. — [YouTube](https://www.youtube.com/watch?v=id_38veBEls)

#### [E6] 확인했지만 비추천하거나 자막이 없는 영어 영상
- How to play T1 Rugby — England Rugby Schools and Colleges / `R1-6zcqvDik` / 1:42 / 2025-03-06 / oEmbed 200 / **자막 트랙 없음**. 잉글랜드 학교 비접촉 입문 형식(T1)이다. 내용은 확인하지 않았다. — [YouTube](https://www.youtube.com/watch?v=R1-6zcqvDik)
- RIPPA RUGBY — Rugby Toolbox(뉴질랜드 Small Blacks 심판 팁) / `_jijuRrOZuw` / 2:06 / 2022-03-20 / oEmbed 200 / en 자동(텍스트는 받지 않음). — [YouTube](https://www.youtube.com/watch?v=_jijuRrOZuw)
- SFS Rippa Rugby 01 Basic Rules — Silver Fern Sport / `3-cCQt80dj8` / 1:16 / 2025-04-10 / oEmbed 200. 자막상 코치 현장 대화라 체계적 설명이 아니다. 1:00–1:05에 "많은 코치가 5m라고 생각하지만 오프사이드 라인은 rip(태그) 지점 바로 앞"이라는 내용이 있다. — [YouTube](https://www.youtube.com/watch?v=3-cCQt80dj8)
- Tag Rugby Rules — Jesse / `oCJvl0sm2NI` / 2:29 / 2019 / oEmbed 200 / 자막 없음 / U7·U8용이다. — [YouTube](https://www.youtube.com/watch?v=oCJvl0sm2NI)
- How to Play Tag Rugby for Beginners: Ultimate Guide — The Ultimate Explainer / `R-OmuUUbohY` / 5:22 / 2025-07-14 / oEmbed 200. **규칙 오류가 많아 비추천**(아래 3절 참고). — [YouTube](https://www.youtube.com/watch?v=R-OmuUUbohY)

### Inferences
- 영어 영상은 대부분 성인·리그형 규칙(6회 태그, 롤볼/플레이더볼, 혼성 득점 가산)이라 한국 학교 수업 규칙(대한럭비협회식 프리패스·탭 재시작)과 재시작 방식이 다르다. 비교 학습용("나라마다 규칙이 다르다")으로 1편(E3 또는 E1)만 쓰는 것을 권장한다.
- E3는 한국어 자동번역 자막 트랙이 있고 83초로 짧아서 중학생에게 가장 적합하다.

### Gaps
- World Rugby 공식 채널의 태그럭비 규칙 영상은 이번 검색("tag rugby rules explained")에서 나오지 않았다. 별도 확인하지 않았다.
- RFU 성인 "O2 Touch"나 England Rugby 공식 태그 규칙 영상은 T1 Rugby(R1-6zcqvDik) 외에는 찾지 못했다.

## 3. 영상 간 규칙 차이 및 흔한 규칙과의 충돌

### Takeaway
영상마다 수비 후퇴 거리(3m, 5m, 다섯 걸음, 7m), 공격 기회 횟수(1회 즉시 교대, 4·5·6회), 재시작 방식(프리패스, 탭, 롤볼)이 다르다. 퀴즈는 수업에서 채택할 규칙과 같은 영상의 타임스탬프에만 근거해야 한다. 두 영상(X9pLOtlo2ns, R-OmuUUbohY)은 태그럭비 기본 원칙과 명백히 충돌한다.

### Cited Findings
- 수비 후퇴 거리: 대한럭비협회 제2강은 3m(1:51) — [YouTube](https://www.youtube.com/watch?v=tGVKW_utmGM). 인천 교육영상은 5m·다섯 발자국(7:18, 10:07) — [YouTube](https://www.youtube.com/watch?v=XlbxBQ1Udvs). 재미수집가는 다섯 걸음(2:07) — [YouTube](https://www.youtube.com/watch?v=S3cXIfFr_d0). Moving Matters는 5m(1:02) — [YouTube](https://www.youtube.com/watch?v=cjrFEOooe7g). 터치럭비는 7m(5:04) — [YouTube](https://www.youtube.com/watch?v=XlbxBQ1Udvs).
- 공격 기회 횟수: 인천 영상은 5회(6:36) — [YouTube](https://www.youtube.com/watch?v=XlbxBQ1Udvs). Moving Matters는 5회(0:32) — [YouTube](https://www.youtube.com/watch?v=cjrFEOooe7g). Tag Rugby Coach는 6회(1:51) — [YouTube](https://www.youtube.com/watch?v=v7e8Y8g3sGY). 협회 제3강은 "태그 3번 및 5번"을 학교 상황에 맞게 정한다(0:29) — [YouTube](https://www.youtube.com/watch?v=XVfzDKMikTU). 재미수집가 초등 버전은 태그 1회에 공수교대한다(설명란) — [YouTube](https://www.youtube.com/watch?v=S3cXIfFr_d0).
- 공을 뒤나 옆으로 떨어뜨리는 경우: 대한럭비협회와 인천 영상은 플레이온·인플레이로 본다(1:12, 6:54) — [YouTube](https://www.youtube.com/watch?v=tGVKW_utmGM). 반면 알쏭달쏭 애니메이션은 "공을 땅에 떨어뜨리면" 공수교대라고 한다(1:58–2:06) — [YouTube](https://www.youtube.com/watch?v=_yUm6wbp6DI). 학생 혼동이 생길 수 있는 지점이다.
- 패스 방향: 알쏭달쏭은 "측면으로만 패스"라고 한다(1:34) — [YouTube](https://www.youtube.com/watch?v=_yUm6wbp6DI). 다른 영상은 "옆이나 뒤"(협회 제2강 1:21, 재미수집가 5:35, Tag Rugby Coach 1:09)라고 한다. 애니메이션은 뒤로 패스를 빠뜨린 단순화 표현이다.
- **충돌 1**: "5학년 스포츠 영역형 럭비형게임 중요 규칙 설명"(X9pLOtlo2ns)은 태그가 아닌 **터치**로 공을 빼앗는다(0:16). **5초 이내 패스** 규칙이 있다(0:35). 앞쪽 같은 편에게 **패스하는 장면을 정상 플레이로 설명**한다(0:49–0:54). 이는 전진 패스 금지라는 태그럭비 핵심 규칙과 충돌하므로, 태그럭비 수업 영상으로는 부적합하다. — [YouTube](https://www.youtube.com/watch?v=X9pLOtlo2ns)
- **충돌 2**: "How to Play Tag Rugby for Beginners: Ultimate Guide"(R-OmuUUbohY)는 트라이를 "대부분 5점"이라고 한다(2:22–2:30). 다른 태그럭비 영상은 1점이다(Tag Rugby Coach 1:20, 인천 6:23). 이 영상은 컨버전 킥 2점(2:40–2:46), "3초 안에 패스"(1:13), 페널티 트라이 5점도 언급하는데, 다른 영상의 "no conversions in tag rugby"(Tag Rugby Coach 1:37, Try Tag Rugby id_38veBEls 1:19)와 충돌한다. 일반 럭비 규칙과 섞인 것으로 보인다. — [YouTube](https://www.youtube.com/watch?v=R-OmuUUbohY); [YouTube](https://www.youtube.com/watch?v=v7e8Y8g3sGY)
- 인천 교육영상의 15인제 정보(트라이 5점 + 컨버전 2점 = 7점, 2:39)는 정규 럭비 기준으로 맞는 설명이다. 태그럭비 1점과 대비하는 퀴즈에 쓸 수 있다. — [YouTube](https://www.youtube.com/watch?v=XlbxBQ1Udvs)

### Inferences
- 수업 규칙을 대한럭비협회 제2강 기준(3m 후퇴, 프리패스·탭 재시작, 3대 규칙: 녹온·포워드패스·태그)으로 정하면 공식 출처와 일치한다. 이 경우 5m를 말하는 영상을 함께 쓸 때는 "학교마다 거리 조정 가능"이라고 안내하는 것이 안전하다.
- 퀴즈 출제 추천 사실(영상 근거와 시각):
  - 태그는 골반 양쪽에 1개씩, 총 2개(K1 1:42, 2:51)
  - 조끼 먼저, 벨트는 그 위에(K1 2:15)
  - 전진 패스는 상대 공(K2 1:21)
  - 공을 앞으로 놓치면 녹온(K2 0:58)
  - "태그!" 외치기(K2 1:45)
  - 자기 태그를 잡고 달리면 페널티(K2 2:49)
  - 옷 잡기는 페널티(K3 1:50, K2 3:00)
  - 슬라이딩 금지(K3 1:56)
  - 태그럭비 창시자는 영국 체육교사 닉 레오날드, 1990년(K4 0:39)
  - 태그 트라이 1점 vs 15인제 트라이 5점(K5 6:28, 2:39)

### Gaps
- 영상별 화면 자막(번인 텍스트)은 확인하지 못했다. 근거는 ASR 음성 자막뿐이다. 특히 숫자(3m, 5회, 20×30 등)는 퀴즈 확정 전에 교사가 해당 시각을 직접 재생해 확인해야 한다.
- 대한럭비협회 공식 태그럭비 규정 문서와의 대조는 이번 범위(영상 조사)에 포함하지 않았다.
