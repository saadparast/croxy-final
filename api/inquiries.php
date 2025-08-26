<?php
require_once __DIR__ . '/lib/cors.php';
require_once __DIR__ . '/config/config.php';

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

if ($method === 'POST') {
    // Get posted data
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Validate required fields
    if (empty($data['name']) || empty($data['email'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Name and email are required']);
        exit();
    }
    
    // Prepare certifications string
    $certifications = isset($data['certifications']) ? 
        (is_array($data['certifications']) ? implode(', ', $data['certifications']) : $data['certifications']) : '';
    
    try {
        $query = "INSERT INTO inquiries 
                  (name, email, phone, company, country, product_interest, custom_product, 
                   quantity, delivery_port, target_price, certifications, message, inquiry_type) 
                  VALUES 
                  (:name, :email, :phone, :company, :country, :product_interest, :custom_product,
                   :quantity, :delivery_port, :target_price, :certifications, :message, :inquiry_type)";
        
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':phone', $data['phone']);
        $stmt->bindParam(':company', $data['company']);
        $stmt->bindParam(':country', $data['country']);
        $stmt->bindParam(':product_interest', $data['productInterest']);
        $stmt->bindParam(':custom_product', $data['customProduct']);
        $stmt->bindParam(':quantity', $data['quantity']);
        $stmt->bindParam(':delivery_port', $data['deliveryPort']);
        $stmt->bindParam(':target_price', $data['targetPrice']);
        $stmt->bindParam(':certifications', $certifications);
        $stmt->bindParam(':message', $data['message']);
        
        $inquiryType = isset($data['inquiryType']) ? $data['inquiryType'] : 'general';
        $stmt->bindParam(':inquiry_type', $inquiryType);
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'id' => $db->lastInsertId(),
                'message' => 'Inquiry submitted successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to submit inquiry']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}
?>