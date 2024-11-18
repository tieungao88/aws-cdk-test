#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { APIGWStack } from '../lib/apigw-stack';
import { ALBStack } from '../lib/alb-stack';

const env = app.node.tryGetContext(process.env.GIT_BRANCH);

const app = new cdk.App();
new TestStack(app, 'TestStack', {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  });
