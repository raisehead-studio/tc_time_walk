import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: {},
}

export const appSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = action.user
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateUser } = appSlice.actions

export default appSlice.reducer