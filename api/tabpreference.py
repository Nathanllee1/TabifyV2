from urllib.parse import urlparse, parse_qs
from http.server import BaseHTTPRequestHandler
import json


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # session_id
        # tab_id
        arguments = parse_qs(urlparse(self.path).query)

        response = {}

        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()

        self.wfile.write(json.dumps(response).encode())
        return

    def do_POST(self):
        # session_id
        # tab_id
        # transpose_level
        arguments = parse_qs(urlparse(self.path).query)

        response = {}

        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()

        self.wfile.write(json.dumps(response).encode())
        return
