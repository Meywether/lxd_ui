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
     * GET /api/lxd/images
     *
     * @param object $f3
     * @return void
     */
    public function get(\Base $f3)
    {
        try {
            // expect ?remote=local
            if ($f3->devoid('GET.remote')) {
                $this->result = [
                    'error' => 'Missing remote parameter',
                    'code'  => 400,
                    'data'  => []
                ];
                return;
            }
            
            // cache remote images if not local
            if ($f3->get('GET.remote') === 'local' || !$this->cache->exists('images.'.$f3->get('GET.remote'), $this->result)) {
                // get images filter by architecture (may add as a parameter if ever needed)
                $this->result = $this->lxd->images->list($f3->get('GET.remote'), 'architecture="'.implode('|', ['x86_64', 'i686', 'amd64']).'"');
                //
                $this->cache->set('images.'.$f3->get('GET.remote'), $this->result, $this->cache_ttl);
            }

            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->result
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
     * POST /api/lxd/images
     * 
     * @return void
     */
    public function post()
    {
        try {
            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->lxd->images->create('local', $this->body)
            ];
            
            $this->cache->clear('images.local');
        } catch (\Exception $e) {
            $this->result = [
                'error' => $e->getMessage(),
                'code'  => 422,
                'data'  => []
            ];
        }
    }

}
