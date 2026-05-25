import { mockInfo, mockInfoTwo } from "../data";
import styles from "../Welcome.module.css";

function SimplifyDiagram() {
  return (
    <svg viewBox="0 0 320 175" className={styles.diagram} aria-hidden="true">
      <defs>
        <marker
          id="messy"
          markerWidth="5"
          markerHeight="5"
          refX="4"
          refY="2.5"
          orient="auto"
        >
          <path d="M0,0 L5,2.5 L0,5 Z" fill="#EF4444" />
        </marker>
        <marker
          id="clean"
          markerWidth="5"
          markerHeight="5"
          refX="4"
          refY="2.5"
          orient="auto"
        >
          <path d="M0,0 L5,2.5 L0,5 Z" fill="#059669" />
        </marker>
      </defs>
      <text
        x={72}
        y={14}
        textAnchor="middle"
        fontSize={8}
        fill="var(--text-secondary)"
        fontWeight="600"
      >
        WITHOUT SPLITO
      </text>

      {mockInfo.map((p) => (
        <g key={p.name}>
          <circle cx={p.cx} cy={p.cy} r={16} fill="#FEE2E2" />
          <text
            x={p.cx}
            y={p.cy + 4}
            textAnchor="middle"
            fontSize={7}
            fontWeight="600"
            fill="#991B1B"
          >
            {p.name}
          </text>
        </g>
      ))}

      {[
        [0, 1],
        [0, 2],
        [0, 3],
        [1, 2],
        [1, 3],
        [2, 3],
      ].map(([a, b], i) => {
        const pts = [
          [30, 38],
          [115, 38],
          [30, 130],
          [115, 130],
        ];
        return (
          <line
            key={i}
            x1={pts[a][0]}
            y1={pts[a][1]}
            x2={pts[b][0]}
            y2={pts[b][1]}
            stroke="#EF4444"
            strokeWidth={1}
            opacity={0.5}
            markerEnd="url(#messy)"
          />
        );
      })}

      <text
        x={72}
        y={162}
        textAnchor="middle"
        fontSize={8}
        fill="#EF4444"
        fontWeight="600"
      >
        Up to 12 payments
      </text>
      <line
        x1={150}
        y1={10}
        x2={150}
        y2={165}
        stroke="var(--border)"
        strokeWidth={1}
        strokeDasharray="4 2"
      />
      <text
        x={238}
        y={14}
        textAnchor="middle"
        fontSize={8}
        fill="var(--text-secondary)"
        fontWeight="600"
      >
        WITH SPLITO
      </text>

      <circle cx={238} cy={84} r={22} fill="#D1FAE5" />
      <text
        x={238}
        y={88}
        textAnchor="middle"
        fontSize={8}
        fontWeight="700"
        fill="#065F46"
      >
        You
      </text>

      {mockInfoTwo.map((p) => (
        <g key={p.name}>
          <circle cx={p.cx} cy={p.cy} r={15} fill="#DCFCE7" />
          <text
            x={p.cx}
            y={p.cy + 4}
            textAnchor="middle"
            fontSize={7}
            fontWeight="600"
            fill="#065F46"
          >
            {p.name}
          </text>
          <line
            x1={p.cx}
            y1={p.cy > 84 ? p.cy - 15 : p.cy + 15}
            x2={238}
            y2={p.cy > 84 ? 106 : 62}
            stroke="#059669"
            strokeWidth={1.5}
            markerEnd="url(#clean)"
          />
        </g>
      ))}

      <text
        x={238}
        y={168}
        textAnchor="middle"
        fontSize={8}
        fill="#059669"
        fontWeight="600"
      >
        Just 3 payments ✓
      </text>
    </svg>
  );
}

export default SimplifyDiagram;
