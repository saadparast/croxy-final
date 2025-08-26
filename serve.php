<?php
// Development server for testing PHP backend with React frontend
// Run: php -S localhost:8080 serve.php

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Handle API routes
if (strpos($uri, '/api/') === 0) {
    // Remove /api prefix and route to api directory
    $apiPath = __DIR__ . $uri . '.php';
    $apiDir = __DIR__ . $uri;
    
    // Check if it's a specific PHP file
    if (file_exists($apiPath)) {
        require $apiPath;
        exit();
    }
    
    // Check if it's a directory with index.php
    if (is_dir($apiDir) && file_exists($apiDir . '/index.php')) {
        require $apiDir . '/index.php';
        exit();
    }
    
    // Handle admin routes
    if (strpos($uri, '/api/admin/') === 0) {
        $adminPath = str_replace('/api/', '/api/', $uri);
        $file = __DIR__ . $adminPath . '.php';
        
        if (file_exists($file)) {
            require $file;
            exit();
        }
        
        // Handle inquiries with ID
        if (preg_match('#^/api/admin/inquiries(/\d+)?$#', $uri)) {
            $_SERVER['REQUEST_URI'] = $uri;
            require __DIR__ . '/api/admin/inquiries.php';
            exit();
        }
    }
    
    // API endpoint not found
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'API endpoint not found']);
    exit();
}

// Serve static files from dist directory (after build)
$distPath = __DIR__ . '/dist' . $uri;
if ($uri !== '/' && file_exists($distPath)) {
    $mimeTypes = [
        'html' => 'text/html',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        'ico' => 'image/x-icon'
    ];
    
    $ext = pathinfo($distPath, PATHINFO_EXTENSION);
    $mimeType = $mimeTypes[$ext] ?? 'application/octet-stream';
    
    header('Content-Type: ' . $mimeType);
    readfile($distPath);
    exit();
}

// Serve index.html for all other routes (React routing)
$indexPath = __DIR__ . '/dist/index.html';
if (file_exists($indexPath)) {
    header('Content-Type: text/html');
    readfile($indexPath);
} else {
    // Development mode - serve from root
    $indexPath = __DIR__ . '/index.html';
    if (file_exists($indexPath)) {
        header('Content-Type: text/html');
        readfile($indexPath);
    } else {
        http_response_code(404);
        echo "Please build the React app first: npm run build";
    }
}
?>