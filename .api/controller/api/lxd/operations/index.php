<?php

namespace Controller\Api\Lxd\Operations;

/**
 *
 */
class Index extends \Base\Controller
{
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
        
        // check feature is enabled
        if (!in_array('operations', $f3->get('modules.lxd'))) {
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
         * GET /api/lxd/operations
         */
        if ($verb === 'GET') {
            try {
                //
                $result = $this->lxd->operations->list('local');

                $return = [];
                if (is_array($result)) {
                    foreach ((array) $result as $type => $operations) {
                        $return[$type] = [];
                        foreach ((array) $operations as $operation) {
                            $row = str_replace('/1.0/operations/', '', $operation);  
                            $return[$type][] = $this->lxd->operations->info('local', $row);
                        }
                    }
                }

                $response = [
                    'error' => null,
                    'code'  => 200,
                    'data'  => $return
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
     * /api/lxd/operations/@uuid
     */
    public function item(\Base $f3, $params)
    {
        // GET | POST | PUT | DELETE
        $verb = $f3->get('VERB');

        /**
         * GET /api/lxd/operations/@uuid
         */
        if ($verb === 'GET') {
            // get containers
            $result = $this->lxd->operations->info('local',  $params['uuid']);

            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => $result
            ]);
        }

        /**
         * DELETE /api/lxd/operations/@uuid
         */
        if ($verb === 'DELETE') {
            //
            try {
                $result = $this->lxd->operations->delete('local',  $params['uuid']);
            } catch (\Exception $e) {
                $result = $e->getMessage();
            }

            $f3->response->json([
                'error' => '',
                'code'  => 200,
                'data'  => $result
            ]);
        }
    }

}
