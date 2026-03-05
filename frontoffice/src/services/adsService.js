import api from './api.js'

export const adsService = {
    getAll : (params= {}) => api.get('/api/ads',{params}),
    getById : (id) => api.get(`/api/ads/${id}`)
}