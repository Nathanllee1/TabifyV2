import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Connection, createConnection } from "mysql2";
import * as req from "request";
import fetch, { Headers } from "node-fetch";
import { convertToMySQLDate, query } from "./utils";

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

var spotify_redirect_uri = "http://localhost:3000/api/callback";
if (process.env.PRODUCTION === "True") {
  spotify_redirect_uri = "https://www.tabify.app/api/callback";
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
  const profile =
    await (await fetch("https://api.spotify.com/v1/me", requestOptions))
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

  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: spotify_redirect_uri,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization: "Basic " +
        Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString(
          "base64",
        ),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    json: true,
  };

  req.post(authOptions, async function (error, res, body) {
    if (!error && res.statusCode === 200) {
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
        await query(
          connection,
          "INSERT INTO USERS (USER_ID, USERNAME, PROFILE_PIC_URL)\
          VALUES (?, ?, ?)",
          [user.id, user.display_name, user.images[0].url],
        );
      }

      // new session
      await query(connection, 
        "INSERT INTO SESSIONS (SESSION_ID, USER_ID, TIME_START)\
        VALUES (?, ?, ?)", 
        [body.access_token, user.id, convertToMySQLDate(new Date())]);

      response.setHeader(
        "Set-Cookie",
        `session=${body.access_token}; Path=/; HttpOnly; Secure; SameSite=None; Expires=9999999`,
      );
      response.redirect("/?token=" + body.access_token);
    }
  });
}
