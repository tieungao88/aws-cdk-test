### **1. Tệp `sb-441162141182.ts`**

- Đây là tệp **entry point**, đóng vai trò là nơi khởi tạo ứng dụng CDK (`cdk.App`) và gọi các stack khác nhau.
- Trong tệp này, bạn đang tạo một stack có tên là `AlbStack`, truyền các thông số cấu hình vào, như:
  - **`env`**: Xác định tài khoản AWS và vùng (`region`) để triển khai stack.
  - **`vpcId`**: ID của VPC hiện có.
  - **`subnetIds`**: Danh sách các subnet liên quan.

#### Vai trò:
- Tệp này là nơi **điều khiển** và quản lý các stack được triển khai.
- Nó cung cấp các tham số cụ thể (như `vpcId` và `subnetIds`) để `AlbStack` sử dụng khi triển khai tài nguyên.

Ví dụ: Khi bạn chạy lệnh `cdk synth` hoặc `cdk deploy`, CDK sẽ sử dụng thông tin từ tệp này để khởi tạo stack và triển khai tài nguyên.

---

### **2. Tệp `alb-stack.ts`**

- Đây là tệp định nghĩa **stack cụ thể** (`AlbStack`) trong AWS CDK. Một stack là một nhóm các tài nguyên AWS được quản lý cùng nhau.
- Tệp này sử dụng các thông số được truyền từ tệp entry point (`sb-441162141182.ts`) để triển khai tài nguyên.
  - **`vpcId`**: Sử dụng để ánh xạ (`import`) một VPC hiện có.
  - **`subnetIds`**: Sử dụng để ánh xạ các subnet và gắn chúng vào Application Load Balancer (ALB).

#### Vai trò:
- Tệp này là nơi thực hiện logic triển khai tài nguyên. Ví dụ:
  - Tạo ALB trong một VPC hiện có.
  - Gắn ALB vào các subnet được chỉ định.
- Nó nhận các tham số (`props`) từ entry point và sử dụng chúng để cấu hình tài nguyên AWS.

---

### **Mối liên hệ giữa hai tệp**

1. **Tệp `sb-441162141182.ts` cung cấp tham số cho `alb-stack.ts`**
   - Trong `sb-441162141182.ts`, bạn truyền các tham số như `vpcId`, `subnetIds`, và `env` khi khởi tạo `AlbStack`:
     ```typescript
     new AlbStack(app, 'sb01', {
       env: {
         account: '441162141182',
         region: 'ap-southeast-1',
       },
       vpcId: 'vpc-086f0abacdf3c8317',
       subnetIds: ['subnet-0d09bbeabd305a6c1', 'subnet-020575be0572f40dc'],
     });
     ```

2. **Tệp `alb-stack.ts` sử dụng tham số để triển khai tài nguyên**
   - Trong `alb-stack.ts`, các tham số này được truy cập thông qua `props`:
     ```typescript
     const vpc = ec2.Vpc.fromVpcAttributes(this, 'VPC', {
       vpcId: props.vpcId,
       availabilityZones: cdk.Fn.getAzs(),
     });

     const subnets = props.subnetIds.map((subnetId, index) =>
       ec2.Subnet.fromSubnetId(this, `Subnet${index}`, subnetId)
     );
     ```

   - Những tham số này được sử dụng để tạo VPC, ánh xạ subnet, và triển khai ALB.

3. **Quy trình chạy:**
   - Khi bạn chạy lệnh như `cdk deploy` hoặc `cdk synth`, AWS CDK:
     1. Khởi tạo ứng dụng từ tệp `sb-441162141182.ts`.
     2. Gọi constructor của `AlbStack` trong `alb-stack.ts` với các tham số được truyền.
     3. Triển khai tài nguyên AWS dựa trên logic được định nghĩa trong `alb-stack.ts`.

---

### **Cách hai tệp hoạt động cùng nhau trong thực tế**
- Tệp **entry point (`sb-441162141182.ts`)** chịu trách nhiệm:
  - Xác định tài khoản AWS và vùng triển khai.
  - Truyền các thông số cần thiết (như `vpcId` và `subnetIds`) cho stack.

- Tệp **stack (`alb-stack.ts`)** chịu trách nhiệm:
  - Nhận tham số từ entry point.
  - Triển khai tài nguyên AWS dựa trên tham số đó.

Ví dụ:
- Entry point định nghĩa rằng `VPC ID` là `vpc-086f0abacdf3c8317`.
- Stack sẽ sử dụng ID này để ánh xạ VPC và triển khai ALB trong VPC đó.