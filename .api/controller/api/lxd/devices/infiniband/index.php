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

namespace Controller\Api\Lxd\Devices\Infiniband;

/**
 *
 */
class Index extends \Base\Controller
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
     * GET /api/lxd/devices/gpu
     *
     * @return void
     */
    public function get()
    {
        try {
            $this->result = (array) $this->devices->findAll('type = "infiniband"');

            foreach ($this->result as &$row) {
                $row['dict'] = json_decode($row['dict']);
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
     * POST /api/lxd/devices/gpu
     *
     * @return void
     */
    public function post()
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
            if (empty($this->body['dict']['parent'])) {
                $this->errors['dict'] = [
                    'parent' => 'Device parent cannot be empty'
                ];
            }
            
            //
            if (empty($this->body['dict']['nictype'])) {
                $this->errors['dict'] = [
                    'nictype' => 'Device nic type cannot be empty'
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

            $this->result = $this->devices->create(['name' => $this->body['name']]);

            $this->result->import([
                'type' => 'infiniband',
                'name' => $this->body['name'],
                'dict' => json_encode($this->body['dict'])
            ]);

            $this->devices->store($this->result);

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

}
