import axios from "axios";

const baseUrl =
  "https://beans-tool-bi-test-deplyed-default-rtdb.firebaseio.com";

export const handleUpdateData = (data) => {
  return axios({
    method: "post",
    url: `${baseUrl}/videoData.json`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return "error";
    });
};

export const handleFetchData = (data) => {
  return axios({
    method: "get",
    url: `${baseUrl}/videoData.json`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return "error";
    });
};

export const handleFetchVideoData = (videoId) => {
  return axios({
    method: "get",
    url: `${baseUrl}/videoData/${videoId}.json`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return "error";
    });
};
