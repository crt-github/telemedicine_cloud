# infrastructure/serverless/deployments/german/main.tf
# GERMAN CELL DEPLOYMENT

module "german_cell" {
  source       = "../../cell-module"
  country_code = "DE"
  region       = "eu-central-1" # Frankfurt
}
