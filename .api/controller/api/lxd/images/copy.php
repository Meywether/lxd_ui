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
 
namespace Controller\Api\Lxd\Images;

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
    protected $cache;     
    
    /*
     * @var
     */
    protected $cache_ttl = 3600;
    
    /**
     * @param object $f3
     * @return void
     */
    public function beforeRoute(\Base $f3)
    {
        parent::beforeRoute($f3);
        
        try {
            \Lib\JWT::checkAuth();
            if (!in_array('images', $f3->get('modules.lxd'))) {
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
        
        $this->cache = \Cache::instance();
    }

    /**
     * POST /api/lxd/images/@fingerprint/copy
     *
     * @param object $f3
     * @return void
     */
    public function post(\Base $f3)
    {
        try {
            // expect ?remote=local
            if ($f3->devoid('GET.remote')) {
                $this->result = [
                    'error' => 'Missing remote parameter',
                    'code'  => 400,
                    'data'  => []
                ];
            }

            ignore_user_abort(true);
            set_time_limit(0);

            $from_remote = escapeshellarg($f3->get('GET.remote'));
            $to_remote = escapeshellarg($this->body['remote']);
            $fingerprint = escapeshellarg($f3->get('PARAMS.fingerprint'));

            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->lxd->local('lxc image copy '.$from_remote.':'.$fingerprint.' '.$to_remote.':')
            ];
            
            $this->cache->clear('images.'.$f3->get('GET.remote'));
            $this->cache->clear('images.'.$this->body['remote']);
        } catch (\Exception $e) {
            $this->result = [
                'error' => $e->getMessage(),
                'code'  => 422,
                'data'  => []
            ];
        }
    }
    
}
