<?php
/**
 * Simple JWT implementation for PHP
 * Compatible with Hostinger shared hosting
 */

class JWT {
    private static $secret = 'croxy-exim-secret-key-2024'; // Change this in production

    /**
     * Encode data to JWT
     */
    public static function encode($payload, $expiry = 86400) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        
        // Add expiry to payload
        $payload['exp'] = time() + $expiry;
        $payload['iat'] = time();
        
        $payload = json_encode($payload);
        
        $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, self::$secret, true);
        $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64Header . "." . $base64Payload . "." . $base64Signature;
    }
    
    /**
     * Decode JWT and verify
     */
    public static function decode($jwt) {
        $tokenParts = explode('.', $jwt);
        
        if (count($tokenParts) != 3) {
            throw new Exception('Invalid token format');
        }
        
        $header = base64_decode($tokenParts[0]);
        $payload = base64_decode($tokenParts[1]);
        $signatureProvided = $tokenParts[2];
        
        // Verify signature
        $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, self::$secret, true);
        $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        if ($base64Signature !== $signatureProvided) {
            throw new Exception('Invalid signature');
        }
        
        $payloadData = json_decode($payload, true);
        
        // Check expiry
        if (isset($payloadData['exp']) && $payloadData['exp'] < time()) {
            throw new Exception('Token expired');
        }
        
        return $payloadData;
    }
    
    /**
     * Get token from Authorization header
     */
    public static function getBearerToken() {
        $headers = null;
        
        if (isset($_SERVER['Authorization'])) {
            $headers = trim($_SERVER["Authorization"]);
        } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
        } else if (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            $requestHeaders = array_combine(
                array_map('ucwords', array_keys($requestHeaders)), 
                array_values($requestHeaders)
            );
            
            if (isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
        }
        
        if (!empty($headers)) {
            if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
                return $matches[1];
            }
        }
        
        return null;
    }
}
?>