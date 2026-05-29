import { expenseMocks } from "../data";
import styles from "../Welcome.module.css";

function ExpenseDiagram() {
  return (
    <svg viewBox="0 0 320 165" className={styles.diagram} aria-hidden="true">
      <defs>
        <marker
          id="expArrow"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--text-secondary)" />
        </marker>
      </defs>
      <rect
        x={10}
        y={55}
        width={100}
        height={55}
        rx={8}
        fill="#EDE9FE"
        stroke="#C4B5FD"
        strokeWidth={1.5}
      />
      <text
        x={60}
        y={76}
        textAnchor="middle"
        fontSize={8}
        fill="#5B21B6"
        fontWeight="700"
      >
        SARAH PAYS
      </text>
      <text
        x={60}
        y={98}
        textAnchor="middle"
        fontSize={22}
        fill="#5B21B6"
        fontWeight="800"
      >
        £90
      </text>
      <path
        d="M112 82 L155 82"
        stroke="var(--text-secondary)"
        strokeWidth={1.5}
        markerEnd="url(#expArrow)"
      />
      <text
        x={133}
        y={75}
        textAnchor="middle"
        fontSize={7}
        fill="var(--text-secondary)"
      >
        split equally
      </text>
      <text
        x={133}
        y={94}
        textAnchor="middle"
        fontSize={7}
        fill="var(--text-secondary)"
      >
        3 ways = £30
      </text>
      {expenseMocks.map((p) => (
        <g key={p.name}>
          <rect
            x={160}
            y={p.y}
            width={148}
            height={38}
            rx={7}
            fill={p.bg}
            stroke={p.border}
            strokeWidth={1.2}
          />
          <text x={170} y={p.y + 15} fontSize={9} fontWeight="700" fill={p.fg}>
            {p.name}
          </text>
          <text x={170} y={p.y + 30} fontSize={7.5} fill={p.fg}>
            {p.note}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default ExpenseDiagram;
