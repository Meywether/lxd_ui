<?php

namespace Controller\Api\Lxd\Containers;

/**
 *
 */
class Exec extends \Base\Controller
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
        if (!in_array('containers', $f3->get('modules.lxd'))) {
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
    public function index(\Base $f3, $params = [])
    {
        // GET | POST | PUT | DELETE
        $verb = $f3->get('VERB');

        /**
         * POST /api/lxd/containers/@name/state
         */
        if ($verb === 'POST') {
            $body = json_decode($f3->get('BODY'), true);
            //
            $result = $this->lxd->containers->exec('local', $params['name'], $body);
            
            $f3->response->json([
                'error' => '',
                'code'  => 200,
                'data'  => $result
            ]);
        }
        
    }

}
