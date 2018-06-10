<?php

namespace Controller\Api\Lxd\Containers;

/**
 *
 */
class Copy extends \Base\Controller
{
    public function beforeRoute(\Base $f3, $params)
    {
        try {
            \Lib\JWT::checkAuthThen(function ($server) use ($f3) {
                // set plinker client
                $f3->set('plinker', new \Plinker\Core\Client($server, [
                    'secret' => $f3->get('AUTH.secret'),
                    'database' => $f3->get('db'),
                    'lxc_path' => $f3->get('LXC.path')
                ]));
            });
        } catch (\Exception $e) {
            $f3->response->json([
                'error' => $e->getMessage(),
                'code'  => $e->getCode(),
                'data'  => []
            ]);
        }
        
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
        
        // plinker client
        $client = $f3->get('plinker');
        
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
                    'data'  => $client->lxd->local('lxc copy local:'.$params['name'].' '.$body['remote'].':'.$params['container'].' --container-only')
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
