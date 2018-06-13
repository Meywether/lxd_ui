<?php

namespace Controller\Api\Lxd\Containers;

/**
 *
 */
class Files extends \Base\Controller
{
    public function beforeRoute(\Base $f3, $params)
    {
        try {
            \Lib\JWT::checkAuthThen(function ($server) use ($f3) {
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
         * GET /api/lxd/containers/@name/files?path=*
         */
        if ($verb === 'GET') {
            
            $items = $client->lxd->containers->files->list('local', $params['name'], $f3->get('GET.path'));
            
            if (is_array($items)) {
                $items = [
                    'type' => 'listing',
                    'data' => array_values($items)
                ];
            } else {
                $items = [
                    'type' => 'file',
                    'data' => $items
                ];
            }

            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => $items
            ]);
        }
        
        /**
         * POST /api/lxd/containers/@name/files?path=*
         */
        if ($verb === 'POST') {
            
            $body = json_decode($f3->get('BODY'), true);

            $items = $client->lxd->containers->files->push('local', $params['name'], $body['source'], $f3->get('GET.path'));

            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => $items
            ]);
        }

        /**
         * DELETE /api/lxd/containers/@name/files?path=*
         */
        if ($verb === 'DELETE') {
            $items = $client->lxd->containers->files->remove('local', $params['name'], $f3->get('GET.path'));

            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => $items
            ]);
        }

    }

}
