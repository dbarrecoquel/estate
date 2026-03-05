import api from './api.js'

export const adsTypeService = {
    getAll : (params= {}) => api.get('/api/adstype',{params})
}