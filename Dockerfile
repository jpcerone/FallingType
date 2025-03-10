FROM eclipse-temurin:17-jdk-jammy
EXPOSE 8080
COPY build/libs/FallingType.war FallingType.war
ENTRYPOINT ["java","-jar","/FallingType.war"]