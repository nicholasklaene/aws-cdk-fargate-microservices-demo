import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";

import { stackBaseName, helloWorldPort, namePort } from "./config";

export class AwsFargateDemoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    /*
      BEGIN VPC
    */
    const vpc = new ec2.Vpc(this, `${stackBaseName}-vpc`, {
      maxAzs: 3,
    });
    /*
      END VPC
    */

    /*
      BEGIN ECS CLUSTER
    */
    const cluster = new ecs.Cluster(this, `${stackBaseName}-fargate-cluster`, {
      vpc,
    });
    /*
      END ECS CLUSTER
    */

    /*
      BEGIN ECR REPO
    */
    const demoFargateAppRepo = ecr.Repository.fromRepositoryName(
      this,
      `${stackBaseName}-aws-fargate-demo-repo`,
      "aws-fargate-demo"
    );
    /*
      END ECR REPO
    */

    /*
      BEGIN ECS TASK ROLE
    */
    const taskRole = new iam.Role(this, `${stackBaseName}-task-role`, {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
    });

    taskRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AmazonECSTaskExecutionRolePolicy"
      )
    );
    /*
      END ECS TASK ROLE
    */

    /*
      BEGIN HELLO WORLD SERVICE ECS TASK DEFINITION
    */
    const helloWorldTaskDefinition = new ecs.FargateTaskDefinition(
      this,
      `${stackBaseName}-task-definition`,
      {
        memoryLimitMiB: 512,
        cpu: 256,
        taskRole,
      }
    );
    /*
      END HELLO WORLD SERVICE ECS TASK DEFINITION
    */

    /*
      BEGIN HELLO WORLD SERVICE ECS CONTAINER
    */
    const helloWorldServiceContainer = helloWorldTaskDefinition.addContainer(
      `${stackBaseName}-hello-world-service-container`,
      {
        image: ecs.ContainerImage.fromEcrRepository(
          demoFargateAppRepo,
          "hello-world-service"
        ),
      }
    );
    /*
      END HELLO WORLD SERVICE ECS CONTAINER
    */

    /*
      BEGIN HELLO WORLD SERVICE PORT MAPPINGS
    */
    helloWorldServiceContainer.addPortMappings({
      containerPort: helloWorldPort,
    });
    /*
      END HELLO WORLD SERVICE PORT MAPPINGS
    */

    /*
      BEGIN HELLO WORLD SERVICE SECURITY GROUP
    */
    const helloWorldServiceSecurityGroup = new ec2.SecurityGroup(
      this,
      `${stackBaseName}-hello-world-service-security-group`,
      {
        allowAllOutbound: true,
        securityGroupName: `${stackBaseName}-hello-world-service-security-group`,
        vpc,
      }
    );

    /*
      END HELLO WORLD SERVICE SECURITY GROUP
    */

    /*
      BEGIN HELLO WORLD SERVICE FARGATE SERVICE
    */
    const helloWorldService = new ecs.FargateService(
      this,
      `${stackBaseName}-hello-world-service`,
      {
        cluster,
        taskDefinition: helloWorldTaskDefinition,
        assignPublicIp: true,
        desiredCount: 1,
        securityGroups: [helloWorldServiceSecurityGroup],
      }
    );
    /*
      END HELLO WORLD SERVICE FARGATE SERVICE
    */

    /*
      BEGIN NAME SERVICE ECS TASK DEFINITION
    */
    const nameTaskDefinition = new ecs.FargateTaskDefinition(
      this,
      `${stackBaseName}-name-task-definition`,
      {
        memoryLimitMiB: 512,
        cpu: 256,
        taskRole,
      }
    );
    /*
      END NAME SERVICE ECS TASK DEFINITION
    */

    /*
      BEGIN NAME SERVICE ECS CONTAINER
    */
    const nameServiceContainer = nameTaskDefinition.addContainer(
      `${stackBaseName}-name-service-container`,
      {
        image: ecs.ContainerImage.fromEcrRepository(
          demoFargateAppRepo,
          "name-service"
        ),
      }
    );
    /*
      END NAME SERVICE ECS CONTAINER
    */

    /*
      BEGIN NAME SERVICE CONTAINER PORT MAPPINGS
    */
    nameServiceContainer.addPortMappings({
      containerPort: namePort,
    });
    /*
      END NAME SERVICE CONTAINER PORT MAPPINGS
    */

    /*
      BEGIN NAME SERVICE SECURITY GROUP
    */
    const nameServiceSecurityGroup = new ec2.SecurityGroup(
      this,
      `${stackBaseName}-name-service-security-group`,
      {
        allowAllOutbound: true,
        securityGroupName: `${stackBaseName}-name-service-security-group`,
        vpc,
      }
    );

    /*
      END NAME SERVICE SECURITY GROUP
    */

    /*
      BEGIN NAME SERVICE FARGATE SERVICE
    */
    const nameService = new ecs.FargateService(
      this,
      `${stackBaseName}-name-service`,
      {
        cluster,
        taskDefinition: nameTaskDefinition,
        assignPublicIp: false,
        desiredCount: 1,
        securityGroups: [nameServiceSecurityGroup],
      }
    );
    /*
      END NAME SERVICE FARGATE SERVICE
    */

    /*
      BEGIN AUTOSCALING CONFIGURATION
    */
    helloWorldService.autoScaleTaskCount({
      minCapacity: 0,
      maxCapacity: 2,
    });

    nameService.autoScaleTaskCount({
      minCapacity: 0,
      maxCapacity: 2,
    });
    /*
      END AUTOSCALING CONFIGURATION
    */

    /*
      BEGIN APPLICATION LOAD BALANCER (ALB) CONFIGURATION
    */
    const httpApiALB = new elbv2.ApplicationLoadBalancer(
      this,
      `${stackBaseName}-internal-elbv2`,
      {
        vpc,
        internetFacing: true,
      }
    );

    const httpApiListener = httpApiALB.addListener(
      `${stackBaseName}-http-api-listener`,
      {
        port: 80,
        defaultAction: elbv2.ListenerAction.fixedResponse(404),
      }
    );
    /*
      END APPLICATION LOAD BALANCER (ALB) CONFIGURATION
    */

    /*
      BEGIN APPLICATION LOAD BALANCER (ALB) TARGET GROUP CONFIGURATION
    */
    const helloWorldServiceTargetGroup = httpApiListener.addTargets(
      `${stackBaseName}-hello-world-target-group`,
      {
        port: 80,
        priority: 1,
        healthCheck: {
          path: "/hello/internal/health",
          interval: cdk.Duration.seconds(30),
          timeout: cdk.Duration.seconds(3),
        },
        targets: [helloWorldService],
        // @ts-ignore
        pathPattern: "/hello*",
      }
    );

    const nameServiceTargetGroup = httpApiListener.addTargets(
      `${stackBaseName}-name-target-group`,
      {
        port: 80,
        priority: 2,
        healthCheck: {
          path: "/name/internal/health",
          interval: cdk.Duration.seconds(30),
          timeout: cdk.Duration.seconds(3),
        },
        targets: [nameService],
        // @ts-ignore
        pathPattern: "/name*",
      }
    );

    helloWorldServiceSecurityGroup.connections.allowFrom(
      httpApiALB,
      ec2.Port.tcp(80)
    );

    nameServiceSecurityGroup.connections.allowFrom(
      httpApiALB,
      ec2.Port.tcp(80)
    );
    /*
      END APPLICATION LOAD BALANCER (ALB) TARGET GROUP CONFIGURATION
    */

    /*
      BEGIN HELLO WORLD SERVICE ENVIRONMENT VARIABLES
    */
    helloWorldServiceContainer.addEnvironment(
      "PORT",
      helloWorldPort.toString()
    );

    helloWorldServiceContainer.addEnvironment("env", "prod");

    // TODO: explain - may not even need service discovery now!
    helloWorldServiceContainer.addEnvironment(
      "LOAD_BALANCER_DNS",
      httpApiALB.loadBalancerDnsName
    );
    /*
      END HELLO WORLD SERVICE ENVIRONMENT VARIABLES
    */

    /*
      BEGIN NAME SERVICE ENVIRONMENT VARIABLES
    */
    nameServiceContainer.addEnvironment("PORT", namePort.toString());

    nameServiceContainer.addEnvironment("env", "prod");
    /*
      END NAME SERVICE ENVIRONMENT VARIABLES
    */
  }
}
