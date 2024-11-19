import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

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
      availabilityZones: cdk.Fn.getAzs(),
    });

    // Lấy các subnet từ danh sách ID
    const subnets = props.subnetIds.map((subnetId, index) =>
      ec2.Subnet.fromSubnetId(this, `Subnet${index}`, subnetId),
    );

    // Tạo Security Group để bảo vệ ALB
    const albSecurityGroup = new ec2.SecurityGroup(this, 'AlbSecurityGroup', {
      vpc,
      description: 'Security group for ALB',
    });

    // Chỉ định các IP được phép truy cập vào ALB
    albSecurityGroup.addIngressRule(ec2.Peer.ipv4('203.0.113.0/24'), ec2.Port.tcp(80), 'Allow HTTP access');
    albSecurityGroup.addIngressRule(ec2.Peer.ipv4('203.0.113.0/24'), ec2.Port.tcp(443), 'Allow HTTPS access');

    // Tạo Application Load Balancer
    const alb = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
      vpc,
      internetFacing: true,
      securityGroup: albSecurityGroup,
      vpcSubnets: { subnets },
    });

    // // Thêm listener cho port 80 (HTTP) và redirect sang HTTPS
    // const httpListener = alb.addListener('HTTPListener', {
    //   port: 80,
    //   protocol: elbv2.ApplicationProtocol.HTTP,
    // });

    // httpListener.addAction('RedirectToHTTPS', {
    //   action: elbv2.ListenerAction.redirect({
    //     protocol: 'HTTPS',
    //     port: '443',
    //     permanent: true,
    //   }),
    // });

    // // Thêm listener cho port 443 (HTTPS)
    // const httpsListener = alb.addListener('HTTPSListener', {
    //   port: 443,
    //   protocol: elbv2.ApplicationProtocol.HTTPS,
    //   certificates: [
    //     {
    //       certificateArn: 'arn:aws:acm:region:account-id:certificate/certificate-id', // Replace with your ACM certificate ARN
    //     },
    //   ],
    // });

    // // Tạo Target Group cho domain a.com.vn
    // const targetGroup = new elbv2.ApplicationTargetGroup(this, 'TargetGroupA', {
    //   vpc,
    //   port: 80,
    //   protocol: elbv2.ApplicationProtocol.HTTP,
    //   targets: [], // Bạn có thể thêm target EC2/Container sau
    //   healthCheck: {
    //     path: '/',
    //     protocol: elbv2.Protocol.HTTP,
    //   },
    // });

    // // Thêm Rule cho domain a.com.vn
    // httpsListener.addRules('RuleForACom', {
    //   priority: 1,
    //   conditions: [
    //     elbv2.ListenerCondition.hostHeaders(['a.com.vn']),
    //   ],
    //   action: elbv2.ListenerAction.forward([targetGroup]),
    // });
  }
}
