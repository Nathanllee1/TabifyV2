/*
from urllib.parse import urlparse, parse_qs
from http.server import BaseHTTPRequestHandler
import json


class handler(BaseHTTPRequestHandler):

    def do_POST(self):
        # session_id
        # tab_id
        # song_id
        arguments = parse_qs(urlparse(self.path).query)

        response = {}

        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()

        self.wfile.write(json.dumps(response).encode())
        return

    def do_GET(self):
        # session_id
        # song_id
        arguments = parse_qs(urlparse(self.path).query)

        response = {}

        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()

        self.wfile.write(json.dumps(response).encode())
        return
*/
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Connection, createConnection } from "mysql2";
import { convertToMySQLDate, getUserFromSession, query } from "./utils";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const connection = createConnection(process.env.DATABASE_URL);

  console.log(request.method)

  const userId =
    (await getUserFromSession(connection, request.cookies["session"]))[0][
      "USER_ID"
    ];

  try {
    await query(
      connection,
      "",
      [
        
      ],
    );
    response.status(200).send({});
  } catch {
    response.status(500).send({});
  }
}
