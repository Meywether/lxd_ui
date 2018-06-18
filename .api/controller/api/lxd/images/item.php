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
    
    /*
     * @var
     */
    protected $cache;     
    
    /*
     * @var
     */
    protected $cache_ttl = 5;
    
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
        
        $this->cache = \Cache::instance();
    }

    /**
     * PUT /api/lxd/images/@fingerprint
     *
     * @param object $f3
     * @return void
     */
    public function put(\Base $f3)
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
            
            $this->body['auto_update'] = $this->body['auto_update'] == '1';
            $this->body['cached'] = $this->body['cached'] == '1';
            $this->body['public'] = $this->body['public'] == '1';
            $this->body['size'] = (int) $this->body['size'];
            
            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->lxd->images->replace($f3->get('GET.remote'), $f3->get('PARAMS.fingerprint'), $this->body)
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
    
    /**
     * DELETE /api/lxd/images/@fingerprint
     *
     * @param object $f3
     * @return void
     */
    public function delete(\Base $f3)
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
            
            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->lxd->images->delete($f3->get('GET.remote'), $f3->get('PARAMS.fingerprint'))
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
