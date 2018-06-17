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
 
namespace Base;

class Controller extends \Prefab
{
    /*
     * @var array
     */
    protected $body = [];
    
    /*
     * @var mixed
     */
    protected $result = []; 
    
    /*
     * @var array
     */
    protected $errors = [];

    /**
     * Before route handler
     * 
     * @param object $f3
     * @return void
     */
    public function beforeRoute(\Base $f3)
    {
        // decode json body & trim
        $this->body = (array) json_decode($f3->get('BODY'), true);
        $this->body = (array) $f3->recursive($this->body, function ($value) {
            return trim($value);
        });
    }

    /**
     * After route handler
     * 
     * @param object $f3
     * @return void
     */
    public function afterRoute(\Base $f3)
    {
        $f3->response->json($this->result);
    }
}
