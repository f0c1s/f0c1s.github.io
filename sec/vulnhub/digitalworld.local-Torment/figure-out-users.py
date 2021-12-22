#!/usr/bin/env python3

import socket

password="mostmachineshaveasupersecurekeyandalongpassphrase"
users=['printers', 'albert', 'cherrlt', 'david', 'edmund', 'ethan', 'eva', 'genevieve', 'govindasamy', 'jessica', 'kenny', 'patrick', 'qinyi', 'qiu', 'roland', 'sara']
addr="192.168.56.77"
port=25

# print(users, password)

for user in users:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((addr, port))
    s.recv(1024)
    s.send(bytes("VRFY " + user + "\n", 'utf-8'))
    data = s.recv(1024).decode('utf-8')
    if "rejected" not in data:
        print(data)
    s.close()

print("Done!")
