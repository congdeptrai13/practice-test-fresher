import axios from "../utils/axios-customize"

const getBooksWithPaginate = (current, pageSize, query, sorter) => {
  if (query) {
    return axios.get(`/api/v1/book?current=${current || 1}&pageSize=${pageSize || 2}${query || ""}&sort=${sorter || ""}`)
  }
  if (sorter) {
    return axios.get(`/api/v1/book?current=${current || 1}&pageSize=${pageSize || 2}${query || ""}&sort=${sorter || ""}`)
  }
  return axios.get(`/api/v1/book?current=${current || 1}&pageSize=${pageSize || 4} `)
}

const getAllCategory = () => {
  return axios.get(`/api/v1/database/category`);
}
const callUploadBookImg = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append('fileImg', fileImg);
  return axios({
    method: 'post', url: '/api/v1/file/upload', data: bodyFormData,
    headers:
    {
      "Content-Type":
        "multipart/form-data",
      "upload-type": "book"
    },
  });
}

const postCreateBook = (thumbnail, slider, mainText, author, price, sold, quantity, category) => {
  return axios.post('/api/v1/book', { thumbnail, slider, mainText, author, price, sold, quantity, category })
}

const putUpdateBook = (id, thumbnail, slider, mainText, author, price, sold, quantity, category) => {
  return axios.put(`/api/v1/book/${id}`, { thumbnail, slider, mainText, author, price, sold, quantity, category })
}

const deleteBook = (id) => {
  return axios.delete(`/api/v1/book/${id}`);
}

const getDetailsBook = (id) => {
  return axios.get(`/api/v1/book/${id}`);
}

export {
  getBooksWithPaginate,
  getAllCategory,
  callUploadBookImg,
  postCreateBook,
  putUpdateBook,
  deleteBook,
  getDetailsBook
}