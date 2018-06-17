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
 
namespace Lib;

class Response extends \Prefab
{
    /*
     * @var object \Base
     */
    protected $f3;

    /**
     * @param object $f3
     * @return object
     */
    public function __construct(\Base $f3)
    {
        $this->f3 = $f3;
    }

    /**
     * @param array $data
     * @param bool $halt
     * @return string|void
     */
    public function json($data = [], $halt = true)
    {
        $data = json_encode($data, JSON_PRETTY_PRINT | JSON_PRESERVE_ZERO_FRACTION);
        
        header('Content-Type: application/json;charset=utf8');
        header('Content-Length: '.strlen($data));
        
        if ($halt) {
            exit($data);
        }
        
        ignore_user_abort(true);
        set_time_limit(0);
        echo $data;
        header('Connection: close');
        ob_end_flush();
        session_write_close();
        fastcgi_finish_request();
    }

    /**
     * @return string|void
     */
    public function html()
    {
        if (!empty($this->f3->get('template'))) {
            echo \View::instance()->render($this->f3->get('template'));
        }
    }
}
