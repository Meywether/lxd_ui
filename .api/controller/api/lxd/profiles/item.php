<?php

namespace Controller\Api\Lxd\Profiles;

/**
 *
 */
class Item extends \Base\Controller
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
        if (!in_array('profiles', $f3->get('modules.lxd'))) {
            $f3->status(404);
            $f3->response->json([
                'error' => 'Feature not enabled',
                'code'  => 404,
                'data'  => []
            ]);
        }
        
        $this->lxd = new \Model\LXD($f3);
    }
    
    public function get(\Base $f3, $params)
    {
        // get containers
            $result = $this->lxd->profiles->info('local', $params['name']);

            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => $result
            ]);
    }
    
    public function post(\Base $f3, $params)
    {
        $body = json_decode($f3->get('BODY'), true);
            
            $errors = [];
            if (empty($params['name'])) {
                $errors['name'] = 'Profiles name cannot be empty'; 
            }

            if (!empty($errors)) {
                $f3->response->json([
                    'error' => $errors,
                    'code'  => 400,
                    'data'  => []
                ]);
            }
            
            // fix devices (cast to object)
            if (!empty($body['devices'])) {
                $body['devices'] = (object) $body['devices'];
            }
            
            try {
                $result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => $this->lxd->profiles->replace('local', $params['name'], $body)
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
    
    public function patch(\Base $f3, $params)
    {
        $body = json_decode($f3->get('BODY'), true);

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
                    'data'  => $this->lxd->profiles->update('local', $params['name'], $body)
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
    
    public function put(\Base $f3, $params)
    {
        $body = json_decode($f3->get('BODY'), true);
            
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
                    'data'  => $this->lxd->profiles->replace('local', $params['name'], $body)
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

public function delete(\Base $f3, $params)
{
    try {
                $result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => $this->lxd->profiles->delete('local', $params['name'])
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
