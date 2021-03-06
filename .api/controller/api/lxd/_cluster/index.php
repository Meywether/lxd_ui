<?php

namespace Controller\Api\Lxd\Cluster;

/**
 *
 */
class Index extends \Base\Controller
{
    /*
     * @var
     */
    private $lxd;
    
    public function beforeRoute(\Base $f3)
    {
        // check auth
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
        if (!in_array('cluster', $f3->get('modules.lxd'))) {
            $f3->status(404);
            $f3->response->json([
                'error' => 'Feature not enabled',
                'code'  => 404,
                'data'  => []
            ]);
        }
        
        $this->lxd = new \Model\LXD($f3);
    }

    /**
     * @todo
     */
    public function index(\Base $f3)
    {
        // GET | POST | PUT | DELETE
        $verb = $f3->get('VERB');
        
        // plinker client
        //$client = $f3->get('plinker');
        
        /**
         * GET /api/lxd
         */
        if ($verb === 'GET') {
            /*
            // get containers
            $result = $client->lxd->containers->list('local', function ($result) {
                return str_replace('/1.0/containers/', '', $result);
            });

            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => $result
            ]);
            */
        }
        
        /**
         * POST /api/lxd/containers
         */
        if ($verb === 'POST') {
            /*
            $f3->response->json([
                'error' => '',
                'code'  => 200,
                'data'  => []
            ]);
            */
        }
        
        /**
         * PUT /api/lxd/containers
         */
        if ($verb === 'PUT') {
            /*
            $item = json_decode($f3->get('BODY'), true);
            
            if (empty($item) || !is_numeric($item['id'])) {
               $f3->response->json([
                    'error' => 'Invalid PUT body, expecting item',
                    'code'  => 422,
                    'data'  => []
                ]); 
            }
            
            $f3->response->json([
                'error' => '',
                'code'  => 200,
                'data'  => []
            ]);
            */
        }
        
        /**
         * DELETE /api/lxd/containers
         */
        if ($verb === 'DELETE') {
            /*
            $item = json_decode($f3->get('BODY'), true);
            
            if (empty($item) || !is_numeric($item['id'])) {
               $f3->response->json([
                    'error' => 'Invalid DELETE body, expecting item',
                    'code'  => 422,
                    'data'  => []
                ]); 
            }
            
            $f3->response->json([
                'error' => '',
                'code'  => 200,
                'data'  => []
            ]);
            */
        }
    }

}
