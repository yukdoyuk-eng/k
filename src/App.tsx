import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Compass,
  MapPin,
  Sparkles,
  Star,
  MessageSquare,
  Search,
  BookOpen,
  Coffee,
  RotateCcw,
  Clock,
  ChevronRight,
  Sparkle,
  Image,
  Award,
  Heart,
  Layers,
  ChevronDown,
  ChevronUp,
  Calendar,
  CalendarCheck,
  CalendarDays,
  Utensils,
  Check,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockDistricts as localDistricts, mockSpots as localSpots } from './data';
import { District, CuratedSpot } from './types';
import CheonanMap from './components/CheonanMap';
import ReviewSection from './components/ReviewSection';
import SpotSurroundingView from './components/SpotSurroundingView';
import InfrastructureConsole from './components/InfrastructureConsole';

// Unified high-quality aesthetic local dining & design photo representation
const UNIFIED_AESTHETIC_IMAGE = "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80";

interface FestivalEvent {
  id: string;
  season: 'spring' | 'summer' | 'autumn' | 'always';
  seasonLabel: string;
  period: string;
  title: string;
  date: string;
  location: string;
  description: string;
  features: string;
  partners: string[];
}

const FESTIVAL_EVENTS: FestivalEvent[] = [
  {
    id: 'bongsah',
    season: 'spring',
    seasonLabel: '봄의 태동 (2월 ~ 4월): 역사와 봄꽃의 흐름',
    period: '2월 28일',
    title: '🌸 3·1운동 기념 아우내 봉화제',
    date: '매년 2월 28일 (양력 기준)',
    location: '동남구 병천면 유관순열사기념관 광장 ~ 아우내장터 일대 (약 1,300m 구간)',
    description: '유관순 열사와 순국선열들의 숭고한 호국 정신을 기리며 실제 횃불 시위와 일본 헌병대와의 충돌 장면을 재현하는 천안의 역사적 랜드마크 축제입니다.',
    features: '횃불 행진 및 만세운동 재현에 수백 명의 시민과 청년 단체가 합동 재투쟁 역사를 연출합니다.',
    partners: ['청화집', '박순자 아우내순대', '충남집', '아우내한방순대', '천안옛날호두과자 병천점']
  },
  {
    id: 'cherry_blossom',
    season: 'spring',
    seasonLabel: '봄의 태동 (2월 ~ 4월): 역사와 봄꽃의 흐름',
    period: '4월 초',
    title: '🌸 천안 위례 벚꽃축제',
    date: '매년 4월 초 (벚꽃 개화기)',
    location: '동남구 북면 위례성로 일원 (약 3.5km 터널)',
    description: '‘천안의 알프스’라 불리는 북면 계곡 길을 따라 흐드러지게 핀 벚꽃을 감상하며 걷는 힐링 봄꽃 축제입니다.',
    features: '연분홍빛 벚꽃 길 드라이브 및 로컬 주민 예술 수공예 장터 단지가 협업 운영됩니다.',
    partners: ['카페 교토리', '카페목천', '풍세커피']
  },
  {
    id: 'bbang_spring',
    season: 'summer',
    seasonLabel: '초여름 (5월 ~ 6월): 제빵의 도시와 수변 정원',
    period: '5월 ~ 6월 중',
    title: '🥐 베리베리 빵빵데이 & 빵지순례',
    date: '2026년 기준 6월 13일 ~ 6월 14일 진행',
    location: '천안시 관내 참여 제과점 매장 및 천안시청 버들광장',
    description: '1934년 학화호도과자로부터 발원해 대한민국 최고 제빵의 도시로 도약한 천안 대표 브랜드 상생 축제입니다.',
    features: '대전 성심당 같은 단일 브랜드 축제와 달리 천안의 수십 개 동네 명품 빵집이 합동 참여하여 10% 일괄 할인 및 빵지순례 맵 투어를 진행합니다.',
    partners: ['뚜쥬루 빵돌가마마을', '뚜쥬루 성정본점', '진스베이커리 천안점', '하레브라도', '히트커피 본점']
  },
  {
    id: 'dance_festival',
    season: 'autumn',
    seasonLabel: '초가을 ~ 늦가을 (9월 ~ 10월): 축제와 미식의 정점',
    period: '10월 초',
    title: '🕺 천안흥타령춤축제',
    date: '2026년 기준 10월 1일 ~ 10월 5일 개최',
    location: '천안종합운동장 일원 및 원도심 아트 아지트',
    description: '문화체육관광부 지정 대한민국 최우수 글로벌 예술 댄스 페스티벌입니다. 세계의 무용단이 모여 도심을 가득 채웁니다.',
    features: '국내외 전문 아티스트 길거리 퍼레이드가 불당동 카페거리 등의 번화가 상권과 직접 제휴 협업하여 미식을 전개합니다.',
    partners: ['킨이로텐', '카와이레시피', '멘야타마시', '그래비티 커피드립바', '피양옥', '광명만두', '장군꼬들살전문점', '교동면옥']
  },
  {
    id: 'bbang_pears',
    season: 'autumn',
    seasonLabel: '초가을 ~ 늦가을 (9월 ~ 10월): 축제와 미식의 정점',
    period: '10월 중순',
    title: '🌾 가을 빵빵데이 & 성환배축제',
    date: '매년 10월 중순 (2025년 기준 10월 18일 ~ 10월 19일 진행)',
    location: '천안종합운동장 오륜문 광장 및 서북구 성환읍 일원',
    description: '가을 낭만 빵빵데이와 110년 전통의 당도 최고 성환 명품 배 수확이 한데 어우러지는 복합형 특산품 대축제입니다.',
    features: '수제 잼 만들기 체험, 가을 빵 콘서트 투어, 1,000여 대의 우주 드론 라이트쇼가 성대하게 진행됩니다.',
    partners: ['이봉원의 봉짬뽕', '정원식당', '학교종이땡땡땡', '이고집 만두']
  },
  {
    id: 'arario_sculpture',
    season: 'always',
    seasonLabel: '사계절 문화 예술 & 원도심 투어',
    period: '상시 운영',
    title: '🎨 아라리오 조각광장 & 리각미술관 공공전',
    date: '연중 상시 진행 (야간 조명쇼 포함)',
    location: '동남구 신부동 터미널 앞 광장 및 유량동 태조산 공원',
    description: '미슐랭 그린가이드 등재 완료. 데미안 허스트, 키스 해링 등 현대 미술 거장들의 조각 작품 26점이 무료 상시 공개됩니다.',
    features: '독립 북카페 감성과 옛날 갈기 골목, 석산장 물갈비 등 유구한 원도심 골목 노포들이 합동하여 사계절 따스한 문화를 선물합니다.',
    partners: ['벤베커', '랜드마크195', '석산장', '정통옥수사', '나정식당', '평양냉면', '일상서재']
  }
];

interface PresetCourseStep {
  baseStartOffset: number; // minutes from baseStart
  duration: number; // duration in minutes
  spotId: number;
  spotName: string;
  guide: string;
}

interface PresetCourse {
  id: string;
  title: string;
  gu: 'DONGNAM' | 'SEOBUK' | 'ALL';
  vibe: string;
  baseStart: string; // e.g. "09:30"
  steps: PresetCourseStep[];
}

const PRESET_COURSES: PresetCourse[] = [
  {
    id: "hist_spring",
    title: "🌸 역사 명소 & 가을 단풍 숲길 코스",
    gu: "DONGNAM",
    vibe: "민족의 숭고한 얼과 단풍 나무 그늘 아래에서 사색하는 고요하고 전통적인 힐링 기행",
    baseStart: "09:30",
    steps: [
      { baseStartOffset: 0, duration: 120, spotId: 1, spotName: "독립기념관 단풍나무 숲길", guide: "붉은 단풍나무가 터널처럼 조밀하게 심어진 3.2km 단풍나무길을 가볍게 걷습니다. 이른 아침 이슬 젖은 잎사귀들에 비치는 절경을 세세히 감상해 보세요." },
      { baseStartOffset: 130, duration: 65, spotId: 4, spotName: "점심 식사: 병천 아우내 청화집", guide: "50년 전통 노포에서 부드럽고 쫄깃쫄깃한 수제 소창 순대국밥 국물과 야채가 알차게 찬 모듬순대로 따끈하게 배를 채웁니다." },
      { baseStartOffset: 210, duration: 20, spotId: 107, spotName: "간식: 옛날호두과자 병천점", guide: "순대국밥 오찬 후 차에서 맛보는 바삭하게 갓 튀겨낸 튀김소보로 호두과자의 고소함을 간식으로 음미합니다." },
      { baseStartOffset: 240, duration: 110, spotId: 2, spotName: "카페목천 (한옥 숲뷰)", guide: "목천읍의 고아한 한옥 마루와 대형 통유리창 앞에 자리 잡아 흔들리는 무성한 숲을 보며, 쫄깃쫄깃한 시그니처 콩크림눌림떡을 음용 차와 즐겨보세요." }
    ]
  },
  {
    id: "bakery_lake",
    title: "🥐 빵의 도시 뚜쥬루 & 성성호수 순환 코스",
    gu: "ALL",
    vibe: "천안의 독창적인 제빵 장인들의 풍미를 만나고 탁 트인 호수 데크길을 걷는 트렌디 미식 코스",
    baseStart: "10:30",
    steps: [
      { baseStartOffset: 0, duration: 100, spotId: 12, spotName: "뚜쥬루 빵돌가마마을", guide: "호빗들이 둥지를 튼 것 같은 동화 마을을 거닐며 가마솥에 손수 졸인 팥이 씹히는 명물 돌가마만주와 갓 구운 거북이빵을 오감으로 맛보세요." },
      { baseStartOffset: 120, duration: 75, spotId: 116, spotName: "점심 식사: 불당동 킨이로텐", guide: "줄서서 먹는 튀김 바에서 아삭 바삭한 새우, 계란, 구수한 연근이 가득한 텐동을 수제 양념장에 올려 황홀하게 수저를 듭니다." },
      { baseStartOffset: 210, duration: 75, spotId: 15, spotName: "성성호수공원 데크길", guide: "도심 속 광활한 호수의 목재 데크길을 약 1.5km 상쾌하게 돌아 걷고 호수 전경을 사진 프레임 안에 가득 담아보며 소화를 돕습니다." },
      { baseStartOffset: 295, duration: 80, spotId: 115, spotName: "히트커피 본점 (로스팅 명가)", guide: "시그니처 드립커피에 달콤부드러운 크림을 도탑게 얹은 '콜드빙하' 아인슈페너 커피를 홀짝이며 나른한 피로를 눈부시게 해소합니다." }
    ]
  },
  {
    id: "art_record",
    title: "🎨 야외 조각광장 & 독립서점 기록 코스",
    gu: "SEOBUK",
    vibe: "거장들의 대형 조각품들과 고서적들이 있는 서재에서 사각사각 소리가 들리게 필사하며 묵혀두는 마음 기록 기행",
    baseStart: "11:00",
    steps: [
      { baseStartOffset: 0, duration: 80, spotId: 11, spotName: "아라리오 조각광장", guide: "터미널 야외 광장 전체가 거대한 지붕 없는 현대미술 거장들의 명작 갤러리입니다. 데미안 허스트의 기념비적인 작품 등 수백억 가치 대작들을 차분히 감상합니다." },
      { baseStartOffset: 95, duration: 60, spotId: 112, spotName: "점심 식사: 정통옥수사 수육과 칼국수", guide: "야들야들하게 수분이 촉촉이 밴 수육 한 점과 칼국수의 깊은 고춧가루 국물이 이루어내는 오랜 장인 노포의 맛으로 입도 즐겁게 채워줍니다." },
      { baseStartOffset: 170, duration: 80, spotId: 9, spotName: "일상서재 (기록도서관)", guide: "캘리그래피 작가의 따스한 살롱에서 펜촉과 잉크를 빌려 엽서지 위에 가슴 깊은 소망 한 줄을 호흡을 멈춘 채 고요히 사각사각 필사해 보세요." },
      { baseStartOffset: 260, duration: 80, spotId: 8, spotName: "책방 허송세월", guide: "사진가 사장님의 따스한 손때 묻은 취향이 오롯이 고여 있는 서점에서 이색 문학 도서와 독립 출판 잡지를 집어 들며 문학적인 기행을 완성합니다." },
      { baseStartOffset: 350, duration: 90, spotId: 111, spotName: "저녁 식사: 원도심 석산장 물갈비", guide: "간장 양념 물 육수를 부어 갈비를 자작하게 졸이듯이 구워내는 역사가 담긴 원조 물갈비를 맛보며 달콤 고소하고 푸근한 행복으로 하루를 끝맺습니다." }
    ]
  }
];

const getStepTimes = (preset: PresetCourse, startStr: string, stepOffset: number, duration: number) => {
  const [pH, pM] = preset.baseStart.split(':').map(Number);
  const presetBaseStartMinutes = pH * 60 + pM;
  
  const [sH, sM] = startStr.split(':').map(Number);
  const userSelectedStartMinutes = sH * 60 + sM;
  
  const shiftDiff = userSelectedStartMinutes - presetBaseStartMinutes;
  
  const startMin = presetBaseStartMinutes + stepOffset + shiftDiff;
  const endMin = startMin + duration;
  
  const formatMin = (m: number) => {
    const adjusted = (m + 1440) % 1440;
    const h = Math.floor(adjusted / 60);
    const min = adjusted % 60;
    const period = h < 12 ? '오전' : '오후';
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${period} ${String(displayH).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
  };
  
  return {
    start: formatMin(startMin),
    end: formatMin(endMin)
  };
};

function CurationRenderer({ text }: { text: string }) {
  if (!text) return null;
  
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  
  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];
  
  const flushTable = (key: number) => {
    if (tableRows.length > 0 || tableHeaders.length > 0) {
      elements.push(
        <div key={`table-${key}`} className="overflow-x-auto my-4 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950">
          <table className="w-full text-xs text-left text-slate-600 dark:text-slate-300">
            {tableHeaders.length > 0 && (
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-850 font-black text-slate-800 dark:text-cyan-400">
                <tr>
                  {tableHeaders.map((h, i) => (
                    <th key={i} className="px-3 py-2.5 tracking-wider">{h.trim()}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {tableRows.map((row, ri) => (
                <tr key={ri} className="border-b dark:border-slate-850 border-slate-100 hover:bg-slate-50/40 dark:hover:bg-slate-900/10">
                  {row.map((cell, ci) => {
                    const formatted = formatInline(cell);
                    return (
                      <td key={ci} className="px-3 py-3 font-medium leading-relaxed align-top" dangerouslySetInnerHTML={{ __html: formatted }}></td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableHeaders = [];
      tableRows = [];
    }
    inTable = false;
  };
  
  const formatInline = (str: string) => {
    let fmt = str.trim();
    fmt = fmt.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-slate-850 dark:text-white">$1</strong>');
    fmt = fmt.replace(/\*(.*?)\*/g, '<em class="italic text-slate-500">$1</em>');
    fmt = fmt.replace(/<br\s*\/?>/gi, '<br />');
    return fmt;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const parts = trimmed.split('|').map(p => p.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
      const isSeparator = parts.every(part => /^:?-+:?$/.test(part));
      
      if (isSeparator) {
        inTable = true;
      } else {
        if (!inTable) {
          tableHeaders = parts;
          inTable = true;
        } else {
          tableRows.push(parts);
        }
      }
      return;
    } else {
      if (inTable) {
        flushTable(index);
      }
    }
    
    if (trimmed.startsWith('###')) {
      elements.push(
        <h5 key={index} className="text-sm font-black text-slate-900 dark:text-white mt-6 mb-2 flex items-center gap-2 border-l-4 border-amber-900 dark:border-cyan-400 pl-2">
          {trimmed.replace(/^###\s*/, '')}
        </h5>
      );
    } else if (trimmed.startsWith('🧭') || trimmed.startsWith('🗺️') || trimmed.startsWith('💊') || trimmed.startsWith('🧭') || trimmed.startsWith('💡')) {
      elements.push(
        <div key={index} className="p-3.5 bg-amber-50/50 dark:bg-slate-900/50 border border-amber-100/30 dark:border-slate-800 text-xs font-semibold rounded-2xl text-[#6B5A40] dark:text-cyan-300 my-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
      );
    } else if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      elements.push(
        <ul key={index} className="list-disc pl-5 my-1.5 text-xs text-slate-600 dark:text-slate-300 space-y-1">
          <li dangerouslySetInnerHTML={{ __html: formatInline(trimmed.replace(/^[-*]\s*/, '')) }} />
        </ul>
      );
    } else if (trimmed) {
      elements.push(
        <p key={index} className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 my-2" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
      );
    }
  });
  
  if (inTable) {
    flushTable(lines.length);
  }
  
  return <div className="space-y-1">{elements}</div>;
}

function getSeasonalRecommendation(month: number) {
  if (month >= 3 && month <= 5) {
    return {
      festivalId: 'cherry_blossom',
      title: '봄바람과 흐드러지는 연분홍 터널, 북면 위례 벚꽃길',
      reason: '봄 햇살이 내리쬐는 천안의 알프스 북면 계곡 길에서 3.5km 벚꽃 드라이브를 만끽하기 가장 좋은 시즌입니다.',
      icon: '🌸',
      accentColor: 'text-pink-650 bg-pink-50/40 border-pink-100 dark:bg-pink-950/20 dark:border-pink-900/30 dark:text-pink-400',
      badgeColor: 'bg-pink-100 text-pink-900 border border-pink-200 dark:bg-pink-900/60 dark:text-pink-100'
    };
  } else if (month >= 6 && month <= 8) {
    return {
      festivalId: 'bbang_spring',
      title: '제빵의 도시 천안, 베리베리 빵빵데이 & 명품 빵지순례',
      reason: '빵돌가마마을과 유수의 명품 로컬 제과점이 전수 동참하는 대한민국 NO.1 제빵 축제 기간이자 초여름 시원한 수변 산책의 완벽한 해답입니다.',
      icon: '🥐',
      accentColor: 'text-amber-800 bg-amber-50/40 border-amber-200/50 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400',
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-200 dark:bg-amber-900/60 dark:text-amber-100'
    };
  } else if (month >= 9 && month <= 11) {
    return {
      festivalId: 'dance_festival',
      title: '익스프레시브 에너지, 천안흥타령춤축제 & 가을 빵 축제',
      reason: '대한민국 최우수 글로벌 댄스 예술 축제와 110년 성환 배 대수확, 빵 콘서트가 함께 물드는 힙한 가을 낭만의 정점입니다.',
      icon: '🕺',
      accentColor: 'text-purple-750 bg-purple-50/40 border-purple-100 dark:bg-purple-950/20 dark:border-purple-900/30 dark:text-purple-400',
      badgeColor: 'bg-purple-100 text-purple-900 border border-purple-200 dark:bg-purple-900/60 dark:text-purple-100'
    };
  } else {
    return {
      festivalId: 'bongsah',
      title: '겨울의 숭고한 등불, 아우내 장터 봉화제 & 실내 미술 투어',
      reason: '2월의 시린 겨울바람 속에서 뜨거운 아우내 독립 만세 운동의 불씨를 기리거나, 아라리오 조각광장 현대예술 거장들의 실내전시를 편히 관람하기 좋습니다.',
      icon: '🏛️',
      accentColor: 'text-blue-750 bg-blue-50/40 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400',
      badgeColor: 'bg-blue-100 text-blue-900 border border-blue-200 dark:bg-blue-900/60 dark:text-blue-100'
    };
  }
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function App() {
  const queryClient = useQueryClient();

  // Persistent dark mode theme toggle state backed by localStorage
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('isDarkTheme');
    return saved ? saved === 'true' : false;
  });

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const newVal = !prev;
      localStorage.setItem('isDarkTheme', String(newVal));
      return newVal;
    });
  };

  // Load districts with React Query and cache
  const { data: districts = localDistricts } = useQuery<District[]>({
    queryKey: ['districts'],
    queryFn: async () => {
      const response = await fetch('/api/districts');
      if (!response.ok) throw new Error('Failed to load districts from API');
      return response.json();
    },
    initialData: localDistricts,
    staleTime: 1000 * 60 * 10, // Districts change very rarely, 10 min cache
  });

  // Load spots with React Query and cache
  const { data: spots = localSpots } = useQuery<CuratedSpot[]>({
    queryKey: ['spots'],
    queryFn: async () => {
      const response = await fetch('/api/spots');
      if (!response.ok) throw new Error('Failed to load spots from API');
      return response.json();
    },
    initialData: localSpots,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes, reducing network requests
  });

  const [selectedGu, setSelectedGu] = useState<'DONGNAM' | 'SEOBUK' | 'ALL'>('ALL');
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);
  const [selectedFestivalId, setSelectedFestivalId] = useState<string | null>(null);
  const [festSeason, setFestSeason] = useState<'ALL' | 'spring' | 'summer' | 'autumn' | 'always'>('ALL');
  const [festivalSearchQuery, setFestivalSearchQuery] = useState('');
  
  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedNearbySpotId, setSelectedNearbySpotId] = useState<number | null>(null);

  // AI Curation Assistant properties
  const [userPrompt, setUserPrompt] = useState('');
  const [aiCuration, setAiCuration] = useState('');
  const [curationLoading, setCurationLoading] = useState(false);

  // Time & interactive settings
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedSpotId, setExpandedSpotId] = useState<number | null>(null);

  // Dynamic Course Planner setting
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(0);
  const [courseStartHour, setCourseStartHour] = useState<string>("09:30");

  // Sync clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Callback when a review is added to dynamically update the view state
  const handleReviewAdded = (updatedSpot: CuratedSpot) => {
    queryClient.setQueryData<CuratedSpot[]>(['spots'], (prevSpots) => {
      if (!prevSpots) return prevSpots;
      return prevSpots.map(s => (s.id === updatedSpot.id ? updatedSpot : s));
    });
  };

  const handleGenerateCuration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPrompt.trim()) return;

    setCurationLoading(true);
    setAiCuration('');

    try {
      const response = await fetch('/api/curate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: userPrompt,
          targetGu: selectedGu,
          currentRatingList: spots.map(s => ({ id: s.id, score: s.weightedScore }))
        }),
      });
      const data = await response.json();
      if (data.success) {
        setAiCuration(data.curation);
      } else {
        setAiCuration("짙은 안개가 천안의 산맥을 에워쌌습니다. 잠시 후 큐레이팅 등대를 다시 켜주세요.");
      }
    } catch (err) {
      setAiCuration("서버와의 지능적 연결에 지연이 발생했으나 가열찬 탐험은 계속됩니다.");
    } finally {
      setCurationLoading(false);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedGu('ALL');
    setSelectedDistrictId(null);
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedFestivalId(null);
    setSelectedNearbySpotId(null);
  };

  // Compute stats dynamically
  const totalAestheticSpots = spots.length;
  
  // Calculate average of Bayesian ratings
  const spotsWithScores = spots.map(s => ({
    ...s,
    score: s.weightedScore || s.ratingRaw
  }));
  
  const topRatedSpot = [...spotsWithScores].sort((a, b) => b.score - a.score)[0];
  const totalReviewsCount = spots.reduce((sum, s) => sum + (s.customReviews?.length || 0) + s.reviewsCount, 0);

  // Filter application matching both structural levels: Gu and subName (districtId)
  const filteredSpots = spotsWithScores.filter(spot => {
    // 1. If nearby filter is active, the center spot is ALWAYS retained.
    // Geographical circle query bypasses administrative boundary partitions (Gu/subName),
    // but still allows search queries, festivals and categories sub-filtering if applied.
    if (selectedNearbySpotId !== null) {
      if (spot.id === selectedNearbySpotId) {
        // Always show the selected anchor spot card
      } else {
        const originSpot = spotsWithScores.find(s => s.id === selectedNearbySpotId);
        if (originSpot) {
          const dist = getDistance(originSpot.latitude, originSpot.longitude, spot.latitude, spot.longitude);
          if (dist > 2.0) {
            return false;
          }
        } else {
          return false;
        }
      }
    } else {
      // 1. Gu Filter
      const districtInfo = districts.find(d => d.id === spot.districtId);
      if (!districtInfo) return false;
      
      if (selectedGu !== 'ALL' && districtInfo.gu !== selectedGu) {
        return false;
      }

      // 2. Specific Sub-District filter from interactive map
      if (selectedDistrictId !== null && spot.districtId !== selectedDistrictId) {
        return false;
      }
    }

    // 3. Category Filter
    if (selectedCategory !== 'ALL' && spot.category !== selectedCategory) {
      return false;
    }

    // 4. Text Search (name, descriptions, or tags)
    if (searchQuery.trim()) {
      const districtInfo = districts.find(d => d.id === spot.districtId);
      const query = searchQuery.toLowerCase();
      const inName = spot.spotName.toLowerCase().includes(query);
      const inDesc = spot.curatorDescription.toLowerCase().includes(query);
      const inTags = spot.mzTags.some(tag => tag.toLowerCase().includes(query));
      const inDistrict = districtInfo ? districtInfo.subName.toLowerCase().includes(query) : false;
      return inName || inDesc || inTags || inDistrict;
    }

    // 5. Selected Festival filter
    if (selectedFestivalId) {
      const activeFest = FESTIVAL_EVENTS.find(f => f.id === selectedFestivalId);
      if (activeFest) {
        // Check if current spotName matches any of the partner name keywords
        const matches = activeFest.partners.some(p => 
          spot.spotName.toLowerCase().includes(p.toLowerCase()) ||
          p.toLowerCase().includes(spot.spotName.toLowerCase())
        );
        if (!matches) return false;
      }
    }

    return true;
  });

  // Category Icon helper
  const renderCategoryIcon = (category: string) => {
    switch (category) {
      case 'Heritage':
        return <Award className="w-4 h-4 text-amber-600" />;
      case 'Nature':
        return <Layers className="w-4 h-4 text-emerald-600" />;
      case 'Taste':
        return <Coffee className="w-4 h-4 text-amber-700" />;
      default:
        return <Compass className="w-4 h-4 text-slate-500" />;
    }
  };

  // Aesthetic category translation
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'Heritage':
        return '역사·문화 유산';
      case 'Nature':
        return '자연·성찰 숲경관';
      case 'Taste':
        return '미식·감성 베이커리';
      default:
        return category;
    }
  };

  // Dynamic branding tone based on active select zone
  const activeTheme = {
    bg: isDark ? 'bg-slate-950' : 'bg-white',
    cardBg: isDark 
      ? (selectedGu === 'DONGNAM' ? 'bg-slate-900/60' : 'bg-slate-900/40')
      : (selectedGu === 'DONGNAM' ? 'bg-[#FCFAF7]' : 'bg-[#FAFCFD]'),
    text: isDark ? 'text-slate-100' : 'text-slate-900',
    border: isDark 
      ? (selectedGu === 'DONGNAM' ? 'border-amber-900/30' : 'border-slate-800/80')
      : (selectedGu === 'DONGNAM' ? 'border-[#FAF0DF]' : 'border-slate-100'),
    titleFont: 'font-sans font-black',
  };

  return (
    <div className={`min-h-screen ${activeTheme.bg} ${activeTheme.text} transition-colors duration-1000 selection:bg-amber-300 selection:text-slate-900 pb-16`}>
      
      {/* Premium Sticky Navigation Bar */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md px-6 md:px-12 py-4 shadow-sm transition-all border-b ${
        isDark ? 'bg-slate-950/90 border-slate-800/95 text-slate-100' : 'bg-white/90 border-slate-100/85 text-slate-900'
      }`}>
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black shadow-sm ${
              isDark ? 'bg-cyan-500 text-slate-950 shadow-cyan-500/10' : 'bg-slate-900 text-white'
            }`}>
              <Compass className="w-5 h-5 text-amber-400 rotate-12" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>천안식객</span>
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider leading-none ${
                  isDark ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/50' : 'bg-amber-100 text-amber-900'
                }`}>All-In-One Portal</span>
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">Cheonan Taste & Culture Hub</p>
            </div>
          </div>

          {/* Editorial Quick Nav Links */}
          <div className={`hidden md:flex items-center gap-6 text-xs font-black tracking-wide ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            <a href="#spots" className={`transition-colors cursor-pointer flex items-center gap-1.5 ${isDark ? 'hover:text-cyan-400' : 'hover:text-slate-900'}`}>
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              명소·맛집 탐색
            </a>
            <a href="#calendar" className={`transition-colors cursor-pointer flex items-center gap-1.5 ${isDark ? 'hover:text-cyan-400' : 'hover:text-slate-900'}`}>
              <CalendarCheck className="w-3.5 h-3.5 text-blue-600" />
              축제 캘린더
            </a>
            <a href="#planner" className={`transition-colors cursor-pointer flex items-center gap-1.5 ${isDark ? 'hover:text-cyan-400' : 'hover:text-slate-900'}`}>
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              추천 투어코스
            </a>
            <a href="#feedback" className={`transition-colors cursor-pointer flex items-center gap-1.5 ${isDark ? 'hover:text-cyan-400' : 'hover:text-slate-900'}`}>
              <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
              방명록 및 소통
            </a>
            <a href="#console" className={`transition-colors cursor-pointer flex items-center gap-1.5 ${isDark ? 'hover:text-cyan-400' : 'hover:text-slate-900'}`}>
              <Layers className="w-3.5 h-3.5 text-cyan-600" />
              데이터 아키텍처
            </a>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono font-bold uppercase tracking-widest hidden lg:inline">
              천안 로컬 시간: {currentTime.toLocaleDateString('ko-KR')}
            </span>

            {/* Persistent Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full cursor-pointer transition-all duration-300 border flex items-center justify-center ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 shadow-sm shadow-cyan-400/5' 
                  : 'bg-slate-100 border-slate-200 text-slate-705 hover:text-amber-850 hover:bg-slate-200'
              }`}
              title={isDark ? '라이트 모드 테마로 전환' : '다크 모드 테마로 전환'}
              aria-label="Toggle Theme Mode"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-cyan-400 hover:rotate-45 transition-transform duration-500" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 hover:-rotate-12 transition-transform duration-500" />
              )}
            </button>

            <button 
              onClick={() => {
                setSelectedGu('ALL');
                setSelectedDistrictId(null);
                setSearchQuery('');
                setFestivalSearchQuery('');
              }}
              className={`rounded-full px-4 py-2 text-[10.5px] font-black tracking-widest uppercase transition-all shadow-sm hover:shadow cursor-pointer ${
                isDark
                  ? 'bg-cyan-950 hover:bg-cyan-900 border border-cyan-800/80 text-cyan-400'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              필터 재설정
            </button>
          </div>
        </div>
      </nav>

      {/* Smart Seasonal Recommendation Banner */}
      {(() => {
        const currentMonth = currentTime.getMonth() + 1;
        const seasonalRec = getSeasonalRecommendation(currentMonth);
        const isActive = selectedFestivalId === seasonalRec.festivalId;
        return (
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-6">
            <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 ${seasonalRec.accentColor} shadow-sm`}>
              <div className="flex items-start gap-3.5">
                <span className="text-2xl sm:text-3xl p-1 bg-white dark:bg-slate-900 rounded-xl shadow-xs self-start sm:self-center shrink-0">
                  {seasonalRec.icon}
                </span>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[9.5px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${seasonalRec.badgeColor}`}>
                      {currentMonth}월 시즌 추천 명소 및 축제
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-550 font-mono">Dynamic Recommendation Engine</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-950 dark:text-white leading-tight">
                    {seasonalRec.title}
                  </h4>
                  <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-semibold max-w-4xl">
                    {seasonalRec.reason}
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => {
                    if (isActive) {
                      setSelectedFestivalId(null);
                    } else {
                      setSelectedFestivalId(seasonalRec.festivalId);
                      document.getElementById('spots')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    isActive
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                      <span>추천 필터 적용됨 (해제하기)</span>
                    </>
                  ) : (
                    <>
                      <Compass className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                      <span>추천 명소 및 파트너 보기</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Editorial Hero Layout Block */}
      <header className="max-w-[1600px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-slate-100 pb-16">
          
          {/* Hero Left: Title & Descriptions */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full text-xs font-bold text-amber-900 border border-amber-200/50">
              <Sparkle className="w-3.5 h-3.5 text-amber-700 animate-spin" />
              <span className="tracking-widest uppercase text-[10px]">Cheonan Beautiful Curated Spatial Index</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-slate-950 font-sans">
              천안의 깊이를 발견하다. <br />
              <span className="text-slate-400 font-serif font-light text-2xl md:text-3.5xl tracking-normal block mt-2">
                역사적인 고요함부터 미식의 발원지까지의 전수조사 포털
              </span>
            </h1>

            <p className="text-sm md:text-base leading-relaxed font-medium text-slate-500 max-w-3xl">
              어우내 장터의 숭고한 횃불 정신(독립기념관·기념관)부터 백석동·신불당동의 트렌디하고 세련된 미식 스팟, 
              은빛 수변 정원(성성호수공원·천호지)과 사계절 문화 예술의 향연(아라리오 조각광장)을 하나의 공간에서 만나보세요. 
              시민들과 여행자를 매료시키는 엄선된 공간 정보를 정밀 인덱스로 제공합니다.
            </p>

            {/* Quick stats tags overview */}
            <div className="flex flex-wrap gap-5 pt-2 text-xs font-bold text-slate-400">
              <span className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-150">
                <Compass className="w-4 h-4 text-amber-650" /> 총 {totalAestheticSpots}개 미학 명관
              </span>
              <span className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-150">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> 로컬 대표 미식 벨트 수립
              </span>
              <span className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-150">
                <Calendar className="w-4 h-4 text-blue-500" /> 24/365 대축제 라인업 연계
              </span>
            </div>
          </div>

          {/* Hero Right: Interactive Quick Guide Card / Location Scope */}
          <div className="lg:col-span-4 bg-slate-50/50 rounded-2xl p-6 border border-slate-200/60 shadow-sm space-y-4">
            <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest block">Explore Destination Selection</span>
            <h3 className="myeongjo-title text-lg font-black text-slate-900">어디로 가고 싶으신가요?</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              천안 동남구의 단아하고 아날로그한 역사 유산 길, 서북구의 현대적이고 감각적인 최신식 핫플레이스로 구분하여 정밀 탐색할 수 있습니다.
            </p>
            
            {/* Nav Tabs Selector */}
            <div className="grid grid-cols-1 gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedGu('ALL');
                  setSelectedDistrictId(null);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  selectedGu === 'ALL'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-350'
                }`}
              >
                <span>🌐 천안 전 지역 통합 큐레이션</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-80" />
              </button>
              <button
                onClick={() => {
                  setSelectedGu('DONGNAM');
                  setSelectedDistrictId(null);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  selectedGu === 'DONGNAM'
                    ? 'bg-amber-900 text-stone-100 shadow-md'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-350'
                }`}
              >
                <span>🪵 동남구 단아한 앤틱 레거시 (병천순대)</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-80" />
              </button>
              <button
                onClick={() => {
                  setSelectedGu('SEOBUK');
                  setSelectedDistrictId(null);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  selectedGu === 'SEOBUK'
                    ? 'bg-slate-800 text-cyan-100 shadow-md border border-cyan-500/25'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-350'
                }`}
              >
                <span>⚡ 서북구 세련된 얼반 센터 (신불당동)</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-80" />
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Core Bento Stats Infographics Area */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        {/* Stat 1 */}
        <div className="bg-white border border-slate-200/55 p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow transition-all duration-300">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">총 엄선 미학 명소</span>
            <span className="text-3xl font-black tracking-tighter text-slate-900">{totalAestheticSpots} 스팟 개방</span>
          </div>
          <div className="p-3.5 bg-slate-50 text-slate-600 rounded-xl">
            <Compass className="w-5 h-5 text-amber-700" />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white border border-slate-200/55 p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow transition-all duration-300">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#8C7A5C] block mb-1">최고 평점 미학처</span>
            <span className="text-sm font-black block truncate max-w-[180px] text-slate-800">
              {topRatedSpot ? topRatedSpot.spotName : '뚜쥬루 빵돌가마'}
            </span>
            <span className="text-xs font-black text-amber-800">★ {topRatedSpot ? topRatedSpot.score.toFixed(2) : '4.80'}점</span>
          </div>
          <div className="p-3.5 bg-amber-50 text-amber-700 rounded-xl">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white border border-slate-200/55 p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow transition-all duration-300">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">누적 종합 참전 리뷰</span>
            <span className="text-3xl font-black tracking-tighter text-slate-900">{totalReviewsCount.toLocaleString()}개 누적</span>
          </div>
          <div className="p-3.5 bg-slate-50 text-slate-600 rounded-xl">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* Main Exploration Screen Layout */}
      <main id="spots" className="max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        
        {/* LEFT PANEL: MAP & FILTERS (col-span-1) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Interactive Geo-Map */}
          {(() => {
            const routeSpots = (selectedPresetIndex !== null && selectedPresetIndex >= 0)
              ? PRESET_COURSES[selectedPresetIndex].steps.map((step, idx) => {
                  const spot = spots.find(s => s.id === step.spotId);
                  return {
                    stepIndex: idx + 1,
                    spotName: step.spotName,
                    latitude: spot ? spot.latitude : 0,
                    longitude: spot ? spot.longitude : 0,
                    id: step.spotId,
                    guide: step.guide
                  };
                }).filter(s => s.latitude > 0)
              : [];

            return (
              <CheonanMap
                districts={districts}
                selectedDistrictId={selectedDistrictId || null}
                onSelectDistrict={(id) => setSelectedDistrictId(id)}
                activeGu={selectedGu}
                spots={spots}
                routeSpots={routeSpots}
                isDark={isDark}
              />
            );
          })()}

          {/* Core Search & Filters Controls */}
          <div className={`transition-all duration-1000 rounded-3xl p-6 border shadow-xl space-y-6 ${activeTheme.cardBg} ${activeTheme.border}`}>
            <div className={`flex justify-between items-center pb-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <span className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-800'}`}>검색 및 세부 속성 필터</span>
              {(searchQuery || selectedCategory !== 'ALL' || selectedDistrictId) && (
                <button
                  onClick={handleResetFilters}
                  className={`text-[10px] font-black hover:underline flex items-center gap-1 cursor-pointer ${
                    isDark ? 'text-cyan-400' : 'text-amber-700'
                  }`}
                >
                  <RotateCcw className="w-2.5 h-2.5" /> 필터 초기화
                </button>
              )}
            </div>

            {/* Keyword Input */}
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-cyan-400/80' : 'text-slate-500'}`}>명소·태그 키워드 검색</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="예: #지브리감성, #벚꽃길, 뚜쥬루, 불당동 등.."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl focus:outline-none focus:ring-2 font-medium transition-all duration-1000 ${
                    isDark 
                      ? 'bg-slate-950 border-slate-800 text-white focus:ring-cyan-500/50' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-slate-300'
                  }`}
                />
              </div>
            </div>

            {/* Category Select Buttons */}
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${isDark ? 'text-cyan-400/80' : 'text-slate-500'}`}>카테고리 분류</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: 'ALL', label: '전체' },
                  { key: 'Heritage', label: '역사·문화 유산 🏛️' },
                  { key: 'Nature', label: '자연·공원 🌲' },
                  { key: 'Taste', label: '식도락·F&B ☕' }
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat.key
                        ? (isDark ? 'bg-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-400/10' : 'bg-slate-900 text-white')
                        : (isDark 
                            ? 'bg-[#1b273b] hover:bg-[#23334c] text-slate-300 border border-slate-800' 
                            : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-400'
                          )
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification alert info */}
            {selectedDistrictId && (
              <div className={`p-3.5 border rounded-xl text-xs font-semibold leading-relaxed transition-all duration-1000 ${
                isDark 
                  ? 'bg-cyan-950/20 border-cyan-800/40 text-cyan-300' 
                  : 'bg-amber-50 border-amber-100 text-[#8C7A5C]'
              }`}>
                📍 <strong>{districts.find(d => d.id === selectedDistrictId)?.subName}</strong> 구역의 명소가 매핑되었습니다. 지도의 흰 여백이나 '초기화' 버튼을 눌러 전체 영역으로 복귀해보세요.
              </div>
            )}
          </div>

          {/* Cheonan Taste Festival & Collaboration Calendar */}
          <div id="calendar" className={`scroll-mt-24 transition-all duration-1000 rounded-3xl p-6 border shadow-xl space-y-6 ${activeTheme.cardBg} ${activeTheme.border}`}>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-amber-800 font-extrabold text-[10px] tracking-widest uppercase dark:text-cyan-400">
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Cheonan Taste Festival Calendar</span>
              </div>
              <h4 className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>천안시맛객 캘린더</h4>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                천안시의 날짜별 주요 행사 및 상생 협업 일정을 확인할 수 있는 달력입니다. **원하는 축제를 클릭**하면 연계된 맛집들이 우측 탐색처 목록에 자동 정렬 및 필터링됩니다!
              </p>
            </div>

            {/* Search Festivals Input Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className={`text-[10px] font-black uppercase tracking-widest block ${isDark ? 'text-cyan-400/80' : 'text-slate-500'}`}>
                  🔍 축제 및 행사 통합 검색
                </label>
                {festivalSearchQuery && (
                  <button
                    onClick={() => setFestivalSearchQuery('')}
                    className={`text-[9px] font-black hover:underline cursor-pointer ${isDark ? 'text-cyan-400' : 'text-amber-800'}`}
                  >
                    검색 초기화
                  </button>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="예: '봉화제', '빵빵데이', '가을' 또는 '체험' 등으로 검색..."
                  value={festivalSearchQuery}
                  onChange={(e) => setFestivalSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl focus:outline-none focus:ring-2 font-medium transition-all ${
                    isDark 
                      ? 'bg-slate-950 border-slate-800 text-white focus:ring-cyan-500/50 font-sans' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-slate-300 font-sans'
                  }`}
                />
              </div>
            </div>

            {/* Season Filtering Tabs */}
            <div className="flex flex-wrap gap-1 border-b pb-3 dark:border-slate-800 border-slate-150">
              {[
                { key: 'ALL', label: '전체 시즌' },
                { key: 'spring', label: '봄 (2~4월) 🌸' },
                { key: 'summer', label: '초여름 (5~6월) 🥐' },
                { key: 'autumn', label: '가을 (9~10월) 🍁' },
                { key: 'always', label: '상시 예술 🎨' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setFestSeason(tab.key as any);
                    // Also filter reset festival if its season doesn't match
                    if (tab.key !== 'ALL') {
                      const active = FESTIVAL_EVENTS.find(f => f.id === selectedFestivalId);
                      if (active && active.season !== tab.key) {
                        setSelectedFestivalId(null);
                      }
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    festSeason === tab.key
                      ? (isDark ? 'bg-cyan-400 text-slate-950 font-black' : 'bg-amber-900 text-white')
                      : (isDark 
                          ? 'bg-slate-950 hover:bg-slate-905 text-slate-400 border border-slate-800' 
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                        )
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Interactive Timeline List */}
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
              {(() => {
                const filteredFestivals = FESTIVAL_EVENTS.filter((event) => {
                  const matchesSeasonTab = festSeason === 'ALL' || event.season === festSeason;
                  const query = festivalSearchQuery.trim().toLowerCase();
                  if (!query) return matchesSeasonTab;

                  const matchesQuery =
                    event.title.toLowerCase().includes(query) ||
                    event.description.toLowerCase().includes(query) ||
                    event.features.toLowerCase().includes(query) ||
                    event.seasonLabel.toLowerCase().includes(query) ||
                    event.period.toLowerCase().includes(query) ||
                    event.location.toLowerCase().includes(query) ||
                    event.partners.some(p => p.toLowerCase().includes(query)) ||
                    (query === '봄' && event.season === 'spring') ||
                    (query === '여름' && event.season === 'summer') ||
                    (query === '초여름' && event.season === 'summer') ||
                    (query === '가을' && event.season === 'autumn') ||
                    (query === '상시' && event.season === 'always');

                  return matchesSeasonTab && matchesQuery;
                });

                if (filteredFestivals.length === 0) {
                  return (
                    <div className="py-12 text-center space-y-2">
                      <p className={`text-xs font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        🔍 일치하는 축제 및 행사 일정이 없습니다.
                      </p>
                      <button
                        onClick={() => {
                          setFestivalSearchQuery('');
                          setFestSeason('ALL');
                        }}
                        className={`text-[10px] font-bold hover:underline cursor-pointer ${isDark ? 'text-cyan-400' : 'text-amber-800'}`}
                      >
                        필터 전체 초기화
                      </button>
                    </div>
                  );
                }

                return filteredFestivals.map((event) => {
                  const isSelected = selectedFestivalId === event.id;
                  return (
                    <motion.div
                      key={event.id}
                      layoutId={`fest-${event.id}`}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedFestivalId(null);
                        } else {
                          setSelectedFestivalId(event.id);
                        }
                      }}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? (isDark 
                              ? 'bg-cyan-950/40 border-cyan-400/80 ring-1 ring-cyan-400/30' 
                              : 'bg-amber-50/75 border-amber-900 ring-1 ring-amber-900/10'
                            )
                          : (isDark 
                              ? 'bg-slate-950 hover:bg-[#131f35]/50 border-slate-800' 
                              : 'bg-slate-50/50 hover:bg-slate-100/50 border-slate-200'
                            )
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                          isSelected 
                            ? (isDark ? 'bg-cyan-400 text-slate-950' : 'bg-amber-900 text-white')
                            : (isDark ? 'bg-slate-850 text-slate-350' : 'bg-slate-200 text-slate-700')
                        }`}>
                          {event.period}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> {event.date}
                        </span>
                      </div>

                      <h5 className={`text-sm font-extrabold mt-2 leading-snug ${
                        isSelected
                          ? (isDark ? 'text-cyan-400' : 'text-amber-950')
                          : (isDark ? 'text-white' : 'text-slate-850')
                      }`}>
                        {event.title}
                      </h5>

                      <p className={`text-[11px] leading-relaxed mt-1.5 font-medium ${isDark ? 'text-slate-350' : 'text-slate-600'}`}>
                        {event.description}
                      </p>

                      {/* Featured Collaborative info */}
                      <div className={`mt-2 p-2.5 rounded-xl text-[10px] leading-relaxed font-semibold ${
                        isDark ? 'bg-[#0f192b]/60 text-slate-300' : 'bg-white/80 border border-slate-100 text-slate-700'
                      }`}>
                        💡 <strong>축제특징 / 동업 상생:</strong> {event.features}
                      </div>

                      {/* Partner Eateries */}
                      <div className="mt-3 space-y-1.5">
                        <span className={`text-[9px] font-black uppercase tracking-wider block ${
                          isDark ? 'text-cyan-400/85' : 'text-slate-400'
                        }`}>
                          📍 연계 로컬 미식 및 청년 창업 벨트:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {event.partners.map((partner, pidx) => (
                            <span
                              key={pidx}
                              className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md ${
                                isSelected
                                  ? (isDark ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30' : 'bg-amber-900/10 text-amber-950 border border-amber-900/20')
                                  : (isDark ? 'bg-slate-900 text-slate-400 border border-slate-800' : 'bg-white text-slate-600 border border-slate-200')
                              }`}
                            >
                              {partner}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Indicator */}
                      <div className="mt-3 pt-2 border-t border-dashed dark:border-slate-800 border-slate-200 flex justify-between items-center">
                        <span className={`text-[9.5px] font-extrabold flex items-center gap-1 ${
                          isSelected 
                            ? (isDark ? 'text-cyan-400' : 'text-amber-900') 
                            : 'text-slate-400 group-hover:text-slate-300'
                        }`}>
                          <MapPin className="w-3 h-3" /> {event.location}
                        </span>
                        <span className={`text-[9.5px] font-black hover:underline cursor-pointer ${
                          isSelected 
                            ? (isDark ? 'text-cyan-400 font-extrabold' : 'text-amber-900') 
                            : 'text-slate-400'
                        }`}>
                          {isSelected ? '연계 맛집 매핑 취소 ↩' : '연계 맛집 매핑하기 📍'}
                        </span>
                      </div>

                    </motion.div>
                  );
                });
              })()}
            </div>
          </div>

          {/* 천안시 코스 도우미 (Dynamic Detailed Course Assistant) */}
          <div id="planner" className={`scroll-mt-24 transition-all duration-1000 rounded-3xl p-6 border shadow-xl space-y-6 ${activeTheme.cardBg} ${activeTheme.border}`}>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-amber-800 font-extrabold text-[10px] tracking-widest uppercase dark:text-cyan-400">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Cheonan Course Helper Planner</span>
              </div>
              <h4 className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>🧭 천안시 코스 도우미</h4>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                천안의 명소와 축제를 분 단위의 섬세한 일정표로 기획해 드립니다. 
                아래 <strong>시간대 버튼들을 눌러 출발 시각을 변경</strong>하시면 전체 일정이 실시간으로 최적 지점 간 연산되어 재조정됩니다!
              </p>
            </div>

            {/* 출발 시간 선택 컨트롤러 */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950 border dark:border-slate-800/80 border-slate-200/50">
              <label className={`text-[10px] font-black uppercase tracking-widest block ${isDark ? 'text-cyan-400/80' : 'text-slate-500'}`}>
                🏃 원하는 출발 시각 설정 (전체 일정 자동 동기화)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { time: "09:00", label: "09:00 (아침 출발) ☀️" },
                  { time: "10:30", label: "10:30 (오전 한적한 소풍) 🌿" },
                  { time: "12:00", label: "12:00 (정오 출발) 🍔" },
                  { time: "13:30", label: "13:30 (오후 여유로운 투어) ☕" },
                  { time: "15:00", label: "15:00 (오후 늦은 야경 코스) 🌙" }
                ].map((item) => (
                  <button
                    key={item.time}
                    onClick={() => setCourseStartHour(item.time)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all duration-300 cursor-pointer ${
                      courseStartHour === item.time
                        ? (isDark ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20' : 'bg-slate-900 text-white')
                        : (isDark ? 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-450')
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 코스 모드 선택 탭 */}
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest block ${isDark ? 'text-cyan-400/80' : 'text-slate-500'}`}>
                🗺️ 코스 모드 선택 또는 나만의 맞춤 설계 구성
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {PRESET_COURSES.map((course, idx) => (
                  <button
                    key={course.id}
                    onClick={() => {
                      setSelectedPresetIndex(idx);
                      // Set corresponding default Gu filter automatically to sync with map visualizer!
                      if (course.gu !== 'ALL') {
                        setSelectedGu(course.gu);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                      selectedPresetIndex === idx
                        ? (isDark ? 'bg-cyan-950/20 border-cyan-400 ring-1 ring-cyan-400/20' : 'bg-amber-50/50 border-amber-800/80 ring-1 ring-amber-800/10')
                        : (isDark ? 'bg-slate-950 border-slate-800/80 hover:border-slate-700' : 'bg-slate-50/50 border-slate-200 hover:border-slate-300')
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[8.5px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                        selectedPresetIndex === idx
                          ? (isDark ? 'bg-cyan-400 text-slate-950' : 'bg-amber-900 text-white')
                          : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-700')
                      }`}>
                        PRESET {idx + 1}
                      </span>
                      <span className="text-[9.5px] font-semibold text-slate-450">구역: {course.gu === 'ALL' ? '천안통합' : course.gu === 'DONGNAM' ? '동남구' : '서북구'}</span>
                    </div>
                    <h5 className={`text-xs font-black leading-tight mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{course.title}</h5>
                    <p className="text-[10px] text-slate-400 leading-normal line-clamp-2">{course.vibe}</p>
                  </button>
                ))}
                
                {/* AI 커스텀 탭 카드 */}
                <button
                  onClick={() => setSelectedPresetIndex(-1)}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-center cursor-pointer ${
                    selectedPresetIndex === -1
                      ? (isDark ? 'bg-cyan-950/25 border-cyan-400 ring-1 ring-cyan-400/20' : 'bg-amber-50/50 border-amber-800/80 ring-1 ring-amber-800/10')
                      : (isDark ? 'bg-slate-950 border-slate-800/80 hover:border-slate-700' : 'bg-slate-50/50 border-slate-200 hover:border-slate-300')
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-amber-800 dark:text-cyan-300 font-extrabold text-[9px] uppercase tracking-widest mb-1">
                    <Sparkle className="w-3 h-3 animate-spin text-amber-700 dark:text-cyan-400" />
                    <span>AI Custom Curation Mode</span>
                  </div>
                  <h5 className={`text-xs font-black leading-tight mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>🎨 나만의 AI 맞춤 시간표 제작</h5>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    원하는 동선 테마나 성향을 직접 적으시면 Gemini가 이보다 더 세세한 시간대별 일정을 실시간 처방합니다.
                  </p>
                </button>
              </div>
            </div>

            {/* 세부 타임라인 타임 테이블 렌더러 */}
            <div className="pt-2">
              <AnimatePresence mode="wait">
                {selectedPresetIndex !== null && selectedPresetIndex >= 0 ? (
                  <motion.div
                    key={`preset-course-${selectedPresetIndex}-${courseStartHour}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* 코스 헤더 */}
                    <div className="p-4 rounded-2xl border bg-slate-50/20 border-dashed dark:border-slate-800 border-slate-200/65 space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-md ${
                          isDark ? 'bg-cyan-400/15 text-cyan-300' : 'bg-amber-100 text-amber-950'
                        }`}>
                          {PRESET_COURSES[selectedPresetIndex].gu === 'ALL' ? '천안시 맛객 종합 투어' : `${PRESET_COURSES[selectedPresetIndex].gu === 'DONGNAM' ? '동남구 앤틱 헤리티지' : '서북구 얼반 센트럴'} 코스`}
                        </span>
                        <div className="text-[10px] text-slate-450 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> 첫 출발 설정: {courseStartHour}
                        </div>
                      </div>
                      <p className={`text-[11px] leading-relaxed font-semibold ${isDark ? 'text-slate-350' : 'text-slate-700'}`}>
                        💡 <strong>코스 감성 컨셉:</strong> {PRESET_COURSES[selectedPresetIndex].vibe}
                      </p>
                    </div>

                    {/* 세세한 타임라인 목록 */}
                    <div className="relative pl-6 border-l border-slate-200/50 dark:border-slate-800 ml-3.5 space-y-6">
                      {PRESET_COURSES[selectedPresetIndex].steps.map((step, sIdx) => {
                        const times = getStepTimes(PRESET_COURSES[selectedPresetIndex!], courseStartHour, step.baseStartOffset, step.duration);
                        return (
                          <motion.div
                            key={sIdx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: sIdx * 0.08 }}
                            className="relative group animate-fade-in"
                          >
                            {/* 타임라인 노드 불릿 */}
                            <span className={`absolute -left-9.5 top-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ring-4 border transition-all ${
                              isDark 
                                ? 'bg-slate-950 border-slate-800 ring-slate-900 group-hover:border-cyan-400 text-cyan-400' 
                                : 'bg-white border-slate-300 ring-slate-100 group-hover:border-amber-800 text-amber-900'
                            }`}>
                              {sIdx + 1}
                            </span>

                            <div className="space-y-1 text-left">
                              {/* 시간대 및 연계 버튼 */}
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-xs font-black text-slate-800 dark:text-cyan-400 tracking-tight flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" /> {times.start} ~ {times.end}
                                  <span className="text-[10px] font-medium text-slate-400">({step.duration}분간 체류)</span>
                                </span>
                                
                                <button
                                  onClick={() => {
                                    // Search this spot in the list
                                    setSearchQuery(step.spotName.replace(/(점심 식사:|식사:|간식:)/g, '').trim());
                                    // Also clear gu filters if needed to make spot visualizer discover it
                                    if (PRESET_COURSES[selectedPresetIndex!].gu !== 'ALL') {
                                      setSelectedGu(PRESET_COURSES[selectedPresetIndex!].gu);
                                    } else {
                                      setSelectedGu('ALL');
                                    }
                                  }}
                                  className={`text-[9px] font-black flex items-center gap-1 px-2 py-0.5 rounded border cursor-pointer hover:scale-105 transition-all ${
                                    isDark 
                                      ? 'bg-slate-950 border-slate-800 text-slate-400 hover:border-cyan-400 hover:text-cyan-400' 
                                      : 'bg-white border-slate-200 text-slate-500 hover:border-amber-800 hover:text-amber-900'
                                  }`}
                                >
                                  <MapPin className="w-2.5 h-2.5 text-red-500" /> 상세 정보 발견 🧭
                                </button>
                              </div>

                              {/* 장소 타이틀 */}
                              <h5 className={`text-sm font-black tracking-tight leading-snug ${isDark ? 'text-white' : 'text-slate-850'}`}>
                                {step.spotName}
                              </h5>

                              {/* 정교한 활동지침 */}
                              <p className={`text-[11px] leading-relaxed font-medium pb-1 ${isDark ? 'text-slate-350' : 'text-slate-600'}`}>
                                {step.guide}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : (
                  // AI 커스텀 모드
                  <motion.div
                    key="custom-ai"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <form onSubmit={handleGenerateCuration} className="space-y-3 bg-slate-50/50 dark:bg-slate-950 border dark:border-slate-850 p-4 rounded-2xl text-left">
                      <div className="space-y-1">
                        <label className={`text-[10px] font-black uppercase tracking-widest block ${isDark ? 'text-cyan-400/80' : 'text-slate-500'}`}>
                          ✍️ 내가 꿈꾸는 코스의 희망 조건 (예: 인원구성, 날씨, 취향 등)
                        </label>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          원하는 테마를 입력하면 "천안시 코스 도우미"가 시간대별 출발지 및 미학 지수를 계산한 최상의 순례길을 세세하게 기획해 줍니다.
                        </p>
                      </div>

                      <div className="relative">
                        <textarea
                          rows={3}
                          value={userPrompt}
                          onChange={(e) => setUserPrompt(e.target.value)}
                          placeholder="예: 부모님을 모시고 걷기 무난하면서 든든한 물갈비/순대국밥이 포함된 여정, 비 내리는 초여름 수변 데크길과 카페 투어를 짜 줘"
                          className={`w-full p-3 text-xs rounded-xl focus:outline-none focus:ring-2 font-medium transition-all ${
                            isDark 
                              ? 'bg-slate-900 border-slate-800 text-white focus:ring-cyan-400/30 font-sans' 
                              : 'bg-white border-slate-200 text-slate-800 focus:ring-slate-300 font-sans'
                          }`}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={curationLoading || !userPrompt.trim()}
                        className={`w-full py-2.5 text-xs font-black rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-all ${
                          curationLoading
                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                            : (isDark 
                                ? 'bg-cyan-400 hover:bg-cyan-500 text-slate-950 shadow-md shadow-cyan-400/10' 
                                : 'bg-slate-900 hover:bg-slate-950 text-white'
                              )
                        }`}
                      >
                        {curationLoading ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            지능형 실시간 일정 조율 중...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            하루 감성 가이드 시간표 추출 시작하기 ✨
                          </>
                        )}
                      </button>
                    </form>

                    {/* AI Curation Results */}
                    {aiCuration && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-2xl border text-xs text-left leading-relaxed space-y-3 font-medium ${
                          isDark 
                            ? 'bg-slate-900 border-slate-800 text-slate-300' 
                            : 'bg-slate-50/50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <CurationRenderer text={aiCuration} />
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: CURATED SPOTS LIST (col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`flex justify-between items-center pb-2 border-b transition-colors duration-1000 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <h3 className={`text-lg font-black tracking-tight transition-colors duration-1000 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {selectedDistrictId 
                ? `${districts.find(d => d.id === selectedDistrictId)?.subName} 큐레이션`
                : selectedGu === 'ALL' ? '천안시맛객' : `${selectedGu === 'DONGNAM' ? '동남구 앤틱' : '서북구 얼반'} 큐레이션`
              }
              <span className="text-xs text-slate-400 ml-2 font-light">({filteredSpots.length}곳 발견)</span>
            </h3>
            
            <div className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
              ESTIMATED BY BAYESIAN FORMULA
            </div>
          </div>

          <div className="space-y-4">
            {selectedNearbySpotId !== null && (() => {
              const originSpot = spotsWithScores.find(s => s.id === selectedNearbySpotId);
              return (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs leading-relaxed ${
                    isDark
                      ? 'bg-[#121f33] border-slate-800 text-slate-300'
                      : 'bg-amber-50/50 border-amber-200/55 p-4.5 rounded-xl text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base animate-pulse">📍</span>
                    <div>
                      <span className="font-extrabold text-slate-950 dark:text-white">[{originSpot?.spotName}]</span> 기준
                      <span className="font-bold text-amber-900 dark:text-cyan-400 ml-1">반경 2km 이내</span>의 추천 명소 필터링 중
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedNearbySpotId(null)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all self-end sm:self-center cursor-pointer border ${
                      isDark
                        ? 'bg-cyan-950/40 border-cyan-800 text-cyan-300 hover:bg-cyan-900/50'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    필터 해제 ✕
                  </button>
                </motion.div>
              );
            })()}

            {/* Highly Polished Editorial Category Tabs */}
            <div className={`flex flex-wrap gap-1.5 pb-3 border-b ${isDark ? 'border-slate-800/80' : 'border-slate-100'}`}>
              {[
                { key: 'ALL', label: '전체보기', icon: '🌐' },
                { key: 'Taste', label: '식도락·F&B', icon: '☕' },
                { key: 'Nature', label: '자연·공원', icon: '🌲' },
                { key: 'Heritage', label: '역사·유산', icon: '🏛️' }
              ].map((cat) => {
                const active = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-3 py-1.5 rounded-full text-[10.5px] font-black transition-all flex items-center gap-1.5 border shadow-sm cursor-pointer ${
                      active
                        ? (isDark 
                            ? 'bg-cyan-400 border-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-400/20' 
                            : 'bg-slate-900 border-slate-900 text-white font-black'
                          )
                        : (isDark 
                            ? 'bg-[#121f33] border-slate-800 text-slate-450 hover:text-slate-200' 
                            : 'bg-white border-slate-200 text-slate-505 hover:border-slate-350 hover:bg-slate-50 text-slate-600'
                          )
                    }`}
                  >
                    <span className="text-xs">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="popLayout">
              {filteredSpots.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredSpots.map((spot) => {
                    const district = districts.find(d => d.id === spot.districtId);
                    const isExpanded = expandedSpotId === spot.id;

                    return (
                      <motion.div
                        layout
                        key={spot.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className={`group rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${activeTheme.cardBg} ${activeTheme.border} ${selectedGu === 'SEOBUK' ? 'shadow-lg shadow-cyan-950/5' : 'shadow-sm hover:shadow-md hover:border-slate-200/80 bg-white'}`}
                      >
                      {/* Compact content layout without images */}
                      <div className="p-6 space-y-4">
                        
                        {/* Tags & Zone Indicator + Rating Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-900/60">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                              district?.gu === 'DONGNAM' ? 'bg-[#FAF5EE] text-[#8C7A5C]' : 'bg-[#18314F] text-[#00E8C6]'
                            }`}>
                              📍 {district?.gu === 'DONGNAM' ? '동남구' : '서북구'} {district?.subName}
                            </span>
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                              selectedGu === 'SEOBUK' ? 'bg-[#1E2E44] text-slate-300' : 'bg-slate-50 text-slate-550 border border-slate-100'
                            }`}>
                              {getCategoryLabel(spot.category)}
                            </span>

                            {/* Distance Indicator badge relative to current center */}
                            {selectedNearbySpotId !== null && selectedNearbySpotId !== spot.id && (() => {
                              const originSpot = spotsWithScores.find(s => s.id === selectedNearbySpotId);
                              if (originSpot) {
                                const dist = getDistance(originSpot.latitude, originSpot.longitude, spot.latitude, spot.longitude);
                                const distStr = dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(2)}km`;
                                return (
                                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black animate-pulse flex items-center gap-1 ${
                                    isDark ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-800/40' : 'bg-amber-100 text-amber-950 border border-amber-200'
                                  }`}>
                                    ⚡ {distStr} 인근
                                  </span>
                                );
                              }
                              return null;
                            })()}

                            {/* Origin reference badge */}
                            {selectedNearbySpotId === spot.id && (
                              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black flex items-center gap-1 ${
                                isDark ? 'bg-cyan-400 text-slate-950 font-black' : 'bg-slate-900 text-amber-400 font-extrabold border border-slate-950'
                              }`}>
                                🎯 탐색 기준점
                              </span>
                            )}
                          </div>

                          {/* Aesthetic Gauge Score with simple layout */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Aesthetic Index</span>
                            <div className="flex items-center text-amber-500 font-extrabold bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                              <Star className="w-3.5 h-3.5 fill-amber-550 text-amber-550 mr-1" />
                              <span className={`text-xs font-black font-mono tracking-tight ${selectedGu === 'SEOBUK' ? 'text-cyan-400' : 'text-amber-800'}`}>
                                {spot.score.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Spot Title & Main Curator Spotlight */}
                        <div className="space-y-3">
                          <h4 className={`text-base sm:text-lg font-extrabold tracking-tight ${
                            selectedGu === 'SEOBUK' ? 'text-white' : 'text-slate-950'
                          }`}>
                            {spot.spotName}
                          </h4>

                          {/* Refined "추천 이유" Boxed Feature */}
                          <div className={`p-4 rounded-xl border transition-colors ${
                            selectedGu === 'SEOBUK' 
                              ? 'bg-slate-950/40 border-slate-800/80 text-slate-350' 
                              : 'bg-slate-50/50 border-slate-200/40 text-slate-650'
                          }`}>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                                selectedGu === 'SEOBUK' ? 'text-cyan-400' : 'text-amber-900/80'
                              }`}>
                                ✨ 추천 이유
                              </span>
                            </div>
                            <p className="text-xs font-medium leading-relaxed">
                              {spot.curatorDescription}
                            </p>
                          </div>
                        </div>

                        {/* Interactive Area: Hot tags & Reviews control */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                          {/* Hot tags line */}
                          <div className="flex flex-wrap gap-1">
                            {spot.mzTags.map(tag => (
                              <span key={tag} className={`text-[9.5px] rounded-lg px-2 py-0.5 transition-colors font-bold ${
                                selectedGu === 'SEOBUK' 
                                  ? 'text-cyan-300 bg-cyan-950/10 border border-cyan-900/30' 
                                  : 'text-amber-900 bg-amber-50/30 border border-amber-100/50'
                              }`}>
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Interaction control button group */}
                          <div className="flex items-center gap-2.5 self-start sm:self-center">
                            {/* Find Nearby Button */}
                            <button
                              onClick={() => {
                                if (selectedNearbySpotId === spot.id) {
                                  setSelectedNearbySpotId(null);
                                } else {
                                  setSelectedNearbySpotId(spot.id);
                                  document.getElementById('spots')?.scrollIntoView({ behavior: 'smooth' });
                                }
                              }}
                              className={`text-[10px] font-black px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border ${
                                selectedNearbySpotId === spot.id
                                  ? (isDark
                                      ? 'bg-cyan-400 text-slate-950 border-cyan-400 font-extrabold shadow-md shadow-cyan-400/20'
                                      : 'bg-slate-900 text-white border-slate-900 font-extrabold'
                                    )
                                  : (isDark
                                      ? 'bg-slate-900 border-slate-800 text-cyan-400 hover:text-cyan-300 hover:border-slate-700'
                                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-[#FAF5EE] hover:border-amber-205 hover:text-amber-950'
                                    )
                              }`}
                            >
                              <Compass className={`w-3.5 h-3.5 ${selectedNearbySpotId === spot.id ? 'animate-spin' : ''}`} />
                              <span>{selectedNearbySpotId === spot.id ? '전체 해제' : '주변 2km 찾기'}</span>
                            </button>

                            {/* Visitor Review section expander */}
                            <button
                              onClick={() => setExpandedSpotId(isExpanded ? null : spot.id)}
                              className={`text-[10.5px] font-black hover:underline flex items-center gap-1 cursor-pointer transition-colors ${
                                selectedGu === 'SEOBUK' ? 'text-cyan-400 hover:text-cyan-300' : 'text-slate-700 hover:text-slate-900'
                              }`}
                            >
                              {isExpanded ? (
                                <>
                                  <span>후기 접기</span>
                                  <ChevronUp className="w-3.5 h-3.5" />
                                </>
                              ) : (
                                <>
                                  <span>후기 ({((spot.customReviews?.length || 0) + (spot.reviewsCount > 5 ? 3 : 0))}개)</span>
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                      </div>

                      {/* Expanded Review Drawer */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`border-t overflow-hidden transition-all duration-1000 ${isDark ? 'bg-[#090f1d]/50 border-slate-850' : 'bg-slate-50/50 border-slate-100'}`}
                          >
                            <div className="p-6 sm:p-8 space-y-6">
                              <SpotSurroundingView
                                spotName={spot.spotName}
                                latitude={spot.latitude}
                                longitude={spot.longitude}
                                isDark={isDark}
                              />
                              <div className={`h-[1px] w-full ${isDark ? 'bg-slate-800/80': 'bg-slate-200/50'}`}></div>
                              <ReviewSection
                                spot={spot}
                                onReviewAdded={handleReviewAdded}
                                isDark={isDark}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </motion.div>
                  );
                })}
                </div>
              ) : (
                <div className={`p-12 text-center border rounded-3xl space-y-4 transition-all duration-1000 ${
                  isDark ? 'bg-[#121F33] border-slate-800' : 'bg-white border-slate-200/50 rounded-3xl'
                }`}>
                  <div className={`font-black ${isDark ? 'text-cyan-400' : 'text-slate-500'}`}>해당하는 미학 탐색처가 없습니다 🗺️</div>
                  <p className={`text-xs leading-relaxed max-w-md mx-auto ${isDark ? 'text-slate-350' : 'text-slate-400'}`}>
                    검색어나 카테고리 필터를 변경하거나, 천안 전역 지도를 클릭하여 다시 탐색해 보세요.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className={`font-bold text-xs px-4 py-2 rounded-full cursor-pointer transition-all ${
                      isDark ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300' : 'bg-slate-900 text-white'
                    }`}
                  >
                    전체 필터 초기화
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </main>

      {/* Portal Complete Usage & Interactive Guide Center */}
      <section id="feedback" className="max-w-[1600px] mx-auto px-6 md:px-12 mt-16 scroll-mt-24">
        <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-8 sm:p-10 space-y-8">
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full uppercase tracking-widest inline-block animate-pulse">
              User Guide Hub
            </span>
            <h3 className="myeongjo-title text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
              천안식객 포털 완벽 활용 가이드
            </h3>
            <p className="text-xs md:text-sm font-semibold text-slate-500 leading-relaxed">
              본 웹사이트는 천안시 맛과 멋의 생태계를 편리하게 탐구할 수 있도록 유기적으로 설계된 종합 관광 플랫폼입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/50 space-y-3 shadow-sm hover:shadow-md transition-all">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-900 font-black text-xs">
                01
              </div>
              <h5 className="font-extrabold text-sm text-slate-900">원하는 구역 선택하기</h5>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                동남구와 서북구를 클릭하여 지도를 전환하세요. 동남구의 아날로그한 단풍길과 서북구의 현대적인 카페거리 속에서 완벽한 명소를 찾을 수 있습니다.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/50 space-y-3 shadow-sm hover:shadow-md transition-all">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-900 font-black text-xs">
                02
              </div>
              <h5 className="font-extrabold text-sm text-slate-900">시즌별 로컬 축제 연계</h5>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                축제 캘린더에서 가을 배축제나 아우내 봉화제를 자유롭게 클릭하세요. 해당 축제와 긴밀히 연계된 청년 미식 맛집 벨트가 지도 우측에 자동 매핑됩니다.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/50 space-y-3 shadow-sm hover:shadow-md transition-all">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-900 font-black text-xs">
                03
              </div>
              <h5 className="font-extrabold text-sm text-slate-900">실시간 AI 코스 플래너</h5>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                상상하던 어떤 아이디어든 한국어로 묘사하세요. AI 모델이 현재 설정하신 출발 시각을 정밀 연산하여 막힘없는 순례길 코스를 설계합니다.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/50 space-y-3 shadow-sm hover:shadow-md transition-all">
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-900 font-black text-xs">
                04
              </div>
              <h5 className="font-extrabold text-sm text-slate-900">익명 방명록 및 고백</h5>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                각 명소 하단의 "방문자 리뷰 및 감상평 보기" 서랍을 열어, 실시간 닉네임과 별점으로 먼저 다녀간 식객들의 진정성 품은 기록에 동참해 보세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full Technology Infrastructure Console integration */}
      <section id="console" className="max-w-[1600px] mx-auto px-6 md:px-12 mt-16 scroll-mt-24">
        <InfrastructureConsole />
      </section>

      {/* Narrative Editorial Footer & Cheonan Identity Map */}
      <footer className={`max-w-[1600px] mx-auto px-6 md:px-12 mt-16 pb-16 border-t border-dashed pt-16 space-y-12 transition-all duration-1000 ${
        isDark ? 'border-slate-850' : 'border-slate-300'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-5 space-y-4">
            <h4 className={`text-xl font-bold myeongjo-title transition-all duration-1000 ${
              isDark ? 'text-cyan-400' : 'text-amber-900'
            }`}>빵의 도시 천안 & 맛과 멋의 생태계</h4>
            <p className={`text-xs leading-relaxed font-semibold transition-all duration-1000 ${
              isDark ? 'text-slate-350' : 'text-slate-500'
            }`}>
              천안시는 매년 가을 "빵빵데이" 축제를 성대하게 개최하는 대한민국 유일무이 제빵의 고장입니다. 
              국내 최대 빵 테마파크인 구룡동 <strong>'뚜쥬루 빵돌가마마을'</strong>은 가마솥에서 팥을 직접 끓이고 유기농 장작으로 구워내는 원초적 장인의 산실이며, 
              안서동 태조산 아래 첫 독립서점 <strong>'책방 허송세월'</strong>, 감성 한옥 <strong>'풍세커피'</strong>와 융합되어 천안 로컬 청년 창업 생태계의 중심을 구축하고 있습니다.
            </p>
          </div>

          <div className="md:col-span-4 space-y-4">
            <h4 className={`text-xl font-bold myeongjo-title transition-all duration-1000 ${
              isDark ? 'text-cyan-400' : 'text-amber-900'
            }`}>아라리오 현대조각의 세계적 성지</h4>
            <p className={`text-xs leading-relaxed font-semibold transition-all duration-1000 ${
              isDark ? 'text-slate-350' : 'text-slate-500'
            }`}>
              독일 예술 전문지 Art에서 "세계 미술 지도에 반드시 기록해야 할 보물"로 격찬한 신부동의 <strong>아라리오 조각광장</strong>. 
              데미안 허스트의 대리석 대작 '찬가'와 '채러티', 키스 해링의 역동작인 '줄리아', 수보드 굽타의 '통제선' 등 수백억 가치를 지닌 역사적 걸작들이 시민들과 터미널 앞 담장 없는 평화로운 공간에서 숨 쉬며 감상할 수 있는 독보적인 축복을 제공합니다.
            </p>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className={`text-lg font-black transition-all duration-1000 ${
              isDark ? 'text-cyan-400' : 'text-slate-800'
            }`}>공식 관광명소 천안 8경</h4>
            <ul className={`text-xs space-y-1 font-semibold leading-relaxed transition-all duration-1000 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <li>• 1경: 독립기념관 (단풍나무 숲길)</li>
              <li>• 2경: 유관순열사 사적지</li>
              <li>• 3경: 천안삼거리 공원</li>
              <li>• 4경: 태조산 왕건길과 각원사</li>
              <li>• 5경: 아라리오 조각광장</li>
              <li>• 6경: 성성호수공원</li>
              <li>• 7경: 광덕산 자연경관</li>
              <li>• 8경: 국보 제7호 봉선홍경사 갈기비</li>
            </ul>
          </div>

        </div>

        <div className={`border-t pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400 gap-4 transition-all duration-1000 ${
          isDark ? 'border-slate-850' : 'border-slate-200'
        }`}>
          <div>
            <span>© 2026 Mijeok Cheonan Spatial Curation Map. Developed under server-side Gemini 3.5-Flash.</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">이용약관</span>
            <span className="hover:underline cursor-pointer">개인정보처리방침</span>
            <span className="hover:underline cursor-pointer">천안시청 공식 바로가기</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
