FROM openjdk:17
MAINTAINER cerone.com
COPY build/libs/FallingType.war FallingType.war
ENTRYPOINT ["java","-jar","/FallingType.war"]