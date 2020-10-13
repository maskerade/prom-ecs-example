#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { PromEcsExampleStack } from '../lib/prom-ecs-example-stack';

const app = new cdk.App();
new PromEcsExampleStack(app, 'PromEcsExampleStack');
