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
 
namespace Controller\Api\Lxd\Containers;

/**
 *
 */
class State extends \Base\Controller
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
        if (!in_array('containers', $f3->get('modules.lxd'))) {
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
     * POST /api/lxd/containers/@name/state
     *
     * @param object $f3
     * @return void
     */
    public function get(\Base $f3)
    {
        try {
            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->lxd->containers->getState('local', $f3->get('PARAMS.name'))
            ];
        } catch (\Exception $e) {
            $this->result = [
                'error' => $e->getMessage(),
                'code'  => 422,
                'data'  => []
            ];
        }
    }
    
    /**
     * PUT /api/lxd/containers/@name/state
     *
     * @param object $f3
     * @return void
     */
    public function put(\Base $f3)
    {
        $this->body['force'] = $this->body['force'] === '1';
        $this->body['stateful'] = $this->body['stateful'] === '1';
        $this->body['timeout'] = (int) $this->body['timeout'];
        
        try {
            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->lxd->containers->setState('local', $f3->get('PARAMS.name'), $this->body)
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
