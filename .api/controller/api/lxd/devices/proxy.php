<?php

namespace Controller\Api\Lxd\Devices;

/**
 *
 */
class Proxy extends \Base\Controller
{
    /*
     * @var
     */
    private $devices;
    
    public function beforeRoute(\Base $f3, $params)
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
        
        $this->devices = new \Base\Model('devices');
    }

    /**
     *
     */
    public function index(\Base $f3, $params)
    {
        // GET | POST | PUT | DELETE
        $verb = $f3->get('VERB');

        /**
         * GET /api/lxd/devices/proxy
         */
        if ($verb === 'GET') {
            try {
                $result = $this->devices->findAll('type = "proxy"');

                foreach ($result as &$row) {
                    $row['dict'] = json_decode($row['dict']);
                }
            } catch (\Exception $e) {
                $result = [];
            }
            
            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => array_values($result)
            ]);
        }
        
        /**
         * POST /api/lxd/devices/proxy
         */
        if ($verb === 'POST') {
            $body = json_decode($f3->get('BODY'), true);
            
            if (empty($body) || !is_numeric($body['id'])) {
               $f3->response->json([
                    'error' => 'Invalid PUT body',
                    'code'  => 422,
                    'data'  => []
                ]); 
            }
            
            $body = $f3->recursive((array) $body, function($value) {
            	return trim($value);
            });

            $errors = [];
            //
            if (empty($body['name'])) {
                $errors['name'] = 'Device name cannot be empty';
            }

            //
            if (empty($body['dict']['listen'])) {
                $errors['dict'] = [
                    'listen' => 'Device listen address cannot be empty'
                ];
            }
            
            //
            if (empty($body['dict']['connect'])) {
                $errors['dict'] = [
                    'connect' => 'Device connect address cannot be empty'
                ];
            }

            if (!empty($errors)) {
               $f3->response->json([
                    'error' => $errors,
                    'code'  => 422,
                    'data'  => []
                ]); 
            }

            try {
                $result = $this->devices->create(['name' => $body['name']]);
 
                $result->import([
                    'type' => 'proxy',
                    'name' => $body['name'],
                    'dict' => json_encode([
                        "listen" => $body['dict']['listen'],
                        "connect" => $body['dict']['connect'],
                        "bind" => $body['dict']['bind']
                    ], JSON_PRETTY_PRINT)
                ]);
                    
                $this->devices->store($result);
            } catch (\Exception $e) {
                $result = [];
            }
            
            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => $result
            ]);
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
         * GET /api/lxd/devices/proxy/@id
         */
        if ($verb === 'GET') {
            try {
                $result = $this->devices->load($params['id']);
                
                if (!empty($result->id)) {
                    $result['dict'] = json_decode($result['dict']);
                } else {
                    throw new \Exception('Not found', 404);
                }
            } catch (\Exception $e) {
                $result = [];
            }
            
            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => array_values($result)
            ]);
        }

        /**
         * PUT /api/lxd/devices/proxy/@id
         */
        if ($verb === 'PUT') {
            $body = json_decode($f3->get('BODY'), true);
            
            if (empty($body) || !is_numeric($body['id'])) {
               $f3->response->json([
                    'error' => 'Invalid PUT body',
                    'code'  => 422,
                    'data'  => []
                ]); 
            }
            
            $body = $f3->recursive((array) $body, function($value) {
            	return trim($value);
            });
            
            $errors = [];
            //
            if (empty($body['name'])) {
                $errors['name'] = 'Device name cannot be empty';
            }

            //
            if (empty($body['dict']['listen'])) {
                $errors['dict'] = [
                    'listen' => 'Device listen address cannot be empty'
                ];
            }
            
            //
            if (empty($body['dict']['connect'])) {
                $errors['dict'] = [
                    'connect' => 'Device connect address cannot be empty'
                ];
            }
            
            if (!empty($errors)) {
               $f3->response->json([
                    'error' => $errors,
                    'code'  => 422,
                    'data'  => []
                ]); 
            }
            
            try {
                $result = $this->devices->load($params['id']);
                
                if (!empty($result->id)) {
                    
                    $result->import([
                        'type' => 'proxy',
                        'name' => $body['name'],
                        'dict' => json_encode([
                            "listen" => $body['dict']['listen'],
                            "connect" => $body['dict']['connect'],
                            "bind" => $body['dict']['bind']
                        ], JSON_PRETTY_PRINT)
                    ]);
                    
                    $this->devices->store($result);
                    
                    $result['dict'] = json_decode($result['dict']);
                } else {
                    throw new \Exception('Not found', 404);
                }
            } catch (\Exception $e) {
                $result = [];
            }
            
            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => $result
            ]);
        }

        /**
         * DELETE /api/lxd/devices/proxy/@id
         */
        if ($verb === 'DELETE') {
            try {
                $result = $this->devices->load($params['id']);
                
                if (!empty($result->id)) {
                    $this->devices->trash($result);
                } else {
                    throw new \Exception('Not found', 404);
                }
            } catch (\Exception $e) {
                $result = [];
            }

            $f3->response->json([
                'error' => '',
                'code'  => 200,
                'data'  => $result
            ]);
        }
    }
    
}
