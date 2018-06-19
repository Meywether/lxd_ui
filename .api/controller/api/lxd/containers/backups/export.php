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
class Export extends \Base\Controller
{
    /*
     * @var
     */
    private $lxd;

    /*
     * @var
     */
    protected $result = []; 

    /**
     * @param object $f3
     * @return void
     */
    public function beforeRoute(\Base $f3)
    {
        parent::beforeRoute($f3);
        
        // check auth
        try {
            if ($f3->devoid('GET.hash')) {
                \Lib\JWT::checkAuth();
            }
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
     * GET /api/lxd/containers/@name/backups/@backup/export
     *
     * @param object $f3
     * @return void
     */
    public function get(\Base $f3)
    {
        try {
            // check backup dir
            if (!file_exists('.plinker/container_backups')) {
                mkdir('.plinker/container_backups', 0755, true);
            }
            
            // create hash for backup container/backup
            $hash = hash('sha256', $f3->get('PARAMS.name').$f3->get('PARAMS.backup'));
            
            // hash set but does not match, check auth
            if (!$f3->devoid('GET.hash') && $f3->get('GET.hash') != $hash) {
                \Lib\JWT::checkAuth();
            }

            // backup exists
            if (file_exists('.plinker/container_backups/'.$hash.'.tar.xz')) {
                // user supplied hash, send the file
                if (!$f3->devoid('GET.hash')) {
                    \Web::instance()->send('.plinker/container_backups/'.$hash.'.tar.xz', 'application/x-xz', (2048*2), true, $f3->get('PARAMS.backup').'.tar.xz');
                    exit();
                }

                $this->result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => [
                        'hash' => $hash,
                        'exists' => true
                    ]
                ];
            } else {
                
                $this->result = [
                    'error' => '',
                    'code'  => 202, // accepted
                    'data'  => [
                        'hash' => $hash,
                        'exists' => false
                    ]
                ];
                
                $data = json_encode($this->result, JSON_PRETTY_PRINT | JSON_PRESERVE_ZERO_FRACTION);
            
                header('Content-Type: application/json;charset=utf8');
                header('Content-Length: '.strlen($data));
                
                ignore_user_abort(true);
                set_time_limit(0);
                echo $data;
                header('Connection: close');
                ob_end_flush();
                session_write_close();
                fastcgi_finish_request();
                
                try {
                    $data = $this->lxd->query('local:/1.0/containers/'. $f3->get('PARAMS.name').'/backups/'.$f3->get('PARAMS.backup').'/export', 'GET', []);
                    file_put_contents(
                        '.plinker/container_backups/'.$hash.'.tar.xz', 
                        $data
                    );
                } catch (\Exception $e) {}
            }
        } catch (\Exception $e) {
            $this->result = [
                'error' => $e->getMessage(),
                'code'  => $e->getCode(),
                'data'  => []
            ];
        }
    }

}
