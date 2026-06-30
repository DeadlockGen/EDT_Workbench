export interface LinuxCommand {
  key: string
  command: string
  description: string
  example?: string
  category: string
  tags: string[]
}

export const linuxCommands: LinuxCommand[] = [
  // Systemctl
  { key: 'sys-start', command: 'systemctl start <service>', description: '启动服务', example: 'systemctl start nginx', category: 'systemctl', tags: ['启动', '服务'] },
  { key: 'sys-stop', command: 'systemctl stop <service>', description: '停止服务', example: 'systemctl stop nginx', category: 'systemctl', tags: ['停止', '服务'] },
  { key: 'sys-restart', command: 'systemctl restart <service>', description: '重启服务', example: 'systemctl restart nginx', category: 'systemctl', tags: ['重启', '服务'] },
  { key: 'sys-reload', command: 'systemctl reload <service>', description: '重新加载配置', example: 'systemctl reload nginx', category: 'systemctl', tags: ['重新加载'] },
  { key: 'sys-status', command: 'systemctl status <service>', description: '查看服务状态', example: 'systemctl status nginx', category: 'systemctl', tags: ['状态'] },
  { key: 'sys-enable', command: 'systemctl enable <service>', description: '设置开机自启', example: 'systemctl enable nginx', category: 'systemctl', tags: ['开机自启'] },
  { key: 'sys-disable', command: 'systemctl disable <service>', description: '禁用开机自启', category: 'systemctl', tags: ['禁用'] },
  { key: 'sys-list', command: 'systemctl list-units --type=service', description: '列出所有服务', category: 'systemctl', tags: ['列表'] },
  { key: 'sys-list-failed', command: 'systemctl --failed', description: '列出失败的服务', category: 'systemctl', tags: ['失败'] },
  { key: 'sys-daemon-reload', command: 'systemctl daemon-reload', description: '重新加载 systemd 配置', category: 'systemctl', tags: ['重新加载'] },

  // Journalctl
  { key: 'journal-all', command: 'journalctl', description: '查看所有日志', category: 'journalctl', tags: ['日志'] },
  { key: 'journal-unit', command: 'journalctl -u <service>', description: '查看指定服务的日志', example: 'journalctl -u nginx', category: 'journalctl', tags: ['服务日志'] },
  { key: 'journal-follow', command: 'journalctl -f', description: '实时跟踪日志', category: 'journalctl', tags: ['实时'] },
  { key: 'journal-since', command: 'journalctl --since "2024-01-01"', description: '查看指定时间后的日志', category: 'journalctl', tags: ['时间过滤'] },
  { key: 'journal-until', command: 'journalctl --until "2024-01-02"', description: '查看指定时间前的日志', category: 'journalctl', tags: ['时间过滤'] },
  { key: 'journal-lines', command: 'journalctl -n 100', description: '查看最后 N 行日志', category: 'journalctl', tags: ['行数'] },
  { key: 'journal-prio', command: 'journalctl -p err', description: '按优先级过滤日志', category: 'journalctl', tags: ['优先级', '过滤'] },
  { key: 'journal-disk', command: 'journalctl --disk-usage', description: '查看日志磁盘占用', category: 'journalctl', tags: ['磁盘'] },

  // Nginx
  { key: 'nginx-test', command: 'nginx -t', description: '测试配置文件语法', category: 'nginx', tags: ['测试', '配置'] },
  { key: 'nginx-reload', command: 'nginx -s reload', description: '重新加载配置', category: 'nginx', tags: ['重新加载'] },
  { key: 'nginx-restart', command: 'systemctl restart nginx', description: '重启 Nginx', category: 'nginx', tags: ['重启'] },
  { key: 'nginx-stop', command: 'nginx -s stop', description: '停止 Nginx', category: 'nginx', tags: ['停止'] },
  { key: 'nginx-start', command: 'systemctl start nginx', description: '启动 Nginx', category: 'nginx', tags: ['启动'] },
  { key: 'nginx-log-access', command: 'tail -f /var/log/nginx/access.log', description: '实时查看访问日志', category: 'nginx', tags: ['日志'] },
  { key: 'nginx-log-error', command: 'tail -f /var/log/nginx/error.log', description: '实时查看错误日志', category: 'nginx', tags: ['日志'] },

  // Docker
  { key: 'docker-ps', command: 'docker ps', description: '列出运行中的容器', category: 'docker', tags: ['容器'] },
  { key: 'docker-ps-all', command: 'docker ps -a', description: '列出所有容器', category: 'docker', tags: ['容器'] },
  { key: 'docker-images', command: 'docker images', description: '列出镜像', category: 'docker', tags: ['镜像'] },
  { key: 'docker-pull', command: 'docker pull <image>', description: '拉取镜像', example: 'docker pull nginx:latest', category: 'docker', tags: ['镜像'] },
  { key: 'docker-run', command: 'docker run -d --name <name> <image>', description: '运行容器', category: 'docker', tags: ['容器'] },
  { key: 'docker-exec', command: 'docker exec -it <container> /bin/bash', description: '进入容器', category: 'docker', tags: ['容器'] },
  { key: 'docker-logs', command: 'docker logs -f <container>', description: '查看容器日志', category: 'docker', tags: ['日志'] },
  { key: 'docker-compose-up', command: 'docker-compose up -d', description: '启动 Compose 服务', category: 'docker', tags: ['compose'] },
  { key: 'docker-compose-down', command: 'docker-compose down', description: '停止 Compose 服务', category: 'docker', tags: ['compose'] },
  { key: 'docker-rm', command: 'docker rm <container>', description: '删除容器', category: 'docker', tags: ['容器'] },
  { key: 'docker-rmi', command: 'docker rmi <image>', description: '删除镜像', category: 'docker', tags: ['镜像'] },
  { key: 'docker-prune', command: 'docker system prune', description: '清理未使用的资源', category: 'docker', tags: ['清理'] },

  // Kubernetes
  { key: 'k8s-get-pods', command: 'kubectl get pods', description: '查看 Pod 列表', category: 'kubernetes', tags: ['pod'] },
  { key: 'k8s-get-pods-all', command: 'kubectl get pods -A', description: '查看所有命名空间的 Pod', category: 'kubernetes', tags: ['pod'] },
  { key: 'k8s-get-svc', command: 'kubectl get svc', description: '查看 Service 列表', category: 'kubernetes', tags: ['service'] },
  { key: 'k8s-get-deploy', command: 'kubectl get deployments', description: '查看 Deployment 列表', category: 'kubernetes', tags: ['deployment'] },
  { key: 'k8s-logs', command: 'kubectl logs <pod>', description: '查看 Pod 日志', category: 'kubernetes', tags: ['日志'] },
  { key: 'k8s-exec', command: 'kubectl exec -it <pod> -- /bin/sh', description: '进入 Pod', category: 'kubernetes', tags: ['exec'] },
  { key: 'k8s-describe', command: 'kubectl describe pod <pod>', description: '查看 Pod 详细信息', category: 'kubernetes', tags: ['describe'] },
  { key: 'k8s-apply', command: 'kubectl apply -f <file.yaml>', description: '应用 YAML 配置', category: 'kubernetes', tags: ['部署'] },
  { key: 'k8s-delete', command: 'kubectl delete -f <file.yaml>', description: '删除资源', category: 'kubernetes', tags: ['删除'] },
  { key: 'k8s-top-node', command: 'kubectl top nodes', description: '查看节点资源使用', category: 'kubernetes', tags: ['监控'] },
  { key: 'k8s-top-pod', command: 'kubectl top pods', description: '查看 Pod 资源使用', category: 'kubernetes', tags: ['监控'] },
  { key: 'k8s-ns', command: 'kubectl get namespaces', description: '查看命名空间', category: 'kubernetes', tags: ['namespace'] },

  // Redis
  { key: 'redis-cli', command: 'redis-cli', description: '进入 Redis CLI', category: 'redis', tags: ['cli'] },
  { key: 'redis-get', command: 'GET <key>', description: '获取键值', category: 'redis', tags: ['命令'] },
  { key: 'redis-set', command: 'SET <key> <value>', description: '设置键值', category: 'redis', tags: ['命令'] },
  { key: 'redis-keys', command: 'KEYS <pattern>', description: '查找键', example: 'KEYS user:*', category: 'redis', tags: ['命令'] },
  { key: 'redis-del', command: 'DEL <key>', description: '删除键', category: 'redis', tags: ['命令'] },
  { key: 'redis-ttl', command: 'TTL <key>', description: '查看过期时间', category: 'redis', tags: ['命令'] },
  { key: 'redis-expire', command: 'EXPIRE <key> <seconds>', description: '设置过期时间', category: 'redis', tags: ['命令'] },
  { key: 'redis-info', command: 'INFO', description: '查看 Redis 信息', category: 'redis', tags: ['命令'] },
  { key: 'redis-flushall', command: 'FLUSHALL', description: '清空所有数据（慎用）', category: 'redis', tags: ['命令', '危险'] },

  // MySQL
  { key: 'mysql-login', command: 'mysql -u root -p', description: '登录 MySQL', category: 'mysql', tags: ['登录'] },
  { key: 'mysql-show-dbs', command: 'SHOW DATABASES;', description: '查看所有数据库', category: 'mysql', tags: ['数据库'] },
  { key: 'mysql-use', command: 'USE <db>;', description: '切换数据库', category: 'mysql', tags: ['数据库'] },
  { key: 'mysql-show-tables', command: 'SHOW TABLES;', description: '查看所有表', category: 'mysql', tags: ['表'] },
  { key: 'mysql-desc', command: 'DESC <table>;', description: '查看表结构', category: 'mysql', tags: ['表'] },
  { key: 'mysql-export', command: 'mysqldump -u root -p <db> > backup.sql', description: '导出数据库', category: 'mysql', tags: ['备份'] },
  { key: 'mysql-import', command: 'mysql -u root -p <db> < backup.sql', description: '导入数据库', category: 'mysql', tags: ['恢复'] },
  { key: 'mysql-processlist', command: 'SHOW PROCESSLIST;', description: '查看进程列表', category: 'mysql', tags: ['监控'] },
  { key: 'mysql-slow-log', command: 'SHOW VARIABLES LIKE "slow_query_log";', description: '查看慢查询日志配置', category: 'mysql', tags: ['慢查询'] },

  // Oracle
  { key: 'oracle-sqlplus', command: 'sqlplus / as sysdba', description: '以 sysdba 登录', category: 'oracle', tags: ['登录'] },
  { key: 'oracle-listener', command: 'lsnrctl status', description: '查看监听状态', category: 'oracle', tags: ['监听'] },
  { key: 'oracle-startup', command: 'STARTUP;', description: '启动数据库', category: 'oracle', tags: ['启动'] },
  { key: 'oracle-shutdown', command: 'SHUTDOWN IMMEDIATE;', description: '关闭数据库', category: 'oracle', tags: ['关闭'] },
  { key: 'oracle-tables', command: 'SELECT * FROM all_tables;', description: '查看所有表', category: 'oracle', tags: ['表'] },
  { key: 'oracle-tablespace', command: 'SELECT * FROM dba_data_files;', description: '查看表空间', category: 'oracle', tags: ['表空间'] },
  { key: 'oracle-session', command: 'SELECT * FROM v$session;', description: '查看会话', category: 'oracle', tags: ['会话'] },
  { key: 'oracle-sql', command: 'SELECT * FROM v$sql WHERE rownum <= 10;', description: '查看 SQL 执行', category: 'oracle', tags: ['SQL'] },

  // PostgreSQL
  { key: 'psql-login', command: 'psql -U postgres', description: '登录 PostgreSQL', category: 'postgresql', tags: ['登录'] },
  { key: 'psql-list-db', command: '\\l', description: '列出数据库', category: 'postgresql', tags: ['数据库'] },
  { key: 'psql-connect', command: '\\c <db>', description: '连接数据库', category: 'postgresql', tags: ['数据库'] },
  { key: 'psql-list-tables', command: '\\dt', description: '列出表', category: 'postgresql', tags: ['表'] },
  { key: 'psql-desc', command: '\\d <table>', description: '查看表结构', category: 'postgresql', tags: ['表'] },
  { key: 'psql-export', command: 'pg_dump -U postgres <db> > backup.sql', description: '导出数据库', category: 'postgresql', tags: ['备份'] },
  { key: 'psql-restore', command: 'psql -U postgres <db> < backup.sql', description: '恢复数据库', category: 'postgresql', tags: ['恢复'] },

  // Kafka
  { key: 'kafka-topics', command: 'kafka-topics.sh --list --bootstrap-server localhost:9092', description: '列出所有 Topic', category: 'kafka', tags: ['topic'] },
  { key: 'kafka-create-topic', command: 'kafka-topics.sh --create --topic <name> --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1', description: '创建 Topic', category: 'kafka', tags: ['topic'] },
  { key: 'kafka-produce', command: 'kafka-console-producer.sh --topic <topic> --bootstrap-server localhost:9092', description: '生产消息', category: 'kafka', tags: ['生产'] },
  { key: 'kafka-consume', command: 'kafka-console-consumer.sh --topic <topic> --bootstrap-server localhost:9092 --from-beginning', description: '消费消息', category: 'kafka', tags: ['消费'] },
  { key: 'kafka-describe', command: 'kafka-topics.sh --describe --topic <topic> --bootstrap-server localhost:9092', description: '查看 Topic 详情', category: 'kafka', tags: ['topic'] },
  { key: 'kafka-groups', command: 'kafka-consumer-groups.sh --list --bootstrap-server localhost:9092', description: '列出消费组', category: 'kafka', tags: ['消费组'] },
  { key: 'kafka-reset-offset', command: 'kafka-consumer-groups.sh --reset-offsets --to-earliest --topic <topic> --group <group> --bootstrap-server localhost:9092 --execute', description: '重置消费偏移', category: 'kafka', tags: ['消费组'] },

  // RabbitMQ
  { key: 'rabbit-status', command: 'rabbitmqctl status', description: '查看 RabbitMQ 状态', category: 'rabbitmq', tags: ['状态'] },
  { key: 'rabbit-queues', command: 'rabbitmqctl list_queues', description: '列出队列', category: 'rabbitmq', tags: ['队列'] },
  { key: 'rabbit-exchanges', command: 'rabbitmqctl list_exchanges', description: '列出交换机', category: 'rabbitmq', tags: ['交换机'] },
  { key: 'rabbit-bindings', command: 'rabbitmqctl list_bindings', description: '列出绑定', category: 'rabbitmq', tags: ['绑定'] },
  { key: 'rabbit-users', command: 'rabbitmqctl list_users', description: '列出用户', category: 'rabbitmq', tags: ['用户'] },
  { key: 'rabbit-add-user', command: 'rabbitmqctl add_user <user> <password>', description: '添加用户', category: 'rabbitmq', tags: ['用户'] },
  { key: 'rabbit-plugins', command: 'rabbitmq-plugins list', description: '列出插件', category: 'rabbitmq', tags: ['插件'] },
  { key: 'rabbit-enable-mgmt', command: 'rabbitmq-plugins enable rabbitmq_management', description: '启用管理插件', category: 'rabbitmq', tags: ['插件'] }
]
