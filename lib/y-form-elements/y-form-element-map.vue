<template>
  <div class="y-form-element-map">

    <label
      class="v-label"
      :class="{ 'error--text': field.error, 'success--text': field.success }">
      {{ field.title }}
    </label>

    <l-map
      class="mt-1"
      :class="field.classes"
      ref="theMap"
      :zoom="mapZoom"
      :center="mapCenter"
      :options="{}"
      :style="`height: ${field.height || '300px'}`"
      @update:zoom="handleChange"
      @update:center="handleChange"
      @update:bounds="handleChange">
      <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <l-marker v-if="value && mapCenter" :lat-lng="mapCenter" />
    </l-map>

    <div v-if="field.hint" class="caption mt-1 ms-2">
      {{ typeof field.hint === 'function' ? field.hint(value) : field.hint }}
    </div>

    <transition name="slide-from-up">
      <div v-if="field.message" class="caption mt-1 ms-2" :class="{ 'error--text': field.error, 'success--text': field.success }">
        {{ field.message }}
      </div>
    </transition>

  </div>
</template>

<script>

import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

import { YFormElementMixin } from 'ykh-form'

import { latLng } from 'leaflet';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';

export default {
  name: 'YFormElementMap',
  components: {
    'l-map': LMap,
    'l-tile-layer': LTileLayer,
    'l-marker': LMarker
  },
  props: {
    value: { },
    field: {
      type: Object,
      required: true
    }
  },
  mixins: [YFormElementMixin],
  computed: {
    mapZoom() {
      return this.value?.zoom ?? this.field?.defaultZoom ?? 10;
    },
    mapCenter() {
      if (!this.value || !this.value.latitude || !this.value.longitude) {
        if (this.field.defaultCenter) {
          return this.makeLatLong(this.field.defaultCenter.latitude, this.field.defaultCenter.longitude);
        }

        return undefined;

      }

      return this.makeLatLong(this.value.latitude, this.value.longitude);

    }
  },
  methods: {
    async handleChange() {
      if (this.field.disabled || this.field.readonly) return;

      this.$emit('input', {
        latitude: this.$refs.theMap?.mapObject?.getCenter()?.lat,
        longitude: this.$refs.theMap?.mapObject?.getCenter()?.lng,
        zoom: this.$refs.theMap?.mapObject?.getZoom()
      });

      await this.$nextTick();
      this.validateValue();

    },
    makeLatLong(latitude, longitude) {
      return latLng(latitude, longitude);
    }
  }
}

</script>
