type Options = {
  value: string;
  emoji: string;
  label: string;
  desc: string;
};

type MockInfo = { name: string, cx: number, cy: number }

type MockTripInfo =  {
  x: number
  label: string
  emoji: string
  color: string
  fg: string
  members: number
}

type MockExpenseData =  {
  name: string
  balance: number
  x: number
  bg: string
  fg: string
  balBg: string
  balFg: string
}

export const options: Array<Options> = [
  {
    value: "example",
    emoji: "👤",
    label: "Add 4 example members",
    desc: "Alex, Sam, Jordan & Casey — rename them anytime",
  },
  {
    value: "custom",
    emoji: "✏️",
    label: "Enter my own names",
    desc: "Type in the names of the people you actually split with",
  },
  {
    value: "skip",
    emoji: "→",
    label: "Skip for now",
    desc: "Go to the dashboard and add members later",
  },
];

export const mockInfo: Array<MockInfo> = [
  { name: "You", cx: 30, cy: 38 },
  { name: "Sam", cx: 115, cy: 38 },
  { name: "Alex", cx: 30, cy: 130 },
  { name: "Jordan", cx: 115, cy: 130 },
]

export const mockInfoTwo: Array<MockInfo> = [
  { name: "Sam", cx: 185, cy: 40 },
  { name: "Alex", cx: 295, cy: 60 },
  { name: "Jordan", cx: 238, cy: 148 },
]

export const mockTripsInfo: Array<MockTripInfo> = [
  {
    x: 10,
    label: "Portugal Trip",
    emoji: "✈️",
    color: "#CCFCE7",
    fg: "#065F46",
    members: 5,
  },
  {
    x: 115,
    label: "Flat Expenses",
    emoji: "🏠",
    color: "#EDE9FE",
    fg: "#5B21B6",
    members: 3,
  },
  {
    x: 220,
    label: "Work Lunches",
    emoji: "🍜",
    color: "#FEF3C7",
    fg: "#92400E",
    members: 4,
  },
]

export const mockExpense: Array<MockExpenseData> = [
  {
    name: "Sarah",
    balance: +60,
    x: 20,
    bg: "#EDE9FE",
    fg: "#5B21B6",
    balBg: "#D1FAE5",
    balFg: "#065F46",
  },
  {
    name: "You",
    balance: -30,
    x: 120,
    bg: "#CCFCE7",
    fg: "#065F46",
    balBg: "#FEE2E2",
    balFg: "#991B1B",
  },
  {
    name: "Marcus",
    balance: -30,
    x: 220,
    bg: "#FEF3C7",
    fg: "#92400E",
    balBg: "#FEE2E2",
    balFg: "#991B1B",
  },
]
