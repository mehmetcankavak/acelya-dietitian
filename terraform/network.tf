# Yeni bir VPC kurmuyoruz — hesabın varsayılan VPC'sini ve subnet'lerini
# olduğu gibi kullanıyoruz (terminal projesindeki pattern ile aynı).
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

resource "aws_security_group" "app" {
  name        = "acelyacetin-app-sg"
  description = "Açelya Çetin API app SG"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "SSH - admin IP only"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["${var.admin_ip}/32"]
  }

  ingress {
    description = "HTTP - CloudFront origin"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "rds" {
  name        = "acelyacetin-rds-sg"
  description = "RDS access from app only"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description     = "Postgres - from app SG only"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_subnet_group" "main" {
  name        = "acelyacetin-db-subnets"
  description = "Açelya Çetin RDS subnet group"
  subnet_ids  = data.aws_subnets.default.ids
}
