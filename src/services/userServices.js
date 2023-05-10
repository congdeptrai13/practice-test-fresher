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

const callUploadAvatarImg = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append('fileImg', fileImg);
  return axios({
    method: 'post', url: '/api/v1/file/upload', data: bodyFormData,
    headers:
    {
      "Content-Type":
        "multipart/form-data",
      "upload-type": "avatar"
    },
  });
}

const putUpdateInfoUser = (fullName, phone, avatar, _id) => {
  return axios.put("/api/v1/user", { fullName, phone, avatar, _id })
}

const postChangePasswordUser = (email, oldpass, newpass) => {
  return axios.post("/api/v1/user/change-password", { email, oldpass, newpass })
}

const getAllDashboard = () => {
  return axios.get("/api/v1/database/dashboard");
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
  deleteUser,
  callUploadAvatarImg,
  putUpdateInfoUser,
  postChangePasswordUser,
  getAllDashboard
}