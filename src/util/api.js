import axios from "axios";

const baseUrl =
  "https://beans-tool-bi-test-deplyed-default-rtdb.firebaseio.com";

const baseUrls = "https://fast-mountain-19267.herokuapp.com/";
// const baseUrls =
//   "https://1888-2001-b011-e60d-328c-75ba-ca4b-4fc3-44c6.ngrok.io";

export const fetchIsAdminData = (data) => {
  return axios({
    method: "get",
    url: `${baseUrl}/isAdmin.json`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return "error";
    });
};

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

export const handleFetchVideoData = () => {
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

export const handleFetchEventDataDetail = (id) => {
  return axios({
    method: "get",
    url: `${baseUrl}/videoData/${id}.json`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return "error";
    });
};

export const handleSubmitEvent = (uid, data) => {
  return axios({
    method: "post",
    url: `${baseUrl}/registration/${uid}.json`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return "error";
    });
};

export const handleFetchUserEventData = (uid) => {
  return axios({
    method: "get",
    url: `${baseUrl}/registration/${uid}.json`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return "error";
    });
};

export const handleECPayment = (data) => {
  return axios({
    method: "post",
    url: `${baseUrls}api/v1/to_ecpay`,
    data: {
      trade_name: data.trade_name,
      trade_phone: data.trade_phone,
      county: data.county,
      district: data.district,
      zipcode: data.zipcode,
      event_id: data.event_id,
      order_id: data.order_id,
      amount_price: data.amount_price,
      user_id: data.user_id,
    },
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return "error";
    });
};

export const handleCreateEvent = (data) => {
  return axios({
    method: "post",
    url: `http://localhost:8000/api/v1/create_event`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return "error";
    });
};

export const handleCheckIsAdmin = (uid) => {
  return axios({
    method: "get",
    url: `${baseUrl}/isAdmin/${uid}.json`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return "error";
    });
};

export const handleUpdateEventSubscription = (uid, data) => {
  return axios({
    method: "put",
    url: `${baseUrl}/videoData/${uid}/subscription.json`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return "error";
    });
};

export const handleGetRegistrationInfo = (uid) => {
  return axios({
    method: "get",
    url: `${baseUrl}/registration/${uid}.json`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return "error";
    });
};
