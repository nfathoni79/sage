import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://jsonblob.com/api/jsonBlob',
  headers: {
    Accept: 'application/json',
  },
})

export default {
  getData: (id) => {
    return apiClient.get(`/${id}`)
  },
  updateData: (id, data) => {
    return apiClient.put(`/${id}`, data)
  },
}