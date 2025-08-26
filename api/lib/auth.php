<?php
require_once __DIR__ . '/JWT.php';

/**
 * Authentication middleware
 */
function authenticateToken() {
    try {
        $token = JWT::getBearerToken();
        
        if (!$token) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Access denied']);
            exit();
        }
        
        $decoded = JWT::decode($token);
        
        // Set user data in globals for use in endpoints
        $GLOBALS['auth_user'] = $decoded;
        
        return true;
    } catch (Exception $e) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Invalid token: ' . $e->getMessage()]);
        exit();
    }
}
?>