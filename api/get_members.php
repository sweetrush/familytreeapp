<?php
header('Content-Type: application/json');
require_once 'data_manager.php';

$manager = new DataManager();
$members = $manager->getMembers();
echo json_encode($members);
?>