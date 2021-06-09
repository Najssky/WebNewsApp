import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
	plugins: [createPersistedState({ storage: window.sessionStorage })],
	state: {
		status: "",
		user: "",
	},
	mutations: {
		auth_request(state) {
			state.status = "loading";
		},
		auth_success(state, login) {
			state.status = "success";
			state.user = login;
		},
		auth_error(state) {
			state.status = "error";
		},
		logout(state) {
			state.status = "";
		},
	},
	actions: {
		login({ commit }, login) {
			return new Promise((resolve) => {
				commit("auth_success", login);
				resolve();
			});
		},
		logout({ commit }) {
			return new Promise((resolve) => {
				commit("logout");
				resolve();
			});
		},
	},

	getters: {
		authStatus: (state) => state.status,
		user: (state) => state.user,
	},
});
