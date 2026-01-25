provider "aws" {
  alias  = "virginia"
  region = "us-east-1"
}

data "aws_ecr_authorization_token" "token" {
  provider = aws.virginia
}

data "aws_iam_policy_document" "ecr_pull_policy" {
  statement {
    actions = ["ecr:BatchGetImage", "ecr:GetDownloadUrlForLayer"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}