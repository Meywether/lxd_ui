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

namespace Controller\Api\Server;

/**
 *
 */
class Idmap extends \Base\Controller
{
    /*
     * @var mixed \Base\Controller::$result
     */
    protected $result = []; 

    /*
     * @var object \Model\System
     */
    private $system;

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

        // load model
        $this->system = new \Model\System($f3);
    }

    /**
     * GET /api/server/idmap
     *
     * @return void
     */
    public function get()
    {
        try {
            $result = $this->system->shell_exec('awk -F: \'{printf "%s:%s\n",$1,$3}\' /etc/passwd');

            $lines = (array) explode(PHP_EOL, trim($result));

            foreach ($lines as $line) {
                $line = explode(':', $line);
                $this->result[] = ['user' => $line[0], 'id' => $line[1]];
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

}
