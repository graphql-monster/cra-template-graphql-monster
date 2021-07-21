import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'



const userToStorage = (userToken) => {
  localStorage.setItem('user.token', userToken.token)
  localStorage.setItem('user.refreshToken', userToken.refreshToken)
  localStorage.setItem('user.id', userToken.user.id)
  localStorage.setItem('user.email', userToken.user.email)
  localStorage.setItem('user.verified', Boolean(userToken.user.verified).toString())
  localStorage.setItem('user.roles', userToken.user.roles.map((r) => r.name).toString())
}

const removeUserFromStorage = () => {
  localStorage.removeItem('user.refreshToken')
  localStorage.removeItem('user.token')
  localStorage.removeItem('user.id')
  // localStorage.removeItem('user.email')
  localStorage.removeItem('user.verified')
  localStorage.removeItem('user.roles')
}

const userFromStorage = () => {
  const token = localStorage.getItem('user.token')
  if (!token) {
    return
  }

  return {
    token,
    email: localStorage.getItem('user.email'),
    id: localStorage.getItem('user.id'),
    roles: localStorage
      .getItem('user.roles')
      ?.split(',')
      .map((role) => ({ name: role })),
    verified: Boolean(localStorage.getItem('user.verified')),
  }
}

const initialState = {
  user: userFromStorage(),
  state: 'no-user',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeState: (state, action) => {
      state.state = action.payload
    },
    login(state, action) {
      userToStorage(action.payload)
      state.user = {
        id: action.payload.user.id,
        token: action.payload.token,
        email: action.payload.user.email,
        roles: action.payload.user.roles,
        verified: Boolean(action.payload.user.verified),
      }
    },
    logout(state) {
      removeUserFromStorage()
      delete state.user
    },
  },
})

export const selectUser = (state) => state?.user?.user
// Action creators are generated for each case reducer function
export const { login, logout, changeState } = userSlice.actions

export default userSlice.reducer
