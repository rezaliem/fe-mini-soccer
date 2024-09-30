import { defineNuxtConfig } from "nuxt";

import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";

import transformerDirective from "@unocss/transformer-directives";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  css: [
    // CSS file in the project
    "~/assets/css/fonts.css",
  ],
  modules: [
    "@unocss/nuxt",
    "@pinia/nuxt",
    "@nuxtjs/moment",
    [
      "unplugin-icons/nuxt",
      {
        /* options */
      },
    ],
  ],
  build: {
    transpile: ["vueuc", "vue3-json-editor"], // fix dev error: Cannot find module 'vueuc'
  },

  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
    plugins: [
      Components({
        resolvers: [NaiveUiResolver(), IconsResolver()], // Automatically register all components in the `components` directory
      }),
      Icons(),
    ],
    // css: {
    //   preprocessorOptions: {
    //     sass: {
    //       additionalData: '@import "@/assets/scss/global.scss"',
    //     },
    //   },
    // },
    // @ts-expect-error: Missing ssr key
    ssr: {
      noExternal: [
        "moment",
        "naive-ui",
        "@juggle/resize-observer",
        "@css-render/vue3-ssr",
      ],
    },
  },

  ssr: true,

  unocss: {
    // presets
    uno: true, // enabled `@unocss/preset-uno`
    icons: true, // enabled `@unocss/preset-icons`
    attributify: true, // enabled `@unocss/preset-attributify`,

    // core options
    shortcuts: {},
    rules: [],
    transformers: [transformerDirective()],
    theme: {
      colors: {
        primary: "#e22465",
        warning: "#faad14",
      },
    },
  },

  runtimeConfig: {
    public: {
      BASE_API_URL: process.env.BASE_API_URL,
      API_URL: process.env.API_URL,
      CA_ADMIN_API_URL: process.env.CA_ADMIN_API_URL,
      SE_API_URL: process.env.SE_API_URL,
      SE_API_KEY: process.env.SE_API_KEY,
      TOKEN: process.env.TOKEN,
    },
  },
});
