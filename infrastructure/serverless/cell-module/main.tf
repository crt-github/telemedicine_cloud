# infrastructure/serverless/cell-module/main.tf
# "Country-in-a-Box" Module
# Deploys a strictly region-locked serverless stack.

variable "country_code" { description = "ISO Country Code (e.g., CH, DE)" }
variable "region" { description = "Cloud Region (e.g., eu-central-2)" }

provider "aws" {
  region = var.region
  alias  = "cell_region"
}

# 1. Regional KMS Key (The Root of Sovereignty)
resource "aws_kms_key" "cell_key" {
  provider    = aws.cell_region
  description = "CMK for ${var.country_code} Patient Data"
  tags = {
    Sovereignty = var.country_code
  }
}

# 2. Serverless Data Store (DynamoDB Global Table - Single Region Config)
resource "aws_dynamodb_table" "patient_store" {
  provider     = aws.cell_region
  name         = "telemed-${var.country_code}-patients"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.cell_key.arn
  }

  tags = {
    Compliance = "${var.country_code}-Only"
  }
}

# 3. Serverless Compute (Lambda)
resource "aws_lambda_function" "api_handler" {
  provider      = aws.cell_region
  function_name = "telemed-${var.country_code}-api"
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  role          = aws_iam_role.lambda_exec.arn
  
  # ... (S3 bucket for code would be here)

  environment {
    variables = {
      REGION_RESTRICTION = var.country_code
      KMS_KEY_ID         = aws_kms_key.cell_key.id
    }
  }
}

# 4. API Gateway (Regional Endpoint)
resource "aws_api_gateway_rest_api" "cell_api" {
  provider = aws.cell_region
  name     = "telemed-${var.country_code}-gateway"
  endpoint_configuration {
    types = ["REGIONAL"] # Strict - No Global Edge Caching for PII
  }
}

output "api_endpoint" {
  value = aws_api_gateway_rest_api.cell_api.execution_arn
}
