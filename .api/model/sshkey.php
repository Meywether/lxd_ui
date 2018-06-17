<?php
/*
 +----------------------------------------------------------------------+
 | Conext LXD Control Panel
 +----------------------------------------------------------------------+
 | Copyright (c)2018 (https://github.com/lcherone/conext)
 +----------------------------------------------------------------------+
 | This source file is subject to MIT License
 | that is bundled with this package in the file LICENSE.
 |
 | If you did not receive a copy of the license and are unable to
 | obtain it through the world-wide-web, please send an email
 | to lawrence@cherone.co.uk so we can send you a copy immediately.
 +----------------------------------------------------------------------+
 | Authors:
 |   Lawrence Cherone <lawrence@cherone.co.uk>
 +----------------------------------------------------------------------+
 */

namespace Model;

class SSHKey extends \Base\Model
{
    /**
     * @return void
     */
    public function __construct()
    {
        parent::__construct('sshkey');
    }
    
    /**
     * Validate SSH public key
     * 
     * @param string $key
     * @return bool
     */
    public function validate($key = '') 
    {
        $key_parts = explode(' ', $key, 3);
          
        if (count($key_parts) < 2) {
            return false;
        }
        
        if (count($key_parts) > 3) {
            return false;
        }
          
        $algorithm = $key_parts[0];
        $key = $key_parts[1];
        
        if (!in_array($algorithm, array('ssh-rsa', 'ssh-dss'))) {
            return false;
        }
        
        $key_base64_decoded = base64_decode($key, true);
        
        if (empty($key_base64_decoded)) {
            return false;
        }
        
        $check = base64_decode(substr($key, 0, 16));
        $check = preg_replace("/[^\w\-]/", "", $check); 
        
        if ((string) $check !== (string) $algorithm) {
            return false;
        }
        return true;
    }
    
    /**
     * Get SSH public key fingerpring in MD5 format
     * 
     * @param string $key
     * @return string
     */
    public function fingerprint($key = '')
    {
        $content = explode(' ', $key, 3);

        return join(':', str_split(md5(base64_decode($content[1])), 2));
    }
}
