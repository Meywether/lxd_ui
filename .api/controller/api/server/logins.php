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

namespace Controller\Api\Server;

/**
 *
 */
class Logins extends \Base\Controller
{
    /*
     * @var mixed \Base\Controller::$result
     */
    protected $result = []; 

    /*
     * @var object \Model\System
     */
    private $system;
        
    /*
     * @var object \Cache
     */
    private $cache;
    
    /*
     * @var int
     */
    private $cache_ttl = 5;
                    
    /*
     * @var int
     */
    private $cache_key = 'logins';

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

        // load models
        $this->system = new \Model\System($f3);
        $this->cache = \Cache::instance();
    }

    /**
     * GET /api/server/logins
     *
     * @return void
     */
    public function get()
    {
        try {
            if (!$this->cache->exists($this->cache_key, $this->result)) {
                //
                $this->result = $this->system->enumerate(['logins']);
                //
                $this->result['logins'] = array_values(array_filter($this->result['logins'], function ($item) {
                    return $item['User'] != 'Reboot';
                }));
                //
                $this->cache->set($this->cache_key, $this->result, $this->cache_ttl);
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

}
