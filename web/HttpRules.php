<?php

class HttpRules {

	static function run($rules=null){
		if ($rules === null) {
			$rules = array();
			foreach (get_class_methods('HttpRules') as $m) {
				if (strpos($m,'run') === 0 && $m !== 'run')
					$rules[] = $m;
			}
		}
		if (!is_array($rules))
			throw new Exception('invalid rules');
		foreach ($rules as $m) {
			if (self::$m())
				exit;
		}
		self::load404();
		exit;
	}

	static function runIndexPages($pages=array('index.php','index.html','index.htm')){
		$me = rtrim($_SERVER['DOCUMENT_ROOT'].$_SERVER['DOCUMENT_URI'], '/');
		foreach ($pages as $k => $v) {
			$check = "$me/$v";
			// temp hack: dont call self
			if ($_SERVER['SCRIPT_FILENAME'] == $check)
				continue;
			if (file_exists($check)) {
				include $check;
				return true;
			}
		}
		return false;
	}

	static function load404(){
		header((isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.0').' 404 Not Found');
		echo 'sup';
	}

}
