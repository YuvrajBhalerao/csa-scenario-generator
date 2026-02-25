# ⚡ ServiceNow CSA PDI Generator

![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Gemini AI](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google-gemini)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

An AI-powered, full-stack web application designed to generate infinite, real-world Personal Developer Instance (PDI) challenges for the ServiceNow Certified System Administrator (CSA) exam. 

Built with a high-performance Python backend and a premium "Aurora Glassmorphism" frontend, this tool bridges the gap between theoretical studying and practical muscle memory.

## 🚀 Features

* **Dynamic AI Generation:** Integrates with Google's Gemini 2.5 Flash LLM to dynamically generate unique business problems every single time. No hardcoded questions.
* **Exam-Mapped Modules:** Scenarios are strictly categorized by official CSA blueprint modules (e.g., Data Schema & Tables, Lists, Filters & Forms).
* **Smart UI/UX:** Features a custom asynchronous Typewriter effect for AI responses, complete with real-time Markdown-to-HTML parsing.
* **Guided Step-by-Step Solutions:** Expandable accordions provide hints, pro-tips, and precise guided steps without cluttering the initial challenge view.
* **Premium Aesthetics:** Client-side rendering is wrapped in a high-fidelity, responsive UI featuring floating gradient orbs, frosted glass cards, and smooth-scroll navigation.

## 🛠️ Architecture & Tech Stack

**Backend (The Engine)**
* **Language:** Python
* **Framework:** FastAPI (High-performance, async-ready web framework)
* **Server:** Uvicorn
* **AI Integration:** Google Generative AI SDK (`google-generativeai`)

**Frontend (The Presentation)**
* **Structure/Style:** Vanilla HTML5 & CSS3
* **Logic:** Vanilla JavaScript (ES6+ with Async/Await)
* **Design System:** Custom CSS featuring CSS Grid, Flexbox, and backdrop-filter Glassmorphism.

**Deployment & DevOps**
* **Hosting:** Render (Cloud PaaS)
* **CI/CD:** Automated GitHub pipeline deployments
