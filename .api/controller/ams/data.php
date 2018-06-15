<?php
namespace Controller\Ams;

/**
 * AMS Data Controller.
 */
class Data extends \Base\Controller
{
    /*
     * @var
     */
    private $ams;
     
    /**
     *
     */
    public function index(\Base $f3, $params)
    {
        // check feature is enabled
        if (!in_array('data', $f3->get('modules.api'))) {
            $f3->status(404);
            $f3->response->json([
                'error' => 'Feature not enabled',
                'code'  => 404,
                'data'  => []
            ]);
        }
        
        $this->ams = new \Base\Model('ams');
        
        // load module
        $module = $this->ams->findOne('module = ? AND version = ?', [$params['module'], $params['version']]);
        
        // not found
        if (empty($module->id)) {
            $f3->error(404);
        }

        ob_start();
        echo (function ($module) use ($f3, /** @scrutinizer ignore-unused */ $params) {
            /**
             * Pre-setup - extract and set variables for source to use
             */
            // set headers
            if (!empty($module->header)) {
                // define allowed headers, if None dont set
                $headers = [
                    'JSON' => 'application/json;charset=utf-8',
                    'HTML' => 'text/html;charset=utf-8',
                    'TEXT' => 'text/plain;charset=utf-8',
                    'JS'   => 'text/javascript;charset=utf-8',
                    'XML'  => 'application/xml;charset=utf-8'
                ];
                if (array_key_exists($module->header, $headers)) {
                    header('Content-Type: '.$headers[$module->header]);
                }
                unset($headers);
            }
            
            // check auth (JWT)
            if (!empty($module->auth) && $module->auth === 'JWT') {
                try {
                    \Lib\JWT::checkAuth();
                } catch (\Exception $e) {
                    $f3->response->json([
                        'error' => $e->getMessage(),
                        'code'  => $e->getCode(),
                        'data'  => []
                    ]);
                }
            }
            
            // extract config
            if (!empty($module->config)) {
                $module->config = (array) json_decode($module->config, true);
                extract($module->config);
            }

            // set source into scope
            $source = @$module->source;
            
            // GET | POST | PUT | DELETE - allows custom code to implement rest
            $verb = $f3->get('VERB');
            
            // unset module variable
            unset($module);

            try {
                $return = eval('?>'.@$source);
            } catch (\ParseError $e) {
                header('Content-Type: text/plain');
                $return = "API Error:\n".$e."\n";
            }
            
            return $return;
        })($module);
        
        exit(ob_get_clean());
    }

}