<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'data_manager.php';

$manager = new DataManager();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Export functionality
        $members = $manager->getMembers();
        $format = $_GET['format'] ?? 'json';

        if ($format === 'csv') {
            // Export as CSV
            header('Content-Type: text/csv');
            header('Content-Disposition: attachment; filename="family-tree.csv"');
            $output = fopen('php://output', 'w');
            fputcsv($output, ['ID', 'Name', 'Date of Birth', 'Location', 'Father ID', 'Mother ID', 'Created At']);
            foreach ($members as $member) {
                fputcsv($output, $member);
            }
            fclose($output);
            exit;
        } else {
            // Export as JSON
            header('Content-Type: application/json');
            header('Content-Disposition: attachment; filename="family-tree.json"');
            echo json_encode($members, JSON_PRETTY_PRINT);
            exit;
        }
        break;

    case 'POST':
        // Import functionality
        if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
            $file = file_get_contents($_FILES['file']['tmp_name']);
            $data = json_decode($file, true);

            if (is_array($data)) {
                // Clear existing data
                $manager->saveData([]);
                // Add imported members
                foreach ($data as $memberData) {
                    $manager->addMember(
                        $memberData['name'] ?? '',
                        $memberData['dob'] ?? '',
                        $memberData['location'] ?? '',
                        $memberData['fatherId'] ?? null,
                        $memberData['motherId'] ?? null
                    );
                }
                echo json_encode(['success' => true, 'count' => count($data)]);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid JSON file']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'File upload error']);
        }
        exit;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
?>