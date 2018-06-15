<?php

namespace Controller\Api\Lxd\Containers;

/**
 *
 */
class Exec extends \Base\Controller
{
    public function beforeRoute(\Base $f3, $params)
    {
        // check auth
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
        
        // check feature is enabled
        if (!in_array('containers', $f3->get('modules.lxd'))) {
            $f3->status(404);
            $f3->response->json([
                'error' => 'Feature not enabled',
                'code'  => 404,
                'data'  => []
            ]);
        }
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
         * GET /api/lxd/containers/@name/state
         */
        if ($verb === 'GET') {
            /*
            //
            $result = $client->lxd->containers->getState('local', $params['name']);

            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => $result
            ]);
            */
        }
        
        /**
         * POST /api/lxd/containers/@name/state
         */
        if ($verb === 'POST') {
            /*
            $body = json_decode($f3->get('BODY'), true);
            //
            $result = $client->lxd->containers->exec('local', $params['name'], $body);
            
            $f3->response->json([
                'error' => '',
                'code'  => 200,
                'data'  => $result
            ]);
            */
        }
        
        /**
         * PUT /api/lxd/containers/@name/state
         */
        if ($verb === 'PUT') {
            /*
            $body = json_decode($f3->get('BODY'), true);
            
            if (empty($body)) {
               $f3->response->json([
                    'error' => 'Invalid PUT body',
                    'code'  => 422,
                    'data'  => []
                ]); 
            }
            
            //
            $result = $client->lxd->containers->setState('local', $params['name'], $body);

            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => $result
            ]);
            */
        }
    }

}
