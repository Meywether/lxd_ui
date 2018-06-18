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

namespace Controller\Api\Lxd\Devices\Proxy;

/**
 *
 */
class Item extends \Base\Controller
{
    /*
     * @var array \Base\Controller::$body
     */
    protected $body = []; 

    /*
     * @var mixed \Base\Controller::$result
     */
    protected $result = []; 
    
    /*
     * @var array \Base\Controller::$errors
     */
    protected $errors = []; 
    
    /*
     * @var object \Base\Model
     */
    private $devices;

    /**
     * @param object $f3
     * @return void
     */
    public function beforeRoute(\Base $f3)
    {
        parent::beforeRoute($f3);

        try {
            \Lib\JWT::checkAuth();
            if (!in_array('devices', $f3->get('modules.lxd'))) {
                throw new \Exception('Feature not enabled', 404);
            }
        } catch (\Exception $e) {
            $f3->response->json([
                'error' => $e->getMessage(),
                'code'  => $e->getCode(),
                'data'  => []
            ]);
        }

        $this->devices = new \Base\Model('devices');
    }

    /**
     * GET /api/lxd/devices/proxy/@id
     *
     * @param object $f3
     * @return void
     */
    public function get(\Base $f3)
    {
        try {
            $this->result = $this->devices->load($f3->get('PARAMS.id'));
                
            if (!empty($this->result->id)) {
                $this->result['dict'] = json_decode($this->result['dict']);
            } else {
                throw new \Exception('Not found', 404);
            }

            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => array_values($this->result)
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
     * PUT /api/lxd/devices/proxy/@id
     *
     * @param object $f3
     * @return void
     */
    public function put(\Base $f3)
    {
        try {
            if (empty($this->body) || !is_numeric($this->body['id'])) {
                throw new \Exception('Invalid PUT body', 422);
            }
            
            //
            if (empty($this->body['name'])) {
                $this->errors['name'] = 'Device name cannot be empty';
            }

            //
            if (empty($this->body['dict']['listen'])) {
                $this->errors['dict'] = [
                    'listen' => 'Device listen address cannot be empty'
                ];
            }
            
            //
            if (empty($this->body['dict']['connect'])) {
                $this->errors['dict'] = [
                    'connect' => 'Device connect address cannot be empty'
                ];
            }

            if (!empty($this->errors)) {
                $this->result = [
                    'error' => $this->errors,
                    'code'  => 422,
                    'data'  => []
                ];
                return;
            }

            $this->result = $this->devices->load($f3->get('PARAMS.id'));
            
            if (empty($this->result->id)) {
                throw new \Exception('Not found', 404);
            }

            $this->result->import([
                'type' => 'proxy',
                'name' => $this->body['name'],
                'dict' => json_encode($this->body['dict'])
            ]);

            $this->devices->store($this->result);
            
            //
            $this->result['dict'] = json_decode($this->result['dict']);
            
            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->result
            ];
        } catch (\Exception $e) {
            $this->result = [
                'error' => $e->getMessage(),
                'code'  => $e->getCode(),
                'data'  => []
            ];
        }
    }

    /**
     * DELETE /api/lxd/devices/proxy/@id
     *
     * @param object $f3
     * @return void
     */
    public function delete(\Base $f3)
    {
        try {
            $this->result = $this->devices->load($f3->get('PARAMS.id'));

            if (empty($this->result->id)) {
                throw new \Exception('Not found', 404);
            }
            
            $this->devices->trash($this->result);

            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => []
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
