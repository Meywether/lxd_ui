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
class Index extends \Base\Controller
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
     * GET /api/lxd/containers
     *
     * @return void
     */
    public function get()
    {
        try {
            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->lxd->local('lxc list --format json')
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
     * POST /api/lxd/containers
     *
     * @return void
     */
    public function post(\Base $f3)
    {
        try {
            if (empty($this->body['name'])) {
                $this->errors['name'] = 'Container name cannot be empty'; 
            }
            
            if (empty($this->body['image_fingerprint'])) {
                $this->errors['image_fingerprint'] = 'Image fingerprint cannot be empty'; 
            }
            
            if (empty($this->body['profile'])) {
                $this->errors['profile'] = 'Container requires at least one profile'; 
            }
            
            if (empty($this->body['pool'])) {
                $this->errors['pool'] = 'Container requires a storage pool'; 
            }
            
            if (empty($this->body['remote'])) {
                $this->errors['remote'] = 'Remote cannot be empty'; 
            }
            
            if (!empty($this->errors)) {
                $this->result = [
                    'error' => $this->errors,
                    'code'  => 400,
                    'data'  => []
                ];
                return;
            }

            // build out array of arguments which will make the final lxc launch command
            $cmd = [
                'lxc launch',
                // remote & image fingerprint
                escapeshellarg($this->body['remote']).':'.escapeshellarg($this->body['image_fingerprint']),
                // container name
                escapeshellarg($this->body['name']),
                // ephemeral
                !empty($this->body['ephemeral']) ? '-e' : '',
                // profiles
                '-p '.implode(' -p ', (array) $f3->recursive((array) $this->body['profile'], function ($value) {
                	return  escapeshellarg($value);
                })),
                // storage pool
                '-s '.escapeshellarg($this->body['pool'])
            ];

            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->lxd->local(implode(' ', $cmd))
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
