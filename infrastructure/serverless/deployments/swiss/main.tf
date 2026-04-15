# infrastructure/serverless/deployments/swiss/main.tf
# SWISS CELL DEPLOYMENT

module "swiss_cell" {
  source       = "../../cell-module"
  country_code = "CH"
  region       = "eu-central-2" # Zurich
}

# Specific Compliance Rule: Backup Retention
resource "aws_backup_plan" "swiss_retention" {
  name = "swiss-10y-retention"

  rule {
    rule_name         = "swiss-10y-retention-rule"
    target_vault_name = "Default"
    schedule          = "cron(0 12 * * ? *)"

    lifecycle {
      delete_after = 3650
    }
  }
}
