# infrastructure/serverless/routing/dns.tf
# GLOBAL TRAFFIC MANAGER (Route53 / Azure Traffic Manager)

resource "aws_route53_zone" "global_zone" {
  name = "telemed.cloud"
}

# 1. Geolocation Routing Policy
# Route traffic based on the physical location of the user

resource "aws_route53_record" "api_swiss" {
  zone_id = aws_route53_zone.global_zone.zone_id
  name    = "api.telemed.cloud"
  type    = "CNAME"
  ttl     = "60"
  
  geolocation_routing_policy {
    country = "CH"
  }
  
  set_identifier = "Swiss Users"
  records        = ["api-ch-gva.aws-region.com"] # Points to Swiss Cell API GW
}

resource "aws_route53_record" "api_german" {
  zone_id = aws_route53_zone.global_zone.zone_id
  name    = "api.telemed.cloud"
  type    = "CNAME"
  ttl     = "60"
  
  geolocation_routing_policy {
    country = "DE"
  }
  
  set_identifier = "German Users"
  records        = ["api-de-fra.aws-region.com"] # Points to German Cell API GW
}

# Fallback for other regions
resource "aws_route53_record" "api_default" {
  zone_id = aws_route53_zone.global_zone.zone_id
  name    = "api.telemed.cloud"
  type    = "CNAME"
  ttl     = "60"
  
  geolocation_routing_policy {
    country = "*" # Default
  }
  
  set_identifier = "Rest of World"
  records        = ["landing-page.telemed.cloud"] # "Unavailble in your region" page
}
