# AWS Timestream - CDK TypeScript project!

This is a project to demo using AWS Timestream with Telegraf to populate the DB with Prometheus metrics data.

Creates the following resources

* VPC
* ECS Cluster (with CloudMap namespace)
* Application Load Balanced Fargate Service - running a simple NodeJS App
* Fargate Service - running custom Telegraf Agent container to scrape prometheus metrics
* AWS Timestream DB 


The `cdk.json` file tells the CDK Toolkit how to execute the app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
