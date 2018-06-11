<?php

namespace Lib;

class Response extends \Prefab
{
    /*
     * @var
     */
    protected $f3;

    public function __construct(\Base $f3)
    {
        $this->f3 = $f3;
    }

    public function json($data = null, $halt = true)
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

    public function html()
    {
        if (!empty($this->f3->get('template'))) {
            echo \View::instance()->render($this->f3->get('template'));
        }
    }
}
