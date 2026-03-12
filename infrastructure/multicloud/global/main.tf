# infrastructure/multicloud/global/main.tf
# GLOBAL COMPUTE ZONE (AWS - Frankfurt/Zurich Region)
# Role: AI Inference, Heavy Compute, Global CDN (No PII allowed)

provider "aws" {
  region = "eu-central-1" # Frankfurt
}

# 1. Global VPC
resource "aws_vpc" "global_compute_vpc" {
  cidr_block = "172.16.0.0/16"
}

# 2. AI Inference Cluster (GPU)
resource "aws_instance" "ai_node_p4" {
  ami           = "ami-012345678" # Deep Learning AMI
  instance_type = "p4d.24xlarge" # Heavy GPU
  subnet_id     = aws_subnet.compute_subnet.id
  
  tags = {
    Name = "Global-AI-Inference"
    Compliance = "NO-PII"
  }
}

# 3. VPN Gateway Endpoint
resource "aws_vpn_gateway" "vpn_gw_global" {
  vpc_id = aws_vpc.global_compute_vpc.id
}
