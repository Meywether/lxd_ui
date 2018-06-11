<?php

namespace Controller\Api\Lxd;

/**
 *
 */
class Sshkeys extends \Base\Controller
{
    /*
     * @var
     */
    private $sshkey;
    
    public function beforeRoute(\Base $f3, $params)
    {
        try {
            \Lib\JWT::checkAuthThen(function ($server) use ($f3) {
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
        
        $this->sshkey = new \Base\Model('sshkey');
    }
    
    private function validateKey($key = '') 
    {
        $key_parts = explode(' ', $key, 3);
          
        if (count($key_parts) < 2) {
            return false;
        }
        if (count($key_parts) > 3) {
            return false;
        }
          
        $algorithm = $key_parts[0];
        $key = $key_parts[1];
        
        if (!in_array($algorithm, array('ssh-rsa', 'ssh-dss'))) {
            return false;
        }
        $key_base64_decoded = base64_decode($key, true);
        
        if (empty($key_base64_decoded)) {
            return false;
        }
        $check = base64_decode(substr($key, 0, 16));
        $check = preg_replace("/[^\w\-]/", "", $check); 
        
        if ((string) $check !== (string) $algorithm) {
            return false;
        }
        return true;
    }
    
    private function keyFingerprint($key = '')
    {
        $content = explode(' ', $key, 3);

        return join(':', str_split(md5(base64_decode($content[1])), 2));
    }

    /**
     *
     */
    public function index(\Base $f3, $params)
    {
        // GET | POST | PUT | DELETE
        $verb = $f3->get('VERB');
        
        // plinker client
        $client = $f3->get('plinker');

        /**
         * GET /api/lxd/ssh-keys
         */
        if ($verb === 'GET') {
            try {
                $result = $this->sshkey->findAll();
            } catch (\Exception $e) {
                $result = [];
            }
            
            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => array_values($result)
            ]);
        }
        
        /**
         * POST /api/lxd/ssh-keys
         */
        if ($verb === 'POST') {
            $body = json_decode($f3->get('BODY'), true);
            
            if (empty($body) || !is_numeric($body['id'])) {
               $f3->response->json([
                    'error' => 'Invalid PUT body',
                    'code'  => 422,
                    'data'  => []
                ]); 
            }
            
            $body = $f3->recursive($body, function($value) {
            	return trim($value);
            });

            $errors = [];
            //
            if (empty($body['name'])) {
                $errors['name'] = 'SSH key name cannot be empty';
            }
            
            //
            if (empty($body['key'])) {
                $errors['key'] = 'SSH public key cannot be empty';
            } elseif (!$this->validateKey($body['key'])) {
                $errors['key'] = 'SSH public key appears to be invalid';
            }

            if (!empty($errors)) {
                $f3->response->json([
                    'error' => $errors,
                    'code'  => 422,
                    'data'  => []
                ]); 
            }
            
            $body['key'] = str_replace(PHP_EOL, '', $body['key']);

            try {
                // check does not exist
                $result = $this->sshkey->findOne('fingerprint = ?', [$this->keyFingerprint($body['key'])]);
                
                if (!empty($result->id)) {
                    $f3->response->json([
                        'error' => [
                            'key' => 'SSH key already added'
                        ],
                        'code'  => 422,
                        'data'  => []
                    ]); 
                }

                $result = $this->sshkey->findOrCreate(['fingerprint' => $this->keyFingerprint($body['key'])]);
 
                $result->import([
                    'name' => $body['name'],
                    'fingerprint' => $this->keyFingerprint($body['key']),
                    'key' => $body['key']
                ]);
                    
                $this->sshkey->store($result);
            } catch (\Exception $e) {
                $result = [];
            }
            
            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => []
            ]);
        }

    }
    
    /**
     *
     */
    public function item(\Base $f3, $params)
    {
        // GET | POST | PUT | DELETE
        $verb = $f3->get('VERB');
        
        // plinker client
        $client = $f3->get('plinker');
        
        /**
         * GET /api/lxd/ssh-keys/@id
         */
        if ($verb === 'GET') {
            try {
                $result = $this->sshkey->load($params['id']);
                
                if (!empty($result->id)) {
                    //$result['dict'] = json_decode($result['dict']);
                } else {
                    throw \Exception('Not found', 404);
                }
            } catch (\Exception $e) {
                $result = [];
            }
            
            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => array_values($result)
            ]);
        }
        
        /**
         * POST /api/lxd/ssh-keys/@id
         */
        if ($verb === 'POST') {

        }
        
        /**
         * PUT /api/lxd/ssh-keys/@id
         */
        if ($verb === 'PUT') {
            $body = json_decode($f3->get('BODY'), true);
            
            if (empty($body) || !is_numeric($body['id'])) {
               $f3->response->json([
                    'error' => 'Invalid PUT body',
                    'code'  => 422,
                    'data'  => []
                ]); 
            }
            
            $body = $f3->recursive($body, function($value) {
            	return trim($value);
            });
            
            $errors = [];
            //
            if (empty($body['name'])) {
                $errors['name'] = 'SSH key name cannot be empty';
            }
            
            //
            if (empty($body['key'])) {
                $errors['key'] = 'SSH public key cannot be empty';
            } elseif (!$this->validateKey($body['key'])) {
                $errors['key'] = 'SSH public key appears to be invalid';
            }

            if (!empty($errors)) {
               $f3->response->json([
                    'error' => $errors,
                    'code'  => 422,
                    'data'  => []
                ]); 
            }
            
            $body['key'] = str_replace(PHP_EOL, '', $body['key']);
            
            try {
                $result = $this->sshkey->load($params['id']);
                
                if (!empty($result->id)) {
                    
                    $result->import([
                        'name' => $body['name'],
                        'fingerprint' => $this->keyFingerprint($body['key']),
                        'key' => $body['key']
                    ]);
                    
                    $this->sshkey->store($result);
                    
                    //$result['dict'] = json_decode($result['dict']);
                } else {
                    throw new \Exception('Not found', 404);
                }
            } catch (\Exception $e) {
                $result = [];
            }
            
            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => []
            ]);
        }

        /**
         * DELETE /api/lxd/ssh-keys/@id
         */
        if ($verb === 'DELETE') {
            try {
                $result = $this->sshkey->load($params['id']);
                
                if (!empty($result->id)) {
                    $this->sshkey->trash($result);
                } else {
                    throw \Exception('Not found', 404);
                }
            } catch (\Exception $e) {
                $result = [];
            }

            $f3->response->json([
                'error' => '',
                'code'  => 200,
                'data'  => []
            ]);
        }
    }
    
}
