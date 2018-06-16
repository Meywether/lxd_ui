<?php

namespace Controller\Api\Lxd\Containers;

/**
 *
 */
class Files extends \Base\Controller
{
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
    public function index(\Base $f3, $params)
    {
        // GET | POST | PUT | DELETE
        $verb = $f3->get('VERB');
        //
        $body = !$f3->devoid('BODY') ? (array) json_decode($f3->get('BODY')) : [];
        //
        $result = [];

        /**
         * GET /api/lxd/containers/@name/files?path=*
         */
        if ($verb === 'GET') {
            try {
                $result = $this->lxd->containers->files->list('local', $params['name'], $f3->get('GET.path'));
                
                if (is_array($result)) {
                    $result = [
                        'type' => 'listing',
                        'data' => array_values($result)
                    ];
                } else {
                    $result = [
                        'type' => 'file',
                        'data' => $result
                    ];
                }
            } catch (\Exception $e) {
                $result = [
                    'error' => $e->getMessage(),
                    'code'  => 422,
                    'data'  => []
                ];
            }
        }
        
        /**
         * POST /api/lxd/containers/@name/files?path=*
         */
        if ($verb === 'POST') {
            try {
                $result = $this->lxd->containers->files->push('local', $params['name'], $body['source'], $f3->get('GET.path'));
                
                $result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => $result
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
         * DELETE /api/lxd/containers/@name/files?path=*
         */
        if ($verb === 'DELETE') {
            try {
                $result = $this->lxd->containers->files->remove('local', $params['name'], $f3->get('GET.path'));
                
                $result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => $result
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
