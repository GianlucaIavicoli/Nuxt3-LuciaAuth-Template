// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  ssr: false,

  runtimeConfig: {
    origin: process.env.ORIGIN,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    mailtrapEndpoint: process.env.MAILTRAP_ENDPOINT,
    mailtrapSender: process.env.MAILTRAP_SENDER,
    mailtrapPassword: process.env.MAILTRAP_PASSWORD,
    mailtrapTemplateUuidResetPassword:
      process.env.MAILTRAP_TEMPLATE_UUID_RESET_PASSWORD,
    mailtrapTemplateUuidVerifyEmail:
      process.env.MAILTRAP_TEMPLATE_UUID_VERIFY_EMAIL,
    companyName: process.env.COMPANY_NAME,
    companyInfoEmail: process.env.COMPANY_INFO_EMAIL,
    companySupportEmail: process.env.COMPANY_SUPPORT_EMAIL,
    companyContactEmail: process.env.COMPANY_CONTACT_EMAIL,
  },

  modules: ["@nuxtjs/tailwindcss", "@nuxt/icon"],
  css: ["~/assets/css/main.css"],
});
