<?php

namespace Base;

class Controller extends \Prefab
{
    public function beforeRoute(\Base $f3)
    {
    }

    public function afterRoute(\Base $f3)
    {
        $f3->response->html();
    }
}
