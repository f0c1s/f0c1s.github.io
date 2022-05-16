<html lang="en">
    <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
        <title>/f0c1s/blog/sec/htb/GoodGames</title>
        <link rel="stylesheet" href="../../../index.css"/>
        <link rel="stylesheet" href="../../../highlight/styles/monokai.min.css"/>
        <script src="../../../highlight/highlight.min.js"></script>
        <script src="../../../setup.js"></script>
    </head>
<body onload="setup()">
<h1>/f0c1s/blog/sec/htb/GoodGames</h1>

<nav>
    <a href="../../../index.html">/blog</a>
    <a href="../../index.html">Security</a>
    <a href="../index.html">VulnHub</a>
    <a href="../index.html">HackTheBox write-ups</a>
    <a href="./goodgames.html">+ goodgames - 2022.05.10 Tuesday</a>
</nav>

## Description

![](01.GoodGames.png)

```shell
┌─[root@pwnbox-base]─[/home/htb-f0c1s]
└──╼ #IP="10.129.109.168"
┌─[root@pwnbox-base]─[/home/htb-f0c1s]
└──╼ #ping $IP
PING 10.129.109.168 (10.129.109.168) 56(84) bytes of data.
64 bytes from 10.129.109.168: icmp_seq=1 ttl=63 time=251 ms
64 bytes from 10.129.109.168: icmp_seq=2 ttl=63 time=251 ms
64 bytes from 10.129.109.168: icmp_seq=3 ttl=63 time=251 ms
64 bytes from 10.129.109.168: icmp_seq=4 ttl=63 time=251 ms
64 bytes from 10.129.109.168: icmp_seq=5 ttl=63 time=251 ms
64 bytes from 10.129.109.168: icmp_seq=6 ttl=63 time=251 ms
^C
--- 10.129.109.168 ping statistics ---
6 packets transmitted, 6 received, 0% packet loss, time 5006ms
rtt min/avg/max/mdev = 251.021/251.222/251.460/0.146 ms
┌─[root@pwnbox-base]─[/home/htb-f0c1s]
└──╼ #nmap $IP
Starting Nmap 7.92 ( https://nmap.org ) at 2022-05-10 14:57 BST
Nmap scan report for 10.129.109.168
Host is up (0.26s latency).
Not shown: 999 closed tcp ports (reset)
PORT   STATE SERVICE
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 4.66 seconds
┌─[root@pwnbox-base]─[/home/htb-f0c1s]
└──╼ #nmap 10.129.109.168 -sU --top-ports=20
Starting Nmap 7.92 ( https://nmap.org ) at 2022-05-10 14:58 BST
Nmap scan report for 10.129.109.168
Host is up (0.25s latency).

PORT      STATE         SERVICE
53/udp    open|filtered domain
67/udp    closed        dhcps
68/udp    open|filtered dhcpc
69/udp    closed        tftp
123/udp   open|filtered ntp
135/udp   closed        msrpc
137/udp   closed        netbios-ns
138/udp   closed        netbios-dgm
139/udp   closed        netbios-ssn
161/udp   closed        snmp
162/udp   closed        snmptrap
445/udp   closed        microsoft-ds
500/udp   closed        isakmp
514/udp   closed        syslog
520/udp   open|filtered route
631/udp   closed        ipp
1434/udp  closed        ms-sql-m
1900/udp  closed        upnp
4500/udp  open|filtered nat-t-ike
49152/udp closed        unknown

Nmap done: 1 IP address (1 host up) scanned in 12.79 seconds

┌─[root@pwnbox-base]─[/home/htb-f0c1s]
└──╼ #PS1="# "
# nmap 10.129.109.168 -sU --top-ports=20 --open
Starting Nmap 7.92 ( https://nmap.org ) at 2022-05-10 15:08 BST
Nmap scan report for 10.129.109.168
Host is up (0.25s latency).
Not shown: 15 closed udp ports (port-unreach)
PORT    STATE         SERVICE
68/udp  open|filtered dhcpc
69/udp  open|filtered tftp
138/udp open|filtered netbios-dgm
445/udp open|filtered microsoft-ds
631/udp open|filtered ipp


# fping -aAqg $IP/24
...
10.129.109.168
...


# nmap $IP -n -A
Starting Nmap 7.92 ( https://nmap.org ) at 2022-05-10 15:12 BST
Stats: 0:00:28 elapsed; 0 hosts completed (1 up), 1 undergoing Traceroute
Traceroute Timing: About 32.26% done; ETC: 15:13 (0:00:00 remaining)
Nmap scan report for 10.129.109.168
Host is up (0.25s latency).
Not shown: 999 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.51
|_http-title: GoodGames | Community and Store
|_http-server-header: Werkzeug/2.0.2 Python/3.9.2
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
TCP/IP fingerprint:
OS:SCAN(V=7.92%E=4%D=5/10%OT=80%CT=1%CU=37786%PV=Y%DS=2%DC=T%G=Y%TM=627A72F
OS:9%P=x86_64-pc-linux-gnu)SEQ(SP=106%GCD=1%ISR=105%TI=Z%CI=Z%II=I%TS=A)OPS
OS:(O1=M505ST11NW7%O2=M505ST11NW7%O3=M505NNT11NW7%O4=M505ST11NW7%O5=M505ST1
OS:1NW7%O6=M505ST11)WIN(W1=FE88%W2=FE88%W3=FE88%W4=FE88%W5=FE88%W6=FE88)ECN
OS:(R=Y%DF=Y%T=40%W=FAF0%O=M505NNSNW7%CC=Y%Q=)T1(R=Y%DF=Y%T=40%S=O%A=S+%F=A
OS:S%RD=0%Q=)T2(R=N)T3(R=N)T4(R=Y%DF=Y%T=40%W=0%S=A%A=Z%F=R%O=%RD=0%Q=)T5(R
OS:=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)T6(R=Y%DF=Y%T=40%W=0%S=A%A=Z%F
OS:=R%O=%RD=0%Q=)T7(R=N)U1(R=Y%DF=N%T=40%IPL=164%UN=0%RIPL=G%RID=G%RIPCK=G%
OS:RUCK=G%RUD=G)IE(R=Y%DFI=N%T=40%CD=S)

Network Distance: 2 hops
Service Info: Host: goodgames.htb

TRACEROUTE (using port 1025/tcp)
HOP RTT       ADDRESS
1   252.74 ms 10.10.14.1
2   252.74 ms 10.129.109.168

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 34.72 seconds


feroxbuster -q -u http://$RHOST/ -w /usr/share/dirbuster/wordlists/directory-list-2.3-medium.txt --rate-limit 100
WLD      267l      548w     9265c Got 200 for http://10.129.109.168/be04d7de32fd42f7802c72feaa335d82 (url length: 32)
WLD         -         -         - Wildcard response is static; auto-filtering 9265 responses; toggle this behavior by using --dont-filter
WLD      267l      548w     9265c Got 200 for http://10.129.109.168/f11b9d2775aa4fb48eb2d02010021166267fe1014104452a9cac2a5d6c435231f501b2df792e4f9bb3904b589a9bb001 (url length: 96)
200      267l      553w     9294c http://10.129.109.168/login
200      267l      545w     9267c http://10.129.109.168/profile
200      909l     2572w    44212c http://10.129.109.168/blog
200      728l     2070w    33387c http://10.129.109.168/signup
302        4l       24w      208c http://10.129.109.168/logout
```

## Installing seclists on mac

```shell
wget -c https://github.com/danielmiessler/SecLists/archive/master.zip -O SecList.zip
  && unzip SecList.zip \
  && rm -f SecList.zip

## executing feroxbuster again
feroxbuster -q -u http://$RHOST/ -w ~/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt --rate-limit 100
WLD      GET      267l      548w     9265c Got 200 for http://10.129.109.236/69941f194ce2450baf3eb2f24ad7b678 (url length: 32)
WLD      GET         -         -         - Wildcard response is static; auto-filtering 9265 responses; toggle this behavior by using --dont-filter
WLD      GET      267l      548w     9265c Got 200 for http://10.129.109.236/315202b4f32b47ceb6d057ba88bdf83e1cf9c920a8c34e1badbb8cce5f6077e0dc59a5fb1a8b479db906543dee88ba5d (url length: 96)
200      GET      267l      553w     9294c http://10.129.109.236/login
200      GET      267l      545w     9267c http://10.129.109.236/profile
200      GET     1735l     5548w    85107c http://10.129.109.236/
200      GET      909l     2572w    44212c http://10.129.109.236/blog
200      GET      728l     2070w    33387c http://10.129.109.236/signup
302      GET        4l       24w      208c http://10.129.109.236/logout => http://10.129.109.236/
Scanning: http://10.129.109.236/
^C%
```



<script>hljs.highlightAll();</script>
</body>
</html>
