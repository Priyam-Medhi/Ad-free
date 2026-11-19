import { useState } from 'react';
import type { DailyLogPoint } from '../types/recovery';

interface ProgressJourneyChartProps {
  history: DailyLogPoint[];
}

function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const controlX = ((current.x + next.x) / 2).toFixed(1);
    path += ` C ${controlX} ${current.y.toFixed(1)}, ${controlX} ${next.y.toFixed(1)}, ${next.x.toFixed(1)} ${next.y.toFixed(1)}`;
  }
  return path;
}

export function ProgressJourneyChart({ history }: ProgressJourneyChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const width = 460;
  const height = 175;
  const padLeft = 46;
  const padRight = 18;
  const padTop = 16;
  const padBottom = 30;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const safeHistory =
    history.length > 0
      ? history
      : [
          {
            dayIndex: 1,
            dayLetter: 'M',
            label: 'D1',
            status: 'clean' as const,
            freedomScore: 55,
            urgeBaseline: 40,
          },
        ];

  const xForIndex = (idx: number) => {
    if (safeHistory.length === 1) return padLeft + plotW / 2;
    return padLeft + (idx / (safeHistory.length - 1)) * plotW;
  };

  const yForScore = (score: number) => {
    const clamped = Math.max(0, Math.min(100, score));
    return padTop + ((100 - clamped) / 100) * plotH;
  };

  const mainPoints = safeHistory.map((pt, i) => ({
    x: xForIndex(i),
    y: yForScore(pt.freedomScore),
  }));

  const baselinePoints = safeHistory.map((pt, i) => ({
    x: xForIndex(i),
    y: yForScore(pt.urgeBaseline),
  }));

  const mainPath = buildSmoothPath(mainPoints);
  const baselinePath = buildSmoothPath(baselinePoints);

  const areaPath =
    mainPoints.length > 1
      ? `${mainPath} L ${mainPoints[mainPoints.length - 1].x.toFixed(1)} ${(padTop + plotH).toFixed(1)} L ${mainPoints[0].x.toFixed(1)} ${(padTop + plotH).toFixed(1)} Z`
      : '';

  const activePoint =
    hoveredIndex !== null && safeHistory[hoveredIndex] ? safeHistory[hoveredIndex] : null;

  return (
    <div className="w-full">
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
          role="img"
          aria-label={`Progress journey over ${safeHistory.length} logged days`}
        >
          <defs>
            <linearGradient id="saharaAreaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c2652a" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#c2652a" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Horizontal Y-axis gridlines */}
          {[
            { label: 'Free', score: 100 },
            { label: 'Mild', score: 50 },
            { label: 'Relapse', score: 0 },
          ].map((tick) => {
            const y = yForScore(tick.score);
            return (
              <g key={tick.label}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#e3dad0"
                  strokeWidth="1"
                  strokeDasharray={tick.score === 0 ? undefined : '2 4'}
                />
                <text
                  x={padLeft - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  fill="#938477"
                  fontSize="10"
                  fontFamily="Manrope, sans-serif"
                >
                  {tick.label}
                </text>
              </g>
            );
          })}

          {/* Warm area fill under Clean Day trajectory */}
          {areaPath && <path d={areaPath} fill="url(#saharaAreaFill)" />}

          {/* Dashed Urge baseline curve */}
          {baselinePath && (
            <path
              d={baselinePath}
              fill="none"
              stroke="#d5a685"
              strokeWidth="1.6"
              strokeDasharray="4 4"
            />
          )}

          {/* Solid Clean Day trajectory curve */}
          {mainPath && (
            <path
              d={mainPath}
              fill="none"
              stroke="#c2652a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Nodes & X-axis labels */}
          {safeHistory.map((pt, i) => {
            const pos = mainPoints[i];
            const isFirst = i === 0;
            const isLast = i === safeHistory.length - 1;
            const isHovered = hoveredIndex === i;
            const isRelapse = pt.status === 'relapse';

            return (
              <g key={`${pt.dayIndex}-${pt.label}`}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isLast || isHovered ? 5 : 3.5}
                  fill={isLast || isFirst ? '#fffdf9' : isRelapse ? '#8c3c3c' : '#c2652a'}
                  stroke={isRelapse ? '#8c3c3c' : isFirst && !isLast ? '#938477' : '#c2652a'}
                  strokeWidth={isLast || isHovered ? 2.4 : 1.8}
                />
                {/* Generous invisible hit circle for hover/click */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={14}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setHoveredIndex(isHovered ? null : i)}
                />
                <text
                  x={pos.x}
                  y={height - 6}
                  textAnchor="middle"
                  fill={isLast ? '#c2652a' : '#8f8073'}
                  fontSize="10"
                  fontWeight={isLast ? '700' : '500'}
                  fontFamily="Manrope, sans-serif"
                >
                  {isLast ? pt.label : pt.dayLetter}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive readout strip when hovering/selecting a day */}
      <div className="min-h-[24px] mt-1 flex items-center justify-between text-xs text-[#6b5d53]">
        {activePoint ? (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[#2d241e]">{activePoint.label}</span>
            <span aria-hidden="true">·</span>
            <span
              className={
                activePoint.status === 'relapse'
                  ? 'text-[#8c3c3c] font-medium'
                  : 'text-[#c2652a] font-medium'
              }
            >
              {activePoint.status === 'relapse' ? 'Gentle reset logged' : 'Clean day'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">Clarity {activePoint.freedomScore}%</span>
            {activePoint.note && (
              <>
                <span aria-hidden="true">·</span>
                <span className="italic truncate max-w-[200px]">“{activePoint.note}”</span>
              </>
            )}
          </div>
        ) : (
          <span className="text-[11px] text-[#938477]">
            Tap or hover any milestone dot to inspect daily clarity
          </span>
        )}
      </div>
    </div>
  );
}
