<?php

define('WEBROOT', dirname(__FILE__));
echo WEBROOT;

include dirname(__FILE__).'/bootshell.php';

exit;

include 'HttpRules.php';

HttpRules::run()

HttpRules::runIndexPages();
