resource "aws_ecr_repository" "acelyacetin_api" {
  name = "acelyacetin-api"

  image_scanning_configuration {
    scan_on_push = true
  }
}
