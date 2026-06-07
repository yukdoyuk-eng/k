import React, { useState, useEffect, useRef } from 'react';
import { District } from '../types';
import { Navigation, CheckCircle, Compass, HelpCircle } from 'lucide-react';

interface RouteSpot {
  stepIndex: number;
  spotName: string;
  latitude: number;
  longitude: number;
  id: number;
  guide?: string;
}

interface CheonanMapProps {
  districts: District[];
  selectedDistrictId: number | null;
  onSelectDistrict: (id: number | null) => void;
  activeGu: 'DONGNAM' | 'SEOBUK' | 'ALL';
  spots?: any[];
  routeSpots?: RouteSpot[];
  isDark?: boolean;
}

const DISTRICT_COORDS: Record<number, { lat: number; lon: number; name: string; gu: 'DONGNAM' | 'SEOBUK' }> = {
  1: { lat: 36.7831, lon: 127.2230, name: '목천읍', gu: 'DONGNAM' },
  2: { lat: 36.8015, lon: 127.2999, name: '병천면', gu: 'DONGNAM' },
  3: { lat: 36.6853, lon: 127.1120, name: '풍세면', gu: 'DONGNAM' },
  4: { lat: 36.8200, lon: 127.2400, name: '북면', gu: 'DONGNAM' },
  5: { lat: 36.7700, lon: 127.2700, name: '수신면', gu: 'DONGNAM' },
  6: { lat: 36.8150, lon: 127.1650, name: '신안동', gu: 'DONGNAM' },
  7: { lat: 36.7850, lon: 127.1400, name: '청룡동', gu: 'DONGNAM' },
  8: { lat: 36.8156, lon: 127.1062, name: '불당동', gu: 'SEOBUK' },
  9: { lat: 36.8431, lon: 127.1420, name: '부성동', gu: 'SEOBUK' },
  10: { lat: 36.8600, lon: 127.1900, name: '성거읍', gu: 'SEOBUK' },
  11: { lat: 36.9150, lon: 127.1280, name: '성환읍', gu: 'SEOBUK' },
  12: { lat: 36.8250, lon: 127.1350, name: '성정동', gu: 'SEOBUK' },
};

// Coordinate mapping boundaries
const minLon = 127.06;
const maxLon = 127.33;
const minLat = 36.64;
const maxLat = 36.94;

const getXY = (lat: number, lon: number, width: number = 380, height: number = 290) => {
  const paddingX = 35;
  const paddingY = 30;

  const x = paddingX + ((lon - minLon) / (maxLon - minLon)) * (width - 2 * paddingX);
  const y = paddingY + (1 - (lat - minLat) / (maxLat - minLat)) * (height - 2 * paddingY);

  return { x, y };
};

export default function CheonanMap({
  districts,
  selectedDistrictId,
  onSelectDistrict,
  activeGu,
  routeSpots = [],
  isDark = false
}: CheonanMapProps) {
  const [hoveredRouteSpot, setHoveredRouteSpot] = useState<RouteSpot | null>(null);
  const [hoveredDistrictId, setHoveredDistrictId] = useState<number | null>(null);

  // Scroll tracking state for drawing travel routes in real-time
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [pathLength, setPathLength] = useState<number>(1000);

  // Calculate if a specific waypoint index has been reached by the current scroll progress
  const isWaypointReached = (idx: number) => {
    if (routeSpots.length <= 1) return true;
    const targetProgress = idx / (routeSpots.length - 1);
    return scrollProgress >= targetProgress - 0.05; // 5% buffer for snappy responsive activation
  };

  // Scroll event observer to map window scrolling down #planner coordinates to 0.0 ~ 1.0 progress
  useEffect(() => {
    const handleScroll = () => {
      const plannerEl = document.getElementById('planner');
      if (!plannerEl) {
        setScrollProgress(0.5); // Fallback visible line range if element cannot be resolved
        return;
      }

      const rect = plannerEl.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Start drawing when user scrolls to bottom 90% of screen height
      // Complete drawing when user scrolls past top 15% of screen height
      const triggerStart = viewportHeight * 0.90;
      const triggerEnd = viewportHeight * 0.15;
      
      const totalRange = rect.height + (triggerStart - triggerEnd);
      const scrolledRange = triggerStart - rect.top;
      
      const rawProgress = scrolledRange / totalRange;
      const progress = Math.max(0, Math.min(1, rawProgress));
      
      setScrollProgress(progress);
    };

    // Initialize position check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    // Quick polling fallback check to resolve layout offsets on slower slow-loading assets
    const intervalId = setInterval(handleScroll, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearInterval(intervalId);
    };
  }, [routeSpots]);

  // Categorize districts
  const dongnamDistricts = districts.filter(d => d.gu === 'DONGNAM' && (activeGu === 'ALL' || activeGu === 'DONGNAM'));
  const seobukDistricts = districts.filter(d => d.gu === 'SEOBUK' && (activeGu === 'ALL' || activeGu === 'SEOBUK'));

  const getDistrictAccent = (districtName: string) => {
    if (districtName.includes('목천읍')) return '독립기념관 단풍길 • 카페목천 콩크림눌림떡';
    if (districtName.includes('병천면')) return '유관순 사적지 • 한방 아우내 순대거리';
    if (districtName.includes('풍세면')) return '태학산 치유의숲 • 풍세커피 한옥고택 베이커리';
    if (districtName.includes('북면')) return '알프스 벚꽃 드라이브 • 일본가옥 카페 교토리';
    if (districtName.includes('수신면')) return '홍대용과학관 은하수 망원경 • 수신 멜론농가 맛집';
    if (districtName.includes('신안동')) return '호수송 버스커 꽃송이가 단대호수 • 아라리오 조각광장 • 책방 허송세월';
    if (districtName.includes('청룡동')) return '동화 속 오두막 뚜쥬루 빵돌가마마을 테마파크';
    if (districtName.includes('불당동')) return '지브리 소품 카와이레시피 고양이 스프카레 • 심야 드립커피 그래비티';
    if (districtName.includes('부성동')) return '야경 순환데크 성성호수공원 수변 브런치 카페거리';
    if (districtName.includes('성거읍')) return '금계국 천흥저수지 • 데이지정원 핑크뮬리 카페 이숲';
    if (districtName.includes('성환읍')) return '국보 갈기비 • 배밭 하얀 꽃밭 조망 과수원 카페 하레브라도';
    if (districtName.includes('성정동')) return '대디디천안축구센터 • 뚜쥬루 성정본점 과자점';
    return '지역 대표 공간';
  };

  // Build both straight and curved route path coordinate strings
  let routePathD = '';
  let curvedRoutePathD = '';
  if (routeSpots.length > 1) {
    routeSpots.forEach((spot, idx) => {
      const { x, y } = getXY(spot.latitude, spot.longitude);
      if (idx === 0) {
        routePathD = `M ${x.toFixed(1)} ${y.toFixed(1)}`;
        curvedRoutePathD = `M ${x.toFixed(1)} ${y.toFixed(1)}`;
      } else {
        routePathD += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
        
        // Let's create beautiful soft curved bezier segments to simulate smooth travel!
        const prevSpot = routeSpots[idx - 1];
        const prevXY = getXY(prevSpot.latitude, prevSpot.longitude);
        
        const dx = x - prevXY.x;
        const dy = y - prevXY.y;
        
        // Control points offset slightly perpendicular to create a sweeping aesthetic arc
        const cx = prevXY.x + dx * 0.5 - dy * 0.15;
        const cy = prevXY.y + dy * 0.5 + dx * 0.15;
        
        curvedRoutePathD += ` Q ${cx.toFixed(1)} ${cy.toFixed(1)}, ${x.toFixed(1)} ${y.toFixed(1)}`;
      }
    });
  }

  // Measure dynamic path length to align stroke dash arrays exactly with physical pixels
  useEffect(() => {
    if (pathRef.current) {
      try {
        const length = pathRef.current.getTotalLength();
        if (length > 0) {
          setPathLength(length);
        }
      } catch (err) {
        console.warn('Unable to retrieve SVG path length dynamically:', err);
      }
    }
  }, [curvedRoutePathD]);

  return (
    <div className={`relative transition-all duration-500 rounded-3xl p-6 border shadow-xl overflow-hidden ${
      isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-100 text-slate-900'
    }`}>
      {/* Highly immersive route and pathway sequential animations */}
      <style>{`
        @keyframes draw-path {
          from {
            stroke-dashoffset: 1000;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes route-glow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -32; }
        }
        @keyframes subtle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-draw-route {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw-path 2.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-route-pulse-flow {
          stroke-dasharray: 10, 15;
          animation: route-glow 1.5s linear infinite;
        }
        .animate-route-backglow {
          stroke-dasharray: 30, 30;
          animation: route-glow 6s linear infinite;
        }
      `}</style>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5 border-b pb-4 border-slate-100/50 dark:border-slate-800/80">
        <div>
          <h4 className="text-base font-black tracking-tight flex items-center gap-1.5 font-sans">
            <Navigation className="w-5 h-5 text-amber-700 dark:text-cyan-400 animate-bounce" />
            천안시 실시간 탐방 노선도 & 큐레이션
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-sans font-medium">
            코스 도우미에서 선택하신 여정의 동선 경로선이 지도 상에 기가막히게 그려집니다.
          </p>
        </div>
        <div className="shrink-0">
          {selectedDistrictId && (
            <button
              onClick={() => onSelectDistrict(null)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all border cursor-pointer border-slate-200/50 ${
                isDark ? 'bg-cyan-950/20 text-cyan-300 border-cyan-800' : 'bg-slate-900 text-white hover:bg-slate-800'
              } font-sans`}
            >
              전체 구역 탐색 ×
            </button>
          )}
        </div>
      </div>

      {/* SVG Interactive Geo Visualizer Canvas */}
      <div className={`relative mb-6 rounded-2xl border p-3 flex flex-col items-center justify-center overflow-hidden ${
        isDark ? 'bg-slate-950/60 border-slate-850' : 'bg-slate-50/50 border-slate-100'
      }`}>
        <div className="absolute top-3.5 left-4 flex items-center gap-2 z-10">
          <span className={`w-2 h-2 rounded-full bg-emerald-500 animate-ping`} />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {routeSpots.length > 0 ? '순차적 여정 경로선 (Active Itinerary Routing)' : '행정 구역 레이아웃 실시간 지도'}
          </span>
        </div>

        {/* Compass HUD Display */}
        <div className="absolute bottom-3 right-4 flex items-center gap-1.5 opacity-60 text-[9.5px] font-mono tracking-wider font-extrabold text-slate-400">
          <Compass className="w-3.5 h-3.5 text-slate-400 dark:text-cyan-500" />
          <span>N 36°48' / E 127°09'</span>
        </div>

        {/* Float Tooltip Overlays */}
        {hoveredRouteSpot && (
          <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 rounded-xl px-3.5 py-2 shadow-2xl text-[10.5px] z-30 pointer-events-none whitespace-normal max-w-[280px] border leading-normal transition-all duration-300 ${
            isDark ? 'bg-slate-900 border-cyan-800 text-white' : 'bg-slate-900 text-white border-slate-850 shadow-slate-900/40'
          }`}>
            <div className="text-amber-400 dark:text-cyan-400 font-black mb-0.5 flex items-center gap-1.5">
              <span>📍 {hoveredRouteSpot.stepIndex}단계 여정선 지표</span>
              <span className={`px-1.5 py-0.2 text-[8px] rounded uppercase ${isDark ? 'bg-cyan-950 text-cyan-400 font-extrabold' : 'bg-amber-900 text-amber-100'}`}>명소</span>
            </div>
            <div className="font-extrabold text-xs text-white mb-1.5">{hoveredRouteSpot.spotName}</div>
            <div className={`text-[10px] ${isDark ? 'text-slate-300' : 'text-slate-200'} font-medium`}>{hoveredRouteSpot.guide}</div>
          </div>
        )}

        {hoveredDistrictId && !hoveredRouteSpot && (() => {
          const d = DISTRICT_COORDS[hoveredDistrictId];
          return (
            <div className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 rounded-xl px-3.5 py-2 shadow-2xl text-[10.5px] z-30 pointer-events-none border leading-normal transition-all duration-200 ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-900 text-white border-slate-850'
            }`}>
              <div className="font-black text-amber-450 dark:text-cyan-400 text-[10px] uppercase tracking-wider mb-0.5">천안시 행정 구역</div>
              <span className="font-black text-xs text-white block">{d?.name}</span>
              <span className="text-[10px] text-slate-350 block mt-1">✨ {getDistrictAccent(d?.name || '')}</span>
            </div>
          );
        })()}

        {routeSpots.length === 0 && (
          <div className="absolute inset-0 bg-transparent flex flex-col items-center justify-center p-6 text-center select-none pointer-events-none z-10">
            <div className={`p-3.5 rounded-full mb-2 bg-white/20 dark:bg-slate-900/60 backdrop-blur-md shadow-inner border border-white/25 dark:border-slate-800`}>
              <Compass className={`w-6 h-6 text-slate-400 dark:text-cyan-500 animate-spin`} style={{ animationDuration: '8s' }} />
            </div>
            <h5 className={`text-xs font-black tracking-tight mb-2 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>비활성 경로선 상태</h5>
            <p className={`text-[10px] leading-relaxed max-w-[260px] font-medium ${isDark ? 'text-slate-450' : 'text-slate-450'}`}>
              하단의 <strong>코스 도우미</strong> 탭에서 <strong>원하는 일정 테마</strong>를 선택하시면 가시적인 경로선이 지도 상에 활성화됩니다.
            </p>
          </div>
        )}

        {/* SVG Interactive Map Geometry Rendering */}
        <svg 
          viewBox="0 0 380 290" 
          className="w-full h-auto max-h-[300px] select-none"
        >
          {/* Subtle Grid dots */}
          <defs>
            <pattern id="dotGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2px" cy="2px" r="1px" fill={isDark ? '#334155/60' : '#cbd5e1/70'} />
            </pattern>
            {routeSpots.length > 1 && (
              <mask id="route-scroll-mask">
                <path
                  ref={pathRef}
                  d={curvedRoutePathD}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={pathLength}
                  strokeDashoffset={pathLength * (1 - scrollProgress)}
                  style={{ transition: 'stroke-dashoffset 0.15s cubic-bezier(0.16, 1, 0.3, 1)' }}
                />
              </mask>
            )}
          </defs>
          <rect width="100%" height="100%" fill="url(#dotGrid)" rx="12" />

          {/* District boundary connection paths (styled network mesh topology) */}
          <g opacity={isDark ? '0.25' : '0.4'} stroke={isDark ? '#475569' : '#cbd5e1'} strokeWidth="1" strokeDasharray="3,3">
            {/* Draw schematic topology wires representing neighboring geographical sectors */}
            {[[1, 2], [1, 4], [1, 5], [1, 6], [1, 7], [2, 4], [2, 5], [6, 7], [6, 12], [8, 12], [8, 9], [9, 12], [9, 10], [10, 12], [11, 10], [3, 7]].map(([fromId, toId], idx) => {
              const fromC = DISTRICT_COORDS[fromId];
              const toC = DISTRICT_COORDS[toId];
              if (fromC && toC) {
                const p1 = getXY(fromC.lat, fromC.lon);
                const p2 = getXY(toC.lat, toC.lon);
                return (
                  <line 
                    key={idx} 
                    x1={p1.x} 
                    y1={p1.y} 
                    x2={p2.x} 
                    y2={p2.y} 
                  />
                );
              }
              return null;
            })}
          </g>

          {/* Render East-West administrative zones visual glowing regions background */}
          <path 
            d="M 120 20 C 130 110, 110 180, 100 270" 
            fill="none" 
            stroke={isDark ? '#1e293b' : '#f1f5f9'} 
            strokeWidth="4" 
            strokeDasharray="5,5" 
            opacity="0.6"
          />

          {/* Sequential itinerary route path representation with advanced layered path animations */}
          {routeSpots.length > 1 && (
            <g key={curvedRoutePathD}>
              {/* Subtle guide rail (NOT masked) so the user sees the future path with beautiful light contrast */}
              <path 
                d={curvedRoutePathD} 
                fill="none" 
                stroke={isDark ? '#334155' : '#cbd5e1'} 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                opacity={isDark ? 0.35 : 0.5}
                strokeDasharray="4, 4"
              />

              {/* Scroll-masked path drawing group */}
              <g mask="url(#route-scroll-mask)">
                {/* Backglow heavy styling path (Curved) */}
                <path 
                  d={curvedRoutePathD} 
                  fill="none" 
                  stroke={isDark ? '#22d3ee' : '#f97316'} 
                  strokeWidth="8" 
                  opacity="0.25" 
                  className="blur-sm"
                />
                {/* Layer 1: Full-route static under-rail showing the completed itinerary footprint gently */}
                <path 
                  d={curvedRoutePathD} 
                  fill="none" 
                  stroke={isDark ? '#1e293b' : '#ffedd5'} 
                  strokeWidth="4.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  opacity="0.8"
                />
                {/* Layer 2: Main Sequential Drawing Core (simulates the pen sketch flow in real-time) */}
                <path 
                  d={curvedRoutePathD} 
                  fill="none" 
                  stroke={isDark ? '#22d3ee' : '#ea580c'} 
                  strokeWidth="2.8" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                {/* Layer 3: Marching dynamic particle pulses (flows iteratively across the lines) */}
                <path 
                  d={curvedRoutePathD} 
                  fill="none" 
                  stroke={isDark ? '#ffffff' : '#7c2d12'} 
                  strokeWidth="1.6" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="animate-route-pulse-flow"
                  opacity="0.9"
                />
              </g>
            </g>
          )}

          {/* Distinct Administrative centroid circles */}
          {Object.entries(DISTRICT_COORDS).map(([idStr, coord]) => {
            const id = Number(idStr);
            const isSelected = selectedDistrictId === id;
            const { x, y } = getXY(coord.lat, coord.lon);
            const isDongnam = coord.gu === 'DONGNAM';

            return (
              <g 
                key={id} 
                className="cursor-pointer group/node"
                onClick={() => onSelectDistrict(isSelected ? null : id)}
                onMouseEnter={() => setHoveredDistrictId(id)}
                onMouseLeave={() => setHoveredDistrictId(null)}
              >
                {/* Glowing ring under selection node */}
                {isSelected && (
                  <circle 
                    cx={x} 
                    cy={y} 
                    r="15" 
                    fill="none" 
                    stroke={isDongnam ? '#ea580c' : '#0284c7'} 
                    strokeWidth="1.5" 
                    strokeDasharray="4,2" 
                    className="animate-spin"
                    style={{ animationDuration: '6s' }}
                  />
                )}

                {/* Outer ring on hover */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r="10" 
                  fill={isDongnam 
                    ? (isSelected ? 'rgba(234, 88, 12, 0.2)' : 'rgba(234, 88, 12, 0.05)') 
                    : (isSelected ? 'rgba(2, 132, 199, 0.2)' : 'rgba(2, 132, 199, 0.05)')
                  } 
                  className="transition-all duration-300 group-hover/node:scale-150"
                />

                {/* Centroid core dot */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r={isSelected ? '5.5' : '4'} 
                  fill={isDongnam 
                    ? (isDark ? '#f97316' : '#c2410c') 
                    : (isDark ? '#38bdf8' : '#0369a1')
                  }
                  className="transition-all duration-300 group-hover/node:r-6"
                />

                {/* Micro text tag under coordinate */}
                <text 
                  x={x} 
                  y={y - 8} 
                  textAnchor="middle" 
                  className={`text-[8.5px] font-black transition-all ${
                    isSelected 
                      ? (isDark ? 'fill-white text-xs scale-105' : 'fill-slate-900') 
                      : (isDark ? 'fill-slate-450 group-hover/node:fill-slate-200' : 'fill-slate-500 group-hover/node:fill-slate-800')
                  }`}
                >
                  {coord.name}
                </text>
              </g>
            );
          })}

          {/* Sequential Waypoint Nodes overlayed specifically over the tour path points */}
          {routeSpots.map((spot, sIdx) => {
            const { x, y } = getXY(spot.latitude, spot.longitude);
            const isReached = isWaypointReached(sIdx);
            return (
              <g 
                key={`route-wp-${spot.stepIndex}`}
                className="cursor-help"
                onMouseEnter={() => setHoveredRouteSpot(spot)}
                onMouseLeave={() => setHoveredRouteSpot(null)}
              >
                {/* Neon Ping Pulse element */}
                {isReached && (
                  <circle 
                    cx={x} 
                    cy={y} 
                    r="13" 
                    fill="none" 
                    stroke={isDark ? '#22d3ee' : '#d97706'} 
                    strokeWidth="1.5" 
                    opacity="0.8"
                    className="animate-ping"
                  />
                )}
                
                {/* Waypoint Base Ring */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r="9.5" 
                  fill={isReached 
                    ? (isDark ? '#083344' : '#ffedd5') 
                    : (isDark ? '#1e293b' : '#f1f5f9')
                  } 
                  stroke={isReached 
                    ? (isDark ? '#22d3ee' : '#b45309') 
                    : (isDark ? '#475569' : '#cbd5e1')
                  } 
                  strokeWidth="2" 
                />

                {/* Step order index text */}
                <text 
                  x={x} 
                  y={y + 3.2} 
                  textAnchor="middle" 
                  className={`text-[9.5px] font-black transition-all duration-300 ${
                    isReached 
                      ? (isDark ? 'fill-cyan-400 font-extrabold' : 'fill-amber-950') 
                      : (isDark ? 'fill-slate-500' : 'fill-slate-400')
                  }`}
                >
                  {spot.stepIndex}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="space-y-6">
        {/* DONGNAM GU GROUP */}
        {dongnamDistricts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-xs font-black text-amber-950 dark:text-amber-400 uppercase tracking-widest font-mono block">동남 헤리티지 구역 (동남구)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dongnamDistricts.map((d) => {
                const isSelected = selectedDistrictId === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => onSelectDistrict(isSelected ? null : d.id)}
                    className={`text-left p-4 rounded-2xl border transition-all duration-300 relative cursor-pointer group flex flex-col justify-between h-[105px] font-sans ${
                      isSelected 
                        ? (isDark 
                            ? 'bg-slate-900/60 border-amber-600 shadow-md ring-1 ring-amber-600/30' 
                            : 'bg-[#FAF5EE] border-amber-500/80 shadow-md ring-1 ring-amber-500/30'
                          )
                        : (isDark 
                            ? 'bg-slate-950 border-slate-850 hover:border-amber-900/40 hover:bg-[#1C160F]' 
                            : 'bg-slate-50/40 hover:bg-[#FAF8F5]/80 border-slate-100 hover:border-amber-350 shadow-sm'
                          )
                    }`}
                  >
                    <div className="w-full">
                      <div className="flex justify-between items-start">
                        <span className={`font-extrabold text-sm transition-colors ${
                          isSelected ? 'text-amber-900 dark:text-amber-350' : 'text-slate-800 dark:text-slate-200 group-hover:text-amber-900 dark:group-hover:text-amber-400'
                        }`}>
                          {d.subName}
                        </span>
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 ml-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 group-hover:text-slate-500 font-medium line-clamp-1 mt-1 leading-normal w-full">
                        {d.description}
                      </p>
                    </div>
                    <div className="text-[10px] font-bold text-amber-800/80 dark:text-amber-400 tracking-tight block truncate w-full mt-2 border-t border-amber-100/30 dark:border-amber-900/20 pt-1">
                      ✨ {getDistrictAccent(d.subName)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SEOBUK GU GROUP */}
        {seobukDistricts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span className="text-xs font-black text-sky-950 dark:text-cyan-450 uppercase tracking-widest font-mono block">서북 얼반 트렌디 구역 (서북구)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {seobukDistricts.map((d) => {
                const isSelected = selectedDistrictId === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => onSelectDistrict(isSelected ? null : d.id)}
                    className={`text-left p-4 rounded-2xl border transition-all duration-300 relative cursor-pointer group flex flex-col justify-between h-[105px] font-sans ${
                      isSelected 
                        ? (isDark 
                            ? 'bg-slate-900/60 border-cyan-500 shadow-md ring-1 ring-cyan-500/30' 
                            : 'bg-[#F0F9FF] border-sky-450 shadow-md ring-1 ring-sky-400/30'
                          )
                        : (isDark 
                            ? 'bg-slate-950 border-slate-850 hover:border-cyan-900/45 hover:bg-[#101923]' 
                            : 'bg-slate-50/40 hover:bg-sky-50/40 border-slate-100 hover:border-sky-350 shadow-sm'
                          )
                    }`}
                  >
                    <div className="w-full">
                      <div className="flex justify-between items-start">
                        <span className={`font-extrabold text-sm transition-colors ${
                          isSelected ? 'text-sky-900 dark:text-cyan-300' : 'text-slate-800 dark:text-slate-200 group-hover:text-sky-850 dark:group-hover:text-cyan-455'
                        }`}>
                          {d.subName}
                        </span>
                        {isSelected && (
                          <CheckCircle className={`w-4 h-4 shrink-0 ml-1 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 group-hover:text-slate-500 font-medium line-clamp-1 mt-1 leading-normal w-full">
                        {d.description}
                      </p>
                    </div>
                    <div className="text-[10px] font-bold text-sky-700/85 dark:text-cyan-400 tracking-tight block truncate w-full mt-2 border-t border-sky-100/30 dark:border-slate-800/80 pt-1">
                      ✨ {getDistrictAccent(d.subName)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
