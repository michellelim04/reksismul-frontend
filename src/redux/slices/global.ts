import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
	name: "globals",
	initialState: {
		loggedIn: false,
		sidebar: false,
	},
	reducers: {
		login: (state) => {
			state.loggedIn = true;
		},
		logout: (state) => {
			state.loggedIn = false;
		},
		toggleSidebar: (state) => {
			state.sidebar = !state.sidebar;
		},
	},
});
export default globalSlice.reducer;
export const { login, logout, toggleSidebar } = globalSlice.actions;
