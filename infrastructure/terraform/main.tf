# infrastructure/terraform/main.tf
# Mock Configuration for Swiss Cloud Provider (e.g., cloudscale.ch / Exoscale)

provider "exoscale" {
  key    = var.exoscale_key
  secret = var.exoscale_secret
  zone   = "ch-gva-2" # Geneva, Switzerland
}

# Network Security Group - Strictly Internal
resource "exoscale_security_group" "internal_sg" {
  name        = "telemed-internal-sg"
  description = "Internal Microservices Network - NO External Access"
}

resource "exoscale_security_group_rule" "allow_internal_tcp" {
  security_group_id = exoscale_security_group.internal_sg.id
  type              = "INGRESS"
  protocol          = "TCP"
  cidr              = "10.0.0.0/16" # VPC Internal Range
  start_port        = 0
  end_port          = 65535
}

# Encrypted Datastore for Patient Data (S3 Compatible - Swiss Hosted)
resource "exoscale_sos_bucket" "patient_data_encrypted" {
  zone = "ch-dk-2" # Zurich, Switzerland
  name = "telemed-patient-records-encrypted"
  acl  = "private"
}

# GPU Instance for AI Modules (Swiss Zone)
resource "exoscale_compute_instance" "ai_gpu_node" {
  zone        = "ch-gva-2"
  name        = "telemed-ai-inference-gpu"
  type        = "gpu.large"
  disk_size   = 100
  security_group_ids = [exoscale_security_group.internal_sg.id]
}
