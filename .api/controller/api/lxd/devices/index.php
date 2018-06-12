<?php

namespace Controller\Api\Lxd\Devices;

/**
 *
 */
class Index extends \Base\Controller
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
         * GET /api/lxd/devices
         */
        if ($verb === 'GET') {
            
            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => $this->devices->findAll()
            ]);
        }
        
    }
    
}
