<?php

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
    private $cache;
    
    /*
     * @var
     */
    private $cache_ttl;
    
    public function beforeRoute(\Base $f3)
    {
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
        
        $this->lxd = new \Model\LXD($f3);
        
        $this->cache = \Cache::instance();
        $this->cache_ttl = 5;
    }

    /**
     *
     */
    public function index(\Base $f3, $params)
    {
        // GET | POST | PUT | DELETE
        $verb = $f3->get('VERB');

        /**
         * POST /api/lxd/containers/@name/copy
         */
        if ($verb === 'POST') {
            $body = json_decode($f3->get('BODY'), true);
            
            ignore_user_abort(true);
            set_time_limit(0);
            
            $params['container'] = !empty($body['name_alt']) ? $body['name_alt'] : $params['name'].'-copy';

            try {
                $response = [
                    'error' => null,
                    'code'  => 200,
                    'data'  => $this->lxd->local('lxc copy local:'.$params['name'].' '.$body['remote'].':'.$params['container'].' --container-only')
                ];
            } catch (\Exception $e) {
                $response = [
                    'error' => $e->getMessage(),
                    'code'  => $e->getCode(),
                    'data'  => []
                ];
            }
            
            $this->cache->clear('images.'.$f3->get('GET.remote'));

            $f3->response->json($response, false);
        }
        
    }

}
