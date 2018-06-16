<?php

namespace Controller\Api\Lxd\Networks;

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
        if (!in_array('networks', $f3->get('modules.lxd'))) {
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
     *
     */
    public function index(\Base $f3)
    {
        // GET | POST | PUT | DELETE
        $verb = $f3->get('VERB');

        /**
         * GET /api/lxd/networks
         */
        if ($verb === 'GET') {
            //
            $networks = $this->lxd->networks->list('local', function ($result) {
                return str_replace('/1.0/networks/', '', $result);
            });

            // get info
            $result = [];
            foreach ($networks as $i => $profile) {
            	$result[$i] = $this->lxd->networks->info('local', $profile);
            }

            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => $result
            ]);
        }
        
        /**
         * POST /api/lxd/networks
         */
        if ($verb === 'POST') {
            $item = json_decode($f3->get('BODY'), true);
            
            if (empty($item)) {
               $f3->response->json([
                    'error' => 'Invalid POST body, expecting item',
                    'code'  => 422,
                    'data'  => []
                ]); 
            }
            
            // fix config (cast to object)
            if (isset($item['config'])) {
                $item['config'] = (object) $item['config'];
            }

            try {
                try {
                    $result = $this->lxd->networks->create('local', $item);
                } catch (\Exception $e) {
                    throw $e;
                }

                $result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => $result
                ];
            } catch (\Exception $e) {
                $result = [
                    'error' => $e->getMessage(),
                    'code'  => 422,
                    'data'  => []
                ];
            }
            
            $f3->response->json($result);
        }
        
        /**
         * PUT /api/lxd/networks
         */
        /*
        if ($verb === 'PUT') {
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
        }
        */
        
        /**
         * DELETE /api/lxd/networks
         */
        /*
        if ($verb === 'DELETE') {
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
        }
        */
    }

    /**
     *
     */
    public function item(\Base $f3, $params)
    {
        // GET | POST | PUT | DELETE
        $verb = $f3->get('VERB');

        /**
         * GET /api/lxd/networks/@name
         */
        if ($verb === 'GET') {
            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => $this->lxd->networks->info('local', $params['name'])
            ]);
        }
        
        /**
         * POST /api/lxd/networks/@name
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
         * PUT /api/lxd/networks/@name
         */
        if ($verb === 'PUT') {
            $item = json_decode($f3->get('BODY'), true);
            
            if (empty($item)) {
               $f3->response->json([
                    'error' => 'Invalid PUT body, expecting item',
                    'code'  => 422,
                    'data'  => []
                ]); 
            }

            try {
                try {
                    $result = $this->lxd->networks->replace('local', $params['name'], $item);
                } catch (\Exception $e) {
                    throw $e;
                }

                $result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => $result
                ];
            } catch (\Exception $e) {
                $result = [
                    'error' => $e->getMessage(),
                    'code'  => 422,
                    'data'  => []
                ];
            }
            
            $f3->response->json($result);
        }
                
        /**
         * PATCH /api/lxd/networks/@name
         */
        if ($verb === 'PATCH') {
            /*
            $item = json_decode($f3->get('BODY'), true);
            
            if (empty($item) || !is_numeric($item['id'])) {
               $f3->response->json([
                    'error' => 'Invalid PATCH body, expecting item',
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
         * DELETE /api/lxd/networks/@name
         */
        if ($verb === 'DELETE') {
            try {
                try {
                    $result = $this->lxd->networks->delete('local', $params['name']);
                } catch (\Exception $e) {
                    throw $e;
                }

                $result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => $result
                ];
            } catch (\Exception $e) {
                $result = [
                    'error' => $e->getMessage(),
                    'code'  => 422,
                    'data'  => []
                ];
            }
            
            $f3->response->json($result);
        }
    }

}
