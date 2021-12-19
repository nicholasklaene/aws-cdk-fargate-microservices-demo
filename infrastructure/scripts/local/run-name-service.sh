#!/bin/bash

# Set vars
export PORT=8082
export env=dev

# Run image
docker run --env PORT=$PORT --env env=$env --expose $PORT -p $PORT:$PORT aws-fargate-demo/name-service
