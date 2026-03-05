import {ref} from 'vue'
import { adsService } from "@/services/adsService.js"
import { defineStore } from "pinia"

export const useAdsStore = defineStore('ads',() => {

    const ads = ref([])
    const currentAds = ref(null)
    const loading = ref(false)
    const error = ref(null)
    const pagination = ref({total : 0, page:1, pages:1})

    const fetchAll = async (params = {}) => {
        loading.value = true
        error.value = null

        try {
            const {data} = await adsService.getAll(params)
            ads.value = data.data
            pagination.value = {total : data.total, page : data.page, pages : data.pages}
        }
        catch (err) {
            error.value = err.response?.data?.message || 'Erreur lors du chargement de la page'
        }
        finally {
            loading.value = false
        }

    }

    const fetchById = async (id) => {
        loading.value = true
        error.value = null

        try {
            const {data}= await adsService.getById(id)
            currentAds.value = data.data
        }
        catch (err) {
            error.value = err.response?.data?.message || 'Erreur lors du chargement produit'
        }
        finally {
            loading.value = false;
        }
    }

    return {ads, currentAds, loading, error, pagination, fetchAll, fetchById}
})