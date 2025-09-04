import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";

export default defineConfig({
  plugins: [pluginReact(), pluginSass()],
  html: {
    title: "Tech Ghost",
  },
  source: {
    define: {
      "process.env": JSON.stringify(process.env),
    },
  },
});
