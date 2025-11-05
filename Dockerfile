# ----------------------
# 1. Frontend build
# ----------------------
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ----------------------
# 2. Backend build
# ----------------------
FROM maven:3.9.11-eclipse-temurin-21 AS backend-build
WORKDIR /app
COPY backend/pom.xml ./
RUN mvn dependency:go-offline

# Másoljuk be a React buildet a backend static mappájába,
# mielőtt a jar elkészül (így bekerül a classpath-ba)
COPY --from=frontend-build /frontend/build ./src/main/resources/static

# Backend források másolása
COPY backend/src ./src

# Jar build
RUN mvn clean package -DskipTests

# ----------------------
# 3. Run stage
# ----------------------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Backend fat JAR
COPY --from=backend-build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
