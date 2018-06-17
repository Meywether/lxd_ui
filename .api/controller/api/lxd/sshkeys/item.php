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

namespace Controller\Api\Lxd\Sshkeys;

/**
 *
 */
class Item extends \Base\Controller
{
    /*
     * @var array \Base\Controller::$body
     */
    protected $body = []; 

    /*
     * @var mixed \Base\Controller::$result
     */
    protected $result = []; 
    
    /*
     * @var array \Base\Controller::$errors
     */
    protected $errors = []; 
    
    /*
     * @var object \Base\Model
     */
    private $sshkey;

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
        if (!in_array('ssh-keys', $f3->get('modules.lxd'))) {
            $f3->status(404);
            $f3->response->json([
                'error' => 'Feature not enabled',
                'code'  => 404,
                'data'  => []
            ]);
        }

        $this->sshkey = new \Model\SSHKey();
    }

    /**
     * GET /api/lxd/ssh-keys/@id
     *
     * @return void
     */
    public function get(\Base $f3)
    {
        try {
            $this->result = (array) $this->sshkey->load($f3->get('PARAMS.id'));
            
            if (empty($result->id)) {
                throw new \Exception('Not found', 404);
            }

            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => array_values($this->result)
            ];
        } catch (\Exception $e) {
            $this->result = [
                'error' => $e->getMessage(),
                'code'  => $e->getCode(),
                'data'  => []
            ];
        }
    }

    /**
     * POST /api/lxd/ssh-keys/@id
     *
     * @return void
     */
    public function put(\Base $f3)
    {
        try {
            if (empty($this->body) || !is_numeric($this->body['id'])) {
                throw new \Exception('Invalid POST body', 422);
            }

            //
            if (empty($this->body['name'])) {
                $this->errors['name'] = 'SSH key name cannot be empty';
            }

            //
            if (empty($this->body['key'])) {
                $this->errors['key'] = 'SSH public key cannot be empty';
            } elseif (!$this->sshkey->validate($this->body['key'])) {
                $this->errors['key'] = 'SSH public key appears to be invalid';
            } else {
                $this->body['key'] = str_replace(PHP_EOL, '', $this->body['key']);
            }

            if (!empty($this->errors)) {
                $this->result = [
                    'error' => $this->errors,
                    'code'  => 422,
                    'data'  => []
                ];
                return;
            }
            
            // get and check does not exist
            $this->result = $this->sshkey->load($f3->get('PARAMS.id'));
                
            if (empty($this->result->id)) {
                throw new \Exception('Not found', 404);
            }

            $this->result->import([
                'name' => $this->body['name'],
                'fingerprint' => $this->sshkey->fingerprint($this->body['key']),
                'key' => $this->body['key']
            ]);
                    
            $this->sshkey->store($this->result);

            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => $this->result
            ];
        } catch (\Exception $e) {
            $this->result = [
                'error' => $e->getMessage(),
                'code'  => $e->getCode(),
                'data'  => []
            ];
        }
    }
    
    /**
     * DELETE /api/lxd/ssh-keys/@id
     *
     * @return void
     */
    public function delete(\Base $f3)
    {
        try {
            $this->result = (array) $this->sshkey->load($f3->get('PARAMS.id'));
            
            if (empty($result->id)) {
                throw new \Exception('Not found', 404);
            }
            
            $this->sshkey->trash($this->result);

            $this->result = [
                'error' => '',
                'code'  => 200,
                'data'  => []
            ];
        } catch (\Exception $e) {
            $this->result = [
                'error' => $e->getMessage(),
                'code'  => $e->getCode(),
                'data'  => []
            ];
        }
    }

}
