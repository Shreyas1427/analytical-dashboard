# Analytical Dashboard

A modern, responsive analytical dashboard built with Next.js, React, Tailwind CSS, and shadcn/ui. This project provides interactive data visualizations, AI-powered insights, and a beautiful, production-ready UI.

---

## 🚀 Features

- **Interactive Charts**: Visualize key metrics like revenue, traffic, conversions, and users with dynamic charts.
- **AI Insights**: Get automated, AI-generated insights based on your data.
- **Date Range Picker**: Filter analytics by custom date ranges.
- **Theme Toggle**: Switch between light and dark modes.
- **Responsive Design**: Fully optimized for desktop and mobile devices.
- **Modern UI**: Built with shadcn/ui and Tailwind CSS for a clean, customizable look.

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Shreyas1427/analytical-dashboard.git
cd analytical-dashboard
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to view the dashboard.

### 4. Build for Production

```bash
npm run build
npm start
```

---

## 📦 Project Structure

- `app/` - Next.js app directory (pages, layout, global styles)
- `components/` - Reusable UI and dashboard components
- `lib/` - Utility functions and mock data
- `hooks/` - Custom React hooks
- `public/` - Static assets

---

## 🧠 AI Usage Report

### AI Tools Used

- **Primary tools:** OpenAI GPT-4 (via bolt.new, Cursor, and ChatGPT)
- **Key use cases:** 
  - Project scaffolding and initial setup
  - Generating React components and UI logic
  - Writing Tailwind CSS classes and responsive layouts
  - Creating data visualization logic and chart components
  - Drafting documentation and README content

### Sample Prompts

1. "Create a responsive React dashboard component with metric cards and a line chart using Tailwind CSS."
2. "Help me implement a date range picker and connect it to filter chart data in Next.js."
3. "Generate an AI Insights card that summarizes key changes in revenue, users, and conversions."
4. "Add real-time metric updates every 30 seconds with smooth transitions."


### AI vs Manual Work Split

- **AI-generated:** ~80%
  - Initial project outline and file structure (bolt.new)
  - Boilerplate code for Next.js, Tailwind, and shadcn/ui integration
  - Most UI components, chart logic, and utility functions
  - Drafting documentation and usage instructions
- **Manual:** ~20%
  - Customizing and refining AI-generated components
  - Debugging layout overflow issues with the Refresh and Theme toggle buttons
  - Connecting UserChart clicks to filter the DataTable.
  - Testing and performance optimization
- **Customization:** 
  - Adapted AI suggestions to match specific design requirements
  - Enhanced accessibility and responsiveness
  - Added unique features and polished the user experience

---

## ☁️ Deployment

The ADmyBRAND Insights dashboard is live and accessible via Vercel:

🔗 **Live Demo:** [https://analytical-dashboard-theta.vercel.app/](https://analytical-dashboard-theta.vercel.app/)

The deployment ensures fast performance, global scalability, and automatic optimizations provided by the Vercel platform. Users can experience the dashboard in real-time with all features including KPI metrics, interactive charts, date range filtering, dark/light theme toggle, and AI-driven insights.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [OpenAI](https://openai.com/)

---
