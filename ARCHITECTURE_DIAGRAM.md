# Expense Tracker: System Architecture Diagrams

This document provides a visual representation and explanation of the data flow within the Expense Tracker application. It covers both synchronous user requests and asynchronous, event-driven internal processes.

---

## Scenario A: Synchronous API Request (e.g., Fetching Categories)

This diagram illustrates the path of a standard, user-initiated request that requires an immediate response.

```
=========================================================================================================================
|                                                    USER'S BROWSER                                                     |
=========================================================================================================================
       |
       | 1. HTTPS Request: GET yourexpenses.com/api/categories
       v
+-----------------------------------------------------------------------------------------------------------------------+
|                                       INTERNET / CLOUD PROVIDER EDGE (e.g., AWS)                                      |
|                                                                                                                       |
|      +--------------------------+                                                                                     |
|      |        TRAEFIK           |  <-- The Public Entry Point / Reverse Proxy. Handles SSL Termination.                |
|      |    (Ingress Controller)  |                                                                                     |
|      +--------------------------+                                                                                     |
|                 |                                                                                                     |
|                 | 2. HTTP Request: Forwards to the API Gateway                                                        |
|                 v                                                                                                     |
|      +--------------------------+      +---------------------------+      +----------------------------------------+  |
|      |       API GATEWAY        |----->|     EUREKA                |----->|         SPRING CLOUD CONFIG SERVER     |  |
|      | (Spring Cloud Gateway)   | 3.   |   (Service Registry)      | 3a.  | (Reads from a separate Git Repo)       |  |
|      +--------------------------+      +---------------------------+      +----------------------------------------+  |
|                 |                                                                                                     |
|                 | 4. Routes to the correct service after discovery                                                    |
|                 v                                                                                                     |
|      +--------------------------+                                                                                     |
|      |    category-service      |                                                                                     |
|      | (Hexagonal Architecture) |                                                                                     |
|      +--------------------------+                                                                                     |
|                 |                                                                                                     |
|                 | 5. Reads from its dedicated database                                                                |
|                 v                                                                                                     |
|      +--------------------------+                                                                                     |
|      |  Category DB (Postgres)  |                                                                                     |
|      +--------------------------+                                                                                     |
|                                                                                                                       |
+-----------------------------------------------------------------------------------------------------------------------+
```

### Explanation of the Synchronous Flow

1.  **User Action:** The user navigates to the "Categories" page in the React frontend. The browser sends a `GET` request to your public domain.
2.  **Traefik (The Front Door):** The request first hits **Traefik**. Traefik handles the secure `https` connection, decrypts the request, and sees that it's for `/api/categories`. Based on its rules, it knows that all `/api/**` traffic should be forwarded to the **API Gateway**.
3.  **API Gateway & Service Discovery:** The **API Gateway** receives the request. It checks its routing rules and sees that this path belongs to a service named `category-service`.
    -   **(3a. On Startup):** The Gateway (and all other services) has already registered itself with **Eureka** and pulled its configuration from the **Spring Cloud Config Server**.
    -   The Gateway now asks **Eureka**: "What is the current IP address and port for an instance of `category-service`?" Eureka provides the location.
4.  **Routing to Service:** The Gateway forwards the request to the specific instance of the **`category-service`**.
5.  **Database Interaction:** The `category-service` receives the request, its logic is executed, and it queries its own dedicated **PostgreSQL database** for the list of categories.
6.  **Response:** The data travels back up the exact same chain to the user's browser.

---

## Scenario B: Asynchronous, Event-Driven Flow (e.g., Creating an Expense)

This diagram shows how services communicate *internally* using an event bus (Kafka) to remain decoupled and resilient.

```
+-----------------------------------------------------------------------------------------------------------------------+
|                                       INTERNAL SERVICE COMMUNICATION (EVENT-DRIVEN)                                   |
|                                                                                                                       |
|      +--------------------------+                                                                                     |
|      |   transaction-service    |                                                                                     |
|      +--------------------------+                                                                                     |
|                 |                                                                                                     |
|                 | 1. Publishes an "expense_created" event                                                             |
|                 v                                                                                                     |
|      +----------------------------------------------------------------+                                               |
|      |                         APACHE KAFKA                           |  <-- The Central Nervous System / Event Bus   |
|      |                (Topic: "transactions")                         |                                               |
|      +----------------------------------------------------------------+                                               |
|                 |                                   |                                                               |
|                 | 2. Events are consumed by         | 2. Events are also consumed by                                |
|                 |    interested services            |    other interested services                                  |
|                 v                                   v                                                               |
|      +--------------------------+      +--------------------------+      +----------------------------------------+  |
|      |     reporting-service    |      |      budget-service      |      |  (Future services can subscribe easily)  |  |
|      +--------------------------+      +--------------------------+      +----------------------------------------+  |
|                 |                                   |                                                               |
|                 | 3. Updates its read models        | 3. Checks if budget is exceeded                               |
|                 v                                   v                                                               |
|      +--------------------------+      +--------------------------+                                                   |
|      |   Reporting DB (Optimized)|      |    notification-service  |                                                   |
|      +--------------------------+      +--------------------------+                                                   |
|                                                     |                                                               |
|                                                     | 4. Sends an email/alert                                       | 
|                                                     v                                                               |
|                                          (External Email Service)                                                     |
|                                                                                                                       |
+-----------------------------------------------------------------------------------------------------------------------+
```

### Explanation of the Asynchronous Flow

1.  **User Action:** A user creates a new expense. The request goes through Traefik and the Gateway to the **`transaction-service`**, which saves the new expense to its own database. Its primary job is now done.
2.  **Publish Event:** Immediately after saving, the `transaction-service` creates an `expense_created` event message (containing the details of the expense) and publishes it to a "transactions" topic in **Apache Kafka**. It does not know or care who is listening.
3.  **Consume Event (Parallel Processing):**
    -   The **`reporting-service`**, which is subscribed to the "transactions" topic, receives the event. It updates its own pre-calculated reporting tables (its CQRS read model) so that dashboards are instantly up-to-date.
    -   Simultaneously, the **`budget-service`** also receives the same event. It checks if this new expense has caused the user to exceed their monthly budget for that category.
4.  **Trigger Downstream Action:** If the budget is exceeded, the `budget-service` sends a direct, simple command to the **`notification-service`**: "Send a 'budget warning' email to user 123." The `notification-service` then handles the logic of formatting and sending the email.
