# Yellow Admin - installation

## 1. Download the latest version of this software

These are the installation instructions of this software for the different Linux distributions.

Log in as "root" on your server and run the following commands to download the necessary dependencies and the latest version of this software from GitHub:

### Debian / Ubuntu Linux

```sh
apt update
apt -y upgrade
apt -y install git openssl
curl -fsSL https://bun.sh/install | bash
source /root/.bashrc
git clone https://github.com/libersoft-org/yellow-admin.git
cd yellow-admin/
bun i
```

### CentOS / RHEL / Fedora Linux

```sh
dnf -y update
dnf -y install git openssl
curl -fsSL https://bun.sh/install | bash
source /root/.bashrc
git clone https://github.com/libersoft-org/yellow-admin.git
cd yellow-admin/
bun i
```

## 2. Use this software

If you'd like to **build this software from source codes, use this command:

```sh
./build.sh
```

... and then move the content of your "**build**" folder to your web server.

If you'd like to **run this software in developer mode**, first you need to create HTTPS keys:

```sh
openssl req -x509 -newkey rsa:2048 -nodes -days $(expr '(' $(date -d 2999/01/01 +%s) - $(date +%s) + 86399 ')' / 86400) -subj "/" -keyout server.key -out server.crt
```

... then use this command to start the server in development mode:

```sh
./start-dev.sh
```

If you need auto login into server admin (for development and testing purposes, not recommended for production environment!!!) you can also edit the "**start-dev-autologin.sh**" file and set your **server**, **username** and **password** and then run:

```sh
./start-dev-autologin.sh
```

... and then navigate to: https://YOUR_SERVER_ADDRESS:4000/ in your browser. Browser will show the certificate error, just skip it.
