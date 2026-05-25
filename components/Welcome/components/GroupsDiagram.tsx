import { mockTripsInfo } from "../data";
import styles from "../Welcome.module.css";

function GroupsDiagram() {
  return (
    <svg viewBox="0 0 320 140" className={styles.diagram} aria-hidden="true">
      {mockTripsInfo.map((g) => (
        <g key={g.x}>
          <rect
            x={g.x}
            y={10}
            width={90}
            height={118}
            rx={10}
            fill="var(--surface)"
            stroke="var(--border)"
            strokeWidth={1.5}
          />
          <rect x={g.x} y={10} width={90} height={36} rx={10} fill={g.color} />
          <rect x={g.x} y={36} width={90} height={10} fill={g.color} />
          <text x={g.x + 45} y={34} textAnchor="middle" fontSize={16}>
            {g.emoji}
          </text>
          <text
            x={g.x + 45}
            y={60}
            textAnchor="middle"
            fontSize={8}
            fill={g.fg}
            fontWeight="600"
          >
            {g.label}
          </text>
          {Array.from({ length: Math.min(g.members, 4) }).map((_, i) => (
            <circle
              key={i}
              cx={g.x + 14 + i * 18}
              cy={88}
              r={9}
              fill={g.color}
              stroke="var(--surface)"
              strokeWidth={2}
            />
          ))}
          <text
            x={g.x + 45}
            y={116}
            textAnchor="middle"
            fontSize={7}
            fill="var(--text-secondary)"
          >
            {g.members} members
          </text>
        </g>
      ))}
    </svg>
  );
}
export default GroupsDiagram;
