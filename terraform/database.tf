resource "random_password" "db" {
  length  = 24
  special = false
}

resource "aws_db_instance" "acelyacetin" {
  identifier     = "acelyacetin-db"
  engine         = "postgres"
  engine_version = "16"
  instance_class = "db.t3.micro"

  allocated_storage = 20
  storage_type      = "gp3"

  db_name  = "acelyacetin"
  username = "acelyaadmin"
  password = random_password.db.result

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  backup_retention_period = 1
  multi_az                = false
  publicly_accessible     = false
  skip_final_snapshot     = true
}
