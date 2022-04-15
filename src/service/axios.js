import axios from 'axios'

export const amgApi = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  // params: {}
})

// server Fake

export const amgApiFake = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL_FAKE,
})

// server Fake
