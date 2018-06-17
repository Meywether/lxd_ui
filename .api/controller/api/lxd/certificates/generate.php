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
 
namespace Controller\Api\Lxd\Certificates;

/**
 *
 */
class Generate extends \Base\Controller
{
    /*
     * @var
     */
    private $lxd;

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
     * @param object $f3
     * @return void
     */
    public function beforeRoute(\Base $f3)
    {
        parent::beforeRoute($f3);
        
        try {
            \Lib\JWT::checkAuth();
        } catch (\Exception $e) {
            $f3->response->json([
                'error' => $e->getMessage(),
                'code'  => $e->getCode(),
                'data'  => []
            ]);
        }

        // check feature is enabled
        if (!in_array('certificates', $f3->get('modules.lxd'))) {
            $f3->status(404);
            $f3->response->json([
                'error' => 'Feature not enabled',
                'code'  => 404,
                'data'  => []
            ]);
        }

        // define model/s
        $this->lxd = new \Model\LXD($f3);
    }

    /**
     * POST /api/lxd/certificates/generate
     *
     * @param object $f3
     * @return void
     */
    public function post(\Base $f3)
    {
        try {
            $tmpname = tempnam("/tmp", "cert");
            
            // protect from nastys
            $this->body = (array) $f3->recursive($this->body, function ($value) {
            	return trim(preg_replace("/[^a-z0-9 \.-]/i", '', $value));
            });

            $subject = "/C={$this->body['subject']['c']}/ST={$this->body['subject']['st']}/L={$this->body['subject']['l']}/O={$this->body['subject']['o']}/OU={$this->body['subject']['ou']}/CN={$this->body['subject']['cn']}";

            // generate
            `openssl genrsa {$this->body['bits']} > "$tmpname.key"`;
            `openssl req -new -x509 -nodes -sha256 -days {$this->body['days']} -key "$tmpname.key" -out "$tmpname.crt" -subj "$subject"`;
            
            $this->result = [
                'key' => file_get_contents("$tmpname.key"),
                'pem' => file_get_contents("$tmpname.crt"),
            ]+$this->body;
            
            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->result
            ];
            
        } catch (\Exception $e) {
            $this->result = [
                'error' => $e->getMessage(),
                'code'  => 422,
                'data'  => []
            ];
        }
    }

}
