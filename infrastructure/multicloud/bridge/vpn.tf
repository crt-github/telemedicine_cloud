# infrastructure/multicloud/bridge/vpn.tf
# SECURE BRIDGE CONFIGURATION
# Connects Swiss Safe Zone (10.0.0.0/16) <-> Global Compute Zone (172.16.0.0/16)

# Site-to-Site VPN Connection
resource "aws_vpn_connection" "ch_global_bridge" {
  vpn_gateway_id      = aws_vpn_gateway.vpn_gw_global.id
  customer_gateway_id = exoscale_compute.vpn_gateway_ch.id # Pointing to Swiss IP
  type                = "ipsec.1"
  static_routes_only  = true
}

# Firewall Rules (The "Privacy Firewall")
# Rule: BLOCK all traffic from CH -> AWS *unless* it is destined for the Anonymization Service
resource "firewall_rule" "egress_control" {
  direction = "egress"
  source    = "10.0.0.0/16" # Swiss VPC
  destination = "172.16.5.5/32" # Anonymization Proxy IP in AWS (or DMZ)
  action    = "ALLOW"
  log       = true
}

resource "firewall_rule" "deny_direct_internet" {
  direction = "egress"
  source    = "10.0.1.0/24" # DB Subnet
  destination = "0.0.0.0/0"
  action    = "DENY"
}
