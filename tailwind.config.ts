import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { fontFamily: { sans: ["var(--font-cairo)", "Arial", "sans-serif"] }, colors: { ink: "#19342d", forest: "#235c49", lime: "#d7f36b", sand: "#f7f6f0", muted: "#78847e" }, boxShadow: { soft: "0 16px 50px rgba(25,52,45,.08)" } } },
  plugins: []
};
export default config;
