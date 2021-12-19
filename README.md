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

## Instructions
### Build

#### Build docker images:

Navigate to `/infrastructure/scripts`

Run: `bash build-images.sh`

#### Verify

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

### Deploy

#### Create ECR Repository on AWS for Images

Run: `aws ecr create-repository --repository-name aws-fargate-demo`

#### Push name-service Image to AWS Repository

Navigate to `/infrastructure/scripts`

Run: `bash ecr-deploy-sh`

Enter your AWS Credentials and the name of the ECR repository you created

When prompted for image id, copy the image ID of the repository with name `aws-fargate-demo/name-service`

When prompted for image name, 

