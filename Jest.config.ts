import type { Config } from "jest"
import nextJest from "next/jest.js"

const createJestConfig = nextJest({ dir: "./" })

const config: Config = {
  // Use node environment — unit tests don't need a browser
  testEnvironment: "node",

  // Only run files in __tests__/unit
  testMatch: ["**/*.test.ts"],

  // Resolve @/ to src/ so imports match the app
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  // Show individual test names in output
  verbose: true,
}

export default createJestConfig(config)