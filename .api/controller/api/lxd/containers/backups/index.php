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
 
namespace Controller\Api\Lxd\Containers\Backups;

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
    protected $body = [];
    
    /*
     * @var
     */
    protected $result = []; 
    
    /*
     * @var
     */
    protected $errors = []; 

    /**
     * @param object $f3
     * @return void
     */
    public function beforeRoute(\Base $f3)
    {
        parent::beforeRoute($f3);
        
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

        // define model/s
        $this->lxd = new \Model\LXD($f3);
    }

    /**
     * GET /api/lxd/containers/@name/backups
     *
     * @param object $f3
     * @return void
     */
    public function get(\Base $f3)
    {
        try {
            $result = $this->lxd->containers->backups->list('local', $f3->get('PARAMS.name'));
            
            $return = [];
            foreach ($result as $backup) {
                $backup = str_replace('/1.0/containers/'.$f3->get('PARAMS.name').'/backups/', '', $backup);  
                $return[] = $this->lxd->containers->backups->info('local', $f3->get('PARAMS.name'), $backup);
            }

            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $return
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
     * POST /api/lxd/containers/@name/backups
     *
     * @param object $f3
     * @return void
     */
    public function post(\Base $f3)
    {
        try {
            // bool fix
            $this->body['container_only'] = !empty($this->body['container_only']);
            $this->body['optimized_storage'] = !empty($this->body['optimized_storage']);
            
            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->lxd->containers->backups->create('local', $f3->get('PARAMS.name'), $this->body)
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
