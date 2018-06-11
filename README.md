# Conext - LXD Control Panel

<img src="https://i.imgur.com/gHhwGG4.png" alt="Screen" title="Screen" align="right" />

[![Build Status](https://travis-ci.org/lcherone/Conext.svg?branch=master)](https://travis-ci.org/plinker/lxd)
[![StyleCI](https://github.styleci.io/repos/133640681/shield?branch=master)](https://github.styleci.io/repos/133640681)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/lcherone/Conext/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/lcherone/Conext/?branch=master)
[![Packagist Version](https://img.shields.io/packagist/v/lcherone/conext.svg?style=flat-square)](https://github.com/lcherone/conext/releases)
[![Packagist Downloads](https://img.shields.io/packagist/dt/lcherone/conext.svg?style=flat-square)](https://packagist.org/packages/lcherone/conext)

A decentralized multi-server LXD server control panel with sugar!

## Features

Not going to bore you with stuff you probably won't read, so here is what the system can do:

 - Responsive single page app control panel.
 - **Full** LXD management, including: profiles, containers, images, certificates, networks, storage and devices.
 - Server information, host CPU, memory, disks network connections and processes.
 - Built-in Web Proxy with LetsEncrypt, to forward HTTP/s traffic into the containers or external upstream's.
 - Create custom tasks for maintaining containers or project deployments.
 - Create simple API endpoints for stuff the panel does not do, with access to your LXD servers over RPC.

## Install

Installing the project is easy, it should be done on a **clean ubuntu server**!

```
# switch into root user!
sudo su

# update package lists
apt update

# install wget
apt install wget

wget https://gist.githubusercontent.com/lcherone/d7e5ba660bc20d738132ccb1a453459d/raw/ffea4d01806354562ce734260ef269ee9b8385cd/install.sh && bash install.sh
```

Once complete, you will be able to go to the panel at `http://IP:88`, and then add the server, with the provided key during install.

## Updates

The panel will have *many* updates, as it is very much under construction. But thankfully updating is simple and wont effect your containers.

So to update, enter into /var/www/html and do a git pull.

```
# switch into root user!
sudo su

# update
cd /var/www/html && git pull

# fix ownership on any new files
chown www-data:www-data ./ -R
```

<!--

### With Composer

On a **clean** Ubuntu server run the following commands:

```
# switch into root user!
sudo su

# update package lists and packages
sudo apt update && sudo apt -y upgrade

# install deps
sudo apt -y install zip php-cli

# install composer
sudo curl -sS https://getcomposer.org/installer | sudo php
sudo mv composer.phar /usr/local/bin/composer
sudo ln -s /usr/local/bin/composer /usr/bin/composer
```

Once done, install the project:

```
# make webroot and move into it
mkdir -p /var/www/html && cd /var/www/html

# install project (ignore warning about not to use root, root is required for post-install)
composer create-project lcherone/Conext .
```

### Git

Follow the above, then install with git.

```
cd /var/www/html

git clone git@github.com:lcherone/Conext.git .

composer install

composer setup

cd .nuxt

npm install

npm run dev

// or
npm run generate
```

### Install LXD

You must be using LXD version 3.0.0 or above, so unless your using 18.04 or above use the snap package.

```
# add www-data to lxd group
sudo usermod -a -G lxd www-data

# install snapd
sudo apt -y install snapd

# install lxd snap package
sudo snap install lxd

# initialise lxd (make sure you allow lxd over network - or the console wont work)
sudo lxd init
```

Now visit LXD API in your browser `https://IP:8443` and accept the self-signed certificate, 
this is done so the websocket connection will work when connecting to containers console.


### Allow www-data LXD access

```
# add www-data to sudoers so can run lxc commands
visudo

# then amend to User privilege specification, it should look like the following:

# User privilege specification
root     ALL=(ALL:ALL) ALL
www-data ALL=(ALL:ALL) NOPASSWD: /snap/bin/lxc
```

Once complete, you will be able to go to the panel at `http://IP:88`, and then add the server, with the provided key during install.

-->


## Contributing

Please see [CONTRIBUTING](https://github.com/lcherone/Conext/blob/master/CONTRIBUTING.md) for details.

## Bespoke System

If you would like a bespoke system created at very competitive rates, with a turn around of a week, contact me via my website @ [https://cherone.co.uk](https://cherone.co.uk) or if you use [Upwork](https://www.upwork.com/o/profiles/users/~01ff0ec055a5895e8f/), though that.

## Developer Support

If you want to show your appreciation or you make money where this is used, please make a small donation to help encourage development [https://www.paypal.me/lcherone](https://www.paypal.me/lcherone), cheers. Also help the project get seen by staring it.. thats free just like the hours I have put into making the system.

## Credits

- [Lawrence Cherone](https://github.com/lcherone)
- [All Contributors](https://github.com/lcherone/Conext/graphs/contributors)

## License

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