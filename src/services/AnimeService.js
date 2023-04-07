import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://api.consumet.org/anime/gogoanime',
  headers: {
    Accept: 'application/json',
  },
})

export default {
  getTopAiring() {
    return apiClient.get('/top-airing')
  },
  search(query) {
    return apiClient.get(`/${query}?page=1`)
  },
  getAnimeInfo(id) {
    return apiClient.get(`/info/${id}`)
  },
  getStreamLink(episodeId) {
    return apiClient.get(`/watch/${episodeId}`)
  },
}