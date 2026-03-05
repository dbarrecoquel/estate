<template>
  <div class="page">

    <RouterLink to="/" class="back">
      <span class="back__arrow">←</span>
      <span>Retour aux annonces</span>
    </RouterLink>

    <div v-if="adsStore.loading" class="state">
      <span class="state__spinner"></span>
      <span>Chargement...</span>
    </div>

    <div v-else-if="adsStore.error" class="state state--error">
      {{ adsStore.error }}
    </div>

    <div v-else-if="ads" class="detail">

      <!-- Image -->
      <div class="detail__img">
        <img
          v-if="ads.images?.[0]"
          :src="ads.images[0].url"
          :alt="ads.images[0].alt"
        />
        <div v-else class="detail__no-img">🏠</div>
      </div>

      <!-- Infos -->
      <div class="detail__info">
        <span class="detail__badge">{{ ads.adsType?.name }}</span>

        <h1 class="detail__title">{{ ads.title }}</h1>

        <div class="detail__price-block">
          <span class="detail__price">
            {{ ads.price?.toLocaleString('fr-FR') }} €
          </span>
          <span v-if="ads.surface" class="detail__surface">
            {{ ads.surface }} m²
          </span>
        </div>

        <div v-if="ads.description" class="detail__desc-block">
          <h2 class="detail__section-title">Description</h2>
          <p class="detail__desc">{{ ads.description }}</p>
        </div>

        <div v-if="ads.surface || ads.rooms" class="detail__specs">
          <h2 class="detail__section-title">Caractéristiques</h2>
          <div class="specs-grid">
            <div v-if="ads.surface" class="spec">
              <span class="spec__label">Surface</span>
              <span class="spec__value">{{ ads.surface }} m²</span>
            </div>
            <div v-if="ads.rooms" class="spec">
              <span class="spec__label">Pièces</span>
              <span class="spec__value">{{ ads.rooms }}</span>
            </div>
            <div v-if="ads.adsType" class="spec">
              <span class="spec__label">Type</span>
              <span class="spec__value">{{ ads.adsType.name }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div v-else class="state">Annonce introuvable.</div>

  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useAdsStore } from '@/stores/ads.js'

const route = useRoute()
const adsStore = useAdsStore()
const ads = computed(() => adsStore.currentAds)

onMounted(() => {
  adsStore.currentAds = null
  adsStore.fetchById(route.params.id)
})

onUnmounted(() => {
  adsStore.currentAds = null
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Mulish:wght@300;400;500;600&display=swap');

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

  font-family: var(--font-body);
  background: var(--c-bg);
  min-height: 100vh;
  padding: 2.5rem 2rem 5rem;
  max-width: 1100px;
  margin: 0 auto;
  color: var(--c-text);
}

/* ── Retour ── */
.back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--c-muted);
  text-decoration: none;
  margin-bottom: 2.5rem;
  transition: color 0.15s;
}

.back:hover { color: var(--c-accent); }

.back__arrow {
  transition: transform 0.2s;
}

.back:hover .back__arrow {
  transform: translateX(-3px);
}

/* ── Layout detail ── */
.detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.5rem;
  align-items: start;
}

@media (max-width: 750px) {
  .detail {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

/* ── Image ── */
.detail__img {
  border-radius: 12px;
  overflow: hidden;
  background: var(--c-accent-light);
  aspect-ratio: 4/3;
  position: sticky;
  top: 2rem;
}

.detail__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.detail__no-img {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
}

/* ── Infos ── */
.detail__badge {
  display: inline-block;
  background: var(--c-text);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.3rem 0.7rem;
  border-radius: 2px;
  margin-bottom: 1rem;
}

.detail__title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3vw, 2.75rem);
  font-weight: 700;
  line-height: 1.1;
  margin: 0 0 1.5rem;
}

/* ── Prix ── */
.detail__price-block {
  display: flex;
  align-items: baseline;
  gap: 1.25rem;
  padding: 1.25rem 0;
  border-top: 1px solid var(--c-border);
  border-bottom: 1px solid var(--c-border);
  margin-bottom: 2rem;
}

.detail__price {
  font-family: var(--font-display);
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--c-accent);
  line-height: 1;
}

.detail__surface {
  font-size: 1rem;
  color: var(--c-muted);
  font-weight: 400;
}

/* ── Description ── */
.detail__section-title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  margin: 0 0 0.75rem;
  color: var(--c-text);
}

.detail__desc-block {
  margin-bottom: 2rem;
}

.detail__desc {
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--c-muted);
  white-space: pre-line;
}

/* ── Specs ── */
.detail__specs {
  margin-top: 1.5rem;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1px;
  background: var(--c-border);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  overflow: hidden;
}

.spec {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 1rem 1.25rem;
  background: var(--c-surface);
}

.spec__label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--c-muted);
}

.spec__value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--c-text);
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

.state__spinner {
  width: 28px;
  height: 28px;
  border: 2px solid var(--c-border);
  border-top-color: var(--c-accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>