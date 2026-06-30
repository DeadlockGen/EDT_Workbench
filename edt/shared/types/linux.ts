export interface LinuxCommand {
  key: string
  command: string
  description: string
  example: string
  category: string
  tags: string[]
}

export type LinuxCategory =
  | 'systemctl'
  | 'journalctl'
  | 'nginx'
  | 'docker'
  | 'kubernetes'
  | 'redis'
  | 'mysql'
  | 'oracle'
  | 'postgresql'
  | 'kafka'
  | 'rabbitmq'
