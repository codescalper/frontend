import axios from "axios";
import {
  MEME_API_PASSWORD,
  MEME_API_URL,
  MEME_API_USERNAME,
} from "../../env/env";
// api - instance exposes authorization header - Error from the API
// Using axios to avoid the above

// https://imgflip.com/api
const API = MEME_API_URL;
const ipUsername = MEME_API_USERNAME;
const ipPassword = MEME_API_PASSWORD;

export const apiGetAllMemes = async () => {
  const result = await axios.get(`${API}/get_memes`);
  return result?.data;
};

export const apiSearchMemes = async (ipQuery) => {
  const formData = new URLSearchParams();

  formData.append("username", ipUsername);
  formData.append("password", ipPassword);
  formData.append("query", ipQuery);

  const result = await axios.post(`${API}/search_memes`, formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return result?.data;
};
