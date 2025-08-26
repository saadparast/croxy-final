<?php
require_once dirname(__DIR__) . '/lib/cors.php';
require_once dirname(__DIR__) . '/config/config.php';
require_once dirname(__DIR__) . '/lib/JWT.php';

// Get posted data
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (empty($data['username']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Username and password are required']);
    exit();
}

// Get database connection
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit();
}

try {
    // Get user from database
    $query = "SELECT * FROM admin_users WHERE username = :username LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':username', $data['username']);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
        exit();
    }
    
    // Verify password
    if (!password_verify($data['password'], $user['password'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
        exit();
    }
    
    // Generate JWT token
    $payload = [
        'id' => $user['id'],
        'username' => $user['username']
    ];
    
    $token = JWT::encode($payload, 86400); // 24 hours expiry
    
    // Return success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username']
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Login failed: ' . $e->getMessage()]);
}
?>