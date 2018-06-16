<?php

namespace Controller\Api\Lxd\Containers;

/**
 *
 */
class Logs extends \Base\Controller
{
    /*
     * @var
     */
    private $lxd;
    
    public function beforeRoute(\Base $f3)
    {
        // check auth
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
    public function index(\Base $f3, $params)
    {
        // GET | POST | PUT | DELETE
        $verb = $f3->get('VERB');

        /**
         * GET /api/lxd/containers/@name/logs
         */
        if ($verb === 'GET') {
            //
            try {
                $result = $this->lxd->containers->logs->list('local', $params['name']);
                
                if (!empty($result)) {
                    foreach ($result as &$log) {
                        $log = str_replace('/1.0/containers/'.$params['name'].'/logs/', '', $log);  
                        $log = [
                            'name' => $log,
                            'data' => $this->lxd->containers->logs->get('local', $params['name'], $log)
                        ];
                    }
                }

                $response = [
                    'error' => null,
                    'code'  => 200,
                    'data'  => $result
                ];
            } catch (\Exception $e) {
                $response = [
                    'error' => $e->getMessage(),
                    'code'  => $e->getCode(),
                    'data'  => []
                ];
            }

            $f3->response->json($response);
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
         * GET /api/lxd/containers/@name/logs/@logfile
         */
        if ($verb === 'GET') {
            //
            try {
                $result = $this->lxd->containers->logs->get('local', $params['name'], $params['logfile']);

                $response = [
                    'error' => null,
                    'code'  => 200,
                    'data'  => $result
                ];
            } catch (\Exception $e) {
                $response = [
                    'error' => $e->getMessage(),
                    'code'  => $e->getCode(),
                    'data'  => []
                ];
            }

            $f3->response->json($response);
        }
        
        /**
         * DELETE /api/lxd/containers/@name/logs/@logfile
         */
        if ($verb === 'DELETE') {
            //
            try {
                $result = $this->lxd->containers->logs->remove('local', $params['name'], $params['logfile']);

                $response = [
                    'error' => null,
                    'code'  => 200,
                    'data'  => $result
                ];
            } catch (\Exception $e) {
                $response = [
                    'error' => $e->getMessage(),
                    'code'  => $e->getCode(),
                    'data'  => []
                ];
            }

            $f3->response->json($response);
        }
    }

}
