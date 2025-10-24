# 1) Build stage: Maven + JDK 17
FROM maven:3-openjdk-17 AS builder
WORKDIR /app

# Copy only the pom and preload dependencies (cache layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the rest of the code & build
COPY src ./src
RUN mvn clean package -DskipTests -B

# 2) Runtime stage: lean OpenJDK 17
FROM openjdk:17-slim AS runtime
WORKDIR /app

# Copy the fat jar from builder
COPY --from=builder /app/target/*.jar ./gateway.jar

# Documented port—and make sure it matches your spring.port
EXPOSE 8081

# Finally, run it
ENTRYPOINT ["java","-jar","gateway.jar"]