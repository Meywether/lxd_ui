<?php

namespace Controller\Api\Lxd\Images;

/**
 *
 */
class Remotes extends \Base\Controller
{
    /*
     * @var
     */
    private $lxd;
    
    /*
     * @var
     */
    private $remotes;
    
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
        
        $this->remotes = new \Base\Model('remotes');
    }

    /**
     *
     */
    public function index(\Base $f3)
    {
        // GET | POST | PUT | DELETE
        $verb = $f3->get('VERB');
        //
        $body = !$f3->devoid('BODY') ? (array) json_decode($f3->get('BODY')) : [];

        /**
         * GET /api/lxd/images/remotes
         */
        if ($verb === 'GET') {
            //
            $result = $this->lxd->images->remotes();
            
            // update remotes database
            foreach ($result as $row) {
                $remote = $this->remotes->findOrCreate([
                    'name' => $row['name']    
                ]);
                $remote->import($row);
                $this->remotes->store($remote);
            }
            
            // handle ?type param
            if (!$f3->devoid('GET.type')) {
                // public/private remotes
                if (in_array($f3->get('GET.type'), ['public', 'private'])) {
                    $result = $this->remotes->findAll('public = ?', [
                        ($f3->get('GET.type') == 'public' ? '1' : '0')
                    ]);
                } else {
                    $result = $this->remotes->findAll();
                }
            } else {
                $result = $this->remotes->findAll();
            }

            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => array_values($result)
            ]);
        }
        
        /**
         * GET /api/lxd/images/remotes
         */
        if ($verb === 'POST') {
            $options = json_decode($f3->get('BODY'), true);
            
            try {
                $response = [
                    'error' => null,
                    'code'  => 200,
                    'data'  => $this->lxd->local('lxc remote add '.$body['name'].' '.$body['url'].' --accept-certificate --password="'.$body['secret'].'" --protocol="'.$body['protocol'].'" --auth-type="'.$body['auth_type'].'"')
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
         * GET /api/lxd/images/remotes/@name
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
         * POST /api/lxd/images/remotes/@name
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
         * PUT /api/lxd/images/remotes/@name
         */
        if ($verb === 'PUT') {
            /*
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
            */
        }
        
        /**
         * DELETE /api/lxd/images/remotes/@name
         */
        if ($verb === 'DELETE') {
            try {
                $result = $this->lxd->local('lxc remote remove '.$params['name']);
                
                // remove from db
                $remote = $this->remotes->findOne('name = ?', [$params['name']]);
                if (!empty($remote->id)) {
                    $this->remotes->trash($remote);
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

}
