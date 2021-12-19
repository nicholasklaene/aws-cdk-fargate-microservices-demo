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

### Verify:

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

#### Create 
