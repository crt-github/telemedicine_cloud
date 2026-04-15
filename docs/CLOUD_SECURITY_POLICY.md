# CLOUD SECURITY POLICY: NotebookLM Bridge (VPC-SC)

This document outlines the security configuration required on Google Cloud Platform to protect the TeleMed pseudonymized "Shadow Copies".

## 1. VPC Service Controls (VPC-SC)

We use a Service Perimeter to isolate the `cloud_sync` bucket from unauthorized access and data exfiltration.

### Terraform Configuration

```hcl
resource "google_access_context_manager_service_perimeter" "telemed_perimeter" {
  parent = "accessPolicies/${var.access_policy_id}"
  name   = "accessPolicies/${var.access_policy_id}/servicePerimeters/telemed_security_zone"
  title  = "TeleMed Security Zone"

  status {
    restricted_services = ["storage.googleapis.com"]
    
    access_levels = [
      google_access_context_manager_access_level.doctor_office_static_ip.name
    ]

    resources = [
      "projects/${var.project_number}"
    ]

    vpc_accessible_services {
      enable_restriction = true
      allowed_services   = ["RESTRICTED-SERVICES"]
    }
  }
}
```

## 2. Bucket IAM (Least Privilege)

Only the **TeleMed Sanitizer Service Account** has write access. NotebookLM has read-only access.

```bash
# Remove all public access
gsutil iam ch -d allUsers gs://telemed-private-shadow-copies

# Grant Write access to the server
gsutil iam ch serviceAccount:sanitizer@project.iam.gserviceaccount.com:objectCreator gs://telemed-private-shadow-copies

# Grant Read access to NotebookLM Service Agent
gsutil iam ch serviceAccount:service-PROJECT_NUMBER@gcp-sa-notebooklm.iam.gserviceaccount.com:objectViewer gs://telemed-private-shadow-copies
```

## 3. Scrubbing Verification (Local Check)

Before any sync, the server performs a local "PII-Zero" check. If `mapping_db` is unavailable or the Sanitizer fails to find a pseudonym, the file is automatically quarantined.

> [!WARNING]
> **Data Residency**: The Cloud Sync bucket should be located in the same region as the TeleMed Local Enclave (e.g., `europe-west6` for Switzerland) to comply with regional health data regulations.
