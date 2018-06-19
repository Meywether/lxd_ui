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
 
namespace Controller\Api\Lxd\Storage;

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
    protected $body;
    
    /*
     * @var
     */
    protected $result; 
    
    /*
     * @var
     */
    protected $errors; 

    /**
     * @param object $f3
     * @return void
     */
    public function beforeRoute(\Base $f3)
    {
        parent::beforeRoute($f3);
        
        try {
            \Lib\JWT::checkAuth();
            if (!in_array('storage', $f3->get('modules.lxd'))) {
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
     * GET /api/lxd/storage/@name
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
                'data'  => $this->lxd->query('local:/1.0/storage-pools/'.$f3->get('PARAMS.name'), 'GET', [])
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
     * POST /api/lxd/storage/@name
     *
     * @param object $f3
     * @return void
     */
    public function post(\Base $f3)
    {
        try {
            if (empty($f3->get('PARAMS.name')) || empty($this->body['name'])) {
                $this->errors['name'] = 'Storage pool names cannot be empty'; 
            }

            if (!empty($this->errors)) {
                $this->result = [
                    'error' => $this->errors,
                    'code'  => 400,
                    'data'  => []
                ];
                return;
            }
            
            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->lxd->query('local:/1.0/storage-pools/'.$f3->get('PARAMS.name'), 'POST', $this->body)
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
     * PUT /api/lxd/storage/@name
     *
     * @param object $f3
     * @return void
     */
    public function put(\Base $f3)
    {
        try {
            // fix config (cast to object)
            if (isset($this->body['config'])) {
                $this->body['config'] = (object) $this->body['config'];
            }
            
            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->lxd->query('local:/1.0/storage-pools/'.$f3->get('PARAMS.name'), 'PUT', $this->body)
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
     * DELETE /api/lxd/storage/@name
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
                'data'  => $this->lxd->query('local:/1.0/storage-pools/'.$f3->get('PARAMS.name'), 'DELETE')
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
