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

namespace Controller;

/**
 * Index Controller
 */
class Index extends \Base\Controller
{
    /**
     * Serves the SPA entry page, redirects or sends 204
     * 
     * @param object $f3
     * @return void
     */
    public function index(\Base $f3)
    {
        // load spa if exists, and enabled
        if (file_exists('public/ui/index.html') && !$f3->devoid('PANEL.enabled')) {
            echo \View::instance()->render('public/ui/index.html');
        } 
        // not enabled, with redirect
        elseif($f3->devoid('PANEL.enabled') && !$f3->devoid('PANEL.redirect')) {
            header("Location: ".$f3->get('PANEL.redirect'));
        } 
        // no content
        else {
            header("HTTP/1.1 204 No Content");
        }
        exit;
    }

    /**
     * Serves favicon
     * 
     * @param object $f3
     * @return void
     */
    public function favicon(\Base $f3)
    {
        if (file_exists('ui/favicon.ico')) {
            \Web::instance()->send(
                'ui/favicon.ico', 'image/x-icon', 2048, false
            );
        }
        $f3->status(404);
    }

    /**
     * Send pong, for connection check
     * 
     * @param object $f3
     * @return void
     */
    public function ping(\Base $f3)
    {
        $f3->status(200);
        die('pong');
    }

}
