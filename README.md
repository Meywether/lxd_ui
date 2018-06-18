# Conext - LXD Control Panel

<img src="https://i.imgur.com/gHhwGG4.png" alt="Screen" title="Screen" align="right" />

<!--[![Build Status](https://travis-ci.org/lcherone/Conext.svg?branch=master)](https://travis-ci.org/lcherone/Conext)-->
[![Build Status](https://scrutinizer-ci.com/g/lcherone/Conext/badges/build.png?b=master)](https://scrutinizer-ci.com/g/lcherone/Conext/build-status/master)
[![StyleCI](https://github.styleci.io/repos/133640681/shield?branch=master)](https://github.styleci.io/repos/133640681)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/lcherone/Conext/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/lcherone/Conext/?branch=master)
[![Packagist Version](https://img.shields.io/packagist/v/lcherone/conext.svg?style=flat-square)](https://github.com/lcherone/conext/releases)
[![Packagist Downloads](https://img.shields.io/packagist/dt/lcherone/conext.svg?style=flat-square)](https://packagist.org/packages/lcherone/conext)
[![Packagist Downloads](https://img.shields.io/liberapay/receives/lcherone.svg)](https://liberapay.com/lcherone)

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

```
# switch into root user!
sudo su

# update package lists
apt update

# install wget
apt install wget

wget https://gist.githubusercontent.com/lcherone/d7e5ba660bc20d738132ccb1a453459d/raw/757e1f6a02a79336d6a00b516019b81944e56106/install.sh && bash install.sh
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

## :lock: Security

Please see [security](https://github.com/lcherone/Conext/wiki/Security) wiki page for details.

## :construction: Contributing

Please see [CONTRIBUTING](https://github.com/lcherone/Conext/blob/master/CONTRIBUTING.md) for details.

## :office: Bespoke System

If you would like a bespoke system created at very competitive rates then contact me via my website @ [https://cherone.co.uk](https://cherone.co.uk) or if you use [Upwork](https://www.upwork.com/o/profiles/users/~01ff0ec055a5895e8f/), though that.

## :heart: Developer Support

If you want to show your appreciation or you make money where this is used, please make a small donation to help encourage development [https://www.paypal.me/lcherone](https://www.paypal.me/lcherone), cheers. Also help the project get seen by :star: staring :star: it.

## :family: Credits

- [Lawrence Cherone](https://github.com/lcherone)
- [All Contributors](https://github.com/lcherone/Conext/graphs/contributors)

## :copyright: License

The MIT License (MIT). Please see [License File](https://github.com/lcherone/Conext/blob/master/LICENSE) for more information.

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