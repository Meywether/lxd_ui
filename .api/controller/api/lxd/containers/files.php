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
         * GET /api/lxd/containers
         */
        if ($verb === 'GET') {
            
            $containers = $client->lxd->local('lxc list --format json');
            
            // send response, but dont exit/halt
            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => array_values($containers)
            ]);
        }
        
        /**
         * POST /api/lxd/containers
         */
        if ($verb === 'POST') {
            $body = json_decode($f3->get('BODY'), true);
            
            $errors = [];
            if (empty($body['name'])) {
                $errors['name'] = 'Container name cannot be empty'; 
            }
            
            if (empty($body['image_fingerprint'])) {
                $errors['image_fingerprint'] = 'Image fingerprint cannot be empty'; 
            }
            
            if (empty($body['profile'])) {
                $errors['profile'] = 'Container requires at least one profile'; 
            }
            
            if (empty($body['pool'])) {
                $errors['pool'] = 'Container requires a storage pool'; 
            }
            
            if (empty($body['remote'])) {
                $errors['remote'] = 'Remote cannot be empty'; 
            }
            
            if (!empty($errors)) {
                $f3->response->json([
                    'error' => $errors,
                    'code'  => 400,
                    'data'  => []
                ]);
            }
            
            $body['ephemeral'] = !empty($body['ephemeral']) ? ' -e ' : '';

            try {
                $result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => $client->lxd->local('lxc launch '.escapeshellarg($body['remote']).':'.escapeshellarg($body['image_fingerprint']).' '.escapeshellarg($body['name']).$body['ephemeral'].' -p '.implode(' -p ', $body['profile']).' -s '.$body['pool'])
                ];
            } catch (\Exception $e) {
                $result = [
                    'error' => 'Could not create container.',
                    'code'  => 422,
                    'data'  => []
                ];
            }

            $f3->response->json($result);
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
            // //
            // $result = $client->lxd->containers->list('local', function ($result) {
            //     return str_replace('/1.0/containers/', '', $result);
            // });
            
            // $f3->response->json([
            //     'error' => '',
            //     'code'  => 200,
            //     'data'  => []
            // ]);
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
         * GET /api/lxd/containers/@name
         */
        if ($verb === 'GET') {
            $result = $client->lxd->containers->info('local', $params['name']);

            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => $result
            ]);
        }
        
        if ($verb === 'POST') {
            $item = json_decode($f3->get('BODY'), true);
            
            if (empty($item) || empty($item['name'])) {
              $f3->response->json([
                    'error' => 'Invalid POST body, expecting item',
                    'code'  => 422,
                    'data'  => []
                ]); 
            }
            
            try {
                $result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => $client->lxd->containers->rename('local', $params['name'], $item['name'])
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

        if ($verb === 'PATCH') {
            $options = json_decode($f3->get('BODY'), true);

            if (empty($options) || empty($params['name'])) {
              $f3->response->json([
                    'error' => 'Invalid PATCH body, expecting item',
                    'code'  => 422,
                    'data'  => []
                ]); 
            }
            
            try {
                $result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => $client->lxd->containers->update('local', $params['name'], $options)
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
        
        if ($verb === 'PUT') {
            $options = json_decode($f3->get('BODY'), true);

            if (empty($options) || empty($params['name'])) {
              $f3->response->json([
                    'error' => 'Invalid PUT body, expecting item',
                    'code'  => 422,
                    'data'  => []
                ]); 
            }
            
            try {
                $result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => $client->lxd->containers->replace('local', $params['name'], $options)
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
        
        if ($verb === 'DELETE') {
            //
            $result = $client->lxd->containers->delete('local', $params['name']);

            $f3->response->json([
                'error' => '',
                'code'  => 200,
                'data'  => []
            ]);
        }
    }

}
