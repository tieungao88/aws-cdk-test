import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as elb from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { Construct } from 'constructs';

export class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // todo
    // Lay thong tin bien moi truong
    const branch = process.env.BRANCH_NAME || "dev"; // Lấy branch từ biến môi trường
    const envConfig = this.node.tryGetContext("environments")[branch];

    if (!envConfig) {
      throw new Error(`Environment configuration for branch "${branch}" not found`);
    }
    const vpcId = envConfig.vpcId;
    const subnetIds = envConfig.subnetIds;

    const vpc = ec2.Vpc.fromLookup(this, "ExistingVpc", { vpcId });

    const subnets = subnetIds.map((subnetId: string, index: number) =>
      ec2.Subnet.fromSubnetId(this, `Subnet${index + 1}`, subnetId)
    );
  }
}
