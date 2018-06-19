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
            if (!in_array('containers', $f3->get('modules.lxd'))) {
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
     * GET /api/lxd/containers/@name
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
                'data'  => $this->lxd->containers->info('local', $f3->get('PARAMS.name'))
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
     * POST /api/lxd/containers/@name
     *
     * @param object $f3
     * @return void
     */
    public function post(\Base $f3)
    {
        try {
            if (empty($this->body) || empty($f3->get('PARAMS.name'))) {
                $this->result = [
                    'error' => 'Invalid POST body, expecting item',
                    'code'  => 422,
                    'data'  => []
                ]; 
                return;
            }
                
            if (empty($this->body['name'])) {
                $this->errors['name'] = 'Container new name cannot be empty'; 
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
                'data'  => $this->lxd->containers->rename('local', $f3->get('PARAMS.name'), $this->body['name'])
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
     * PATCH /api/lxd/containers/@name
     *
     * @param object $f3
     * @return void
     */
    public function patch(\Base $f3)
    {
        try {
            if (empty($this->body) || empty($f3->get('PARAMS.name'))) {
                $this->result = [
                    'error' => 'Invalid PATCH body, expecting item',
                    'code'  => 422,
                    'data'  => []
                ]; 
                return;
            }

            if (isset($this->body['devices'])) {
                $this->body['devices'] = (array) $f3->recursive($this->body['devices'], function ($value) {
                    return trim($value);
                });
            }

            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->lxd->containers->update('local', $f3->get('PARAMS.name'), $this->body)
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
     * PUT /api/lxd/containers/@name
     *
     * @param object $f3
     * @return void
     */
    public function put(\Base $f3)
    {
        try {
            if (empty($this->body) || empty($f3->get('PARAMS.name'))) {
                $this->result = [
                    'error' => 'Invalid PATCH body, expecting item',
                    'code'  => 422,
                    'data'  => []
                ]; 
                return;
            }
            
            if (isset($this->body['devices'])) {
                $this->body['devices'] = (array) $f3->recursive($this->body['devices'], function ($value) {
                    return trim($value);
                });
            }

            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->lxd->containers->replace('local', $f3->get('PARAMS.name'), $this->body)
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
     * DELETE /api/lxd/containers/@name
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
                'data'  => $this->lxd->containers->delete('local', $f3->get('PARAMS.name'))
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
