#!/usr/bin/env python3
import http.server
import socketserver
import os
import subprocess
import json
import sys
from urllib.parse import urlparse, parse_qs

PORT = 8080

class PHPHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Handle API routes by executing PHP
        if path.startswith('/api/'):
            self.handle_php_request('GET')
        # Serve static files from dist
        elif os.path.exists('dist' + path) and path != '/':
            self.path = '/dist' + path
            return http.server.SimpleHTTPRequestHandler.do_GET(self)
        # Serve index.html for React routes
        elif os.path.exists('dist/index.html'):
            self.path = '/dist/index.html'
            return http.server.SimpleHTTPRequestHandler.do_GET(self)
        else:
            return http.server.SimpleHTTPRequestHandler.do_GET(self)
    
    def do_POST(self):
        if self.path.startswith('/api/'):
            self.handle_php_request('POST')
        else:
            self.send_error(404, 'Not Found')
    
    def do_PUT(self):
        if self.path.startswith('/api/'):
            self.handle_php_request('PUT')
        else:
            self.send_error(404, 'Not Found')
    
    def do_DELETE(self):
        if self.path.startswith('/api/'):
            self.handle_php_request('DELETE')
        else:
            self.send_error(404, 'Not Found')
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def handle_php_request(self, method):
        # Map URL to PHP file
        php_file = None
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        if path == '/api/inquiries.php':
            php_file = 'api/inquiries.php'
        elif path == '/api/admin/login.php':
            php_file = 'api/admin/login.php'
        elif path.startswith('/api/admin/inquiries'):
            php_file = 'api/admin/inquiries.php'
        
        if not php_file or not os.path.exists(php_file):
            self.send_error(404, 'API endpoint not found')
            return
        
        # Get request body if POST/PUT
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b''
        
        # Set up environment for PHP
        env = os.environ.copy()
        env['REQUEST_METHOD'] = method
        env['REQUEST_URI'] = self.path
        env['CONTENT_TYPE'] = self.headers.get('Content-Type', '')
        env['CONTENT_LENGTH'] = str(content_length)
        
        # Pass Authorization header if present
        if 'Authorization' in self.headers:
            env['HTTP_AUTHORIZATION'] = self.headers['Authorization']
        
        # Execute PHP script
        try:
            result = subprocess.run(
                ['php', php_file],
                input=post_data,
                capture_output=True,
                env=env,
                timeout=30
            )
            
            # Parse output
            output = result.stdout.decode('utf-8')
            
            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            self.end_headers()
            self.wfile.write(output.encode())
            
        except subprocess.TimeoutExpired:
            self.send_error(500, 'PHP script timeout')
        except Exception as e:
            print(f"Error executing PHP: {e}", file=sys.stderr)
            self.send_error(500, f'Internal Server Error: {str(e)}')

# Change to webapp directory
os.chdir('/home/user/webapp')

# Start server
with socketserver.TCPServer(("", PORT), PHPHandler) as httpd:
    print(f"Server running at http://0.0.0.0:{PORT}/")
    sys.stdout.flush()
    httpd.serve_forever()