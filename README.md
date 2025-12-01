# lapkeu-project
laporan keuangan

## Installing neccesary depedencies

```bash
cd app
bun i
```

## Creating Mysql Account (On MariaDB Server)
for bun connection

```bash mysql
CREATE USER 'bunapp'@'localhost' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON *.* TO 'bunapp'@'localhost';
FLUSH PRIVILEGES;
```