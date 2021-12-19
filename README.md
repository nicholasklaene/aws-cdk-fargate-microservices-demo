# aws-cdk-fargate-microservices-demo

## Requirements
- Java 11
- TypeScript
- Maven
- NPM
- Docker
- AWS CLI
- AWS CDK
- Git Bash or WSL if using Windows

## Build

### Build docker images:

Navigate to `/infrastructure/scripts`

Run: `bash build-images.sh`

<br/>

## Verify Build

Open two new terminals:

Navigate to `/infrastructure/scripts/local`

Run: 

`bash run-name-service.sh`

`bash run-hello-world-service.sh`

<br/>
Open:
`http://localhost:8081/hello/nick`

You should see a JSON response with the following format:

`{"hello":"nick Clinton"}`

<br/>

## Deploy

### Create ECR Repository on AWS for Images

Run: `aws ecr create-repository --repository-name aws-fargate-demo`

<br/>

### Push Images to AWS ECR Repository

Navigate to `/infrastructure/scripts`

Run: `bash ecr-deploy-sh`

- Enter your AWS Credentials and the name of the ECR repository you created
- When prompted for image id, copy the image ID of the repository with name `aws-fargate-demo/name-service`
- When prompted for image name, type `name-service`
- Reply `y` when asked if you want to delete previous images if you would like to avoid extra costs, `n` otherwise
- Repeat for `hello-world-service`
<br/>

### Create AWS Infrastructure

Navigate to `/infrastructure`

Install dependencies: `npm install`

Deploy infrastructure: `cdk deploy`

<br/>

## Cleanup

### Delete ECR Repository and Images

`aws ecr delete-repository --repository-name aws-fargate-demo --force`

### Delete infrastructure

`cdk destroy`
