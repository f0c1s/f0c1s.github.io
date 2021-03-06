<html lang="en">
    <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
        <title>/f0c1s/blog/sec/vulnhub/symfonos-6.1</title>
        <link rel="stylesheet" href="../../../index.css"/>
        <link rel="stylesheet" href="../../../highlight/styles/monokai.min.css"/>
        <script src="../../../highlight/highlight.min.js"></script>
        <script src="../../../setup.js"></script>
        <script>hljs.highlightAll();</script>
    </head>
<body onload="setup()">
<h1>/f0c1s/blog/sec/vulnhub/symfonos-6.1</h1>

<nav>
    <a href="../../../index.html">/blog</a>
    <a href="../../index.html">Security</a>
    <a href="../index.html">VulnHub</a>
    <a href="../../../sec/vulnhub/symfonos-6.1/symfonos-6.1.html">+ symfonos-6.1 - 2022.01.09 Sunday</a>
</nav>

## Description


> Difficulty: intermediate-hard
>
> This VM was designed to search for the attackers "Achilles' heel". Please only assign one network adapter to avoid issues.
>
> VMware works fine. Virtualbox has issues.
>
> \## Changelog v6.1 - 2020-04-07 v6.0 - 2020-04-05


[VulnHub: https://www.vulnhub.com/entry/symfonos-61,458/](https://www.vulnhub.com/entry/symfonos-61,458/)
[Series: https://www.vulnhub.com/series/symfonos,217/](https://www.vulnhub.com/series/symfonos,217/)

![0.running-box](0.running-box.png)

## Scanning

```shell
fping -aAqg 192.168.56.1/24
192.168.56.1
192.168.56.2
192.168.56.70
192.168.56.95

```

```shell
export RHOST="192.168.56.95"
export LHOST="192.168.56.70"
export LPORT="443"

```


```shell
_n $RHOST
firing nmap 192.168.56.95 -n | tee nmap.default.txt
Starting Nmap 7.92 ( https://nmap.org ) at 2022-01-09 06:39 IST
Nmap scan report for 192.168.56.95
Host is up (0.00026s latency).
Not shown: 995 closed tcp ports (conn-refused)
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
3000/tcp open  ppp
3306/tcp open  mysql
5000/tcp open  upnp

Nmap done: 1 IP address (1 host up) scanned in 0.10 seconds

```

```shell
_ntd $RHOST
firing nmap 192.168.56.95 -p- -Pn -A -T4 --min-rate=5000 -sVC -n | tee nmap.tcp-ports.deep.txt
Starting Nmap 7.92 ( https://nmap.org ) at 2022-01-09 06:39 IST
Nmap scan report for 192.168.56.95
Host is up (0.00011s latency).
Not shown: 65530 closed tcp ports (conn-refused)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 7.4 (protocol 2.0)
| ssh-hostkey:
|   2048 0e:ad:33:fc:1a:1e:85:54:64:13:39:14:68:09:c1:70 (RSA)
|   256 54:03:9b:48:55:de:b3:2b:0a:78:90:4a:b3:1f:fa:cd (ECDSA)
|_  256 4e:0c:e6:3d:5c:08:09:f4:11:48:85:a2:e7:fb:8f:b7 (ED25519)
80/tcp   open  http    Apache httpd 2.4.6 ((CentOS) PHP/5.6.40)
| http-methods:
|_  Potentially risky methods: TRACE
|_http-title: Site doesn't have a title (text/html; charset=UTF-8).
|_http-server-header: Apache/2.4.6 (CentOS) PHP/5.6.40
3000/tcp open  ppp?
| fingerprint-strings:
|   GenericLines, Help:
|     HTTP/1.1 400 Bad Request
|     Content-Type: text/plain; charset=utf-8
|     Connection: close
|     Request
|   GetRequest:
|     HTTP/1.0 200 OK
|     Content-Type: text/html; charset=UTF-8
|     Set-Cookie: lang=en-US; Path=/; Max-Age=2147483647
|     Set-Cookie: i_like_gitea=a3142ba2e7e13add; Path=/; HttpOnly
|     Set-Cookie: _csrf=a4ddOs0clCC5sPskWxvJotrhFzg6MTY0MTcxMDM5NzYyMDc4NzMzMA; Path=/; Expires=Mon, 10 Jan 2022 06:39:57 GMT; HttpOnly
|     X-Frame-Options: SAMEORIGIN
|     Date: Sun, 09 Jan 2022 06:39:57 GMT
|     <!DOCTYPE html>
|     <html lang="en-US">
|     <head data-suburl="">
|     <meta charset="utf-8">
|     <meta name="viewport" content="width=device-width, initial-scale=1">
|     <meta http-equiv="x-ua-compatible" content="ie=edge">
|     <title> Symfonos6</title>
|     <link rel="manifest" href="/manifest.json" crossorigin="use-credentials">
|     <script>
|     ('serviceWorker' in navigator) {
|     navigator.serviceWorker.register('/serviceworker.js').then(function(registration) {
|     console.info('ServiceWorker registration successful with scope: ', registrat
|   HTTPOptions:
|     HTTP/1.0 404 Not Found
|     Content-Type: text/html; charset=UTF-8
|     Set-Cookie: lang=en-US; Path=/; Max-Age=2147483647
|     Set-Cookie: i_like_gitea=b72a9edadba754bf; Path=/; HttpOnly
|     Set-Cookie: _csrf=AaXuOzxcsLW6D7TDZF5nGHpFfuI6MTY0MTcxMDQwMjY0MDg4MTMxNg; Path=/; Expires=Mon, 10 Jan 2022 06:40:02 GMT; HttpOnly
|     X-Frame-Options: SAMEORIGIN
|     Date: Sun, 09 Jan 2022 06:40:02 GMT
|     <!DOCTYPE html>
|     <html lang="en-US">
|     <head data-suburl="">
|     <meta charset="utf-8">
|     <meta name="viewport" content="width=device-width, initial-scale=1">
|     <meta http-equiv="x-ua-compatible" content="ie=edge">
|     <title>Page Not Found - Symfonos6</title>
|     <link rel="manifest" href="/manifest.json" crossorigin="use-credentials">
|     <script>
|     ('serviceWorker' in navigator) {
|     navigator.serviceWorker.register('/serviceworker.js').then(function(registration) {
|_    console.info('ServiceWorker registration successful
3306/tcp open  mysql   MariaDB (unauthorized)
5000/tcp open  upnp?
| fingerprint-strings:
|   FourOhFourRequest:
|     HTTP/1.0 404 Not Found
|     Content-Type: text/plain
|     Date: Sun, 09 Jan 2022 06:40:27 GMT
|     Content-Length: 18
|     page not found
|   GenericLines, Help, Kerberos, LDAPSearchReq, LPDString, RTSPRequest, SSLSessionReq, TLSSessionReq, TerminalServerCookie:
|     HTTP/1.1 400 Bad Request
|     Content-Type: text/plain; charset=utf-8
|     Connection: close
|     Request
|   GetRequest:
|     HTTP/1.0 404 Not Found
|     Content-Type: text/plain
|     Date: Sun, 09 Jan 2022 06:39:57 GMT
|     Content-Length: 18
|     page not found
|   HTTPOptions:
|     HTTP/1.0 404 Not Found
|     Content-Type: text/plain
|     Date: Sun, 09 Jan 2022 06:40:12 GMT
|     Content-Length: 18
|_    page not found

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 94.98 seconds
```

```shell
_nu $RHOST
firing sudo nmap 192.168.56.95 -sU -p- -Pn --min-rate=5000 --open --top-ports=500 -n | tee nmap.udp-all-ports.txt
Starting Nmap 7.92 ( https://nmap.org ) at 2022-01-09 06:43 IST
Nmap scan report for 192.168.56.95
Host is up (0.00059s latency).
Not shown: 493 open|filtered udp ports (no-response), 6 closed udp ports (port-unreach)
PORT     STATE SERVICE
5353/udp open  zeroconf
MAC Address: 08:00:27:4A:8B:5B (Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 0.84 seconds

```

## Attacking web

![1.homepage-port-80](1.homepage-port-80.png)

![2.homepage-port-3000](2.homepage-port-3000.png)

### nikto port 80

```shell
nikto -C all -host http://$RHOST | tee nikto.txt
- Nikto v2.1.6
---------------------------------------------------------------------------
+ Target IP:          192.168.56.95
+ Target Hostname:    192.168.56.95
+ Target Port:        80
+ Start Time:         2022-01-09 06:44:47 (GMT5.5)
---------------------------------------------------------------------------
+ Server: Apache/2.4.6 (CentOS) PHP/5.6.40
+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-XSS-Protection header is not defined. This header can hint to the user agent to protect against some forms of XSS
+ The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type
+ Apache/2.4.6 appears to be outdated (current is at least Apache/2.4.37). Apache 2.2.34 is the EOL for the 2.x branch.
+ PHP/5.6.40 appears to be outdated (current is at least 7.2.12). PHP 5.6.33, 7.0.27, 7.1.13, 7.2.1 may also current release for each branch.
+ Allowed HTTP Methods: OPTIONS, GET, HEAD, POST, TRACE
+ OSVDB-877: HTTP TRACE method is active, suggesting the host is vulnerable to XST
+ OSVDB-3268: /icons/: Directory indexing found.
+ OSVDB-3233: /icons/README: Apache default file found.
+ 26521 requests: 0 error(s) and 9 item(s) reported on remote host
+ End Time:           2022-01-09 06:46:07 (GMT5.5) (80 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested

```

### nikto port 3000

```shell
nikto -C all -host http://$RHOST:3000 | tee nikto.p3000.txt
- Nikto v2.1.6
---------------------------------------------------------------------------
+ Target IP:          192.168.56.95
+ Target Hostname:    192.168.56.95
+ Target Port:        3000
+ Start Time:         2022-01-09 06:49:47 (GMT5.5)
---------------------------------------------------------------------------
+ Server: No banner retrieved
+ The X-XSS-Protection header is not defined. This header can hint to the user agent to protect against some forms of XSS
+ The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type
+ Cookie lang created without the httponly flag
+ Uncommon header 'content-transfer-encoding' found, with contents: binary
+ Uncommon header 'content-disposition' found, with contents: attachment; filename=favicon.png
+ Uncommon header 'content-description' found, with contents: File Transfer
+ Cookie redirect_to created without the httponly flag
+ /debug/: Possible debug directory/program found.
+ 26525 requests: 0 error(s) and 8 item(s) reported on remote host
+ End Time:           2022-01-09 06:51:03 (GMT5.5) (76 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested

```

### feroxbuster port 80

```shell
feroxbuster -q -u http://$RHOST/ -w /usr/share/dirbuster/wordlists/directory-list-2.3-medium.txt --rate-limit 100 -d 2 -L 4 -k -f
403        8l       22w      210c http://192.168.56.95/cgi-bin/
200     1006l     4983w        0c http://192.168.56.95/icons/
500       23l       93w      943c http://192.168.56.95/posts/
200       78l      746w        0c http://192.168.56.95/icons/small/
???? Caught ctrl+c ???? saving scan state to ferox-http_192_168_56_95_-1641691622.state ...
Scanning: http://192.168.56.95/
Scanning: http://192.168.56.95/cgi-bin/
Scanning: http://192.168.56.95/icons/

```

- `/cgi-bin/`
- `/posts/`

![3.posts-on-default-web](3.posts-on-default-web.png)

>  The warrior Achilles is one of the great heroes of Greek mythology.
> According to legend, Achilles was extraordinarily strong, courageous and loyal,
> but he had one vulnerability???his Achilles heel.
>
> Homer???s epic poem The Iliad tells the story of his adventures during the last year of the Trojan War.

This is surprising, as the returned http status code is 500.

### feroxbuster port 3000

```shell
feroxbuster -q -u http://$RHOST:3000 -w /usr/share/dirbuster/wordlists/directory-list-2.3-medium.txt --rate-limit 100 -d 2 -L 4 -k -f
302        2l        2w       34c http://192.168.56.95:3000/admin/
302        2l        2w       34c http://192.168.56.95:3000/issues/
302        2l        2w       37c http://192.168.56.95:3000/explore/
200        5l       10w      160c http://192.168.56.95:3000/debug/
302        2l        2w       34c http://192.168.56.95:3000/milestones/
302        2l        2w       34c http://192.168.56.95:3000/notifications/
200      363l      913w        0c http://192.168.56.95:3000/achilles/
500      263l      694w        0c http://192.168.56.95:3000/debug/3647/
500      263l      694w        0c http://192.168.56.95:3000/achilles/story/
500      263l      694w        0c http://192.168.56.95:3000/achilles/image/
500      263l      694w        0c http://192.168.56.95:3000/4041/
500      263l      694w        0c http://192.168.56.95:3000/debug/esmfeatures/
500      263l      694w        0c http://192.168.56.95:3000/debug/h_search/
500      263l      694w        0c http://192.168.56.95:3000/achilles/31/
500      263l      694w        0c http://192.168.56.95:3000/debug/Laptop/
500      263l      694w        0c http://192.168.56.95:3000/debug/4574/
500      263l      694w        0c http://192.168.56.95:3000/debug/sciences/
500      263l      694w        0c http://192.168.56.95:3000/debug/esmscreenshots/
500      263l      694w        0c http://192.168.56.95:3000/debug/5080/
500      263l      694w        0c http://192.168.56.95:3000/5795/
500      263l      694w        0c http://192.168.56.95:3000/debug/genetic/
500      263l      694w        0c http://192.168.56.95:3000/achilles/community/
500      263l      694w        0c http://192.168.56.95:3000/achilles/photos/
500      263l      694w        0c http://192.168.56.95:3000/achilles/history/
500      263l      694w        0c http://192.168.56.95:3000/achilles/papers/
500      263l      694w        0c http://192.168.56.95:3000/debug/edmonton/
500      263l      694w        0c http://192.168.56.95:3000/achilles/data/
500      263l      694w        0c http://192.168.56.95:3000/3096/
500      263l      694w        0c http://192.168.56.95:3000/achilles/arrow/
500      263l      694w        0c http://192.168.56.95:3000/achilles/strona_19/
500      263l      694w        0c http://192.168.56.95:3000/debug/top7/
500      263l      694w        0c http://192.168.56.95:3000/debug/3121/
500      263l      694w        0c http://192.168.56.95:3000/debug/3172/
500      263l      694w        0c http://192.168.56.95:3000/debug/5857/
500      263l      694w        0c http://192.168.56.95:3000/debug/pgpkeys/
500      263l      694w        0c http://192.168.56.95:3000/achilles/partner/
500      263l      694w        0c http://192.168.56.95:3000/2907/
500      263l      694w        0c http://192.168.56.95:3000/visa_delta/
500      263l      694w        0c http://192.168.56.95:3000/more1/
500      263l      694w        0c http://192.168.56.95:3000/arlington/
500      263l      694w        0c http://192.168.56.95:3000/4609/
500      263l      694w        0c http://192.168.56.95:3000/cic/
500      263l      694w        0c http://192.168.56.95:3000/nazi/
500      263l      694w        0c http://192.168.56.95:3000/opera9/
500      263l      694w        0c http://192.168.56.95:3000/achilles/videos/
500      263l      694w        0c http://192.168.56.95:3000/achilles/51/
500      263l      694w        0c http://192.168.56.95:3000/achilles/perl/
500      263l      694w        0c http://192.168.56.95:3000/achilles/46/
500      263l      694w        0c http://192.168.56.95:3000/achilles/pix/
500      263l      694w        0c http://192.168.56.95:3000/achilles/49/
500      263l      694w        0c http://192.168.56.95:3000/achilles/57/
500      263l      694w        0c http://192.168.56.95:3000/achilles/61/
500      263l      694w        0c http://192.168.56.95:3000/achilles/h/
500      263l      694w        0c http://192.168.56.95:3000/achilles/63/
500      263l      694w        0c http://192.168.56.95:3000/achilles/52/
500      263l      694w        0c http://192.168.56.95:3000/achilles/whatsnew/
500      263l      694w        0c http://192.168.56.95:3000/achilles/details/
500      263l      694w        0c http://192.168.56.95:3000/achilles/icon/
500      263l      694w        0c http://192.168.56.95:3000/doctrine/
500      263l      694w        0c http://192.168.56.95:3000/livre/
500      263l      694w        0c http://192.168.56.95:3000/zidane/
500      263l      694w        0c http://192.168.56.95:3000/5541/
500      263l      694w        0c http://192.168.56.95:3000/liaise/
500      263l      694w        0c http://192.168.56.95:3000/11429/
500      263l      694w        0c http://192.168.56.95:3000/Progress/
500      263l      694w        0c http://192.168.56.95:3000/diablo2/
500      263l      694w        0c http://192.168.56.95:3000/9273/
500      263l      694w        0c http://192.168.56.95:3000/XForms/
500      263l      694w        0c http://192.168.56.95:3000/getamac/
500      263l      694w        0c http://192.168.56.95:3000/3352/
500      263l      694w        0c http://192.168.56.95:3000/debug/data_recovery/
500      263l      694w        0c http://192.168.56.95:3000/pes/
500      263l      694w        0c http://192.168.56.95:3000/achilles/press_releases/
500      263l      694w        0c http://192.168.56.95:3000/debug/tooltip/
500      263l      694w        0c http://192.168.56.95:3000/debug/icon_exclaim/
500      263l      694w        0c http://192.168.56.95:3000/debug/Suzuki/
500      263l      694w        0c http://192.168.56.95:3000/debug/XSL/
500      263l      694w        0c http://192.168.56.95:3000/debug/reid/
500      263l      694w        0c http://192.168.56.95:3000/debug/InvestorRelations/
500      263l      694w        0c http://192.168.56.95:3000/debug/add2netvibes/
500      263l      694w        0c http://192.168.56.95:3000/debug/pisces/
500      263l      694w        0c http://192.168.56.95:3000/debug/NewsRoom/
500      263l      694w        0c http://192.168.56.95:3000/debug/feature_articles/
500      263l      694w        0c http://192.168.56.95:3000/achilles/toc/
500      263l      694w        0c http://192.168.56.95:3000/achilles/hp/
500      263l      694w        0c http://192.168.56.95:3000/achilles/finance/
500      263l      694w        0c http://192.168.56.95:3000/homicide/
500      263l      694w        0c http://192.168.56.95:3000/8233/
500      263l      694w        0c http://192.168.56.95:3000/debug/5085/
500      263l      694w        0c http://192.168.56.95:3000/achilles/j/
500      263l      694w        0c http://192.168.56.95:3000/achilles/Articles/
500      263l      694w        0c http://192.168.56.95:3000/debug/3892/
500      263l      694w        0c http://192.168.56.95:3000/debug/fullview/
500      263l      694w        0c http://192.168.56.95:3000/debug/createpipeline/
500      263l      694w        0c http://192.168.56.95:3000/debug/3700/
500      263l      694w        0c http://192.168.56.95:3000/achilles/smile/
500      263l      694w        0c http://192.168.56.95:3000/DivX/
500      263l      694w        0c http://192.168.56.95:3000/rmi/
500      263l      694w        0c http://192.168.56.95:3000/debug/4410/
500      263l      694w        0c http://192.168.56.95:3000/debug/MP/
500      263l      694w        0c http://192.168.56.95:3000/debug/appc/
500      263l      694w        0c http://192.168.56.95:3000/debug/pbp/
500      263l      694w        0c http://192.168.56.95:3000/debug/CR/
500      263l      694w        0c http://192.168.56.95:3000/oi/
500      263l      694w        0c http://192.168.56.95:3000/a60/
500      263l      694w        0c http://192.168.56.95:3000/debug/domainnames/
500      263l      694w        0c http://192.168.56.95:3000/debug/asktheeditors/
500      263l      694w        0c http://192.168.56.95:3000/debug/tracy/
500      263l      694w        0c http://192.168.56.95:3000/11447/
500      263l      694w        0c http://192.168.56.95:3000/brisbane/
500      263l      694w        0c http://192.168.56.95:3000/01709/
500      263l      694w        0c http://192.168.56.95:3000/gartner/
500      263l      694w        0c http://192.168.56.95:3000/11444/
500      263l      694w        0c http://192.168.56.95:3000/achilles/term/
500      263l      694w        0c http://192.168.56.95:3000/achilles/phones/
500      263l      694w        0c http://192.168.56.95:3000/debug/2002-11/
500      263l      694w        0c http://192.168.56.95:3000/achilles/Publications/
500      263l      694w        0c http://192.168.56.95:3000/debug/000186/
500      263l      694w        0c http://192.168.56.95:3000/achilles/200/
500      263l      694w        0c http://192.168.56.95:3000/achilles/cache/
500      263l      694w        0c http://192.168.56.95:3000/achilles/135/
500      263l      694w        0c http://192.168.56.95:3000/debug/xilisoft/
500      263l      694w        0c http://192.168.56.95:3000/debug/cpyright/
500      263l      694w        0c http://192.168.56.95:3000/debug/contactbutton/
500      263l      694w        0c http://192.168.56.95:3000/debug/elebits/
500      263l      694w        0c http://192.168.56.95:3000/screencasts/
???? Caught ctrl+c ???? saving scan state to ferox-http_192_168_56_95:3000-1641691620.state ...
Scanning: http://192.168.56.95:3000
Scanning: http://192.168.56.95:3000/debug/
Scanning: http://192.168.56.95:3000/achilles/

```

- `/admin/`
- `/issues/`
- `/explore/`
- `/debug/`
- `/milestones/`
- `/notifications/`
- `/achilles/`

![4.achilles-on-port-3000](4.achilles-on-port-3000.png)

### gobuster port 80


```shell
gobuster dir --url http://$RHOST -x jpg,png,cgi,py,txt,php,log,bak,zip --wordlist=/usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -q -f
/cgi-bin/             (Status: 403) [Size: 210]
/icons/               (Status: 200) [Size: 74409]
/image.jpg            (Status: 200) [Size: 271800]
/posts/               (Status: 500) [Size: 943]
^C
[!] Keyboard interrupt detected, terminating.

```


### gobuster port 3000

```shell
gobuster dir --url http://$RHOST:3000 -x jpg,png,cgi,py,txt,php,log,bak,zip --wordlist=/usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -q -f
/admin/               (Status: 302) [Size: 34] [--> /user/login]
/issues/              (Status: 302) [Size: 34] [--> /user/login]
/file.php             (Status: 500) [Size: 8390]
/status/              (Status: 500) [Size: 8346]
/Internet.bak         (Status: 500) [Size: 8479]
/conference.zip       (Status: 500) [Size: 8522]
/pricing.bak          (Status: 500) [Size: 8455]
/pricing.jpg          (Status: 500) [Size: 8455]
/pricing.zip          (Status: 500) [Size: 8455]
/ecommerce.txt        (Status: 500) [Size: 8500]
/work.log             (Status: 500) [Size: 8389]
/voip.txt             (Status: 500) [Size: 8390]
^C
[!] Keyboard interrupt detected, terminating.

```

### At this point

I have found a blog post on default web (80) and a user on gitea (3000). There can be other users, so I am firing a scan for that via username list.

### Users

![5.explore-users](5.explore-users.png)

### ffuf


```shell
ffuf -u "http://$RHOST:3000/FUZZ" -w /usr/share/wordlists/dirbuster/directories.jbrofuzz -fc 403,404,401,400 -s | grep -v "^#"

.
??
achilles
admin
avatars
css
debug
explore
img
issues
js
milestones
notifications
vendor


```

```shell
ffuf -u "http://$RHOST:3000/FUZZ" -w /usr/share/wordlists/dirbuster/directory-list-1.0.txt -fc 403,404,401,400 -s | grep -v "^#"

img
healthcheck
admin
milestones
issues
css
js
avatars
debug
vendor
explore
notifications


```

```shell
ffuf -u "http://$RHOST:3000/FUZZ" -w /usr/share/wordlists/dirbuster/apache-user-enum-1.0.txt -fc 403,404,401,400 -s | grep -v "^#"
ffuf -u "http://$RHOST:3000/FUZZ" -w /usr/share/wordlists/dirbuster/apache-user-enum-2.0.txt -fc 403,404,401,400 -s | grep -v "^#"

```

```shell
ffuf -u "http://$RHOST:3000/FUZZ" -w /usr/share/wordlists/dirbuster/directory-list-2.3-small.txt -fc 403,404,401,400 -s | grep -v "^#"
img

admin
issues
css
avatars
js
vendor
explore
debug
milestones
notifications
achilles



```

```shell
ffuf -u "http://$RHOST:3000/FUZZ" -w /usr/share/wordlists/dirbuster/directory-list-lowercase-2.3-medium.txt -fc 403,404,401,400 -s | grep -v "^#"
img

admin
issues
css
avatars
js
vendor
explore
debug
milestones
notifications
achilles

healthcheck


```

![6.healthcheck](6.healthcheck.png)

```shell
ffuf -u "http://$RHOST:3000/FUZZ" -w /usr/share/wordlists/seclists/Discovery/Web-Content/common.txt -fc 403,404,401,400 -s | grep -v "^#"
admin
avatars
css
debug
explore
img
issues
js
notifications
vendor


```

```shell
ffuf -u "http://$RHOST:3000/FUZZ" -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words-lowercase.txt -fc 403,404,401,400 -s | grep -v "^#"
admin
js
css
img
.
avatars
debug
vendor
issues
explore
notifications
healthcheck
milestones
achilles


```

![7.what-is-even-vendor](7.what-is-even-vendor.png)

![8.user-zayotic](8.user-zayotic.png)

```shell
ffuf -u "http://$RHOST/FUZZ" -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-files-lowercase.txt -fc 403,404,401,400 -s | grep -v "^#"
index.html
.
image.jpg


```

```shell
ffuf -u "http://$RHOST/FUZZ" -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words-lowercase.txt -fc 403,404,401,400 -s | grep -v "^#"
.
posts
flyspray


```

### :80/flyspray

![9.flyspray](9.flyspray.png)

![10.bug-report](10.bug-report.png)

[FlySpray: http://www.flyspray.org/](http://www.flyspray.org/)

![11.flyspray-org](11.flyspray-org.png)

![12.register-a-user-at-flyspray](12.register-a-user-at-flyspray.png)

![13.failed-attempt-at-RCE](13.failed-attempt-at-RCE.png)

![14.failed-at-bold](14.failed-at-bold.png)

Cannot move forward as of yet. To be continued...

</body>
</html>
