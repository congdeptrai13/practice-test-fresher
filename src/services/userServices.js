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

const postCreateUser = (data) => {
  return axios.post("/api/v1/user", { ...data });
}

const postImportUser = (data) => {
  return axios.post("/api/v1/user/bulk-create", [...data]);
}

const putUpdateUser = (data) => {
  return axios.put("/api/v1/user", { ...data });
}

const deleteUser = (id) => {
  return axios.delete(`/api/v1/user/${id}`);
}
export {
  postRegisterUser,
  postLoginUser,
  fetchInfoUser,
  postLogoutUser,
  getUsersWithPaginate,
  postCreateUser,
  postImportUser,
  putUpdateUser,
  deleteUser
}