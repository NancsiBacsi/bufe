# ----------------------
# 1. Build stage
# ----------------------
FROM maven:3.9.11-eclipse-temurin-21 AS build
WORKDIR /app

# Maven cache-elés a függőségekhez
COPY pom.xml .
RUN mvn dependency:go-offline

# Forrás másolása és build
COPY src ./src
RUN mvn clean package -DskipTests

# ----------------------
# 2. Run stage
# ----------------------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Buildelt fat JAR másolása
COPY --from=build /app/target/*.jar app.jar

# Port beállítás
EXPOSE 8080

# Indítás
ENTRYPOINT ["java", "-jar", "app.jar"]
