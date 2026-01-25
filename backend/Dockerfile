FROM openjdk:17-jdk-slim AS backend-builder

WORKDIR /app
COPY backend/pom.xml backend/
COPY backend/src backend/src

RUN ./mvnw package -DskipTests

FROM openjdk:17-jre-slim

WORKDIR /app
COPY --from=backend-builder /app/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]