import {ref} from 'vue'
import { adsTypeService } from "@/services/adsTypeService.js"
import { defineStore } from "pinia"

export const useAdsTypeStore = defineStore('adsType',() => {

    const adsType = ref([])
    const loading = ref(false)
    const error = ref(null)
    const pagination = ref({total : 0, page:1, pages:1})

    const fetchAll = async (params = {}) => {
        loading.value = true
        error.value = null

        try {
            const {data} = await adsTypeService.getAll(params)
            adsType.value = data.data
            pagination.value = {total : data.total, page : data.page, pages : data.pages}
        }
        catch (err) {
            error.value = err.response?.data?.message || 'Erreur lors du chargement de la page'
        }
        finally {
            loading.value = false
        }

    }


    return {adsType, loading, error, pagination, fetchAll}
})