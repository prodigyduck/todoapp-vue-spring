module "todoapp_ecs" {
  source = "terraform-aws-modules/ecs/aws"

  cluster_name = "todoapp"
  
  cluster_settings = {
    name = "containerInsights"
    value = "enabled"
  }

  fargate_capacity_providers = {
    FARGATE = {
      default_capacity_provider_strategy = {
        weight = 100
      }
    }
    FARGATE_SPOT = {
      default_capacity_provider_strategy = {
        weight = 0
      }
    }
  }
}

module "todoapp_service" {
  source = "terraform-aws-modules/ecs/aws//modules/service"

  for_each = toset(["frontend", "backend"])

  cluster  = module.todoapp_ecs.cluster_name
  name     = "${each.key}-service"
  cpu      = each.key == "backend" ? 1024 : 512
  memory   = each.key == "backend" ? 2048 : 1024

  container_definitions = {
    (each.key) = {
      cpu     = 256
      memory  = 512
      essential = true
      image   = "ghcr.io/${var.github_repository}-${each.key}:latest"
      port_mappings = {
        container = each.key == "backend" ? 8080 : 80
        protocol  = "tcp"
      }

      environment_variables = each.key == "backend" ? {
        SPRING_PROFILES_ACTIVE = "production"
        SPRING_DATASOURCE_URL  = "jdbc:postgresql://${module.rds.db_instance_endpoint}/todoapp"
        SPRING_DATASOURCE_USERNAME = module.rds.db_instance_username
        SPRING_DATASOURCE_PASSWORD = module.rds.db_instance_password
        JWT_SECRET = var.jwt_secret
      } : {
        VITE_API_BASE_URL = "https://api.yourapp.com"
      }

      readonly_root_filesystem = false
      enable_cloudwatch_logging = true
    }
  }

  load_balancer = {
    service = {
      target_group_arn = module.alb.target_groups[each.key].arn
      container_name   = each.key
      container_port   = each.key == "backend" ? 8080 : 80
    }
  }

  subnet_ids = module.vpc.private_subnets
  security_group_rules = {
    egress = {
      protocol    = "-1"
      from_port   = 0
      to_port     = 0
      type        = "egress"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }
}