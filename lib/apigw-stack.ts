import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as apigw from "aws-cdk-lib/aws-apigatewayv2";
import { Construct } from 'constructs';

export class APIGWStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

    //  todo ...
    }
}