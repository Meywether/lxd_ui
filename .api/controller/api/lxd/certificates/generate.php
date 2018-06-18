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

namespace Controller\Api\Lxd\Certificates;

/**
 *
 */
class Generate extends \Base\Controller
{
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
            if (!in_array('certificates', $f3->get('modules.lxd'))) {
                throw new \Exception('Feature not enabled', 404);
            }
        } catch (\Exception $e) {
            $f3->response->json([
                'error' => $e->getMessage(),
                'code'  => $e->getCode(),
                'data'  => []
            ]);
        }
    }

    /**
     * POST /api/lxd/certificates/generate
     *
     * @param object $f3
     * @return void
     */
    public function post(\Base $f3)
    {
        try {
            // protect from nastys
            $this->body = (array) $f3->recursive($this->body, function ($value) {
            	return trim(preg_replace("/[^a-z0-9 \.-]/i", '', $value));
            });

            // subject - country
            if (empty($this->body['subject']['c'])) {
                $this->errors['subject']['c'] = 'Country is a required field';
            } elseif(strlen($this->body['subject']['c']) != 2) {
                $this->errors['subject']['c'] = 'Country is a 2 letter code';
            }

            // subject - state
            if (empty($this->body['subject']['st'])) {
                $this->errors['subject']['st'] = 'State is a required field';
            }
            
            // subject - state
            if (empty($this->body['subject']['l'])) {
                $this->errors['subject']['l'] = 'Locality is a required field';
            }

            // subject - organization
            if (empty($this->body['subject']['o'])) {
                $this->errors['subject']['o'] = 'Organization is a required field';
            }

            // subject - organization unit
            if (empty($this->body['subject']['ou'])) {
                $this->errors['subject']['ou'] = 'Organization unit is a required field';
            }

            // subject - common name
            if (empty($this->body['subject']['cn'])) {
                $this->errors['subject']['cn'] = 'Common name is a required field';
            }
            
            // check bits
            if (!in_array($this->body['bits'], [2048, 4096, 8192])) {
                $this->body['bits'] = 2048;
            }

            // check days
            if (!is_numeric($this->body['days']) || $this->body['days'] < 1 || $this->body['days'] > 3650) {
                $this->body['days'] = 3650;
            }

            if (!empty($this->errors)) {
                $this->result = [
                    'error' => $this->errors,
                    'code'  => 400,
                    'data'  => []
                ];
                return;
            }
            
            //
            $dn = [
                "countryName" => strtoupper($this->body['subject']['c']),
                "stateOrProvinceName" => $this->body['subject']['st'],
                "localityName" => $this->body['subject']['l'],
                "organizationName" => $this->body['subject']['o'],
                "organizationalUnitName" => $this->body['subject']['ou'],
                "commonName" => $this->body['subject']['cn']
            ];
            
            // generate a new private (and public) key pair
            $privkey = openssl_pkey_new([
                "private_key_bits" => (int) $this->body['bits'],
                "private_key_type" => OPENSSL_KEYTYPE_RSA,
            ]);
            
            // generate a certificate signing request
            $csr = openssl_csr_new($dn, $privkey, ['digest_alg' => 'sha256']);
            
            // generate a self-signed cert
            $x509 = openssl_csr_sign($csr, null, $privkey, $this->body['days'], ['digest_alg' => 'sha256']);
            
            // export private key and self-signed cert
            openssl_x509_export($x509, $certout);
            openssl_pkey_export($privkey, $pkeyout, null);

            $this->result = [
                'key' => $pkeyout,
                'pem' => $certout,
            ]+$this->body;

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
