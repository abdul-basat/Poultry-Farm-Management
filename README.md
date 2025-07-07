# Poultry Farm Management App

A modern, bilingual (English / Urdu) web application for managing day-to-day poultry-farm operations. Built with **React&nbsp;+&nbsp;TypeScript**, **Vite**, and **Tailwind CSS**.

# Project is live on:
[Poultry Farm Management](https://poultry-farm-management.netlify.app/)
## ✨ Features

- 📊 Dashboard with live statistics & charts
- 🐣 Chick arrivals, mortality logs, feed & medicine, sales – full CRUD
- 💸 Smart currency display (`PKR` / `روپے`)
- 🧾 One-click PDF reports (with embedded Urdu font)
- 🌗 Light / Dark theme toggle
- 🔄 RTL layout when Urdu is selected
- 📱 Responsive design – works on mobile, tablet and desktop

---

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone <repo-url>
cd poultry-farm-management-app

# 2. Install dependencies
npm install   # or yarn

# 3. Start the dev server
npm run dev
# Vite will print a local URL (http://localhost:5173 by default)
```

### Production build

```bash
npm run build   # Generates an optimized build in /dist
npm run preview # Serves the production build locally
```

> **Node 14+** is recommended. Tested with Node 18 & npm 9.

---

## 📂 Project Structure

```
├─ src/
│  ├─ components/     # React components (Dashboard, Layout, …)
│  ├─ contexts/       # Global React Contexts (Language, Data, Theme)
│  ├─ assets/         # Fonts & static assets
│  ├─ types/          # Shared TypeScript types
│  ├─ index.css       # Tailwind directives & custom utilities
│  └─ main.tsx        # App entry
├─ tailwind.config.js # Tailwind configuration (custom colors, dark mode)
└─ postcss.config.js  # PostCSS / Tailwind plugin setup
```

---

## 🔧 Tech Stack

| Category      | Stack                                    |
| ------------- | ---------------------------------------- |
| Front-end     | React 18, React Router v6, TypeScript    |
| Tooling       | Vite 7, ESLint, Prettier                 |
| Styling       | Tailwind CSS, React Icons                |
| Charts        | Recharts                                |
| PDF export    | jsPDF, jspdf-autotable                   |

---

## 🌐 Internationalisation

- Language toggles between **English (LTR)** and **Urdu (RTL)**.
- All strings are stored in `src/contexts/LanguageContext.tsx`.
- Add new languages by extending the `translations` object and updating the `Language` union type.

---

## 🌓 Theming

Dark mode is powered by Tailwind's [`dark` variant](https://tailwindcss.com/docs/dark-mode). A `ThemeContext` adds / removes the `dark` class on `<html>` and persists the choice in `localStorage`.

---

## 📜 License

This project is released under the **MIT License** – see `LICENSE` for details. 
