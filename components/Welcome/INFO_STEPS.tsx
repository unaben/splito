import BalanceDiagram from "./components/BalanceDiagram";
import ExpenseDiagram from "./components/ExpenseDiagram";
import GroupsDiagram from "./components/GroupsDiagram";
import SimplifyDiagram from "./components/SimplifyDiagram";

export const INFO_STEPS = [
    {
      emoji: "👋",
      headline: (name: string) => `Welcome to Splito, ${name}!`,
      body: () => (
        <>
          <p>
            Splito is a <strong>shared expense tracker</strong>. It answers the
            question everyone asks after a holiday or shared house:
            <em> &quot;who owes who, and how much?&quot;</em>
          </p>
          <p>
            Log expenses as they happen. Splito does the maths and tells each
            person exactly what to pay — and to whom. No awkward money
            conversations.
          </p>
        </>
      ),
      diagram: null as React.ReactNode,
    },
    {
      emoji: "🏠",
      headline: () => "Step 1 — Create a Group",
      body: () => (
        <>
          <p>
            A <strong>group</strong> is a tab for any shared situation. Create one
            for a holiday, a flat share, a regular dinner — anything where several
            people share costs together.
          </p>
          <p>
            Each group is completely <strong>separate</strong>. Your Portugal trip
            and your flat bills never mix.
          </p>
        </>
      ),
      diagram: <GroupsDiagram />,
    },
    {
      emoji: "💸",
      headline: () => "Step 2 — Log who paid the bill",
      body: () => (
        <>
          <p>
            When someone pays for the group, tap <strong>+ Add expense</strong>.
            Pick who paid, type the amount, and choose how to split it.
            <strong> Equal split</strong> divides the cost evenly.
          </p>
          <p>
            The payer&apos;s own share is <strong>automatically marked settled</strong>{" "}
            — they already paid it by fronting the bill. Everyone else&apos;s share
            shows as outstanding.
          </p>
        </>
      ),
      diagram: <ExpenseDiagram />,
    },
    {
      emoji: "⚖️",
      headline: () => "Step 3 — Check the Balances",
      body: () => (
        <>
          <p>
            The <strong>Balances tab</strong> shows everyone&apos;s net position across
            all expenses in that group.
            <span style={{ color: "#059669", fontWeight: 600 }}> Green</span> =
            you are owed money.
            <span style={{ color: "#DC2626", fontWeight: 600 }}> Red</span> = you
            owe money.
          </p>
          <p>
            The <strong>Suggested payments</strong> section shows the minimum
            transfers needed to clear all debts in that group.
          </p>
        </>
      ),
      diagram: <BalanceDiagram />,
    },
    {
      emoji: "✅",
      headline: () => "Step 4 — Settle up",
      body: () => (
        <>
          <p>
            Splito reduces transfers to the <strong>mathematical minimum</strong>.
            With 4 people, up to 12 payments might be needed without
            simplification. Splito cuts that down to just 3.
          </p>
          <p>
            Hit <strong>Settle up</strong> in a group to record that a payment was
            made. The balance clears immediately. Pay by cash or card — it&apos;s up to
            you.
          </p>
        </>
      ),
      diagram: <SimplifyDiagram />,
    },
  ];