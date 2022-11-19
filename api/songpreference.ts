
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

    if (request.method === "POST") {
      try {
        console.log(request.query["selected_tab"], request.query["song_id"])
        const res = await query(
          connection,
          "INSERT INTO SONG_PREFS (USER_ID, SONG_ID, SELECTED_TAB)\
           VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE USER_ID=?, SONG_ID=?, SELECTED_TAB=?" ,
          [
            userId, 
            request.query["song_id"][0],
            request.query["selected_tab"], 
            userId, 
            request.query["song_id"][0],
            request.query["selected_tab"]
          ],
        );
        response.status(200).json(res);
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
          FROM SONG_PREFS\
          WHERE USER_ID = ? AND SONG_ID = ?",
          [
            userId, 
            request.query["song_id"]
          ],
        );
        console.log(res)
        response.status(200).json(res);
      } catch(e) {
          console.log(e)
        response.status(500).send({});
      }
      return;
    }
  
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
