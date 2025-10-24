# Stage 1: Build the application with Maven
# This stage uses a full Maven and Java image to build the executable .jar file.
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
# Copy all the source code
COPY . .
# Run the Maven build command to create the package. -DskipTests skips running tests during this build.
RUN mvn clean install -DskipTests

# Stage 2: Create the final, lightweight image
# This stage uses a slim Java runtime, which is much smaller than the build environment.
FROM openjdk:17-jdk-slim
WORKDIR /app
# Copy the built .jar file from the 'build' stage into the final image.
# The jar file is located in the 'web' module's target directory.
COPY --from=build /app/web/target/*.jar app.jar
# Expose port 8080, the default port for Spring Boot applications.
EXPOSE 8080
# The command to run the application when the container starts.
ENTRYPOINT ["java","-jar","app.jar"]
