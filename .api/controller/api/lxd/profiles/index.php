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

    /*
     * @var
     */
    protected $body;
    
    /*
     * @var
     */
    protected $result; 
    
    /*
     * @var
     */
    protected $errors; 

    /**
     * 
     */
    public function beforeRoute(\Base $f3)
    {
        parent::beforeRoute($f3);
        
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

        // define model/s
        $this->lxd = new \Model\LXD($f3);
    }

    /**
     * GET /api/lxd/profiles
     */
    public function get(\Base $f3)
    {
        try {
            //
            $profiles = $this->lxd->profiles->list('local', function ($result) {
                return str_replace('/1.0/profiles/', '', $result);
            });
            
            // get info
            foreach ((array) $profiles as $i => $profile) {
                $this->result[$i] = $this->lxd->profiles->info('local', $profile);
            }
            
            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->result
            ];
        } catch (\Exception $e) {
            $this->result = [
                'error' => $e->getMessage(),
                'code'  => 422,
                'data'  => []
            ];
        }
    }

    /**
     * POST /api/lxd/profiles
     */
    public function post(\Base $f3)
    {
        try {
            if (empty($this->body['name'])) {
                $this->errors['name'] = 'Profiles name cannot be empty'; 
            }
            
            if (!empty($this->errors)) {
                $this->result = [
                    'error' => $this->errors,
                    'code'  => 400,
                    'data'  => []
                ];
                return;
            }
            
            // fix devices (cast to object)
            if (isset($this->body['devices'])) {
                $this->body['devices'] = (object) $this->body['devices'];
            }
            
            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->lxd->profiles->create('local', $this->body)
            ];
        } catch (\Exception $e) {
            $this->result = [
                'error' => $e->getMessage(),
                'code'  => 422,
                'data'  => []
            ];
        }
    }

}
