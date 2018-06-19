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
 
namespace Controller\Api\Lxd\Operations;

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
            if (!in_array('operations', $f3->get('modules.lxd'))) {
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
     * GET /api/lxd/operations
     * 
     * @return void
     */
    public function get()
    {
        try {
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
            
            $this->result = [
                'error' => null,
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

}
