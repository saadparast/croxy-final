<?php
require_once dirname(__DIR__) . '/lib/cors.php';
require_once dirname(__DIR__) . '/config/config.php';
require_once dirname(__DIR__) . '/lib/auth.php';

// Authenticate user
authenticateToken();

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Get database connection
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit();
}

// Parse URL to get inquiry ID if present
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);
$inquiryId = null;

// Check if ID is provided in the URL
if (isset($uri[4]) && is_numeric($uri[4])) {
    $inquiryId = $uri[4];
}

switch ($method) {
    case 'GET':
        if ($inquiryId) {
            // Get single inquiry
            try {
                $query = "SELECT * FROM inquiries WHERE id = :id";
                $stmt = $db->prepare($query);
                $stmt->bindParam(':id', $inquiryId);
                $stmt->execute();
                
                $inquiry = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if (!$inquiry) {
                    http_response_code(404);
                    echo json_encode(['success' => false, 'error' => 'Inquiry not found']);
                    exit();
                }
                
                // Get notes for this inquiry
                $notesQuery = "SELECT * FROM inquiry_notes WHERE inquiry_id = :inquiry_id ORDER BY created_at DESC";
                $notesStmt = $db->prepare($notesQuery);
                $notesStmt->bindParam(':inquiry_id', $inquiryId);
                $notesStmt->execute();
                
                $notes = $notesStmt->fetchAll(PDO::FETCH_ASSOC);
                $inquiry['notes'] = $notes;
                
                echo json_encode(['success' => true, 'data' => $inquiry]);
                
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
            }
        } else {
            // Get all inquiries
            try {
                $query = "SELECT * FROM inquiries ORDER BY created_at DESC";
                $stmt = $db->prepare($query);
                $stmt->execute();
                
                $inquiries = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                echo json_encode(['success' => true, 'data' => $inquiries]);
                
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
            }
        }
        break;
        
    case 'PUT':
        if (!$inquiryId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Inquiry ID is required']);
            exit();
        }
        
        $data = json_decode(file_get_contents("php://input"), true);
        
        try {
            // Update inquiry status
            if (isset($data['status'])) {
                $updateQuery = "UPDATE inquiries SET status = :status, updated_at = CURRENT_TIMESTAMP WHERE id = :id";
                $updateStmt = $db->prepare($updateQuery);
                $updateStmt->bindParam(':status', $data['status']);
                $updateStmt->bindParam(':id', $inquiryId);
                $updateStmt->execute();
            }
            
            // Add note if provided
            if (!empty($data['note'])) {
                $noteQuery = "INSERT INTO inquiry_notes (inquiry_id, note) VALUES (:inquiry_id, :note)";
                $noteStmt = $db->prepare($noteQuery);
                $noteStmt->bindParam(':inquiry_id', $inquiryId);
                $noteStmt->bindParam(':note', $data['note']);
                $noteStmt->execute();
            }
            
            echo json_encode(['success' => true, 'message' => 'Inquiry updated successfully']);
            
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
        }
        break;
        
    case 'DELETE':
        if (!$inquiryId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Inquiry ID is required']);
            exit();
        }
        
        try {
            $query = "DELETE FROM inquiries WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $inquiryId);
            
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Inquiry deleted successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'Failed to delete inquiry']);
            }
            
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        break;
}
?>