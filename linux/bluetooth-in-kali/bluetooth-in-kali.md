```shell
sudo systemctl enable bluetooth


sudo service bluetooth status
[sudo] password for f0c1s:
● bluetooth.service - Bluetooth service
     Loaded: loaded (/lib/systemd/system/bluetooth.service; enabled; vendor preset: disabled)
     Active: active (running) since Tue 2022-01-25 11:25:16 IST; 40s ago
       Docs: man:bluetoothd(8)
   Main PID: 1075 (bluetoothd)
     Status: "Running"
      Tasks: 1 (limit: 77025)
     Memory: 6.1M
        CPU: 25ms
     CGroup: /system.slice/bluetooth.service
             └─1075 /usr/libexec/bluetooth/bluetoothd --noplugin=sap

Jan 25 11:25:16 kali systemd[1]: Starting Bluetooth service...
Jan 25 11:25:16 kali bluetoothd[1075]: Bluetooth daemon 5.62
Jan 25 11:25:16 kali systemd[1]: Started Bluetooth service.
Jan 25 11:25:16 kali bluetoothd[1075]: Starting SDP server
Jan 25 11:25:16 kali bluetoothd[1075]: Excluding (cli) sap
Jan 25 11:25:16 kali bluetoothd[1075]: Bluetooth management interface 1.21 initialized
Jan 25 11:25:37 kali bluetoothd[1075]: src/service.c:btd_service_connect() a2dp-sink profile connect failed for EB:06:EF:AA:30:A1: Protocol not available
Jan 25 11:25:44 kali bluetoothd[1075]: src/service.c:btd_service_connect() a2dp-sink profile connect failed for 08:DF:1F:E5:A4:BC: Protocol not available


systemctl --user status pulseaudio
○ pulseaudio.service - Sound Service
     Loaded: loaded (/usr/lib/systemd/user/pulseaudio.service; enabled; vendor preset: enabled)
    Drop-In: /usr/lib/systemd/user/pulseaudio.service.d
             └─kali_pulseaudio.conf
     Active: inactive (dead)
TriggeredBy: ○ pulseaudio.socket



systemctl --user enable pulseaudio
Created symlink /home/f0c1s/.config/systemd/user/default.target.wants/pulseaudio.service → /usr/lib/systemd/user/pulseaudio.service.
Created symlink /home/f0c1s/.config/systemd/user/sockets.target.wants/pulseaudio.socket → /usr/lib/systemd/user/pulseaudio.socket.


sudo systemctl enable pulseaudio-enable-autospawn
Synchronizing state of pulseaudio-enable-autospawn.service with SysV service script with /lib/systemd/systemd-sysv-install.
Executing: /lib/systemd/systemd-sysv-install enable pulseaudio-enable-autospawn
Failed to enable unit: Unit file /lib/systemd/system/pulseaudio-enable-autospawn.service is masked.

sudo apt-get install pulseaudio-module-bluetooth
sudo killall pulseaudio
pulseaudio --start
sudo systemctl restart bluetooth

sudo systemctl status bluetooth
● bluetooth.service - Bluetooth service
     Loaded: loaded (/lib/systemd/system/bluetooth.service; enabled; vendor preset: disabled)
     Active: active (running) since Tue 2022-01-25 11:32:20 IST; 8s ago
       Docs: man:bluetoothd(8)
   Main PID: 5954 (bluetoothd)
     Status: "Running"
      Tasks: 1 (limit: 77025)
     Memory: 2.0M
        CPU: 51ms
     CGroup: /system.slice/bluetooth.service
             └─5954 /usr/libexec/bluetooth/bluetoothd --noplugin=sap

Jan 25 11:32:20 kali bluetoothd[5954]: Bluetooth management interface 1.21 initialized
Jan 25 11:32:20 kali bluetoothd[5954]: Endpoint registered: sender=:1.87 path=/MediaEndpoint/A2DPSink/sbc
Jan 25 11:32:20 kali bluetoothd[5954]: Endpoint registered: sender=:1.87 path=/MediaEndpoint/A2DPSource/sbc
Jan 25 11:32:20 kali bluetoothd[5954]: Endpoint registered: sender=:1.87 path=/MediaEndpoint/A2DPSink/sbc_xq_453
Jan 25 11:32:20 kali bluetoothd[5954]: Endpoint registered: sender=:1.87 path=/MediaEndpoint/A2DPSource/sbc_xq_453
Jan 25 11:32:20 kali bluetoothd[5954]: Endpoint registered: sender=:1.87 path=/MediaEndpoint/A2DPSink/sbc_xq_512
Jan 25 11:32:20 kali bluetoothd[5954]: Endpoint registered: sender=:1.87 path=/MediaEndpoint/A2DPSource/sbc_xq_512
Jan 25 11:32:20 kali bluetoothd[5954]: Endpoint registered: sender=:1.87 path=/MediaEndpoint/A2DPSink/sbc_xq_552
Jan 25 11:32:20 kali bluetoothd[5954]: Endpoint registered: sender=:1.87 path=/MediaEndpoint/A2DPSource/sbc_xq_552
Jan 25 11:32:26 kali bluetoothd[5954]: /org/bluez/hci0/dev_EB_06_EF_AA_30_A1/sep1/fd0: fd(42) ready
```

Every time `sudo killall pulseaudio && pulseaudio --start && sudo systemctl restart bluetooth`.
