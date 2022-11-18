import type { Connection } from "mysql2";

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
