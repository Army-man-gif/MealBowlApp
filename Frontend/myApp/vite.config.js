import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
console.log("Vite configuration loaded");
// https://vite.dev/config/
export default defineConfig({
  base: "/MealBowlApp/docs/",
  plugins: [react()],
});
