<?php

namespace Controller\Api\Lxd\Storage;

/**
 *
 */
class Index extends \Base\Controller
{
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
        if (!in_array('storage', $f3->get('modules.lxd'))) {
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
         * GET /api/lxd/storage
         */
        if ($verb === 'GET') {
            $types = (array) $f3->get('GET.types');
            
            //
            $pools = $this->lxd->query('local:/1.0/storage-pools', 'GET', [], function ($result) {
                return str_replace('/1.0/storage-pools/', '', $result);
            });

            if (!empty($types)) {
                //
                $result = [];
                
                try {
                    // name
                    if (in_array('name', $types)) {
                        foreach ($pools as $i => $pool) {
                            $result[$i]['name'] = $pool;
                        }
                    }
                    
                    // get info
                    if (in_array('info', $types)) {
                        foreach ($pools as $i => $pool) {
                            $result[$i]['info'] = $this->lxd->query('local:/1.0/storage-pools/'.$pool, 'GET', []);
                        }
                    }
                    
                    // get resources
                    if (in_array('resources', $types)) {
                        foreach ($pools as $i => $pool) {
                            $result[$i]['resources'] = $this->lxd->query('local:/1.0/storage-pools/'.$pool.'/resources', 'GET', []);
                        }
                    }    
                    
                    // get volumes
                    if (in_array('volumes', $types)) {
                        foreach ($pools as $i => $pool) {
                            $volumes = $this->lxd->query('local:/1.0/storage-pools/'.$pool.'/volumes', 'GET', [], function ($result) {
                                $result = str_replace('/1.0/storage-pools/', '', $result);
                                foreach ($result as &$row) {
                                    $row = explode('/', $row);
                                    $row = ['type' => $row[2], 'name' => $row[3]];
                                }
                                return $result;
                            });
                            $result[$i]['volumes'] = $volumes;
                        }
                    }
                } catch (\Exception $e) {
                    $result = [
                        'error' => $e->getMessage(),
                        'code'  => 422,
                        'data'  => []
                    ];
                }
            } else {
                $result = $pools;
            }

            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => $result
            ]);
        }
        
        /**
         * POST /api/lxd/storage
         */
        if ($verb === 'POST') {
            $body = json_decode($f3->get('BODY'), true);
            
            $errors = [];
            if (empty($body['name'])) {
                $errors['name'] = 'Storage pool name cannot be empty'; 
            }

            if (!empty($errors)) {
                $f3->response->json([
                    'error' => $errors,
                    'code'  => 400,
                    'data'  => []
                ]);
            }
            
            // fix config (cast to object)
            if (isset($body['config'])) {
                $body['config'] = (object) $body['config'];
            }
            
            try {
                //
                $pool = $this->lxd->query('local:/1.0/storage-pools', 'POST', $body);

                $result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => $pool
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
    
    /**
     *
     */
    public function item(\Base $f3, $params)
    {
        // GET | POST | PUT | DELETE
        $verb = $f3->get('VERB');

        /**
         * GET /api/lxd/storage/@name
         */
        if ($verb === 'GET') {
            //
            $result = $this->lxd->query('local:/1.0/storage-pools/'.$params['name'], 'GET', []);

            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => $result
            ]);
        }
        
        /**
         * POST /api/lxd/storage/@name
         */
        if ($verb === 'POST') {
            $body = json_decode($f3->get('BODY'), true);
            
            $errors = [];
            if (empty($params['name']) || empty($body['name'])) {
                $errors['name'] = 'Storage pool names cannot be empty'; 
            }

            if (!empty($errors)) {
                $f3->response->json([
                    'error' => $errors,
                    'code'  => 400,
                    'data'  => []
                ]);
            }

            try {
                //
                $pool = $this->lxd->query('local:/1.0/storage-pools/'.$params['name'], 'POST', $body);

                $result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => $pool
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
         * PUT /api/lxd/storage/@name
         */
        if ($verb === 'PUT') {
            $body = json_decode($f3->get('BODY'), true);
            
            $errors = [];
            if (empty($body['name'])) {
                $errors['name'] = 'Storage pool name cannot be empty'; 
            }

            if (!empty($errors)) {
                $f3->response->json([
                    'error' => $errors,
                    'code'  => 400,
                    'data'  => []
                ]);
            }
            
            // fix config (cast to object)
            if (isset($body['config'])) {
                $body['config'] = (object) $body['config'];
            }
            
            try {
                //
                $pool = $this->lxd->query('local:/1.0/storage-pools/'.$params['name'], 'PUT', $body);

                $result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => $pool
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
         * DELETE /api/lxd/storage/@name
         */
        if ($verb === 'DELETE') {
            try {
                $result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => $this->lxd->query('local:/1.0/storage-pools/'.$params['name'], 'DELETE')
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
