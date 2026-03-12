# infrastructure/multicloud/swiss/main.tf
# SWISS SAFE ZONE (Cloudscale.ch / Exoscale)
# Role: Store sensitive PII, Master Patient Index, Encryption Keys

provider "exoscale" {
  zone   = "ch-gva-2"
}

# 1. Secure Swiss VPC
resource "exoscale_network" "swiss_safe_zone" {
  name = "telemed-swiss-vpc"
  cidr = "10.0.0.0/16"
}

# 2. Subnet for Confidential Data (No Public Internet)
resource "exoscale_network_subnet" "db_subnet" {
  network_id = exoscale_network.swiss_safe_zone.id
  cidr       = "10.0.1.0/24"
}

# 3. Master Patient Index Database
resource "exoscale_compute" "mpi_db" {
  name = "mpi-master-db"
  type = "standard.medium"
  # Security Group: Allow access ONLY from Internal App Servers
}

# 4. VPN Gateway Endpoint
resource "exoscale_compute" "vpn_gateway_ch" {
  name = "vpn-gateway-ch"
  ip_address = "185.x.x.x" # Static Swiss IP
  # Firewall: Allow UDP 500/4500 from AWS_GLOBAL_IP only
}
