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
    const res = (await query(
      connection,
"SELECT COUNT(*) AS sessions\
        FROM SESSIONS\
        WHERE USER_ID = ?",
      [
        userId,
      ],
    ))[0] as { sessions: number };
    console.log(res);

    const songs = (await query(
      connection,
"SELECT SUM(songs) AS songs FROM (SELECT SESSION_ID, COUNT(*) AS songs  \
      FROM SONGS_PLAYED\
      GROUP BY SESSION_ID\
      HAVING SESSION_ID IN (SELECT SESSION_ID FROM SESSIONS WHERE USER_ID = ?)) foo ",
      [
        userId,
      ],
    ))[0] as { songs: number };

    const top10 = (await query(
      connection,
    "SELECT SONG_ID, COUNT(*) AS TIMES_PLAYED\
    FROM USERS\
    JOIN SESSIONS ON SESSIONS.USER_ID = USERS.USER_ID\
    JOIN SONGS_PLAYED ON SONGS_PLAYED.SESSION_ID = SESSIONS.SESSION_ID\
    WHERE USERS.USER_ID = ?\
    GROUP BY SONG_ID\
    ORDER BY TIMES_PLAYED DESC\
    LIMIT 10",
      [
        userId,
      ],
    ))

    console.log(top10)

    response.status(200).json({ ...res, ...songs, topTen: top10 });
  } catch (e) {
    console.log(e);
    response.status(500).send({});
  }
  return;
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
