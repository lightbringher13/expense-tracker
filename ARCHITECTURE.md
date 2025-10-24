# Architecture Decision Record (ADR) for Expense Tracker

This document outlines the architectural decisions and technical roadmap for the Expense Tracker project. It serves as the single source of truth for development, ensuring consistency and alignment with the project's long-term goals.

## 1. Core Strategy: Monolith to Microservices

The project is being migrated from a monolithic architecture to a modern microservices-based system. The primary strategy for this migration is the **Strangler Fig Pattern**, where new microservices will be incrementally built and traffic will be routed to them, gradually "strangling" the old monolith until it is fully decomposed.

## 2. Repository and Branching Strategy

-   **Repository Model:** **Monorepo**. All services, including frontend and backend, will reside in a single Git repository. This enables atomic commits, simplified dependency management, and greater code visibility.
-   **Branching Model:** **GitHub Flow**.
    -   The `main` branch is the single source of truth and must always be in a deployable state.
    -   All work is done on short-lived feature branches (e.g., `feature/add-category-service`).
    -   Changes are merged into `main` via Pull Requests (PRs) that require code review and passing automated checks (CI).
    -   Merges to `main` should trigger automated deployments (CD).

## 3. High-Level System Architecture

The system is composed of several independent services communicating over the network, orchestrated by a set of core infrastructure services.

-   **API Gateway (`gateway`):** A single entry point for all client requests (from the frontend). It handles routing, authentication, and rate limiting. Built with Spring Cloud Gateway.
-   **Service Registry (`service-registry`):** Allows services to dynamically discover each other. Built with Netflix Eureka.
-   **Configuration Server (`config-server`):** Centralizes configuration for all microservices. Backed by a separate Git repository. Built with Spring Cloud Config.
-   **Reverse Proxy (`traefik`):** The public-facing entry point that handles SSL/TLS termination and routes external traffic to the API Gateway.

## 4. Individual Microservice Architecture

All microservices will be built using the **Hexagonal Architecture** (also known as Ports and Adapters or Clean Architecture).

-   **Core Principle:** The business logic (Domain and Application layers) is kept pure and isolated from external technologies (like frameworks, databases, or UI).
-   **Dependency Rule:** Dependencies must always point inwards, towards the core logic.
-   **Structure:**
    -   **`domain`:** Contains the core business models (pure Java objects).
    -   **`application`:** Contains the use cases and ports (interfaces) for driving (input) and driven (output) operations.
    -   **`adapter`:** Contains the concrete implementations of the ports (e.g., REST controllers, database repositories, Kafka publishers).

## 5. Advanced Design Patterns

-   **CQRS (Command Query Responsibility Segregation):** This pattern will be applied on a per-service basis where read and write models have significantly different requirements.
    -   **Initial Use Case:** The `reporting-service` is a prime candidate for CQRS to provide fast, denormalized reads for the UI without compromising write-side consistency.
    -   **Non-Use Case:** Simple CRUD services like `category-service` will not use CQRS to avoid over-engineering.
-   **Asynchronous Communication (Apache Kafka):** For decoupling services and building resilient, event-driven workflows.
    -   **Example:** When an expense is created, the `expense-service` will publish an `expense_created` event to a Kafka topic. The `reporting-service` or a `notification-service` can then consume this event asynchronously.

## 6. Technology Stack

-   **Backend:** Java 17+, Spring Boot, Spring Cloud
-   **Frontend:** React (with Vite)
-   **Database:** PostgreSQL (per-service databases)
-   **Caching:** Redis
-   **Messaging:** Apache Kafka
-   **Containerization:** Docker
-   **Orchestration:** Kubernetes (for production), Docker Compose (for local development)
-   **CI/CD:** GitHub Actions
-   **Observability:**
    -   **Logging:** ELK Stack (Elasticsearch, Logstash, Kibana)
    -   **Metrics:** Prometheus & Grafana
    -   **Tracing:** Jaeger or Zipkin
-   **Infrastructure as Code:** Terraform

## 7. Phased Build Plan

The project will be built incrementally to ensure a stable foundation.

1.  **Phase 0: The Skeleton:** Build the basic plumbing (`frontend` -> `gateway` -> `backend`) to prove end-to-end connectivity.
2.  **Phase 1: Core Infrastructure:** Set up and integrate the `Service Registry` and `Config Server`.
3.  **Phase 2: First Business Service:** Extract the `category-service` as the first fully-functioning microservice with its own database.
4.  **Phase 3 & Beyond:** Iteratively extract other services (`expense-service`, `auth-service`, etc.), set up CI/CD pipelines, and layer in observability tools.

This document should be updated as new architectural decisions are made.
