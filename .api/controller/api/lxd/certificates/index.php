<?php

namespace Controller\Api\Lxd\Certificates;

/**
 *
 */
class Index extends \Base\Controller
{
    /*
     * @var
     */
    private $lxd;
    
    public function beforeRoute(\Base $f3)
    {
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
        if (!in_array('certificates', $f3->get('modules.lxd'))) {
            $f3->status(404);
            $f3->response->json([
                'error' => 'Feature not enabled',
                'code'  => 404,
                'data'  => []
            ]);
        }
        
        $this->lxd = new \Model\LXD($f3);
    }

    /**
     *
     */
    public function index(\Base $f3)
    {
        // GET | POST | PUT | DELETE
        $verb = $f3->get('VERB');

        /**
         * GET /api/lxd/certificates
         */
        if ($verb === 'GET') {
            $certificates = $this->lxd->certificates->list('local', function ($result) {
                return str_replace('/1.0/certificates/', '', $result);
            });
            
            $result = [];
            foreach ((array) $certificates as $fingerprint) {
                $result[] = $this->lxd->certificates->info('local', $fingerprint);
            }

            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => $result
            ]);
        }
        
        /**
         * POST /api/lxd/certificates
         */
        if ($verb === 'POST') {
            $item = json_decode($f3->get('BODY'), true);

            $item['certificate'] = trim(str_replace(
                ['-----BEGIN CERTIFICATE-----', '-----END CERTIFICATE-----'],
                '', 
                trim($item['certificate'])
            ));

            try {
                $result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => $this->lxd->query('local:/1.0/certificates', 'POST', $item)
                ];
                
            } catch (\Exception $e) {
                $result = [
                    'error' => $e->getMessage(),
                    'code'  => 422,
                    'data'  => []
                ];
            }

            $f3->response->json($result);
        }

    }
    
    /**
     *
     */
    public function item(\Base $f3, $params)
    {
        // GET | POST | PUT | DELETE
        $verb = $f3->get('VERB');

        /**
         * GET /api/lxd/certificates/@fingerprint
         */
        if ($verb === 'GET') {
            $certificates = $this->lxd->certificates->list('local', function ($result) {
                return str_replace('/1.0/certificates/', '', $result);
            });
            
            $result = [];
            foreach ((array) $certificates as $fingerprint) {
                $result[] = $this->lxd->certificates->info('local', $fingerprint);
            }

            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => $result
            ]);
        }

        /**
         * PUT /api/lxd/certificates/@fingerprint
         */
        if ($verb === 'PUT') {
            $item = json_decode($f3->get('BODY'), true);

            $item['certificate'] = trim(str_replace(
                ['-----BEGIN CERTIFICATE-----', '-----END CERTIFICATE-----'],
                '', 
                trim($item['certificate'])
            ));

            try {
                $result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => $this->lxd->query('local:/1.0/certificates/'.$params['fingerprint'], 'PUT', $item)
                ];
                
            } catch (\Exception $e) {
                $result = [
                    'error' => $e->getMessage(),
                    'code'  => 422,
                    'data'  => []
                ];
            }

            $f3->response->json($result);
        }
        
        /**
         * PATCH /api/lxd/certificates/@fingerprint
         */
        if ($verb === 'PATCH') {
            $item = json_decode($f3->get('BODY'), true);

            $item['certificate'] = trim(str_replace(
                ['-----BEGIN CERTIFICATE-----', '-----END CERTIFICATE-----'],
                '', 
                trim($item['certificate'])
            ));

            try {
                $result = [
                    'error' => '',
                    'code'  => 200,
                    'data'  => $this->lxd->query('local:/1.0/certificates/'.$params['fingerprint'], 'PATCH', $item)
                ];
                
            } catch (\Exception $e) {
                $result = [
                    'error' => $e->getMessage(),
                    'code'  => 422,
                    'data'  => []
                ];
            }

            $f3->response->json($result);
        }
        
        /**
         * DELETE /api/lxd/containers/@fingerprint
         */
        if ($verb === 'DELETE') {
            if (empty($params['fingerprint'])) {
               $f3->response->json([
                    'error' => 'Invalid DELETE, expecting fingerprint',
                    'code'  => 422,
                    'data'  => []
                ]); 
            }
            
            $this->lxd->certificates->delete('local', $params['fingerprint']);
            
            $f3->response->json([
                'error' => '',
                'code'  => 200,
                'data'  => []
            ]);
        }
    }
    
    /**
     *
     */
    public function generate(\Base $f3, $params)
    {
        // GET | POST | PUT | DELETE
        $verb = $f3->get('VERB');

        /**
         * POST /api/lxd/certificates/generate
         */
        if ($verb === 'POST') {
            $body = json_decode($f3->get('BODY'), true);
            
            $tmpname = tempnam("/tmp", "cert");
            
            // protect from nastys
            $body = $f3->recursive($body, function($value) {
            	return trim(preg_replace("/[^a-z0-9 \.-]/i", '', $value));
            });

            $subject = "/C={$body['subject']['c']}/ST={$body['subject']['st']}/L={$body['subject']['l']}/O={$body['subject']['o']}/OU={$body['subject']['ou']}/CN={$body['subject']['cn']}";

            // generate
            `openssl genrsa {$body['bits']} > "$tmpname.key"`;
            `openssl req -new -x509 -nodes -sha256 -days {$body['days']} -key "$tmpname.key" -out "$tmpname.crt" -subj "$subject"`;
            
            $result = [
                'key' => file_get_contents("$tmpname.key"),
                'pem' => file_get_contents("$tmpname.crt"),
            ]+$body;
            
            $f3->response->json([
                'error' => null,
                'code'  => 200,
                'data'  => $result
            ]);
        }
    }

}
