<?php

namespace Controller\Api\Lxd\Profiles;

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
    
    public function get(\Base $f3)
    {
        //
            $profiles = $this->lxd->profiles->list('local', function ($result) {
                return str_replace('/1.0/profiles/', '', $result);
            });
            
            // get state
            $result = [];
            foreach ($profiles as $i => $profile) {
            	$result[$i] = $this->lxd->profiles->info('local', $profile);
            }

            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => $result
            ]);
    }
    
    public function post()
    {
        $body = json_decode($f3->get('BODY'), true);
            
            $errors = [];
            if (empty($body['name'])) {
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
            if (isset($body['devices'])) {
                $body['devices'] = (object) $body['devices'];
            }
            
            try {
                $result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => $this->lxd->profiles->create('local', $body)
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
