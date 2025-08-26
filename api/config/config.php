<?php
// Configuration file to switch between SQLite (testing) and MySQL (production)

// Set to 'sqlite' for testing, 'mysql' for production
define('DB_TYPE', 'sqlite');

if (DB_TYPE === 'sqlite') {
    require_once __DIR__ . '/database-sqlite.php';
} else {
    require_once __DIR__ . '/database.php';
}
?>