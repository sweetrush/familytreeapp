<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'data_manager.php';

$input = json_decode(file_get_contents('php://input'), true);
$name = $input['name'] ?? '';
$dob = $input['dob'] ?? '';
$location = $input['location'] ?? '';
$fatherId = $input['fatherId'] ?? null;
$motherId = $input['motherId'] ?? null;

if (empty($name)) {
    http_response_code(400);
    echo json_encode(['error' => 'Name is required']);
    exit;
}

$manager = new DataManager();
$member = $manager->addMember($name, $dob, $location, $fatherId, $motherId);
echo json_encode($member);
?>