import { District, CuratedSpot } from './types';

// Districts list representing administrative structure
export const mockDistricts: District[] = [
  {
    id: 1,
    gu: 'DONGNAM',
    subName: '목천읍',
    themeBg: '#FAF5EE',
    themeText: '#5A4E3B',
    description: '독립기념관의 단풍나무 조망과 흑성산 운해, 고즈넉한 힐링 코스가 있는 전통 명소.'
  },
  {
    id: 2,
    gu: 'DONGNAM',
    subName: '병천면',
    themeBg: '#F3EFE9',
    themeText: '#4A3D2C',
    description: '유관순 열사 사적지의 숭고한 나라 사랑 정신과 푸짐한 아우내 순대거리 벨트.'
  },
  {
    id: 3,
    gu: 'DONGNAM',
    subName: '풍세면 (광덕면 포함)',
    themeBg: '#EFECE6',
    themeText: '#3D3425',
    description: '태학산 치유의 숲과 광덕산 가을 단풍 산행, 고택 정원 베이커리 쉼터.'
  },
  {
    id: 4,
    gu: 'DONGNAM',
    subName: '북면',
    themeBg: '#F5EFE6',
    themeText: '#4C3B24',
    description: '천안의 알프스라 불리는 청정 계곡 위례성로 벚꽃 터널 드라이브 스팟.'
  },
  {
    id: 5,
    gu: 'DONGNAM',
    subName: '수신면',
    themeBg: '#EDF2F4',
    themeText: '#2B2D42',
    description: '은하수가 밤하늘에 펼쳐지는 홍대용과학관과 풍요로운 로컬 특산품의 고장.'
  },
  {
    id: 6,
    gu: 'DONGNAM',
    subName: '신안동 (신부동/안서동/유량동/대흥동)',
    themeBg: '#FDFBF7',
    themeText: '#4E3A21',
    description: '단대호수 산책로, 아라리오 야외 조각광장과 원도심의 유서 깊은 맛객 노포거리.'
  },
  {
    id: 7,
    gu: 'DONGNAM',
    subName: '청룡동 (구룡동/신방동)',
    themeBg: '#FCF3E8',
    themeText: '#59291E',
    description: '동화 속 빵 놀이공간 뚜쥬루 빵돌가마마을과 풍미 깊은 스페셜티 감성 로스터리.'
  },
  // SEOBUK DISTRICTS
  {
    id: 8,
    gu: 'SEOBUK',
    subName: '불당동',
    themeBg: '#0D1B2A',
    themeText: '#E0E1DD',
    description: '트렌디한 청년 상업 카페와 지브리 감성, 오픈런이 끊이지 않는 미식의 메카.'
  },
  {
    id: 9,
    gu: 'SEOBUK',
    subName: '부성동 (성성동)',
    themeBg: '#0F2027',
    themeText: '#85FFBD',
    description: 'LED 수변 데크길이 반짝이는 성성호수공원과 호수 전망 감성 테라스 카페 군락.'
  },
  {
    id: 10,
    gu: 'SEOBUK',
    subName: '성거읍',
    themeBg: '#1C2541',
    themeText: '#00B4D8',
    description: '여름날 천흥지 저수지의 노란 금계국 군락과 샤스타데이지 들판 정원.'
  },
  {
    id: 11,
    gu: 'SEOBUK',
    subName: '성환읍',
    themeBg: '#1F2421',
    themeText: '#95D5B2',
    description: '봄철 하얗게 피어나는 110년 전통의 성환 배밭 과수원 풍경과 국보 갈기비.'
  },
  {
    id: 12,
    gu: 'SEOBUK',
    subName: '성정동 (두정동/쌍용동/백석동)',
    themeBg: '#1A1A2E',
    themeText: '#E94560',
    description: '천안축구센터 광장, 정통 뚜쥬루 본점과 든든한 점심을 채우는 특수부위 맛집.'
  }
];

export const mockSpots: CuratedSpot[] = [
  // 1. 목천읍
  {
    id: 1,
    districtId: 1,
    spotName: '독립기념관 (독립숲길)',
    category: 'Heritage',
    googlePlaceId: 'ChIJj71b_9N9fDURDk8bK3sAd-I',
    latitude: 36.7838,
    longitude: 127.2231,
    mzTags: ['#독립숲길', '#가을단풍터널', '#동남헤리티지', '#웅장한산책'],
    curatorDescription: '민족의 찬란한 투쟁 역사가 깃든 곳. 드넓은 단풍나무 숲길의 장엄함과 새벽 흑성산의 바다 같은 운해 풍경이 감동을 선물합니다.',
    ratingRaw: 4.8,
    reviewsCount: 3120,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 2,
    districtId: 1,
    spotName: '카페목천',
    category: 'Taste',
    googlePlaceId: 'ChIJX_Mox_N9fDUR_CafeMokcheon',
    latitude: 36.7850,
    longitude: 127.2180,
    mzTags: ['#통창숲뷰', '#제철과일빙수', '#콩크림눌림떡', '#감성한옥'],
    curatorDescription: '사계절 부드러운 나뭇잎이 유리 통창에 가득 차는 곳. 전통 한식을 우아하게 재해석한 고소하고 쫄깃한 식감의 콩크림눌림떡이 명물입니다.',
    ratingRaw: 4.6,
    reviewsCount: 180,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },

  // 2. 병천면
  {
    id: 3,
    districtId: 2,
    spotName: '유관순 열사 사적지',
    category: 'Heritage',
    googlePlaceId: 'ChIJi0Mux_N9fDUR_RyuGwanSun',
    latitude: 36.8042,
    longitude: 127.2978,
    mzTags: ['#기념관', '#초가생가', '#대한독립만세', '#봉화제'],
    curatorDescription: '아우내 장터에서 만세운동을 이끌었던 숭고한 나라 사랑의 발자취. 복원된 초가집 생가와 추모비가 경건한 사색을 유도합니다.',
    ratingRaw: 4.7,
    reviewsCount: 840,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 4,
    districtId: 2,
    spotName: '청화집',
    category: 'Taste',
    googlePlaceId: 'ChIJChunghwa_3123',
    latitude: 36.8028,
    longitude: 127.2988,
    mzTags: ['#병천순대터줏대감', '#4대정통', '#소창순대', '#개운한국물'],
    curatorDescription: '50년이 넘는 역사를 지닌 아우내 순대거리의 증인. 작은창자(소창)를 써 소담하고 잡내가 없으며 야채와 선지가 차분히 들어가 개운한 끝맛을 냅니다.',
    ratingRaw: 4.8,
    reviewsCount: 940,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 104,
    districtId: 2,
    spotName: '박순자 아우내순대',
    category: 'Taste',
    googlePlaceId: 'ChIJParkSoonJaAunae',
    latitude: 36.8020,
    longitude: 127.2990,
    mzTags: ['#전국대기행렬', '#속이꽉찬순대', '#명물수제순대', '#육즙의감동'],
    curatorDescription: '주말마다 길게 늘어선 대기 행렬이 증명하는 수제 순대의 정수. 속이 가득하여 입안 가득 터지는 깊은 맛이 감동적입니다.',
    ratingRaw: 4.7,
    reviewsCount: 1520,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 107,
    districtId: 2,
    spotName: '천안옛날호두과자 병천점',
    category: 'Taste',
    googlePlaceId: 'ChIJCheonanYennalByeongcheon',
    latitude: 36.8035,
    longitude: 127.2970,
    mzTags: ['#적앙금진수', '#튀김소보로호두과자', '#간식스팟', '#전통밀가루'],
    curatorDescription: '순댓국 식후에 빠질 수 없는 천안 디저트의 상징. 아삭하고 고소하게 튀겨내어 팥 앙금 맛을 배가시킨 명품 간식 명당입니다.',
    ratingRaw: 4.4,
    reviewsCount: 310,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },

  // 3. 풍세면/광덕산
  {
    id: 5,
    districtId: 3,
    spotName: '풍세커피 (한옥고택)',
    category: 'Taste',
    googlePlaceId: 'ChIJOfd_yZGAfDUR_PungseCoffee',
    latitude: 36.7325,
    longitude: 127.1325,
    mzTags: ['#한옥고택', '#정원카페', '#사색의여백', '#메타세쿼이아'],
    curatorDescription: '수백 년 고택의 마루와 전통 보를 살린 자연 친화형 정원 예술 카페. 메타세쿼이아 숲 아래에서 흘러나오는 사색의 커피 맛이 일품입니다.',
    ratingRaw: 4.4,
    reviewsCount: 420,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },

  // 4. 북면
  {
    id: 6,
    districtId: 4,
    spotName: '카페 교토리',
    category: 'Taste',
    googlePlaceId: 'ChIJV2H_yZGAfDUR_Kyotori',
    latitude: 36.8524,
    longitude: 127.2412,
    mzTags: ['#일본가옥감성', '#벚꽃길드라이브', '#다다미공간', '#수제유자차'],
    curatorDescription: '천안의 알프스 북면 위례성로 벚꽃 터널에 정갈하게 비쳐 드는 목재 건축 카페. 다다미 구조 내부에서 조용한 계곡 소리와 차 향기를 즐깁니다.',
    ratingRaw: 4.5,
    reviewsCount: 340,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },

  // 5. 수신면
  {
    id: 7,
    districtId: 5,
    spotName: '천안홍대용과학관',
    category: 'Heritage',
    googlePlaceId: 'ChIJV2H_yZGAfDUR_HongDaeYong',
    latitude: 36.7582,
    longitude: 127.2688,
    mzTags: ['#천체관측실', '#조선실학정신', '#은하수망원경', '#별자리투영'],
    curatorDescription: '실학파 우주 과학자 홍대용을 기념하는 고감도 플라네타리움 성지. 고배율 망원경을 통해 밤하늘 성운과 은하수를 눈앞에서 생생하게 만날 수 있습니다.',
    ratingRaw: 4.6,
    reviewsCount: 220,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },

  // 6. 신안동/원도심
  {
    id: 8,
    districtId: 6,
    spotName: '책방 허송세월',
    category: 'Heritage',
    googlePlaceId: 'ChIJv_HeosongSewol',
    latitude: 36.8148,
    longitude: 127.1638,
    mzTags: ['#독립문학서점', '#사진가대표', '#24시무인갤러리', '#인디출판물'],
    curatorDescription: '사진작가 사장님의 낭만적인 취향이 스민 충청권 1호 독립서점. 매혹적인 사진집과 독립출판 도서들, 바로 옆 24시간 오픈형 쇼룸이 눈부십니다.',
    ratingRaw: 4.9,
    reviewsCount: 88,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 9,
    districtId: 6,
    spotName: '일상서재 (기록도서관)',
    category: 'Heritage',
    googlePlaceId: 'ChIJv_IlsangSeojae',
    latitude: 36.8124,
    longitude: 127.1512,
    mzTags: ['#필사와기록', '#글쟁이살롱', '#망고푸들', '#조용한문화동'],
    curatorDescription: '캘리그래피 작가의 섬세한 수제 잉크와 사려 깊은 마스코트 푸들 "망고"가 반겨주는 필사 도서관 서점. 고요하게 생각하고 기록하는 시간을 줍니다.',
    ratingRaw: 4.8,
    reviewsCount: 52,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 11,
    districtId: 6,
    spotName: '아라리오 조각광장',
    category: 'Heritage',
    googlePlaceId: 'ChIJi0ArarioSculpturePlaza',
    latitude: 36.8198,
    longitude: 127.1568,
    mzTags: ['#데미안허스트', '#수보드굽타', '#도심야외갤러리', '#세계미술성지'],
    curatorDescription: '마치 노천 거장 미술관에 서 있는 느낌. 데미안 허스트의 거대한 찬가 랜드마크와 수보드 굽타의 통제선 등 수백억 대 조각을 일상 삼아 걸으며 산책합니다.',
    ratingRaw: 4.8,
    reviewsCount: 1540,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 10,
    districtId: 6,
    spotName: '천호지 (단대호수공원)',
    category: 'Nature',
    googlePlaceId: 'ChIJv_CheonhojiLake',
    latitude: 36.8322,
    longitude: 127.1725,
    mzTags: ['#송꽃송이가', '#밤산책명소', '#천호수데크길', '#벚꽃라이드'],
    curatorDescription: '가을바람이 솔솔 불 지음 생각나는 버스커버스커 노랫소리의 낭만처. 넓은 은빛 저수지를 가로지르는 긴 보행데크가 호수빛 밤하늘을 수놓습니다.',
    ratingRaw: 4.6,
    reviewsCount: 1250,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 111,
    districtId: 6,
    spotName: '석산장',
    category: 'Taste',
    googlePlaceId: 'ChIJSeoksanjangWonDosim',
    latitude: 36.8090,
    longitude: 127.1478,
    mzTags: ['#조려먹는물갈비', '#천안역갈비노포', '#명물육수갈비', '#달콤짭조름'],
    curatorDescription: '천안역 앞 원도심 갈비골목의 영예를 지키는 역사적 갈비 노포. 팬 가장자리의 특제 간장 육수에 고기를 푹 졸이듯 정성으로 구워 먹는 달콤한 물갈비의 대가입니다.',
    ratingRaw: 4.5,
    reviewsCount: 780,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 112,
    districtId: 6,
    spotName: '정통옥수사',
    category: 'Taste',
    googlePlaceId: 'ChIJJeongtongOksusa',
    latitude: 36.8182,
    longitude: 127.1585,
    mzTags: ['#생활의달인', '#머릿고기수육', '#걸쭉한손칼국수', '#원조노포'],
    curatorDescription: '오랜 세월 동안 쫄깃하고 잡내 전혀 없이 촉촉하게 삶아낸 수육과 고춧가루를 풀어 보글보글 끓여낸 묵직한 손칼국수의 조화가 완벽한 신부동 대표 식당입니다.',
    ratingRaw: 4.6,
    reviewsCount: 540,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 124,
    districtId: 6,
    spotName: '안서동 이고집 만두',
    category: 'Taste',
    googlePlaceId: 'ChIJYegojipManduAnseo',
    latitude: 36.8290,
    longitude: 127.1850,
    mzTags: ['#얇은피만두전골', '#꽃잎만두샤브', '#줄서는명가', '#고기만두전국구'],
    curatorDescription: '속이 다 들여다보이는 종이처럼 얇은 피로 정갈하게 빚은 만두 샤브 전골. 사계절 한결같이 오픈 전부터 만석 행렬을 이루는 명불허전 만두 명당입니다.',
    ratingRaw: 4.8,
    reviewsCount: 1640,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },

  // 7. 청룡동/구룡동/신방동
  {
    id: 12,
    districtId: 7,
    spotName: '뚜쥬루 빵돌가마마을',
    category: 'Taste',
    googlePlaceId: 'ChIJ_ToujoursBreadVillage',
    latitude: 36.7792,
    longitude: 127.1422,
    mzTags: ['#동화홉비트마을', '#가마솥직접끓인팥', '#돌가마만주', '#거북이빵'],
    curatorDescription: '빵의 고장 천안을 수호하는 랜드마크 빵 테마파크. 유기농 밀가루와 장작으로 가마 속에서 건강하고 투박하게 구워 대형 순례 행렬을 만듭니다.',
    ratingRaw: 4.8,
    reviewsCount: 3450,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 115,
    districtId: 7,
    spotName: '히트커피 본점 (신방동)',
    category: 'Taste',
    googlePlaceId: 'ChIJHitCoffeeSinbang',
    latitude: 36.7820,
    longitude: 127.1250,
    mzTags: ['#콜드빙하', '#크림아인슈페너', '#우드감성로스터', '#천안커피자존심'],
    curatorDescription: '묵진하고 달콤한 콜드 드립 커피 위에 수제 아인슈페너 크림을 고소하게 얹은 시그니처 "콜드빙하"로 천안의 감성 커피 흐름을 평정한 리얼 로스터리 레전드입니다.',
    ratingRaw: 4.7,
    reviewsCount: 350,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },

  // 8. 불당동
  {
    id: 116,
    districtId: 8,
    spotName: '킨이로텐',
    category: 'Taste',
    googlePlaceId: 'ChIJKinirotenBuldang',
    latitude: 36.8145,
    longitude: 127.1055,
    mzTags: ['#인생텐동', '#특제타래소스', '#오징어꽈리튀김', '#오픈런대기'],
    curatorDescription: '바삭바삭 소리부터 찬란한 튀김 덮밥의 교과서. 싱싱한 새우와 반숙 계란, 아삭한 연근 튀김에 녹작지근 뿌려낸 특제 소스가 황홀한 불당동 최고 핫플입니다.',
    ratingRaw: 4.7,
    reviewsCount: 890,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },

  // 9. 성성동
  {
    id: 15,
    districtId: 9,
    spotName: '성성호수공원 (수변데크)',
    category: 'Nature',
    googlePlaceId: 'ChIJi0SeongseongLake',
    latitude: 36.8450,
    longitude: 127.1390,
    mzTags: ['#습지순환데크', '#낙조포토존', '#LED은빛경관', '#피트니스힐링'],
    curatorDescription: '도심 속 대자연과 고용함을 선사하는 넓은 생태 호수. 수면에 비쳐 들려 춤을 추는 야경 수변 데크길이 낭만적인 밤공기를 불러옵니다.',
    ratingRaw: 4.7,
    reviewsCount: 1680,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },

  // 10. 성거읍
  {
    id: 16,
    districtId: 10,
    spotName: '성거 천흥지 & 카페 이숲',
    category: 'Nature',
    googlePlaceId: 'ChIJ_CheonheungjiIsuoop',
    latitude: 36.8825,
    longitude: 127.1895,
    mzTags: ['#금계국들판', '#샤스타데이지숲', '#가을핑크뮬리', '#천흥저수지'],
    curatorDescription: '여름날 노란 물빛을 자아내는 저수지의 금계국 야생화. 바로 아래 화려한 가을 핑크뮬리와 하얀 샤스타데이지 벌판을 가꾼 정원 "이숲"이 그림을 만듭니다.',
    ratingRaw: 4.6,
    reviewsCount: 480,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },

  // 12. 성정동/백석동/쌍용동/두정동
  {
    id: 121,
    districtId: 12,
    spotName: '쌍용동 광명만두',
    category: 'Taste',
    googlePlaceId: 'ChIJGwangmyeongManduSsang',
    latitude: 36.7995,
    longitude: 127.1255,
    mzTags: ['#인생군만두', '#엄청나게바삭함', '#속이꽉찬찐만두', '#품절주의'],
    curatorDescription: '파삭! 깨무는 순간 터져 나오는 묵직한 고기 육즙과 바삭한 피의 전율. 마니아들 사이에서 "인생 만두"라 일컬어지는 만두의 단일 대가입니다.',
    ratingRaw: 4.7,
    reviewsCount: 930,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  }
];
