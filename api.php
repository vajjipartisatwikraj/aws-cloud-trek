<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

// Initialize database on first run
initializeDatabase();

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['action'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

$action = $input['action'];

switch ($action) {
    case 'add_student':
        addStudent($input['data']);
        break;
    case 'get_students':
        getStudents();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Unknown action']);
}

function addStudent($data) {
    $pdo = getDBConnection();
    if (!$pdo) {
        echo json_encode(['success' => false, 'message' => 'Database connection failed']);
        return;
    }
    
    // Validate input
    if (empty($data['name']) || empty($data['email']) || empty($data['course']) || empty($data['phone'])) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        return;
    }
    
    // Validate email format
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        return;
    }
    
    try {
        $sql = "INSERT INTO students (name, email, course, phone) VALUES (?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            trim($data['name']),
            trim($data['email']),
            trim($data['course']),
            trim($data['phone'])
        ]);
        
        echo json_encode([
            'success' => true, 
            'message' => 'Student added successfully',
            'student_id' => $pdo->lastInsertId()
        ]);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) { // Duplicate entry
            echo json_encode(['success' => false, 'message' => 'Email already exists']);
        } else {
            error_log("Add student error: " . $e->getMessage());
            echo json_encode(['success' => false, 'message' => 'Database error occurred']);
        }
    }
}

function getStudents() {
    $pdo = getDBConnection();
    if (!$pdo) {
        echo json_encode(['success' => false, 'message' => 'Database connection failed']);
        return;
    }
    
    try {
        $sql = "SELECT id, name, email, course, phone, created_at FROM students ORDER BY created_at DESC";
        $stmt = $pdo->query($sql);
        $students = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'data' => $students,
            'count' => count($students)
        ]);
    } catch (PDOException $e) {
        error_log("Get students error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to retrieve students']);
    }
}
?>
