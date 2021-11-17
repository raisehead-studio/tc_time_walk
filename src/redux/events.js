import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  handleFetchVideoData,
  handleFetchEventDataDetail,
  handleSubmitEvent,
  handleFetchEvent,
  handleFetchUserEventData,
  handleUpdateEventSubscription,
  handleEmail,
  handleChangeIsPass,
} from "../util/api";

const initialState = {
  events: {},
  eventLoading: false,
  eventDetail: {},
  eventDetailLoading: false,
  eventUpdated: {},
  eventUpdatedLoading: false,
  userEvents: [],
  userEventsLoading: false,
  userDetail: {},
  userDetailLoading: false,
  sendEmailLoading: false,
  changeIsPassLoading: false,
};

export const handleChangeEventIsPass = createAsyncThunk(
  "event/handleChangeEventIsPass",
  async (params) => {
    const res = await handleChangeIsPass(params);
    return res.data ? res.data : {};
  }
);

export const handleSendEmail = createAsyncThunk(
  "event/handleSendEmail",
  async (params) => {
    console.log(params);

    const res = await handleEmail(params);
    return res.data ? res.data : {};
  }
);

export const handleFetchUserData = createAsyncThunk(
  "event/handleFetchUserData",
  async (uid) => {
    const res = await handleFetchUserEventData(uid);
    return res.data ? res.data : {};
  }
);

export const handleFetchEventData = createAsyncThunk(
  "event/fetchEventData",
  async () => {
    const res = await handleFetchVideoData();
    return res.data;
  }
);

export const handleFetchEventDetail = createAsyncThunk(
  "event/handleFetchEventDataDetail",
  async (id) => {
    const res = await handleFetchEventDataDetail(id);
    console.log(res);
    return res.data ? res.data : {};
  }
);

export const handleFetchUserDetail = createAsyncThunk(
  "event/handleFetchUserDetail",
  async (params) => {
    const res = await handleFetchEvent(params.id);

    const data = Object.values(res.data).filter(
      (e) => e.eventId === params.event_id
    )[0];

    return data || {};
  }
);

export const handleUpdateEvent = createAsyncThunk(
  "event/handleUpdateEvent",
  async (data) => {
    const res = await handleSubmitEvent(data.uid, data.data);
    if (res.data) {
      const res = await handleUpdateEventSubscription(
        data.data.eventId,
        data.data.subscription
      );
      return res.data;
    }
  }
);

export const appSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = action.user;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(handleFetchEventData.pending, (state) => {
      state.eventLoading = true;
    });
    builder.addCase(handleFetchEventData.fulfilled, (state, action) => {
      state.eventLoading = false;
      state.events = action.payload;
    });
    builder.addCase(handleFetchEventDetail.pending, (state) => {
      state.eventDetailLoading = true;
    });
    builder.addCase(handleFetchEventDetail.fulfilled, (state, action) => {
      state.eventDetailLoading = false;
      state.eventDetail = action.payload;
    });
    builder.addCase(handleUpdateEvent.pending, (state) => {
      state.eventUpdatedLoading = true;
    });
    builder.addCase(handleUpdateEvent.fulfilled, (state, action) => {
      state.eventUpdatedLoading = false;
      state.eventUpdated = action.payload;
    });
    builder.addCase(handleFetchUserData.pending, (state) => {
      state.userEventsLoading = true;
    });
    builder.addCase(handleFetchUserData.fulfilled, (state, action) => {
      const updateUserEvent = [];

      Object.entries(action.payload).forEach((event) => {
        updateUserEvent.push({
          id: event[0],
          ...event[1],
        });
      });

      state.userEventsLoading = false;
      state.userEvents = updateUserEvent.sort(
        (a, b) => b.startDate - a.startDate
      );
    });
    builder.addCase(handleFetchUserDetail.pending, (state) => {
      state.userDetailLoading = true;
    });
    builder.addCase(handleFetchUserDetail.fulfilled, (state, action) => {
      state.userDetailLoading = false;
      state.userDetail = action.payload;
    });
    builder.addCase(handleSendEmail.pending, (state) => {
      state.sendEmailLoading = true;
    });
    builder.addCase(handleSendEmail.fulfilled, (state, action) => {
      state.sendEmailLoading = false;
    });
    builder.addCase(handleChangeEventIsPass.pending, (state) => {
      state.changeIsPassLoading = true;
    });
    builder.addCase(handleChangeEventIsPass.fulfilled, (state, action) => {
      state.changeIsPassLoading = false;
    });
  },
});

export default appSlice.reducer;
