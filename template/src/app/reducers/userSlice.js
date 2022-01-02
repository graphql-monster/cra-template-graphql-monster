import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loader } from "graphql.macro";
export const LOGIN_QL = loader("../graphql/login.gql");
export const REGISTER_MUTATION = loader("../graphql/register.gql");
export const FORGOTTEN_PASSWORD_RESET_MUTATION = loader(
  "../graphql/forgotten-password-reset.gql"
);

export const STATES = {
  NONE: "NONE",
  LOG_IN: "LOG_IN",
  LOGING: "LOGING",
  REGISTERING: "REGISTERING",
  RESETING: "RESETING",
};

export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }, { extra: { apolloClient } }) => {
    const { data } = await apolloClient.mutate({
      mutation: LOGIN_QL,
      variables: { email, password },
    });

    return data.login_v1;
  }
);

export const register = createAsyncThunk(
  "user/register",
  async (variables, { extra: { apolloClient } }) => {
    const { data } = await apolloClient.mutate({
      mutation: REGISTER_MUTATION,
      variables,
    });

    return data.register_v1;
  }
);

export const passwordReset = createAsyncThunk(
  "user/passwordReset",
  async (variables, { extra: { apolloClient } }) => {
    const { data } = await apolloClient.mutate({
      mutation: FORGOTTEN_PASSWORD_RESET_MUTATION,
      variables,
    });

    return data.register_v1;
  }
);

const userToStorage = (userToken) => {
  localStorage.setItem("user.token", userToken.token);
  localStorage.setItem("user.refreshToken", userToken.refreshToken);
  localStorage.setItem("user.id", userToken.user.id);
  localStorage.setItem("user.email", userToken.user.email);
  localStorage.setItem(
    "user.verified",
    Boolean(userToken.user.verified).toString()
  );
  localStorage.setItem(
    "user.roles",
    userToken.user.roles.map((r) => r.name).toString()
  );
};

const removeUserFromStorage = () => {
  localStorage.removeItem("user.refreshToken");
  localStorage.removeItem("user.token");
  localStorage.removeItem("user.id");
  // localStorage.removeItem('user.email')
  localStorage.removeItem("user.verified");
  localStorage.removeItem("user.roles");
};

const userFromStorage = () => {
  const token = localStorage.getItem("user.token");
  if (!token) {
    return;
  }

  return {
    token,
    email: localStorage.getItem("user.email"),
    id: localStorage.getItem("user.id"),
    roles: localStorage
      .getItem("user.roles")
      ?.split(",")
      .map((role) => ({ name: role })),
    verified: Boolean(localStorage.getItem("user.verified")),
  };
};

const initialState = {
  user: userFromStorage(),
  state: "no-user",
};

const _login = (state, user) => {
  userToStorage(user);
  state.state = STATES.LOG_IN;
  state.user = {
    id: user.user.id,
    token: user.token,
    email: user.user.email,
    roles: user.user.roles,
    verified: Boolean(user.user.verified),
  };
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    changeState: (state, action) => {
      state.state = action.payload;
    },
    logout(state) {
      removeUserFromStorage();
      delete state.user;
    },
  },
  extraReducers: {
    [login.pending]: (state, action) => {
      state.state = STATES.LOGING;
    },
    [login.fulfilled]: (state, action) => {
      _login(state, action.payload);
    },
    [register.pending]: (state, action) => {
      state.state = STATES.REGISTERING;
    },
    [register.fulfilled]: (state, action) => {
      _login(state, action.payload);
    },
    [passwordReset.pending]: (state, action) => {
      state.state = STATES.RESETING;
    },
    [passwordReset.fulfilled]: (state, action) => {
      _login(state, action.payload);
    },
  },
});

export const selectUser = (state) => state?.user?.user;
// Action creators are generated for each case reducer function
export const { logout, changeState } = userSlice.actions;

export default userSlice.reducer;
