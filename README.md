# Nuxt3 Lucia-Auth Template

A Nuxt.js Authentication template (login, register, email validation, reset password and oauth) using Lucia-Auth, Prisma, PostgreSQL and Mailtrap.


## Tech Stack:

[![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/docs)
[![Nuxt.js](https://img.shields.io/badge/Nuxt.js-3-00DC82?style=for-the-badge&logo=nuxtdotjs&logoColor=white)](https://nuxt.com/docs/getting-started/introduction)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/docs/)
[![Lucia](https://img.shields.io/badge/Lucia-Auth-20A1A1?style=for-the-badge&logo=auth0&logoColor=white)](https://lucia-auth.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/docs/)
[![Zod](https://img.shields.io/badge/Zod-Validation-6200EE?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)
[![VeeValidate](https://img.shields.io/badge/VeeValidate-Validation-4FC08D?style=for-the-badge&logo=veevalidate&logoColor=white)](https://vee-validate.logaretm.com/)
[![Mailtrap](https://img.shields.io/badge/Mailtrap-Email_Service-000000?style=for-the-badge&logo=mailtrap&logoColor=white)](https://mailtrap.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Framework-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/docs)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-UI_Framework-FF00FF?style=for-the-badge&logo=daisyui&logoColor=white)](https://daisyui.com/)

## Features

### Authentication
- **Register and Login with Credentials**: Users can create an account and log in using their email and password.
- **OAuth Integration (GitHub & Google)**: Users can authenticate using their GitHub or Google accounts.
- **Password Reset via Email**: Users can reset their password through an email link.
- **Email Verification**: Send verification emails to confirm user email addresses.

### Linked OAuth and Credentials-Based Accounts
- **Seamless Login**: If a user registers with their email (e.g., `example@example.com`) and later logs in with Google or GitHub using the same email address, they will be logged into their existing account. This ensures a unified user experience regardless of how they sign in.
- **Unified Accounts**: Whether the user signs up using credentials or OAuth, they will only have one account associated with their email, avoiding duplicate accounts and providing a seamless login experience.

### Pre-Built Pages
- **Tailwind CSS and DaisyUI Styling**: The template includes pre-built pages that are fully styled using Tailwind CSS and DaisyUI.
- **Form Validation (Client and Server-Side)**: All forms on the pre-built pages are validated both on the client side using Zod and VeeValidate.
- **Pages:**
  - Homepage: An accessible page for anyone visiting the site.
  - Protected Page: A page that requires users to be signed in to access.
  - Login Page
  - Register Page
  - Reset Password Page (Send Request)
  - Reset Password Page (Confirm)
  - Email Verification Page

## Setup

Configure Environment Variables:

- Rename the `.env.example` file to `.env`:

- Populate the `.env` file with the following environment variables:

### Node.js
- `NODE_ENV=""`
- `ORIGIN=""`

### OAuth
- `GITHUB_CLIENT_ID=""`
- `GITHUB_CLIENT_SECRET=""`
- `GOOGLE_CLIENT_ID=""`
- `GOOGLE_CLIENT_SECRET=""`

### PostgreSQL URI
- `DATABASE_URL=""`

### Email
- `MAILTRAP_ENDPOINT=''`
- `MAILTRAP_SENDER=''`
- `MAILTRAP_PASSWORD=''`
- `MAILTRAP_TEMPLATE_UUID_RESET_PASSWORD=''`
- `MAILTRAP_TEMPLATE_UUID_VERIFY_EMAIL=''`

### Utils
- `COMPANY_NAME=''`
- `COMPANY_INFO_EMAIL=''`
- `COMPANY_SUPPORT_EMAIL=''`
- `COMPANY_CONTACT_EMAIL=''`

Make sure to install the dependencies:

```bash
npm install
```

## Setup Prisma

After installing the dependencies, you need to set up Prisma. First, run the migration command and specify a name for the migration. You can use `"init"` as the name:

```bash
npx prisma migrate dev --name init
```

Next, generate the Prisma client:

```bash
npx prisma generate
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```
