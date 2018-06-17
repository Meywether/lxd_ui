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
class Copy extends \Base\Controller
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
    
    /*
     * @var
     */
    private $cache;

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
        
        $this->cache = \Cache::instance();
    }

    /**
     * POST /api/lxd/containers/@name/copy
     *
     * @return void
     */
    public function post(\Base $f3)
    {
        try {
            if (empty($this->body['name_alt'])) {
                $this->errors['name_alt'] = 'Container name cannot be empty'; 
            } else {
                $this->body['name_alt'] = escapeshellarg($this->body['name_alt']);
            }
            
            if (empty($this->body['remote'])) {
                $this->errors['remote'] = 'Remote cannot be empty'; 
            } else {
                $this->body['remote'] = escapeshellarg($this->body['remote']);
            }

            if (!empty($this->errors)) {
                $this->result = [
                    'error' => $this->errors,
                    'code'  => 400,
                    'data'  => []
                ];
                return;
            }

            ignore_user_abort(true);
            set_time_limit(0);

            $container = !empty($this->body['name_alt']) ? $this->body['name_alt'] : escapeshellarg($f3->get('PARAMS.name')).'-copy';

            $this->result = [
                'error' => null,
                'code'  => 200,
                'data'  => $this->lxd->local('lxc copy local:'.$f3->get('PARAMS.name').' '.$this->body['remote'].':'.$container.' --container-only')
            ];

            $this->cache->clear('images.'.$f3->get('GET.remote'));
        } catch (\Exception $e) {
            $this->result = [
                'error' => $e->getMessage(),
                'code'  => 422,
                'data'  => []
            ];
        }
    }

}
