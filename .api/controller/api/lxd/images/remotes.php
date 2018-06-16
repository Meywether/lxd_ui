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
    private $remotes;
    
    public function beforeRoute(\Base $f3)
    {
        // check auth
        try {
            \Lib\JWT::checkAuthThen(function ($server) use ($f3) {
                // set plinker client
                $f3->set('plinker', new \Plinker\Core\Client($server, [
                    'secret' => $f3->get('AUTH.secret'),
                    'database' => $f3->get('db'),
                    'lxc_path' => $f3->get('LXC.path')
                ]));
            });
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
        
        $this->remotes = new \Base\Model('remotes');
    }

    /**
     *
     */
    public function index(\Base $f3)
    {
        // GET | POST | PUT | DELETE
        $verb = $f3->get('VERB');
        
        // plinker client
        $client = $f3->get('plinker');
        
        /**
         * GET /api/lxd/images/remotes
         */
        if ($verb === 'GET') {
            //
            $result = $client->lxd->images->remotes();
            
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
        
    }

}
