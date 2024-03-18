import { ENVIRONMENT } from "../services";

export const consoleLogonlyDev = (msg) => {
  if (ENVIRONMENT === "development" || ENVIRONMENT === "localhost") {
    console.log(msg);
  }
};
