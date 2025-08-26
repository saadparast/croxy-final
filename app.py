#!/usr/bin/env python3
import json
import sqlite3
import hashlib
import hmac
import base64
import time
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import sys

PORT = 8081
DB_FILE = '/home/user/webapp/croxy_exim.db'
JWT_SECRET = 'croxy-exim-secret-key-2024'

class APIHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()
    
    def send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # API routes
        if path == '/api/admin/inquiries' or path.startswith('/api/admin/inquiries/'):
            self.handle_admin_inquiries('GET')
        # Serve static files from dist
        elif path != '/' and os.path.exists('dist' + path):
            self.serve_static_file('dist' + path)
        # Serve index.html for React routes
        elif os.path.exists('dist/index.html'):
            self.serve_static_file('dist/index.html')
        else:
            self.send_error(404, 'Not Found')
    
    def do_POST(self):
        path = urlparse(self.path).path
        
        if path == '/api/inquiries.php' or path == '/api/inquiries':
            self.handle_inquiry_submission()
        elif path == '/api/admin/login.php' or path == '/api/admin/login':
            self.handle_admin_login()
        else:
            self.send_error(404, 'Not Found')
    
    def do_PUT(self):
        if self.path.startswith('/api/admin/inquiries/'):
            self.handle_admin_inquiries('PUT')
        else:
            self.send_error(404, 'Not Found')
    
    def do_DELETE(self):
        if self.path.startswith('/api/admin/inquiries/'):
            self.handle_admin_inquiries('DELETE')
        else:
            self.send_error(404, 'Not Found')
    
    def serve_static_file(self, filepath):
        try:
            with open(filepath, 'rb') as f:
                content = f.read()
            
            # Determine content type
            if filepath.endswith('.html'):
                content_type = 'text/html'
            elif filepath.endswith('.css'):
                content_type = 'text/css'
            elif filepath.endswith('.js'):
                content_type = 'application/javascript'
            elif filepath.endswith('.json'):
                content_type = 'application/json'
            elif filepath.endswith('.png'):
                content_type = 'image/png'
            elif filepath.endswith('.jpg') or filepath.endswith('.jpeg'):
                content_type = 'image/jpeg'
            elif filepath.endswith('.svg'):
                content_type = 'image/svg+xml'
            else:
                content_type = 'application/octet-stream'
            
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        except FileNotFoundError:
            self.send_error(404, 'File not found')
    
    def handle_inquiry_submission(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
            
            # Connect to database
            conn = sqlite3.connect(DB_FILE)
            c = conn.cursor()
            
            # Insert inquiry
            c.execute('''INSERT INTO inquiries 
                        (name, email, phone, company, country, product_interest, 
                         custom_product, quantity, delivery_port, target_price, 
                         certifications, message, inquiry_type)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                     (data.get('name'), data.get('email'), data.get('phone'),
                      data.get('company'), data.get('country'), 
                      data.get('productInterest'), data.get('customProduct'),
                      data.get('quantity'), data.get('deliveryPort'),
                      data.get('targetPrice'), 
                      json.dumps(data.get('certifications', [])),
                      data.get('message'), data.get('inquiryType', 'general')))
            
            inquiry_id = c.lastrowid
            conn.commit()
            conn.close()
            
            # Send response
            response = {
                'success': True,
                'id': inquiry_id,
                'message': 'Inquiry submitted successfully'
            }
            
            self.send_response(201)
            self.send_header('Content-Type', 'application/json')
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            self.send_error(500, f'Error: {str(e)}')
    
    def handle_admin_login(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
            username = data.get('username')
            password = data.get('password')
            
            # Check credentials (hardcoded for simplicity)
            if username == 'admin' and password == '70709081@MDsaad':
                # Generate JWT token
                header = base64.urlsafe_b64encode(json.dumps({'typ': 'JWT', 'alg': 'HS256'}).encode()).decode().rstrip('=')
                payload = {
                    'id': 1,
                    'username': username,
                    'exp': int(time.time()) + 86400,
                    'iat': int(time.time())
                }
                payload_encoded = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip('=')
                
                signature = hmac.new(
                    JWT_SECRET.encode(),
                    f"{header}.{payload_encoded}".encode(),
                    hashlib.sha256
                ).digest()
                signature_encoded = base64.urlsafe_b64encode(signature).decode().rstrip('=')
                
                token = f"{header}.{payload_encoded}.{signature_encoded}"
                
                response = {
                    'success': True,
                    'token': token,
                    'user': {
                        'id': 1,
                        'username': username
                    }
                }
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())
            else:
                self.send_response(401)
                self.send_header('Content-Type', 'application/json')
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': 'Invalid credentials'}).encode())
                
        except Exception as e:
            self.send_error(500, f'Error: {str(e)}')
    
    def handle_admin_inquiries(self, method):
        # Check authorization
        auth_header = self.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            self.send_response(401)
            self.send_header('Content-Type', 'application/json')
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({'success': False, 'message': 'Access denied'}).encode())
            return
        
        # For simplicity, we'll skip JWT validation in this demo
        
        parsed_path = urlparse(self.path)
        path_parts = parsed_path.path.strip('/').split('/')
        inquiry_id = path_parts[-1] if len(path_parts) > 2 and path_parts[-1].isdigit() else None
        
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        
        try:
            if method == 'GET':
                if inquiry_id:
                    # Get single inquiry
                    c.execute('SELECT * FROM inquiries WHERE id = ?', (inquiry_id,))
                    inquiry = c.fetchone()
                    if inquiry:
                        response = {'success': True, 'data': dict(inquiry)}
                    else:
                        response = {'success': False, 'error': 'Inquiry not found'}
                else:
                    # Get all inquiries
                    c.execute('SELECT * FROM inquiries ORDER BY created_at DESC')
                    inquiries = [dict(row) for row in c.fetchall()]
                    response = {'success': True, 'data': inquiries}
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())
                
            elif method == 'PUT' and inquiry_id:
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                if 'status' in data:
                    c.execute('UPDATE inquiries SET status = ? WHERE id = ?', 
                             (data['status'], inquiry_id))
                    conn.commit()
                
                response = {'success': True, 'message': 'Inquiry updated successfully'}
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())
                
            elif method == 'DELETE' and inquiry_id:
                c.execute('DELETE FROM inquiries WHERE id = ?', (inquiry_id,))
                conn.commit()
                
                response = {'success': True, 'message': 'Inquiry deleted successfully'}
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())
                
        except Exception as e:
            self.send_error(500, f'Error: {str(e)}')
        finally:
            conn.close()

# Initialize database
def init_database():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    
    # Create tables if they don't exist
    c.execute('''CREATE TABLE IF NOT EXISTS inquiries (
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
    )''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )''')
    
    conn.commit()
    conn.close()

# Main
if __name__ == '__main__':
    os.chdir('/home/user/webapp')
    init_database()
    
    server = HTTPServer(('', PORT), APIHandler)
    print(f"Server running at http://0.0.0.0:{PORT}/")
    sys.stdout.flush()
    server.serve_forever()