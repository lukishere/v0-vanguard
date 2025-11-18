# Architecture Overview

## Frontend (Next.js)
├── app/                    # App router pages and layouts
│   ├── api/               # API routes
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── faq/               # FAQ page
│   ├── news/              # News/Blog section
│   ├── privacy/           # Privacy policy
│   ├── services/          # Services pages
│   ├── terms/             # Terms of service
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
│
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── ai-feature-showcase.tsx
│   ├── chatbot.tsx
│   ├── client-review.tsx
│   ├── footer.tsx
│   ├── header.tsx
│   └── ... (other components)
│
├── contexts/             # React contexts
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and helpers
├── public/              # Static assets
└── styles/              # Global styles

## Backend (Firebase)
├── dataconnect/         # Firebase Data Connect
├── dataconnect-generated/ # Generated Data Connect files
├── firebase.json        # Firebase configuration
└── .firebaserc          # Firebase project settings

## Configuration
├── .eslintrc.json      # ESLint configuration
├── next.config.mjs     # Next.js configuration
├── package.json        # Dependencies and scripts
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── postcss.config.mjs  # PostCSS configuration 