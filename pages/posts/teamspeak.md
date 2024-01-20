---
title: teamspeak server端搭建
date: 2023-12-17
tags: bundler
desc: 记录
---

## 0. 先行条件

teamspeak在运行时不建议使用root用户运行，所以可以先创建个teamspeak用户

```bash
useradd -m teamspeak
passwd teamspeak

操作系统: Ubuntu 20.04
```

## 1. teamspeak server安装

### 1-1. 下载

#### 1-1-1. 官网下载

[到ts官网下载](https://teamspeak.com/en/downloads/#server)

#### 1-1-2. Wget

```bash
64bit: wget https://files.teamspeak-services.com/releases/server/3.13.7/teamspeak3-server_linux_amd64-3.13.7.tar.bz2
32bit: wget https://files.teamspeak-services.com/releases/server/3.13.7/teamspeak3-server_linux_x86-3.13.7.tar.bz2
```

### 2-1. 解压

```bash
tar -xvf teamspeak3-server_linux_amd64-3.13.7.tar.bz2
mv teamspeak3-server_linux_amd64-3.13.7 /opt/teamspeak
cd /opt/teamspeak

// 赋予刚刚新建的用户权限
chown -R teamspeak:teamspeak /opt/teamspeak
```

## 2. 运行

首先同意以下使用解析

```bash
touch .ts3server_license_accepted
```

这里就可以直接运行了

```bash
./ts3server_startscript.sh start
```
但是这样ts server无法自运行

so，我们可以创建init配置文件

```bash
cd /lib/systemd/system
touch teamspeak.service

--- teamspeak.service配置
[Unit]
Description=TeamSpeak 3 Server
After=network.target

[Service]
WorkingDirectory=/opt/teamspeak/
User=teamspeak
Group=teamspeak
Type=forking
ExecStart=/opt/teamspeak/ts3server_startscript.sh start inifile=ts3server.ini
ExecStop=/opt/teamspeak/ts3server_startscript.sh stop
ExecRestart=/opt/teamspeak/ts3server_startscript.sh restart
PIDFile=/opt/teamspeak/ts3server.pid
RestartSec=15
Restart=always

[Install]
WantedBy=multi-user.target
```

然后就可以使用 systemctl 运行

```bash
重新加载 systemd : systemctl --system daemon-reload
开启自启动(可选) : systemctl enable teamspeak.service
启动 TeamSpeak : systemctl start teamspeak.service
查询TeamSpeak开启状态 : systemctl status teamspeak.service
停止 TeamSpeak : systemctl stop teamspeak.service
```

## 3. 端口放开

| Port | Proto | Desc |
| :--: | :---: | :--- |
|9987	 |UDP	   |默认语音服务器端口
|10011 |TCP	   |ServerQuery raw 端口
|10022 |TCP	   |ServerQuery SSH 端口(需要 3.3.0 以上版本服务端)
|10080 |TCP	   |ServerQuery HTTP 端口(需要 3.12.0 以上版本服务端)
|10443 |TCP	   |ServerQuery HTTPS 端口(需要 3.12.0 以上版本服务端)
|30033 |TCP	   |文件传输端口
|41144 |TCP	   |TSDNS
