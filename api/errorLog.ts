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
  
  // error_id, message, context
  try {
    const res = await query(
      connection,
      "INSERT INTO ERRORS_ (USER_ID, ERR_ID, ERR_CODE, TIME_, MESSAGE, CONTEXT_)\
       VALUES (?, ?, ?, ?, ?, ?)" ,
      [
        userId, 
        request.query["error_id"],
        convertToMySQLDate(new Date()),
        request.query["message"], 
        request.query["context"]
      ],
    );
    response.status(200).json(res);
  } catch(e) {
      console.log(e) 

    response.status(500).send({});
  }
}
