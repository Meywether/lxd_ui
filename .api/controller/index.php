<?php

namespace Controller;

/**
 * Index Controller
 */
class Index extends \Base\Controller
{
    /**
     * Handles sending the SPA entry page
     */
    public function index(\Base $f3)
    {
        // load spa if exists, and enabled
        if (file_exists('public/ui/index.html') && !$f3->devoid('PANEL.enabled')) {
            exit(\View::instance()->render('public/ui/index.html'));
        } 
        // not enabled, with redirect
        elseif($f3->devoid('PANEL.enabled') && !$f3->devoid('PANEL.redirect')) {
            exit(header("Location: ".$f3->get('PANEL.redirect')));
        } 
        // no content
        else {
            exit(header("HTTP/1.1 204 No Content"));
        }
    }
    
    /**
     * Handles favicon
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
     * Handles pong'ing back, for status check
     */
    public function ping(\Base $f3)
    {
        $f3->status(200);
        die('pong');
    }

}
