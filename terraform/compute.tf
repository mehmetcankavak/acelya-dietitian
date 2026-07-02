data "aws_ssm_parameter" "al2023_ami" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
}

resource "aws_key_pair" "app" {
  key_name   = "acelyacetin-key"
  public_key = file("${path.module}/acelyacetin-key.pub")
}

resource "aws_instance" "app" {
  ami                    = data.aws_ssm_parameter.al2023_ami.value
  instance_type          = "t3.micro"
  key_name               = aws_key_pair.app.key_name
  subnet_id              = tolist(data.aws_subnets.default.ids)[0]
  vpc_security_group_ids = [aws_security_group.app.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2.name

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  user_data = file("${path.module}/user-data.sh")

  tags = {
    Name = "acelyacetin-app"
  }

  lifecycle {
    ignore_changes = [ami, user_data]
  }
}

output "ec2_public_dns" {
  value = aws_instance.app.public_dns
}

output "ec2_public_ip" {
  value = aws_instance.app.public_ip
}

output "ecr_repository_url" {
  value = aws_ecr_repository.acelyacetin_api.repository_url
}

output "rds_endpoint" {
  value = aws_db_instance.acelyacetin.address
}

output "db_password" {
  value     = random_password.db.result
  sensitive = true
}
