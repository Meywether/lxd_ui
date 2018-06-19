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
class Item extends \Base\Controller
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
     * GET /api/lxd/containers/@name/backups/@backup
     *
     * @param object $f3
     * @return void
     */
    public function get(\Base $f3)
    {
        try {
            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->lxd->containers->backups->info('local', $f3->get('PARAMS.name'), $f3->get('PARAMS.backup'))
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
     * POST /api/lxd/containers/@name/backups/@backup
     *
     * @param object $f3
     * @return void
     */
    public function post(\Base $f3)
    {
        // rename backup if exist
        $old_backup = '.plinker/container_backups/'.hash('sha256', $f3->get('PARAMS.name').$f3->get('PARAMS.backup')).'.tar.xz';
        $new_backup = '.plinker/container_backups/'.hash('sha256', $f3->get('PARAMS.name').$this->body['name']).'.tar.xz';
        if (file_exists($backup) && is_file($backup)) {
            rename($old_backup, $new_backup);
        }
        
        try {
            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->lxd->containers->backups->rename('local', $f3->get('PARAMS.name'), $f3->get('PARAMS.backup'), $this->body['name'])
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
     * DELETE /api/lxd/containers/@name/backups/@backup
     *
     * @param object $f3
     * @return void
     */
    public function delete(\Base $f3)
    {
        // remove backup if exist
        $backup = '.plinker/container_backups/'.hash('sha256', $f3->get('PARAMS.name').$f3->get('PARAMS.backup')).'.tar.xz';
        if (file_exists($backup) && is_file($backup)) {
            unlink($backup);
        }
        
        try {
            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->lxd->containers->backups->delete('local', $f3->get('PARAMS.name'), $f3->get('PARAMS.backup'))
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
