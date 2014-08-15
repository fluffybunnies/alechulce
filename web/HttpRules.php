<?php

class HttpRules {

	static function run($rules=null){
		if ($rules === null) {
			$rules = array();
			$methods = get_class_methods('HttpRules');
			foreach ($methods as $m) {
				if (strpos($m,'run') === 0)
					$rules[] = $m;
			}
		}
		if (!is_array($rules))
			throw new Exception('invalid rules');
		foreach ($rules as $m) {
			if (self::$m())
				exit;
		}
	}

	static function runIndexPages($pages=array('index.php','index.html','index.htm')){
		foreach ($pages as $k => $v) {
			$check = $_SERVER['DOCUMENT_ROOT'].$_SERVER['DOCUMENT_URI'].$v;
			if (file_exists($check)) {
				include $check;
				return true;
			}
		}
		return false;
	}

	static function run404($ignoreExtensions=array('ico,css,js,gif,jpg,jpeg,png')){
		// ignoreExtensions so 404 resources dont set cookies, or attempt infinite redirect, etc
		$ignoreExtensions = is_array($ignoreExtensions) ? array_fill_keys($ignoreExtensions, true) : array();
		$m = array();
		preg_match('/\/.+\.(.+)$/',$_SERVER['REQUEST_URI'],$m);
		$ext = isset($m[1]) ? $m[1] : null;
		var_dump($ignoreExtensions);
		var_dump($ext);
		if ($ignoreExtensions && $ext && !empty($ignoreExtensions[$ext]))
			return false;
		header((isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.0').' 404 Not Found');
		return true;
	}

}
