#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AlbStack } from '../lib/alb-stack';

const app = new cdk.App();

// Tạo ALB trên tài khoản AWS "Account A"
new AlbStack(app, 'sb01', {
  env: {
    account: '441162141182', // Tài khoản AWS A
    region: 'ap-southeast-1',
  },
  vpcId: 'vpc-086f0abacdf3c8317',
  subnetIds: ['subnet-0d09bbeabd305a6c1', 'subnet-020575be0572f40dc'],
});