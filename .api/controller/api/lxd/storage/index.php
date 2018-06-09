<?php

namespace Controller\Api\Lxd\Storage;

/**
 *
 */
class Index extends \Base\Controller
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
         * GET /api/lxd/storage
         */
        if ($verb === 'GET') {
            $types = (array) $f3->get('GET.types');
            
            //
            $pools = $client->lxd->query('local:/1.0/storage-pools', 'GET', [], function ($result) {
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
                        	$result[$i]['info'] = $client->lxd->query('local:/1.0/storage-pools/'.$pool, 'GET', []);
                        }
                    }
                    
                    // get resources
                    if (in_array('resources', $types)) {
                        foreach ($pools as $i => $pool) {
                        	$result[$i]['resources'] = $client->lxd->query('local:/1.0/storage-pools/'.$pool.'/resources', 'GET', []);
                        }
                    }    
                    
                    // get volumes
                    if (in_array('volumes', $types)) {
                        foreach ($pools as $i => $pool) {
                        	$volumes = $client->lxd->query('local:/1.0/storage-pools/'.$pool.'/volumes', 'GET', [], function ($result) {
                                $result = str_replace('/1.0/storage-pools/default/volumes/', '', $result);
                                foreach ($result as &$row) {
                                    $row = explode('/', $row);
                                    $row = ['type' => $row[0], 'name' => $row[1]];
                                }
                                return $result;
                            });
                        	
                        	/*
                        	$client->lxd->query('local:/1.0/storage-pools/default/volumes', 'POST', [
                                "config" => (object) [],
                                "pool" => "default",
                                "name" => "vol1",
                                "type" => "custom"
                            ]);
                        	*/
                      
                     
                        	// get volume info
                        	//if (in_array('volume_info', $types)) {
                        	//    foreach ($volumes as $volume) {
                        	//        $result[$i]['volumes'][] = $client->lxd->query('local:'.$volume, 'GET', []);
                        	//        print_r($result);
                        	//    }
                        	//} else {
                        	    $result[$i]['volumes'] = $volumes;
                        	//}
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
                $pool = $client->lxd->query('local:/1.0/storage-pools', 'POST', $body);

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
        
        // plinker client
        $client = $f3->get('plinker');
        
        /**
         * GET /api/lxd/storage/@name
         */
        if ($verb === 'GET') {
            //
            $result = $client->lxd->query('local:/1.0/storage-pools/'.$params['name'], 'GET', []);

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
                $pool = $client->lxd->query('local:/1.0/storage-pools/'.$params['name'], 'POST', $body);

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
                $pool = $client->lxd->query('local:/1.0/storage-pools/'.$params['name'], 'PUT', $body);

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
                    'data'  => $client->lxd->query('local:/1.0/storage-pools/'.$params['name'], 'DELETE')
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
