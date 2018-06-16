<?php

namespace Base;

class Controller extends \Prefab
{
    /*
     * @var
     */
    protected $body = [];
    
    /*
     * @var
     */
    protected $result = []; 
    
    /*
     * @var
     */
    protected $errors = [];
    
    /**
     * Before route handler
     */
    public function beforeRoute(\Base $f3)
    {
        // decode json body & trim
        $this->body = json_decode($f3->get('BODY'), true);
        $this->body = (array) $f3->recursive((array) $this->body, function($value) {
            return trim($value);
        });
    }

    /**
     * After route handler
     */
    public function afterRoute(\Base $f3)
    {
        $f3->response->json($this->result);
    }
}
