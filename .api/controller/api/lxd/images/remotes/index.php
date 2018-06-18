<?php
/*
 +----------------------------------------------------------------------+
 | Conext LXD Control Panel
 +----------------------------------------------------------------------+
 | Copyright (c)2018 (https://github.com/lcherone/conext)
 +----------------------------------------------------------------------+
 | This source file is subject to MIT License
 | that is bundled with this package in the file LICENSE.
 |
 | If you did not receive a copy of the license and are unable to
 | obtain it through the world-wide-web, please send an email
 | to lawrence@cherone.co.uk so we can send you a copy immediately.
 +----------------------------------------------------------------------+
 | Authors:
 |   Lawrence Cherone <lawrence@cherone.co.uk>
 +----------------------------------------------------------------------+
 */
 
namespace Controller\Api\Lxd\Images\Remotes;

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
    private $remotes;

    /*
     * @var
     */
    protected $body = [];
    
    /*
     * @var
     */
    protected $result = []; 
    
    /*
     * @var
     */
    protected $errors = []; 
    
    /*
     * @var
     */
    protected $cache; 

    /**
     * @param object $f3
     * @return void
     */
    public function beforeRoute(\Base $f3)
    {
        parent::beforeRoute($f3);
        
        try {
            \Lib\JWT::checkAuth();
            if (!in_array('images', $f3->get('modules.lxd'))) {
                throw new \Exception('Feature not enabled', 404);
            }
        } catch (\Exception $e) {
            $f3->response->json([
                'error' => $e->getMessage(),
                'code'  => $e->getCode(),
                'data'  => []
            ]);
        }

        // define model/s
        $this->lxd = new \Model\LXD($f3);
        
        $this->remotes = new \Base\Model('remotes');
        $this->cache = \Cache::instance();
    }

    /**
     * GET /api/lxd/images/remotes
     *
     * @param object $f3
     * @return void
     */
    public function get(\Base $f3)
    {
        try {
            //
            $result = $this->lxd->images->remotes();
            
            // update remotes database
            foreach ($result as $row) {
                $remote = $this->remotes->findOrCreate([
                    'name' => $row['name']    
                ]);
                
                $remote->active = '1';
                
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
                } elseif($f3->get('GET.type') == 'active') {
                    $result = $this->remotes->findAll('active = "1"');
                } else {
                    $result = $this->remotes->findAll();
                }
            } else {
                $result = $this->remotes->findAll();
            }

            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => array_values($result)
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
     * POST /api/lxd/images/remotes
     *
     * @param object $f3
     * @return void
     */
    public function post()
    {
        try {
            //
            $cmd = [
                'lxc remote add',
                escapeshellarg($this->body['name']),
                escapeshellarg($this->body['url']),
                '--accept-certificate',
                '--password='.escapeshellarg($this->body['secret']),
                '--protocol='.escapeshellarg($this->body['protocol']),
                '--auth-type='.escapeshellarg($this->body['auth_type']),
            ];

            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->lxd->local(implode(' ', $cmd))
            ];
            
            $remote = $this->remotes->findOrCreate([
                'name' => $this->body['name']    
            ]);
            
            // dont store secret
            unset($this->body['secret']);

            // set to active
            $this->body['active'] = '1';
            
            $remote->import($this->body);
            $this->remotes->store($remote);
            
            // clear cache
            $this->cache->clear('images.'.$this->body['name']);
            
        } catch (\Exception $e) {
            $this->result = [
                'error' => $e->getMessage(),
                'code'  => 422,
                'data'  => []
            ];
        }
    }

}
