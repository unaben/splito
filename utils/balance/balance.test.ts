import { formatPence, penceFromPounds } from "./balance";

describe("formatPence", () => {
  it("whole pounds", () => expect(formatPence(3000)).toBe("£30.00"));
  it("pence values", () => expect(formatPence(150)).toBe("£1.50"));
  it("zero", () => expect(formatPence(0)).toBe("£0.00"));
  it("large amounts", () => expect(formatPence(100000)).toBe("£1,000.00"));
});

describe("penceFromPounds", () => {
  it("number input", () => expect(penceFromPounds(30)).toBe(3000));
  it("string input", () => expect(penceFromPounds("12.50")).toBe(1250));
  it("rounds correctly", () => expect(penceFromPounds("9.999")).toBe(1000));
  it("zero", () => expect(penceFromPounds(0)).toBe(0));
});
