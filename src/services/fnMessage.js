export const fnMessage = (error) => {
  if (error?.response) {
    if (error?.response?.status === 500) {
      console.log({
        InternalServerError:
          error?.response?.data?.message || error?.response?.data?.name,
      });
      return "Internal Server Error, please try again later";
    } else if (error?.response?.status === 401) {
      console.log({ 401: error?.response?.statusText });
      return error?.response?.data?.message;
    } else if (error?.response?.status === 404) {
      console.log({
        404: error?.response?.statusText || error?.response?.data?.message,
      });
      return (
        error?.response?.data?.message ||
        "Something went wrong, please try again later"
      );
    } else if (error?.response?.status === 400) {
      console.log({
        400: error?.response?.data?.message,
      });
      return error?.response?.data?.message;
    }
  } else {
    return "Something went wrong, please try again later";
  }
};
