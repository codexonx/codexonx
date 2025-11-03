variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "codexonx"
}

variable "ec2_ami" {
  description = "AMI ID for EC2 instance (Ubuntu 20.04 LTS)"
  type        = string
  default     = "ami-0261755bbcb8c4a84" # Ubuntu 20.04 LTS in us-east-1
}

variable "key_name" {
  description = "Name of the SSH key pair"
  type        = string
}

variable "db_username" {
  description = "Username for PostgreSQL database"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Password for PostgreSQL database"
  type        = string
  sensitive   = true
}
