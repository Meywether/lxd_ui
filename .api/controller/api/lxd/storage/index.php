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
 
namespace Controller\Api\Lxd\Storage;

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
     * @param object $f3
     * @return void
     */
    public function beforeRoute(\Base $f3)
    {
        parent::beforeRoute($f3);
        
        try {
            \Lib\JWT::checkAuth();
            if (!in_array('storage', $f3->get('modules.lxd'))) {
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
    }

    /**
     * GET /api/lxd/storage
     *
     * @param object $f3
     * @return void
     */
    public function get(\Base $f3)
    {
        try {
            //
            $pools = $this->lxd->query('local:/1.0/storage-pools', 'GET', [], function ($result) {
                return str_replace('/1.0/storage-pools/', '', $result);
            });
            
            $types = (array) $f3->get('GET.types');
            
            if (!empty($types)) {
                // name
                if (in_array('name', $types)) {
                    foreach ($pools as $i => $pool) {
                        $this->result[$i]['name'] = $pool;
                    }
                }
                    
                // get info
                if (in_array('info', $types)) {
                    foreach ($pools as $i => $pool) {
                        $this->result[$i]['info'] = $this->lxd->query('local:/1.0/storage-pools/'.$pool, 'GET', []);
                    }
                }
                    
                // get resources
                if (in_array('resources', $types)) {
                    foreach ($pools as $i => $pool) {
                        $this->result[$i]['resources'] = $this->lxd->query('local:/1.0/storage-pools/'.$pool.'/resources', 'GET', []);
                    }
                }    
                    
                // get volumes
                if (in_array('volumes', $types)) {
                    foreach ($pools as $i => $pool) {
                        $volumes = $this->lxd->query('local:/1.0/storage-pools/'.$pool.'/volumes', 'GET', [], function ($result) {
                            $result = str_replace('/1.0/storage-pools/', '', $result);
                            foreach ($result as &$row) {
                                $row = explode('/', $row);
                                $row = ['type' => $row[2], 'name' => $row[3]];
                            }
                            return $result;
                        });
                        $this->result[$i]['volumes'] = $volumes;
                    }
                }
            } else {
                $this->result = $pools;
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
     * POST /api/lxd/storage
     *
     * @param object $f3
     * @return void
     */
    public function post()
    {
        try {
            if (empty($this->body['name'])) {
                $this->errors['name'] = 'Storage pool name cannot be empty'; 
            }

            if (!empty($this->errors)) {
                $this->result = [
                    'error' => $this->errors,
                    'code'  => 400,
                    'data'  => []
                ];
                return;
            }
            
            // fix config (cast to object)
            if (isset($this->body['config'])) {
                $this->body['config'] = (object) $this->body['config'];
            }
            
            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->lxd->query('local:/1.0/storage-pools', 'POST', $this->body)
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
