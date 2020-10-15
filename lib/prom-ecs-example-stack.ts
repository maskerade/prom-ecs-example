import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';
import { LogGroup, RetentionDays } from "@aws-cdk/aws-logs";
import * as iam from '@aws-cdk/aws-iam';

export class PromEcsExampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const timeStreamDbName = 'EcsMetrics'

    const cluster = new ecs.Cluster(this, 'Cluster', {
      defaultCloudMapNamespace: {
        name: 'services'
      }
    });

    const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'NodeService', {
      cluster,
      memoryLimitMiB: 512,
      cpu: 256,
      cloudMapOptions: {}, 
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset("./lib/src/"),
        environment: {
          PROMETHEUS: "true",
        }
      },
    });
    
    loadBalancedFargateService.targetGroup.configureHealthCheck({
      path: "/",
    });

    
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TeleGrafTaskDef');

    taskDefinition.addContainer('DefaultContainer', {
      image: ecs.ContainerImage.fromRegistry("maskerade/telegraf-prom-timestream:1.7"),
      memoryLimitMiB: 512,
      logging: ecs.LogDriver.awsLogs({
        logGroup: new LogGroup(this, "teleGraf", {
          logGroupName: "/telegraf-ecs/",
          retention: RetentionDays.TWO_WEEKS,
          removalPolicy: cdk.RemovalPolicy.DESTROY
        }),
        streamPrefix: "prom"
      }),
      environment: {
        TIMESTREAM_DB_NAME: timeStreamDbName

      }
    });

    taskDefinition.addToTaskRolePolicy(
      new iam.PolicyStatement({
        actions: [
          "ecs:*",
          "timestream:*"
        ],
        resources: ["*"],
      })
    );

    const ecsService = new ecs.FargateService(this, 'TeleGraf', {
      cluster,
      taskDefinition
    });
    
    // Create Timestrema DB - Raw as no CfnXxx class exists
    new cdk.CfnResource(this, 'MyTimeStreamDb', {
      type: 'AWS::Timestream::Database',
      properties: {
        DatabaseName: timeStreamDbName
      }
    });


  };
};