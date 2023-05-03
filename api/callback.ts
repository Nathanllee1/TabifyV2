import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Connection, createConnection } from "mysql2";
import fetch, { Headers } from "node-fetch";

// const { convertToMySQLDate, query } = require("../utils")

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

var spotify_redirect_uri = "http://localhost:3000/api/callback";
if (process.env.PRODUCTION === "True") {
  spotify_redirect_uri = "https://www.tabify.app/api/callback";
} else if (process.env.PRODUCTION === "False") {
  spotify_redirect_uri = "https://tabify2-nathanllee1.vercel.app/api/callback"
}

const getSpotifyUser = async (authToken: string) => {
  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${authToken}`,
  );
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };
  myHeaders.append("Content-Type", "application/json");
  const res = await fetch("https://api.spotify.com/v1/me", requestOptions);
  const profile = await (res)
    .json() as SpotifyApi.CurrentUsersProfileResponse;

  return profile;
};

const getUser = (connection: Connection, userId: string) => {
  return new Promise((accept, reject) => {
    connection.query(
      { sql: "SELECT * FROM USERS WHERE USER_ID = ?" },
      userId,
      function (err, results, fields) {
        accept(results);
      },
    );
  });
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  var code = request.query.code;

  console.log("Recieved code", code);

  const authOptions = {
    method: "POST",
    headers: {
      "Authorization": `Basic ${
        btoa(`${spotify_client_id}:${spotify_client_secret}`)
      }`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      "code": code.toString(),
      "redirect_uri": spotify_redirect_uri,
      "grant_type": "authorization_code",
    }),
  };

  const res = await fetch(
    "https://accounts.spotify.com/api/token",
    authOptions,
  );
  const body = await res.json();

  const user = await getSpotifyUser(body.access_token);

      const connection = createConnection(process.env.DATABASE_URL);
      const userRes = await query(
        connection,
        "SELECT * FROM USERS WHERE USER_ID = ?",
        [user.id],
      ) as string[];
      console.log(userRes);
      // if the user doesn't exist, create them
      if (userRes.length === 0) {
        console.log('Creating userv')
        await query(
          connection,
          "INSERT INTO USERS (USER_ID, USERNAME)\
          VALUES (?, ?)",
          [user.id, user.display_name],
        );
      }

  // new session
  await query(
    connection,
"INSERT INTO SESSIONS (SESSION_ID, USER_ID, TIME_START)\
        VALUES (?, ?, ?)",
    [body.access_token, user.id, convertToMySQLDate(new Date())],
  );

  response.setHeader(
    "Set-Cookie",
    `session=${body.access_token}; Path=/; HttpOnly; Secure; SameSite=None; Expires=9999999`,
  );
  response.redirect("/?token=" + body.access_token);
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
