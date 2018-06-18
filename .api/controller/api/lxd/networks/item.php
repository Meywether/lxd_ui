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
 
namespace Controller\Api\Lxd\Networks;

/**
 *
 */
class Item extends \Base\Controller
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
            if (!in_array('networks', $f3->get('modules.lxd'))) {
                throw new \Exception('Feature not enabled', 404);
            }
        } catch (\Exception $e) {
            $f3->response->json([
                'error' => $e->getMessage(),
                'code'  => $e->getCode(),
                'data'  => []
            ]);
        }

        // define model/s
        $this->lxd = new \Model\LXD($f3);
    }

    /**
     * GET /api/lxd/networks/@name
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
                'data'  => $this->lxd->networks->info('local', $f3->get('PARAMS.name'))
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
     * POST /api/lxd/networks/@name
     *
     * @param object $f3
     * @return void
     */
    public function post(\Base $f3)
    {
        try {
            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->lxd->networks->rename('local', $f3->get('PARAMS.name'), $this->body['name'])
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
     * PUT /api/lxd/networks/@name
     *
     * @param object $f3
     * @return void
     */
    public function put(\Base $f3)
    {
        try {
            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->lxd->networks->replace('local', $f3->get('PARAMS.name'), $this->body)
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
     * DELETE /api/lxd/networks/@name
     *
     * @param object $f3
     * @return void
     */
    public function delete(\Base $f3)
    {
        try {
            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->lxd->networks->delete('local', $f3->get('PARAMS.name'))
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
