<?php
// SQLite database configuration for testing (simulates MySQL)
class Database {
    private $db_file = __DIR__ . "/../../croxy_exim.db";
    private $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            // Use SQLite for testing
            $this->conn = new PDO("sqlite:" . $this->db_file);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Create tables if they don't exist
            $this->createTables();
            
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }

    private function createTables() {
        // Create inquiries table
        $query = "CREATE TABLE IF NOT EXISTS inquiries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            company TEXT,
            country TEXT,
            product_interest TEXT,
            custom_product TEXT,
            quantity TEXT,
            delivery_port TEXT,
            target_price TEXT,
            certifications TEXT,
            message TEXT,
            inquiry_type TEXT DEFAULT 'general',
            status TEXT DEFAULT 'pending',
            source TEXT DEFAULT 'website',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )";
        $this->conn->exec($query);

        // Create admin_users table
        $query = "CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )";
        $this->conn->exec($query);

        // Create inquiry_notes table
        $query = "CREATE TABLE IF NOT EXISTS inquiry_notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            inquiry_id INTEGER,
            note TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (inquiry_id) REFERENCES inquiries(id) ON DELETE CASCADE
        )";
        $this->conn->exec($query);

        // Insert default admin user if not exists
        $defaultPassword = password_hash('70709081@MDsaad', PASSWORD_DEFAULT);
        $checkStmt = $this->conn->prepare("SELECT COUNT(*) FROM admin_users WHERE username = ?");
        $checkStmt->execute(['admin']);
        $count = $checkStmt->fetchColumn();
        
        if ($count == 0) {
            $stmt = $this->conn->prepare("INSERT INTO admin_users (username, password) VALUES (?, ?)");
            $stmt->execute(['admin', $defaultPassword]);
        }
    }
}
?>