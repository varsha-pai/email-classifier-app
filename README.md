This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

⚙️ Project Setup
Once the software is installed, you need to set up the project itself.

Clone the Repository: Open your terminal and run git clone <your-github-repo-url>.

Navigate into the Project: Run cd <your-project-folder-name>.

Install Dependencies: Run the command npm install to download all the necessary libraries (like Next.js, React, NextAuth, etc.).

 🔑 Environment Variables
The application requires secret keys to connect to Google and run securely.

In the root of your project, create a new file named .env.local.

Copy and paste the following template into that file, and fill in the values:

Code snippet

# Get these from your Google Cloud Console
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

# A random secret for NextAuth.js
# Generate one by running `openssl rand -base64 32` in your terminal
NEXTAUTH_SECRET=YOUR_GENERATED_SECRET

# The URL of your local development server
NEXTAUTH_URL=http://localhost:3000
To get the GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, you must set up a project in the Google Cloud Console, enable the Gmail API, and configure the OAuth consent screen with the correct redirect URI (http://localhost:3000/api/auth/callback/google).

After completing all these steps, you can finally run the application with npm run dev.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

---------------------------------------------------------------------------------------------------------------------------------------------------------------------

👤 User Flow & Onboarding
Secure Authentication: Users log into the application securely using their Google Account via OAuth.

Guided Setup: After logging in for the first time, users are directed to a dedicated page to enter and save their OpenAI API key.

Smart Navigation: On subsequent visits, the app remembers that the key has been saved and takes the user directly to the main dashboard after they log in.

----------------------------------------------------------------------------------------------------------------------------------------------------------------------

📧 Core Functionality
Variable Email Fetching: On the main dashboard, users can type in the number of emails they want to retrieve from their Gmail account.

Gmail API Integration: A "Fetch Emails" button calls a secure backend API that uses the user's credentials to fetch the latest emails directly from the Gmail API, including the sender, subject, and full body content.

AI-Powered Classification: A "Classify Emails" button sends the fetched emails to another backend API. This API uses LangChain.js to communicate with OpenAI's GPT-4o model, which classifies each email into categories like "Important," "Promotional," "Marketing," etc.

----------------------------------------------------------------------------------------------------------------------------------------------------------------------


💻 User Interface (UI)
Two-Pane Layout: The application features a responsive, master-detail layout.

Collapsible Detail Panel: The email list appears in the left pane. Clicking an email opens its full content in the right pane. Clicking the same email again collapses the detail panel, expanding the list to full width.

Dynamic Grouping: Before classification, emails are shown in a simple list. After classification, the list automatically regroups the emails under their respective category headings (Important, Promotional, etc.).

Styled Components: The UI is styled using Tailwind CSS, with custom components for email cards, detail views, and inputs.

----------------------------------------------------------------------------------------------------------------------------------------------------------------------

🛠️ Technology Stack
Framework: Next.js (A React framework for full-stack web applications).

Authentication: NextAuth.js for handling the entire Google OAuth 2.0 flow.

Styling: Tailwind CSS for a modern, utility-first design.

AI: LangChain.js to structure prompts and interact with the OpenAI API.

APIs: Google APIs (Gmail) for fetching data.

This creates a complete, functional application that meets all the requirements of the original assignment