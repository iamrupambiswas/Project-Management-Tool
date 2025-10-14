# Step 1: Build the JAR using Maven
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the application JAR (skipping tests for faster builds)
RUN mvn clean package -DskipTests

# Step 2: Run the application using a lightweight JDK image
FROM openjdk:21-slim
WORKDIR /app
COPY --from=builder /app/target/project-management-backend.jar project-management-backend.jar

# Expose port 8080
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "/app/project-management-backend.jar"]