import axios from "../utils/axios-customize"

const postCreateOrder = (data) => {
  return axios.post("/api/v1/order", { ...data })
}

const getAllOrder = () => {
  return axios.get("/api/v1/history")
}

const getListOrderWithPaginate = () => {
  return axios.get(`/api/v1/order?current=1&pageSize=10`);
}
export {
  postCreateOrder,
  getAllOrder,
  getListOrderWithPaginate
}