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

  try {
    await query(
      connection,
"INSERT INTO SONGS_PLAYED (SONG_ID, SESSION_ID, TIME_STARTED, TAB_RETURNED)\
        VALUES (?, ?, ?, ?)",
      [
        request.query["song_id"],
        request.cookies["session"],
        convertToMySQLDate(new Date()),
        request.query["tab_returned"] === "t" ? true : false,
      ],
    );
    response.status(200).send({});
  } catch(e) {
    console.log(e)
    response.status(500).send({});
  }
}
