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
     * @param object $f3
     * @return void
     */
    public function post(\Base $f3)
    {
         // load remotes model
        $this->remotes = new \Base\Model('remotes');
        
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
            
            // get remote database entry
            $remote = $this->remotes->findOne('name = ? AND active = "1"', [$this->body['remote']]);
            
            if (empty($remote->id)) {
                $this->errors['remote'] = 'Remote not enabled'; 
            }
            
            if (!empty($this->errors)) {
                $this->result = [
                    'error' => $this->errors,
                    'code'  => 400,
                    'data'  => []
                ];
                return;
            }

            // build source

            // local image
            if ($this->body['remote'] == 'local') {
                $source = [
                    'type' => 'image',
                    'mode' => 'pull',
                    'fingerprint' => $this->body['image_fingerprint']
                ];
            } 
            // private remote (so easy when you can use the local instance to get remotes, no storing certs!!!)
            elseif (empty($remote->public)) {
                // get client certificate
                $remote_info = $this->lxd->query($this->body['remote'].':/1.0', 'GET', []);
                
                // create image secret
                $image_secret = $this->lxd->query($this->body['remote'].':/1.0/images/'.$this->body['image_fingerprint'].'/secret', 'POST', []);

                $source = [
                    'type' => 'image',
                    'mode' => 'pull',
                    'server' => $remote->url,
                    'protocol' => $remote->protocol,
                    'certificate' => $remote_info['environment']['certificate'],
                    'secret' => $image_secret['metadata']['secret'],
                    'fingerprint' => $this->body['image_fingerprint']
                ];
            } 
            // public remote
            else {
                $source = [
                    'type' => 'image',
                    'mode' => 'pull',
                    'server' => $remote->url,
                    'protocol' => $remote->protocol,
                    'fingerprint' => $this->body['image_fingerprint']
                ];
            }

            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->lxd->query('local:/1.0/containers', 'POST', [
                    "name" => $this->body['name'],
                    "architecture" => "x86_64",
                    "profiles" => $this->body['profile'],
                    "ephemeral" => $this->body['ephemeral'],
                    "config" => (object)[],
                    "devices" => [],
                    "source" => $source
                ])
            ];
            
            // wait for creation (debug)
            //print_r($this->lxd->query('local:/1.0/operations/'.$this->result['data']['id'].'/wait'));

            //! old way just call lxc launch
            // build out array of arguments which will make the final lxc launch command
            /*
            $cmd = [
                'lxc launch',
                // remote & image fingerprint
                escapeshellarg($this->body['remote']).':'.escapeshellarg($this->body['image_fingerprint']),
                // container name
                escapeshellarg($this->body['name']),
                // ephemeral
                !empty($this->body['ephemeral']) ? '-e' : '',
                // network, removed from ui as it adds a nic (bridge).. which you can do with devices
                !empty($this->body['network']) ? '-n '.escapeshellarg($this->body['network']) : '',
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
            */
        } catch (\Exception $e) {
            $this->result = [
                'error' => $e->getMessage(),
                'code'  => 422,
                'data'  => []
            ];
        }
    }

}
