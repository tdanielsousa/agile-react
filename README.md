# Agile React

## Summary
Agile React is a modern, serverless project management application designed for tracking tasks, workflows, and productivity metrics in real time.   
It is built on an edge-first architecture, delivering low-latency interactions and scalable performance without relying on traditional backend servers.

The application features a clean, glassmorphism-inspired interface with both Kanban and List views, integrated analytics, and a modular component system optimized for performance and maintainability.

---

## Introduction
This application was developed as part of a 25-hour project and represents my first hands-on experience with both React and full-stack development.  
Despite the limited timeframe, I designed and implemented a complete end-to-end solution, including the frontend interface, serverless API layer, and database integration.

The project provided practical insight into component-based architecture, demonstrating how complex interfaces can be decomposed into reusable, maintainable components, as well as how data flows through a modern web application.  
It also introduced me to structuring API interactions and managing application state without relying on heavy global state libraries.

During development, I encountered several technical challenges.   
The project was initially built and deployed using Vercel, however, due to platform constraints, I made the decision to migrate to a different infrastructure.  
While these limitations could have been worked around, doing so would have introduced unnecessary complexity and reduced clarity within the API layer.   
Prioritizing maintainability and architectural simplicity, I transitioned to a more suitable platform, resulting in a cleaner and more scalable solution.

This project reflects not only my introduction to modern full-stack development, React and CI/CD but also my ability to evaluate trade-offs and make pragmatic engineering decisions under time constraints.


---

##  Tech Stack & Architecture

| Layer             | Technology                 | Rationale                                                                                  |
| :---------------- | :------------------------- | :----------------------------------------------------------------------------------------- |
| **Frontend**      | React + Vite               | Fast builds, efficient hot module replacement, and modern component-driven UI architecture |
| **Styling**       | Native CSS  | Lightweight, no runtime overhead, scalable theming system                                  |
| **Hosting & CDN** | Cloudflare Pages           | Global edge delivery of static assets with zero server maintenance                         |
| **Backend API**   | Cloudflare Functions       | Serverless API endpoints running on the edge with minimal cold start latency               |
| **Database**      | Turso (libSQL)             | Distributed SQLite-based database with globally replicated nodes for low-latency queries   |
| **CI/CD**      | GitHub Actions          | Frontend and backend deploy together automatically on every push   |

---

##  Architectural Overview

### Edge-First Serverless Model

All backend logic is implemented as isolated serverless functions deployed via Cloudflare’s edge runtime.  
Each endpoint is responsible for a single concern (e.g., authentication, task operations, project management), improving scalability and maintainability.

Database queries are executed against Turso’s distributed replicas, ensuring that data access occurs geographically close to the user for optimal performance.

---

### Component Architecture (Container / Presentational Pattern)

The application follows a separation-of-concerns approach:

* **Container Components (Logic Layer)**
  Encapsulate state management, side effects, and API communication using React hooks.

* **Presentational Components (UI Layer)**
  Receive data and callbacks via props, remaining stateless and highly reusable.

This approach avoids the overhead of global state libraries while maintaining clarity and testability.

---

## Security Considerations

* Sensitive credentials (e.g., database tokens) are **never exposed to the client**
* All secure operations are executed within serverless functions
* Session handling is implemented via token-based validation at the API layer

---

## Local Development

### Prerequisites

* Node.js
* Turso database instance
* Wrangler CLI

---

### Setup

```bash
git clone https://github.com/tdanielsousa/agile-react.git
cd agile-react
npm install
```

---

### Environment Configuration

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8788
```

> Note: Database credentials should be configured in Cloudflare environment bindings, not in Vite-exposed variables.

---

### Run Development Environment

```bash
npm run dev
```

---

## Production Deployment

Deployment is fully automated via GitHub integration with Cloudflare Pages:

* **Build Step:**
  `npm run build`

* **Deployment Step:**

  * Static files served via Cloudflare CDN
  * `/functions` directory deployed as serverless endpoints

---

## Key Design Principles

* **Performance-first:** Minimal client bundle and edge-executed APIs
* **Serverless by design:** No dedicated backend infrastructure
* **Modular architecture:** Clear separation between logic and presentation
* **Scalable data layer:** Distributed SQL with low-latency access
* **Maintainability:** Simple, predictable component patterns

---





