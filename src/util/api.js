import axios from "axios";

const baseUrl = "https://tctimewalkadmin-default-rtdb.firebaseio.com/";

const baseUrls = "https://tctimewalk.herokuapp.com/";
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

export const handleSubmitEvent = ({ uid, data }) => {
  return axios({
    method: "post",
    url: `${baseUrl}registration/${uid}.json`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return "error";
    });
};

export const handleFetchEvent = (uid, subId) => {
  return axios({
    method: "get",
    url: `${baseUrl}/registration/${uid}/${subId}.json`,
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
      sub_id: data.order_id,
    },
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return "error";
    });
};

export const handleEmail = (data) => {
  return axios({
    method: "post",
    url: `${baseUrls}api/v1/email`,
    data: {
      email_type: data.email_type,
      from_email: "no-reply@tctimewalk.com",
      to_email: data.to_email,
      user_name: data.user_name,
      event_id: data.event_id,
      subId: data.subId,
    },
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return "error";
    });
};

// export const handleCreateEvent = (data) => {
//   return axios({
//     method: "post",
//     url: `http://localhost:8000/api/v1/create_event`,
//     data: data,
//   })
//     .then((res) => {
//       return res;
//     })
//     .catch((err) => {
//       return "error";
//     });
// };

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

export const handleChangeIsPass = (params) => {
  return axios({
    method: "get",
    url: `${baseUrl}/registration/${params.user_id}/${params.sub_id}.json`,
  }).then((res) => {
    const { data } = res;

    const info = {
      ...data,
      isPass: params.is_pass,
      isTouched: true,
    };
    return axios({
      method: "put",
      url: `${baseUrl}/registration/${params.user_id}/${params.sub_id}.json`,
      data: info,
    })
      .then((res) => {
        return axios({
          method: "get",
          url: `${baseUrl}/videoData/${params.event_id}/subscription.json`,
          // data: info,
        }).then((res) => {
          const index = res.data.findIndex(
            (e) => e.userId === params.user_id && e.subId === params.sub_id
          );
          const info = {
            ...res.data[index],
            isPass: params.is_pass,
            isTouched: true,
          };
          const update_data = [
            ...res.data.slice(0, index),
            info,
            ...res.data.slice(index + 1),
          ];
          return axios({
            method: "put",
            url: `${baseUrl}/videoData/${params.event_id}/subscription.json`,
            data: update_data,
          });
        });
      })
      .catch((err) => {
        return "error";
      });
  });
};

export const handleDeleteEvent = (event_id) => {
  return axios({
    method: "get",
    url: `${baseUrl}/videoData/${event_id}.json`,
  }).then((res) => {
    const { data } = res;
    return axios({
      method: "put",
      url: `${baseUrl}/videoData/${event_id}.json`,
      data: {
        ...data,
        isDel: true,
      },
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return "error";
      });
  });
};
