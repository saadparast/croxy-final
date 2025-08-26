<?php
// Database configuration for MySQL (Hostinger compatible)
class Database {
    private $host = "localhost";
    private $db_name = "croxy_exim";
    private $username = "root"; // Change this for production
    private $password = ""; // Change this for production
    private $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            // For initial setup, try to create database if it doesn't exist
            try {
                $tempConn = new PDO(
                    "mysql:host=" . $this->host,
                    $this->username,
                    $this->password
                );
                $tempConn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $tempConn->exec("CREATE DATABASE IF NOT EXISTS " . $this->db_name);
                
                // Try connecting again
                $this->conn = new PDO(
                    "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                    $this->username,
                    $this->password
                );
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $this->conn->exec("set names utf8");
                
                // Create tables
                $this->createTables();
            } catch(PDOException $e) {
                echo "Connection error: " . $e->getMessage();
            }
        }

        return $this->conn;
    }

    private function createTables() {
        // Create inquiries table
        $query = "CREATE TABLE IF NOT EXISTS inquiries (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50),
            company VARCHAR(255),
            country VARCHAR(100),
            product_interest TEXT,
            custom_product TEXT,
            quantity VARCHAR(100),
            delivery_port VARCHAR(255),
            target_price VARCHAR(100),
            certifications TEXT,
            message TEXT,
            inquiry_type VARCHAR(50) DEFAULT 'general',
            status VARCHAR(50) DEFAULT 'pending',
            source VARCHAR(50) DEFAULT 'website',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";
        $this->conn->exec($query);

        // Create admin_users table
        $query = "CREATE TABLE IF NOT EXISTS admin_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
        $this->conn->exec($query);

        // Create inquiry_notes table
        $query = "CREATE TABLE IF NOT EXISTS inquiry_notes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            inquiry_id INT,
            note TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (inquiry_id) REFERENCES inquiries(id) ON DELETE CASCADE
        )";
        $this->conn->exec($query);

        // Insert default admin user if not exists
        $defaultPassword = password_hash('70709081@MDsaad', PASSWORD_DEFAULT);
        $stmt = $this->conn->prepare("INSERT IGNORE INTO admin_users (username, password) VALUES (?, ?)");
        $stmt->execute(['admin', $defaultPassword]);
    }
}
?>