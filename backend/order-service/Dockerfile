FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build
COPY . .
RUN mvn -q -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
ENV SERVER_PORT=8084
EXPOSE 8084
COPY --from=build /build/target/*.jar /app/app.jar
ENTRYPOINT ["java","-jar","/app/app.jar"]

