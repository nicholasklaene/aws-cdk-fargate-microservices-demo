#!/bin/bash

# Package Spring Boot applications
cd ../../hello-world-service
mvn clean install
cd ../name-service
mvn clean install
cd ../infrastructure/scripts

# Build docker images 
cd ../../hello-world-service/
docker build -t aws-fargate-demo/hello-world-service .
cd ../name-service
docker build -t aws-fargate-demo/name-service .
cd ../infrastructure/scripts
