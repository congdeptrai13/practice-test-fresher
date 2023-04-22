import axios from "../utils/axios-customize"

const postRegisterUser = (data) => {
  return axios.post(`/api/v1/user/register`, { ...data });
}

const postLoginUser = (data) => {
  return axios.post(`/api/v1/auth/login`, { ...data, delay: 1000 })
}

const fetchInfoUser = () => {
  return axios.get(`/api/v1/auth/account`)
}

const postLogoutUser = () => {
  return axios.post(`/api/v1/auth/logout`);
}

const getUsersWithPaginate = (current, pageSize, query, sorter) => {
  if (query) {
    return axios.get(`/api/v1/user?current=${current || 1}&pageSize=${pageSize || 2}${query || ""}`)
  }
  if (sorter) {
    return axios.get(`/api/v1/user?current=${current || 1}&pageSize=${pageSize || 2}${query || ""}&sort=${sorter}`)
  }
  return axios.get(`/api/v1/user?current=${current || 1}&pageSize=${pageSize || 2} `)

}

export {
  postRegisterUser,
  postLoginUser,
  fetchInfoUser,
  postLogoutUser,
  getUsersWithPaginate
}