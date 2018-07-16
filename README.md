# - LXD Control Panel
# - Attention this repo is a fork of the original repo made by lcherone! 

<img src="https://i.imgur.com/gHhwGG4.png" alt="Screen" title="Screen" align="right" />


A full-featured decentralized LXD server control panel with sugar!

## :clipboard: Features

Here is just some of the features:

 - Lighting fast single page app control panel built with nuxt.js and Vue2.
 - **Full** LXD management of profiles, containers, images, remotes, certificates, networks, storage and devices.
 - Simple toggling of devices, SSH keys and user/group idmap'ing.
 - Server information, host CPU, memory, disks network connections and processes.
 - Built-in Web Proxy with LetsEncrypt, to forward HTTP/s traffic into the containers or external upstream's.
 - Create custom tasks for maintaining containers or project deployments.
 - Create simple API endpoints for stuff the panel does not do, with access to your LXD servers over RPC.

## :arrow_forward: Install

Installing the project is easy, it should be done on a **clean ubuntu server**!
## Will be updated soon!
```
# switch into root user!
sudo su

# update package lists
apt update


```

Once complete, you will be able to go to the panel at `http://IP:88`, and then add the server, with the provided key during install.

**Note:** If you install this project in a LXC container, the container must be privileged and have nesting enabled. Also the install will fail first time after installing snap "core", just press up and run it again then it works.

## :fast_forward: Updates

The panel will have *many* updates, as it is very much under construction. But thankfully updating is simple and wont effect your containers.

So to update, enter into `/var/www/html` and do a `git pull`.

```
# switch into root user!
sudo su

# update
cd /var/www/html && git pull

# fix ownership on any new files
chown www-data:www-data ./ -R
```



## :heart: Developer Support

If you want to show your appreciation or you make money where this is used, please make a small donation to help encourage development [https://www.paypal.me/lcherone](https://www.paypal.me/lcherone), cheers. Also help the project get seen by :star: staring :star: it.

## :family: Credits

- [Lawrence Cherone](https://github.com/lcherone)
- [Meywether (Bughunter!)](https://github.com/Meywether)
- [All Contributors](https://github.com/lcherone/Conext/graphs/contributors)

## :copyright: License

The MIT License (MIT). 

```
MIT License

Copyright (c) 2018 Lawrence Cherone

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

:100: :penguin:
