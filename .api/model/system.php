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

namespace Model;

/**
 * System adapter model class
 * - For the \Plinker\System component so can use it and bypass the RPC call.
 */
class System
{
    /**
     * @var
     */
    protected $f3;

    /**
     * @var
     */
    private $chaining = false;
    
     /**
      * @var
      */
    private $component = [];

    /**
     * @param object $f3
     * @return void
     */
    public function __construct(\Base $f3)
    {
        $this->f3 = $f3;
    }

    /**
     * @param string $component
     * @return object
     */
    public function __get($component)
    {
        // on first call reset component array and enable chaining
        if (!$this->chaining) {
            $this->component = [];
            $this->chaining = true;
        }

        $this->component[] = ucfirst($component);

        return $this;
    }

    /**
     * Magic caller method, which calls component
     *
     * @param string $action
     * @param array  $params
     * @throws Exception
     * @return mixed
     */
    public function __call($action, $params)
    {
        // set chaining state
        $this->chaining = false;

        // change params array into numeric
        $params = array_values($params);
        
        // handle root, and add lxd namespace so its not lxd->lxd
        if (empty($this->component)) {
            $this->component = ['system'];
        }

        // define plinker component namespace
        $ns = rtrim('\\Plinker\\System\\'.ucfirst(implode('\\', $this->component)), '\\');

        $response = null;
        if (class_exists($ns)) {
            // init component
            $component = new $ns();

            // call method, if exception return exception class
            try {
                if (method_exists($component, $action)) {
                    $response = call_user_func_array(
                        [
                            $component,
                            $action
                        ],
                        $params
                    );
                } else {
                    $response = sprintf('System model action (%s) not implemented in: %s', $action, $ns);
                }
            } catch (\Exception $e) {
                throw $e;
            }
            return $response;
        }
        throw new \Exception(sprintf('System model (%s) not implemented', $ns));
    }

}
