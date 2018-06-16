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

namespace Controller\Api\Lxd\Devices\Nic;

/**
 *
 */
class Index extends \Base\Controller
{
    /*
     * @var \Base\Controller::$body
     */
    protected $body = []; 

    /*
     * @var \Base\Controller::$result
     */
    protected $result = []; 
    
    /*
     * @var \Base\Controller::$errors
     */
    protected $errors = []; 
    
    /*
     * @var \Base\Model
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
        } catch (\Exception $e) {
            $f3->response->json([
                'error' => $e->getMessage(),
                'code'  => $e->getCode(),
                'data'  => []
            ]);
        }

        // check feature is enabled
        if (!in_array('devices', $f3->get('modules.lxd'))) {
            $f3->status(404);
            $f3->response->json([
                'error' => 'Feature not enabled',
                'code'  => 404,
                'data'  => []
            ]);
        }

        $this->devices = new \Base\Model('devices');
    }

    /**
     * GET /api/lxd/devices/nic
     *
     * @return void
     */
    public function get()
    {
        try {
            $this->result = $this->devices->findAll('type = "nic"');

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
     * POST /api/lxd/devices/nic
     *
     * @return void
     */
    public function post(\Base $f3)
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
                'type' => 'nic',
                'name' => $this->body['name'],
                'dict' => json_encode([
                    "nictype" => $this->body['dict']['nictype'],
                    "limits.ingress" => $this->body['dict']['limits.ingress'],
                    "limits.egress" => $this->body['dict']['limits.egress'],
                    "limits.max" => $this->body['dict']['limits.max'],
                    "name" => $this->body['dict']['name'],
                    "host_name" => $this->body['dict']['host_name'],
                    "hwaddr" => $this->body['dict']['hwaddr'],
                    "mtu" => $this->body['dict']['mtu'],
                    "vlan" => $this->body['dict']['vlan'],
                    "ipv4.address" => $this->body['dict']['ipv4.address'],
                    "ipv6.address" => $this->body['dict']['ipv6.address'],
                    "security.mac_filtering" => $this->body['dict']['security.mac_filtering'],
                    "maas.subnet.ipv4" => $this->body['dict']['maas.subnet.ipv4'],
                    "maas.subnet.ipv6" => $this->body['dict']['maas.subnet.ipv6'],
                    "parent" => $this->body['dict']['parent']
                ], JSON_PRETTY_PRINT)
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
