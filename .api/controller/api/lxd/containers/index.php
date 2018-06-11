<?php

namespace Controller\Api\Lxd\Containers;

/**
 *
 */
class Index extends \Base\Controller
{
    /*
     * @var
     */
    private $lxd;
    
    /**
     * Before route - check auth and load models
     */
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
        
        $this->lxd = new \Model\LXD($f3);
    }

    /**
     *
     */
    public function index(\Base $f3, $params)
    {
        // GET | POST | PUT | DELETE
        $verb = $f3->get('VERB');
        //
        $body = !$f3->devoid('BODY') ? (array) json_decode($f3->get('BODY')) : [];
        //
        $errors = [];
        //
        $result = [];

        /**
         * GET /api/lxd/containers
         */
        if ($verb === 'GET') {
            try {
                $result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => $this->lxd->local('lxc list --format json')
                ];
            } catch (\Exception $e) {
                $result = [
                    'error' => $e->getMessage(),
                    'code'  => 422,
                    'data'  => []
                ];
            }
        }
        
        /**
         * POST /api/lxd/containers
         */
        if ($verb === 'POST') {

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

            // build out array of arguments which wil make the final lxc launch command
            $cmd = [
                'lxc launch',
                // remote & image fingerprint
                escapeshellarg($body['remote']).':'.escapeshellarg($body['image_fingerprint']),
                // container name
                escapeshellarg($body['name']),
                // ephemeral
                !empty($body['ephemeral']) ? '-e' : '',
                // profiles
                '-p '.implode(' -p ', $f3->recursive((array) $body['profile'], function ($value) {
                	return  escapeshellarg($value);
                })),
                // storage pool
                '-s '.escapeshellarg($body['pool'])
            ];

            try {
                $result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => $this->lxd->local(implode(' ', $cmd))
                ];
            } catch (\Exception $e) {
                if (($error = stristr($e->getMessage(), 'Error:')) === false) {
                    $error = $e->getMessage();
                }
                $result = [
                    'error' => $error,
                    'code'  => 422,
                    'data'  => []
                ];
            }
        }

        $f3->response->json($result);
    }
    
    /**
     *
     */
    public function item(\Base $f3, $params)
    {
        // GET | POST | PUT | DELETE
        $verb = $f3->get('VERB');
        //
        $body = !$f3->devoid('BODY') ? (array) json_decode($f3->get('BODY')) : [];
        //
        $errors = [];
        //
        $result = [];
        
        /**
         * GET /api/lxd/containers/@name
         */
        if ($verb === 'GET') {
            try {
                $result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => $this->lxd->containers->info('local', $params['name'])
                ];
            } catch (\Exception $e) {
                $result = [
                    'error' => $e->getMessage(),
                    'code'  => 422,
                    'data'  => []
                ];
            }
        }
        
        /**
         * POST /api/lxd/containers/@name
         */
        if ($verb === 'POST') {

            if (empty($body) || empty($params['name'])) {
              $f3->response->json([
                    'error' => 'Invalid POST body, expecting item',
                    'code'  => 422,
                    'data'  => []
                ]); 
            }
            
            if (empty($body['name'])) {
                $errors['name'] = 'Containers new name cannot be empty'; 
            }

            if (!empty($errors)) {
                $f3->response->json([
                    'error' => $errors,
                    'code'  => 400,
                    'data'  => []
                ]);
            }
            
            try {
                $result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => $this->lxd->containers->rename('local', $params['name'], $body['name'])
                ];
            } catch (\Exception $e) {
                $result = [
                    'error' => $e->getMessage(),
                    'code'  => 422,
                    'data'  => []
                ];
            }
        }

        /**
         * PATCH /api/lxd/containers/@name
         */
        if ($verb === 'PATCH') {

            if (empty($body) || empty($params['name'])) {
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
                    'data'  => $this->lxd->containers->update('local', $params['name'], $body)
                ];
            } catch (\Exception $e) {
                $result = [
                    'error' => $e->getMessage(),
                    'code'  => 422,
                    'data'  => []
                ];
            }
        }
        
        /**
         * PUT /api/lxd/containers/@name
         */
        if ($verb === 'PUT') {

            if (empty($body) || empty($params['name'])) {
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
                    'data'  => $this->lxd->containers->replace('local', $params['name'], $body)
                ];
            } catch (\Exception $e) {
                $result = [
                    'error' => $e->getMessage(),
                    'code'  => 422,
                    'data'  => []
                ];
            }
        }
        
        /**
         * DELETE /api/lxd/containers/@name
         */
        if ($verb === 'DELETE') {
            try {
                $result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => $this->lxd->containers->delete('local', $params['name'])
                ];
            } catch (\Exception $e) {
                $result = [
                    'error' => $e->getMessage(),
                    'code'  => 422,
                    'data'  => []
                ];
            }
        }
        
        $f3->response->json($result);
    }

}
