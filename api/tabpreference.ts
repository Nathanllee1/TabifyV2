import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Connection, createConnection } from "mysql2";
import { convertToMySQLDate, getUserFromSession, query } from "./utils";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const connection = createConnection(process.env.DATABASE_URL);

  const userId =
    (await getUserFromSession(connection, request.cookies["session"]))[0][
      "USER_ID"
    ];
  // transpose, tab_id
  if (request.method === "POST") {
    try {
      await query(
        connection,
        "INSERT INTO TAB_PREFS (USER_ID, TAB_ID, SONG_ID, TRANSPOSE)\
         VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE USER_ID=?, TAB_ID=?, SONG_ID=?, TRANSPOSE=?" ,
        [
          userId, 
          request.query["tab_id"],
          request.query["song_id"], 
          request.query["transpose"],
          userId, 
          request.query["tab_id"],
          request.query["song_id"], 
          request.query["transpose"]
        ],
      );
      response.status(200).send({});
    } catch(e) {
        console.log(e) 
      response.status(500).send({});
    }
    return;

  // tab_id
  } else if (request.method === "GET") {
    try {
      const res = await query(
        connection,
        "SELECT *\
        FROM TAB_PREFS\
        WHERE USER_ID = ? AND TAB_ID = ?",
        [
          userId, 
          request.query["tab_id"]
        ],
      );
      response.status(200).json(res);
    } catch(e) {
        console.log(e)
      response.status(500).send({});
    }
    return;
  }
}
