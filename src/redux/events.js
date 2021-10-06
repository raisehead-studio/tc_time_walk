import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  handleFetchVideoData,
  handleFetchEventDataDetail,
  handleSubmitEvent,
  handleFetchUserEventData,
  handleUpdateEventSubscription,
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
};

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
    return res.data ? res.data : {};
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
  },
});

export default appSlice.reducer;
