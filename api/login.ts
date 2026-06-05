import type { VercelRequest, VercelResponse } from "@vercel/node";

const spotify_redirect_uri =
  process.env.SPOTIFY_REDIRECT_URI ||
  (process.env.PRODUCTION === "True"
    ? "https://www.tabify.app/api/callback"
    : "http://127.0.0.1:3000/api/callback");

var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  var scope = "streaming user-read-email user-read-private user-top-read";
  var state = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: spotify_redirect_uri,
    state: state,
  });
  console.log(
    "https://accounts.spotify.com/authorize/?" +
      auth_query_parameters.toString(),
  );
  response.redirect(
    "https://accounts.spotify.com/authorize/?" +
      auth_query_parameters.toString(),
  );
}
