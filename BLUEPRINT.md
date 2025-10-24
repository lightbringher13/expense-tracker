# Expense Tracker Application Blueprint

## 1. Product Vision: Clarity on Your Cash Flow

Our expense tracker will be an intelligent financial companion that helps users effortlessly understand where their money is going, identify trends, and achieve their financial goals. The core values are **Simplicity, Insight, and Security.**

---

## 2. Core Features & User Experience

Features are grouped into tiers, representing the development priority.

### Tier 1: The Foundation (Effortless Data Capture)

These are the non-negotiable, core features.

-   **Multi-Account Tracking:** Users can add multiple accounts (e.g., "Personal Checking," "Credit Card," "Cash") to accurately track where money is coming from and going to.
-   **Flexible Expense/Income Logging:**
    -   Log expenses and incomes with amount, date, category, account, and a notes field.
    -   **Recurring Transactions:** Users can set up recurring expenses/incomes (e.g., "Rent" every month, "Salary" every two weeks). The system will automatically create these transactions on the correct date.
-   **Smart Categorization:**
    -   Users can create and manage their own custom categories with names and icons.
    -   The system will have a set of smart default categories upon sign-up.
-   **Secure & Simple Authentication:** A "magic link" passwordless login system.

### Tier 2: The "Aha!" Moment (Insight & Analysis)

These features provide real value beyond simple tracking.

-   **Interactive Dashboard:** A powerful, visual dashboard showing:
    -   Current month's income vs. expenses.
    -   A pie chart of spending by category.
    -   A line chart showing cash flow over the last 6 months.
    -   A list of recent transactions.
-   **Powerful Reporting & Filtering:** A dedicated "Reports" page where users can:
    -   View spending trends over any custom date range.
    -   Filter transactions by category, account, or date range.
    -   See a detailed breakdown of spending for a specific category over time.
-   **Budgeting & Goals:**
    -   Users can set a monthly budget for specific categories (e.g., "$200/month for Groceries").
    -   The dashboard will show a progress bar indicating how much of the budget has been spent.
    -   The system will send an alert when a user is approaching their budget limit.

### Tier 3: The "Wow" Factor (Intelligent & Proactive Features)

These are the advanced features that will make our application stand out.

-   **Receipt Scanning (OCR):**
    -   Users can take a picture of a receipt.
    -   The system will use Optical Character Recognition (OCR) to automatically parse the vendor, date, and total amount, creating a draft expense.
-   **Smart Alerts & Insights:**
    -   The system will proactively send notifications (email or push) for budget warnings, large transactions, or upcoming recurring payments.
-   **Tagging & Search:**
    -   Users can add free-form tags to transactions (e.g., `#vacation2025`).
    -   A powerful, global search bar to instantly find any transaction.

---

## 3. Microservice Architecture

To support these features, the system will be composed of the following independent microservices, each following **Hexagonal Architecture**.

1.  **`auth-service`**
    -   **Responsibilities:** Manages user profiles, handles magic link authentication, issues and refreshes JWTs. The single source of truth for user identity.

2.  **`transaction-service`**
    -   **Responsibilities:** The core of the application. Manages all CRUD operations for expenses, incomes, and user accounts (e.g., checking, credit card). Manages the creation of recurring transactions.

3.  **`category-service`**
    -   **Responsibilities:** Manages CRUD for user-defined expense and income categories.

4.  **`reporting-service`**
    -   **Responsibilities:** A highly optimized, read-focused service. It listens for events from the `transaction-service` (via Kafka) and pre-calculates all the data needed for the dashboard and reports. This service will be built using the **CQRS** pattern.

5.  **`budget-service`**
    -   **Responsibilities:** Manages user-defined budgets. Listens for transaction events to check if budgets have been exceeded and, if so, sends a request to the `notification-service`.

6.  **`notification-service`**
    -   **Responsibilities:** A central service for sending all user communications (e.g., magic link emails, budget alerts). It receives requests from other services to send notifications.

7.  **`receipt-parser-service`**
    -   **Responsibilities:** A specialized service that exposes one endpoint to accept an image. It uses an OCR library or cloud service to parse the image and returns structured data (vendor, date, total).

---

## 4. Technology Stack

-   **Backend:** Java 17+, Spring Boot, Spring Cloud
-   **Frontend:** React (with Vite), Tailwind CSS
-   **Database:** PostgreSQL (a separate database per service)
-   **Caching:** Redis
-   **Asynchronous Communication:** Apache Kafka
-   **Containerization & Orchestration:** Docker, Kubernetes
-   **CI/CD:** GitHub Actions
-   **Infrastructure as Code:** Terraform
-   **Observability:** ELK Stack (Logging), Prometheus & Grafana (Metrics), Jaeger (Tracing)
-   **Security:** HashiCorp Vault (Secrets), Traefik (Reverse Proxy)
