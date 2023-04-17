import axios from "../utils/axios-customize"

const postRegisterUser = (data) => {
  return axios.post(`/api/v1/user/register`, { ...data });
}

const postLoginUser = (data) => {
  return axios.post(`/api/v1/auth/login`, { ...data, delay: 1000 })
}

export {
  postRegisterUser,
  postLoginUser
}