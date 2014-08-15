<?php

class HttpRules {

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

}