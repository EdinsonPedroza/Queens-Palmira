import coreWebVitals from "eslint-config-next/core-web-vitals"

/** Flat config — `next lint` was removed in Next 16, so this runs through the ESLint CLI. */
const config = [
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts", "public/**"] },
  ...coreWebVitals,
]

export default config
