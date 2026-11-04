<?php
/**
 * Contact-form endpoint: validates an enquiry and stores it in MongoDB Atlas.
 *
 * POST /api/enquiry.php  (JSON body: name, email, phone, service, message, source_page, company_website)
 *   200 {"ok":true}            saved (or silently dropped as a bot)
 *   422 {"ok":false,...}       validation failed
 *   500 {"ok":false,...}       server / database problem
 *
 * Needs the PHP "mongodb" extension (enabled in hPanel -> PHP Configuration) and
 * api/config.php (copy api/config.example.php; never commit the real one).
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $code, array $body): void {
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_SLASHES);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

// Browsers send Origin on fetch POSTs; only accept our own site (no Origin = server-side/curl).
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = ['https://webgrow360.online', 'https://www.webgrow360.online'];
if ($origin !== '' && !in_array($origin, $allowedOrigins, true)) {
    respond(403, ['ok' => false, 'error' => 'forbidden_origin']);
}

$raw = file_get_contents('php://input', false, null, 0, 20000);
$in = json_decode($raw ?: '', true);
if (!is_array($in)) {
    $in = $_POST; // also accept a classic form-encoded POST
}

$str = static function ($key, int $max) use ($in): string {
    $v = $in[$key] ?? '';
    return is_string($v) ? mb_substr(trim($v), 0, $max) : '';
};

// Honeypot: real visitors never fill this hidden field. Pretend success so bots don't retry.
if ($str('company_website', 200) !== '') {
    respond(200, ['ok' => true]);
}

$doc = [
    'name'        => $str('name', 120),
    'email'       => $str('email', 200),
    'phone'       => $str('phone', 40),
    'service'     => $str('service', 120),
    'message'     => $str('message', 5000),
    'source_page' => $str('source_page', 300),
    'user_agent'  => mb_substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 400),
];

// Same rules as the form's client-side validation.
$errors = [];
if (mb_strlen($doc['name']) < 2) $errors[] = 'name';
if (!preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/', $doc['email'])) $errors[] = 'email';
$digits = preg_replace('/\D/', '', $doc['phone']);
if (strlen($digits) === 12 && strpos($digits, '91') === 0) $digits = substr($digits, 2);
if (strlen($digits) === 11 && $digits[0] === '0') $digits = substr($digits, 1);
if (!(strlen($digits) === 10 || (substr($doc['phone'], 0, 1) === '+' && strlen($digits) >= 8 && strlen($digits) <= 15))) $errors[] = 'phone';
if ($doc['service'] === '') $errors[] = 'service';
if (mb_strlen($doc['message']) < 10) $errors[] = 'message';
if ($errors) {
    respond(422, ['ok' => false, 'error' => 'invalid', 'fields' => $errors]);
}

$configFile = __DIR__ . '/config.php';
if (!is_file($configFile) || !extension_loaded('mongodb')) {
    error_log('[enquiry] ' . (!is_file($configFile) ? 'api/config.php missing' : 'PHP mongodb extension not loaded'));
    respond(500, ['ok' => false, 'error' => 'server_not_configured']);
}
$cfg = require $configFile;

try {
    $doc['created_at'] = new MongoDB\BSON\UTCDateTime();
    $manager = new MongoDB\Driver\Manager($cfg['uri'], [
        'username' => $cfg['username'],
        'password' => $cfg['password'],
        'appname'  => 'webgrow360-site',
        'serverSelectionTimeoutMS' => 8000,
    ]);
    $bulk = new MongoDB\Driver\BulkWrite();
    $bulk->insert($doc);
    $manager->executeBulkWrite(
        $cfg['db'] . '.' . $cfg['collection'],
        $bulk,
        ['writeConcern' => new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 10000)]
    );
} catch (Throwable $e) {
    error_log('[enquiry] MongoDB insert failed: ' . get_class($e) . ': ' . $e->getMessage());
    respond(500, ['ok' => false, 'error' => 'save_failed']);
}

respond(200, ['ok' => true]);
