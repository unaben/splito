import { mockExpense } from "../data";
import styles from "../Welcome.module.css";

function BalanceDiagram() {
  return (
    <svg viewBox="0 0 320 175" className={styles.diagram} aria-hidden="true">
      <defs>
        <marker
          id="balArrow"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="#991B1B" />
        </marker>
      </defs>

      {mockExpense.map((p) => (
        <g key={p.name}>
          <circle cx={p.x + 40} cy={48} r={28} fill={p.bg} />
          <text
            x={p.x + 40}
            y={53}
            textAnchor="middle"
            fontSize={9}
            fontWeight="700"
            fill={p.fg}
          >
            {p.name}
          </text>
          <rect
            x={p.x + 8}
            y={84}
            width={64}
            height={26}
            rx={6}
            fill={p.balBg}
          />
          <text
            x={p.x + 40}
            y={101}
            textAnchor="middle"
            fontSize={11}
            fontWeight="800"
            fill={p.balFg}
          >
            {p.balance > 0 ? `+£${p.balance}` : `-£${Math.abs(p.balance)}`}
          </text>
          <text
            x={p.x + 40}
            y={126}
            textAnchor="middle"
            fontSize={7}
            fill="var(--text-secondary)"
          >
            {p.balance > 0 ? "is owed" : "owes"}
          </text>
        </g>
      ))}
      <path
        d="M165 145 Q130 158 82 140"
        stroke="#991B1B"
        strokeWidth={1.5}
        fill="none"
        strokeDasharray="4 2"
        markerEnd="url(#balArrow)"
      />
      <path
        d="M263 145 Q200 162 82 140"
        stroke="#991B1B"
        strokeWidth={1.5}
        fill="none"
        strokeDasharray="4 2"
        markerEnd="url(#balArrow)"
      />
      <text
        x={160}
        y={172}
        textAnchor="middle"
        fontSize={7.5}
        fill="var(--text-secondary)"
      >
        You & Marcus each pay Sarah £30 → all square
      </text>
    </svg>
  );
}
export default BalanceDiagram;
