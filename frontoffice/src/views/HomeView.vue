<template>
  <div class="page">

    <!-- Header -->
    <div class="page-header">
      <div class="header-text">
        <span class="header-eyebrow">Catalogue</span>
        <h1 class="header-title">Annonces<br><em>immobilières</em></h1>
      </div>

      <div class="filters">
        <div class="filter-group">
          <label class="filter-label">Recherche</label>
          <input
            v-model="search"
            class="filter-input"
            placeholder="Titre, ville, description..."
            @input="debouncedFetch"
          />
        </div>

        <div class="filter-group">
          <label class="filter-label">Type</label>
          <select v-model="selectedAdsType" class="filter-input" @change="fetchAds">
            <option value="">Tous les types</option>
            <option
              v-for="adsType in adsTypeStore.adsType"
              :key="adsType._id"
              :value="adsType._id"
            >
              {{ adsType.name }}
            </option>
          </select>
        </div>

        <div class="filter-group filter-group--price">
          <label class="filter-label">Budget (€)</label>
          <div class="price-range">
            <input
              v-model="minPrice"
              class="filter-input filter-input--sm"
              type="number"
              min="0"
              placeholder="Min"
              @change="fetchAds"
            />
            <span class="price-sep">—</span>
            <input
              v-model="maxPrice"
              class="filter-input filter-input--sm"
              type="number"
              min="0"
              placeholder="Max"
              @change="fetchAds"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- États -->
    <div v-if="adsStore.loading" class="state">
      <span class="state__spinner"></span>
      <span>Chargement...</span>
    </div>

    <div v-else-if="adsStore.error" class="state state--error">
      {{ adsStore.error }}
    </div>

    <div v-else-if="adsStore.ads.length === 0" class="state state--empty">
      <span class="state__icon">🏠</span>
      <p>Aucune annonce trouvée</p>
      <small>Essayez d'élargir vos critères de recherche</small>
    </div>

    <!-- Grille -->
    <div v-else>
      <div class="results-meta">
        <span>{{ adsStore.pagination.total ?? adsStore.ads.length }} annonce{{ adsStore.ads.length > 1 ? 's' : '' }}</span>
      </div>

      <div class="ads-grid">
        <RouterLink
          v-for="(ads, i) in adsStore.ads"
          :key="ads._id"
          :to="`/ads/${ads._id}`"
          class="ad-card"
          
        >
          <div class="ad-card__img">
            <img
              v-if="ads.images?.[0]"
              :src="ads.images[0].url"
              :alt="ads.images[0].alt"
            />
           
            <span class="ad-card__badge">{{ ads.adsType?.name }}</span>
          </div>

          <div class="ad-card__body">
            <h3 class="ad-card__title">{{ ads.title }}</h3>

            <div class="ad-card__meta">
              <span v-if="ads.surface" class="ad-card__surface">
                {{ ads.surface }} m²
              </span>
            </div>

            <div class="ad-card__footer">
              <span class="ad-card__price">
                {{ ads.price?.toLocaleString('fr-FR') }} €
              </span>
              <span class="ad-card__arrow">→</span>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="adsStore.pagination.pages > 1" class="pagination">
      <button
        class="pagination__btn"
        :disabled="page === 1"
        @click="changePage(page - 1)"
      >← Précédent</button>

      <span class="pagination__info">{{ page }} / {{ adsStore.pagination.pages }}</span>

      <button
        class="pagination__btn"
        :disabled="page === adsStore.pagination.pages"
        @click="changePage(page + 1)"
      >Suivant →</button>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAdsStore } from '@/stores/ads.js'
import { useAdsTypeStore } from '@/stores/adsType.js'

const route = useRoute()
const adsStore = useAdsStore()
const adsTypeStore = useAdsTypeStore()

const selectedAdsType = ref('')
const search = ref('')
const minPrice = ref('')
const maxPrice = ref('')
const page = ref(1)

let debounceTimer = null
const debouncedFetch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(fetchAds, 400)
}

const fetchAds = () => {
  const params = { page: page.value, limit: 12 }
  if (search.value) params.search = search.value
  if (selectedAdsType.value) params.adsType = selectedAdsType.value
  if (minPrice.value) params.minPrice = minPrice.value
  if (maxPrice.value) params.maxPrice = maxPrice.value
  adsStore.fetchAll(params)
}

const changePage = (newPage) => {
  page.value = newPage
  fetchAds()
}

watch(minPrice, (val) => {
  if (val !== '' && Number(val) < 0) minPrice.value = 0
})
watch(maxPrice, (val) => {
  if (val !== '' && Number(val) < 0) maxPrice.value = 0
  if (minPrice.value !== '' && val !== '' && Number(val) < Number(minPrice.value)) {
    maxPrice.value = minPrice.value
  }
})

onMounted(() => {
  if (route.query.search) search.value = route.query.search
  if (route.query.adsType) selectedAdsType.value = route.query.adsType
  if (route.query.minPrice) minPrice.value = route.query.minPrice
  if (route.query.maxPrice) maxPrice.value = route.query.maxPrice
  if (route.query.page) page.value = Number(route.query.page)
  adsTypeStore.fetchAll()
  fetchAds()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Mulish:wght@300;400;500;600&display=swap');

/* ── Variables ── */
.page {
  --c-bg: #f7f4ef;
  --c-surface: #ffffff;
  --c-border: #e4ddd3;
  --c-text: #1a1714;
  --c-muted: #8a7f75;
  --c-accent: #c4714a;
  --c-accent-light: #f2e8e2;
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Mulish', sans-serif;
  --radius: 4px;
  --radius-lg: 12px;

  font-family: var(--font-body);
  background: var(--c-bg);
  min-height: 100vh;
  padding: 2.5rem 2rem 4rem;
  max-width: 1280px;
  margin: 0 auto;
  color: var(--c-text);
}

/* ── Header ── */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--c-border);
}

.header-eyebrow {
  display: block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--c-accent);
  margin-bottom: 0.5rem;
}

.header-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 700;
  line-height: 1.05;
  color: var(--c-text);
  margin: 0;
}

.header-title em {
  font-style: italic;
  color: var(--c-accent);
}

/* ── Filters ── */
.filters {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.filter-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--c-muted);
}

.filter-input {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  padding: 0.6rem 0.9rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--c-text);
  outline: none;
  transition: border-color 0.15s;
  min-width: 160px;
}

.filter-input:focus {
  border-color: var(--c-accent);
}

.filter-input--sm {
  min-width: 80px;
  width: 80px;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-sep {
  color: var(--c-muted);
  font-size: 0.8rem;
}

/* ── States ── */
.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 6rem 2rem;
  color: var(--c-muted);
  font-size: 0.9rem;
}

.state--error { color: #c0392b; }

.state__icon { font-size: 3rem; }

.state--empty small {
  font-size: 0.8rem;
  opacity: 0.7;
}

.state__spinner {
  width: 28px;
  height: 28px;
  border: 2px solid var(--c-border);
  border-top-color: var(--c-accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Results meta ── */
.results-meta {
  font-size: 0.8rem;
  color: var(--c-muted);
  margin-bottom: 1.25rem;
  letter-spacing: 0.03em;
}

/* ── Grid ── */
.ads-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* ── Card ── */
.ad-card {
  display: block;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.ad-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.08);
  border-color: var(--c-accent);
}

/* Featured — première card plus grande */
.ad-card--featured {
  grid-column: span 2;
}

.ad-card--featured .ad-card__img {
  height: 280px;
}

@media (max-width: 700px) {
  .ad-card--featured { grid-column: span 1; }
  .ad-card--featured .ad-card__img { height: 200px; }
}

/* Card image */
.ad-card__img {
  position: relative;
  height: 200px;
  background: var(--c-accent-light);
  overflow: hidden;
}

.ad-card__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.ad-card:hover .ad-card__img img {
  transform: scale(1.04);
}

.ad-card__no-img {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  background: var(--c-accent-light);
}

.ad-card__badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: var(--c-text);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.3rem 0.6rem;
  border-radius: 2px;
}

/* Card body */
.ad-card__body {
  padding: 1.25rem;
}

.ad-card__title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 0.5rem;
  color: var(--c-text);
}

.ad-card__meta {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.ad-card__surface {
  font-size: 0.8rem;
  color: var(--c-muted);
  background: var(--c-bg);
  padding: 0.2rem 0.5rem;
  border-radius: 2px;
}

.ad-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid var(--c-border);
}

.ad-card__price {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--c-accent);
}

.ad-card__arrow {
  font-size: 1rem;
  color: var(--c-muted);
  transition: transform 0.2s, color 0.2s;
}

.ad-card:hover .ad-card__arrow {
  transform: translateX(4px);
  color: var(--c-accent);
}

/* ── Pagination ── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--c-border);
}

.pagination__btn {
  background: none;
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  padding: 0.6rem 1.25rem;
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--c-text);
  cursor: pointer;
  transition: all 0.15s;
}

.pagination__btn:hover:not(:disabled) {
  border-color: var(--c-accent);
  color: var(--c-accent);
}

.pagination__btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.pagination__info {
  font-size: 0.85rem;
  color: var(--c-muted);
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .page-header {
    flex-direction: column;
  }

  .filters {
    width: 100%;
  }

  .filter-input {
    min-width: 120px;
  }
}

@media (max-width: 600px) {
  .page { padding: 1.5rem 1rem 3rem; }
  .filters { flex-direction: column; }
  .filter-input { min-width: 100%; }
  .filter-input--sm { width: 100%; min-width: 0; }
  .price-range { width: 100%; }
}
</style>