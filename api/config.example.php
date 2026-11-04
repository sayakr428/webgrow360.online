<?php
// Copy to api/config.php on the server and fill in the real values.
// api/config.php is git-ignored and blocked from the web by api/.htaccess.
return [
    'uri'        => 'mongodb+srv://<cluster-host>/',   // Atlas connection string, without credentials
    'username'   => '<database-user>',
    'password'   => '<database-password>',             // raw, no URL-encoding needed
    'db'         => 'DigitalMarketing_webgrow360-DB',
    'collection' => 'Marketing_enqueries_webgrow360',
];
