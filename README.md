# Splitflow - Modern Expense Management

Focus on the memories, not the math. SplitFlow is a high-fidelity, mobile-first web application designed to take the friction out of shared finances. Built with a focus on type safety, component reusability, and scalable architecture.

## The Mission

SplitFlow was built to solve the "awkward math" problem of group travel and shared living. Unlike clunky legacy spreadsheets, SplitFlow offers a streamlined, "SaaS-style" dashboard that provides instant clarity on net balances, group-specific debts, and recent activity.

---

## Tech Stack

| Technology      | Purpose     | Why?                                                           |
| --------------- | ----------- | -------------------------------------------------------------- |
| React 18        | UI Library  | Component-based architecture for maximum reusability.          |
| TypeScript      | Language    | Ensuring financial data integrity via strict type definitions. |
| Tailwind CSS    | Styling     | Rapid UI development with a "Utility-First" approach.          |
| React Router 6  | Routing     | Seamless SPA navigation with active-state handling.            |
| React Hook Form | Logic       | Performant, memoized form handling with built-in validation.   |
| Heroicons       | Iconography | Clean, consistent SVG-based visual language.                   |

---

### Features 

- **Intelligent Dashboard**: A high-level overview of total balance, amounts owed, and amounts owing.

- **Dynamic Group Grid**: Context-aware cards for different social circles (Trips, House, Events).

- **Precision Add Expense Flow**: A robust modal-driven entry system featuring:

    - Live validation on inputs.

    - Segmented controls for splitting logic (Equally, %, Exact).

    - Real-time balance calculations.

- **Mobile-First Design**: A fully responsive "App Shell" including a fixed desktop sidebar and a slide-out mobile drawer menu.

- **Recent Activity Feed**: A chronological audit trail of all financial changes.

---

### Architectural Decisions

- **Atomic Component Structure**: UI elements are broken down into "Prefabs" (like the <Card /> wrapper), ensuring that the design remains consistent as the app grows.

- **Centralized Constants**: Navigation links and configuration are stored in a single source of truth (src/constants/), making the app "Developer Scalable."

- **Type-Safe Routing**: Leveraged NavLink to provide intuitive user feedback on current location within the app.

---

- [] **Phase 2**: Real-time WebSockets via Supabase for instant expense notifications.

- [] **Phase 3**: Integration with Stripe Connect for "One-Tap Settlement."

- [] **Phase 4**: AI-Powered OCR for automatic receipt scanning and itemization.
