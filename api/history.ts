import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Connection, createConnection } from "mysql2";

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

export const query = (
  connection: Connection,
  query: string,
  subs: any[],
) => {
  return new Promise((accept, reject) => {
    connection.query(
      { sql: query },
      subs,
      function (err, results, fields) {
        if (err) {
          reject(err);
        }
        accept(results);
      },
    );
  });
};
export const getUserFromSession = async (
  connection: Connection,
  session: string,
) => {
  return await query(
    connection,
"SELECT DISTINCT USER_ID \
    FROM SESSIONS \
    WHERE SESSION_ID = ?",
    [session],
  );
};

export const convertToMySQLDate = (date: Date) => {
  return date.toISOString().slice(0, 19).replace("T", " ");
};
