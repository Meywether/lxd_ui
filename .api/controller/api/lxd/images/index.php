<?php

namespace Controller\Api\Lxd\Images;

/**
 *
 */
class Index extends \Base\Controller
{
    /*
     * @var
     */
    private $cache;
    
    /*
     * @var
     */
    private $cache_ttl;
    
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
        if (!in_array('images', $f3->get('modules.lxd'))) {
            $f3->status(404);
            $f3->response->json([
                'error' => 'Feature not enabled',
                'code'  => 404,
                'data'  => []
            ]);
        }
        
        $this->lxd = new \Model\LXD($f3);
        
        $this->cache = \Cache::instance();
        $this->cache_ttl = 5;
    }

    /**
     *
     */
    public function index(\Base $f3)
    {
        // GET | POST | PUT | DELETE
        $verb = $f3->get('VERB');

        /**
         * GET /api/lxd/images?remote=local
         */
        if ($verb === 'GET') {
            // expect ?remote=local
            if ($f3->devoid('GET.remote')) {
                $f3->response->json([
                    'error' => 'Missing remote parameter',
                    'code'  => 400,
                    'data'  => []
                ]);
            }

            try {
                // cache remote images if not local
                if ($f3->get('GET.remote') === 'local' || !$this->cache->exists('images.'.$f3->get('GET.remote'), $result)) {
                    // get images filter by architecture (may add as a parameter if ever needed)
                    $result = $this->lxd->images->list($f3->get('GET.remote'), 'architecture="'.implode('|', ['x86_64', 'i686', 'amd64']).'"');
                    //
                    $this->cache->set('images.'.$f3->get('GET.remote'), $result, 3600);
                }
                
                $result = [
                    'error' => null,
                    'code'  => 200,
                    'data'  => $result
                ];
            } catch (\Exception $e) {
                $result = [
                    'error' => $e->getMessage(),
                    'code'  => $e->getCode(),
                    'data'  => []
                ];
            }
            $f3->response->json($result);
        }
        
        /**
         * POST /api/lxd/images
         */
        if ($verb === 'POST') {
            $options = json_decode($f3->get('BODY'), true);
            
            try {
                $response = [
                    'error' => null,
                    'code'  => 200,
                    'data'  => $this->lxd->images->create('local', $options)
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
         * GET /api/lxd/images/@fingerprint
         */
        if ($verb === 'GET') {
            /*
            // expect ?remote=local
            if ($f3->devoid('GET.remote')) {
                $f3->response->json([
                    'error' => 'Missing remote parameter',
                    'code'  => 400,
                    'data'  => []
                ]);
            }
            
            // cache remote images if not local
            if ($f3->get('GET.remote') === 'local' || !$this->cache->exists('images.'.$f3->get('GET.remote'), $result)) {
                // get images filter by architecture (may add as a parameter if ever needed)
                $result = $this->lxd->images->list($f3->get('GET.remote'), 'architecture="'.implode('|', ['x86_64', 'i686', 'amd64']).'"');
                //
                $this->cache->set('images.'.$f3->get('GET.remote'), $result, 3600);
            }

            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => $result
            ]);
            */
        }
        
        /**
         * POST /api/lxd/images/@fingerprint
         */
        if ($verb === 'POST') {
            /*
            $f3->response->json([
                'error' => '',
                'code'  => 200,
                'data'  => []
            ]);
            */
        }
        
        /**
         * PUT /api/lxd/images/@fingerprint
         */
        if ($verb === 'PUT') {
            $options = json_decode($f3->get('BODY'), true);
            
            try {
                $response = [
                    'error' => null,
                    'code'  => 200,
                    'data'  => $this->lxd->images->replace($f3->get('GET.remote'), $params['fingerprint'], $options)
                ];
                
                $this->cache->clear('images.'.$f3->get('GET.remote'));
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
         * DELETE /api/lxd/images/@fingerprint?remote=local
         */
        if ($verb === 'DELETE') {
            // expect ?remote=local
            if ($f3->devoid('GET.remote')) {
                $f3->response->json([
                    'error' => 'Missing remote parameter',
                    'code'  => 400,
                    'data'  => []
                ]);
            }
            
            //
            try {
                $result = $this->lxd->images->delete($f3->get('GET.remote'), $params['fingerprint']);

                $response = [
                    'error' => null,
                    'code'  => 200,
                    'data'  => $result
                ];
                
                $this->cache->clear('images.'.$f3->get('GET.remote'));
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
