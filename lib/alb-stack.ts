import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

// Định nghĩa kiểu props mở rộng từ StackProps
interface AlbStackProps extends cdk.StackProps {
  vpcId: string;
  subnetIds: string[];
}

export class AlbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AlbStackProps) {
    super(scope, id, props);

    // Lấy VPC từ ID
    const vpc = ec2.Vpc.fromVpcAttributes(this, 'VPC', {
      vpcId: props.vpcId,
      availabilityZones: cdk.Fn.getAzs(), // Tự động lấy danh sách Availability Zones
    });
    console.log(vpc)

    // Lấy các subnet từ danh sách ID
    const subnets = props.subnetIds.map((subnetId, index) =>
      ec2.Subnet.fromSubnetId(this, `Subnet${index}`, subnetId),
    );

    // Tạo Application Load Balancer
    new elbv2.ApplicationLoadBalancer(this, 'ALB', {
      vpc,
      internetFacing: false,
      vpcSubnets: { subnets }, // Cung cấp danh sách subnet
    });
  }
}