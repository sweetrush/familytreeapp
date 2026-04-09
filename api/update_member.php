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
$id = $input['id'] ?? '';
$updates = [
    'name' => $input['name'] ?? null,
    'dob' => $input['dob'] ?? null,
    'location' => $input['location'] ?? null,
    'fatherId' => $input['fatherId'] ?? null,
    'motherId' => $input['motherId'] ?? null
];

// Remove null values from updates
$updates = array_filter($updates, function($value) {
    return $value !== null;
});

if (empty($id)) {
    http_response_code(400);
    echo json_encode(['error' => 'ID is required']);
    exit;
}

$manager = new DataManager();
$member = $manager->updateMember($id, $updates);
if ($member) {
    echo json_encode($member);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Member not found']);
}
?>