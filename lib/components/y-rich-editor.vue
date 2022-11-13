<template>
  <div class="y-rich-editor">

    <drag-container @drop="handleDrop" :drag-handle-selector="readonly ? '#non-existant-id' : '.drag-handle'">
      <drag-element v-for="(part, index) in parsedValue.parts" :key="part._id" class="editor-item">

        <div v-if="part.type === 'text'" class="pt-6">
          <y-html-editor
            :value="part.text"
            @input="updatePart(index, { text: $event })"
          />
        </div>

        <v-img
          v-if="part.type === 'image'"
          :src="part.path"
          class="my-4"
        />

        <v-card v-if="part.type === 'link'" :to="!part.link || part.link.startsWith('http') ? undefined : part.link" target="_blank" :href="part.link && part.link.startsWith('http') ? part.link : undefined" outlined class="my-4 d-flex flex-row pa-1">
          <v-img v-if="part.image" :src="part.image" contain class="me-3 flex-grow-0" height="88" width="88"/>
          <div>
            <div class="text-h6">{{ part.title }}</div>
            <div class="text-subtitle-2 font-weight-light mt-n1">{{ part.domain }}</div>
            <div class="text-body-1 mt-3" style="white-space: nowrap;">{{ part.description }}</div>
          </div>
        </v-card>

        <template v-if="part.type === 'map'">
          <l-map :zoom="part.zoom" :center="makeLatLong(part.latitude, part.longitude)" :options="{}" :style="`height: ${part.height || '300px'}`">
            <l-tile-layer :url="tileUrl" />
            <l-marker :lat-lng="makeLatLong(part.latitude, part.longitude)" />
          </l-map>
        </template>

        <v-card v-if="part.type === 'file'" :href="part.path" target="_blank" outlined class="my-4 d-flex align-center flex-row pa-1">
          <v-icon size="72">
            mdi-file
          </v-icon>
          <div>

            <div class="text-h6">
              {{ part.title }}
            </div>

            <div class="text-body-1 mt-3" style="white-space: nowrap;">
              {{ part.description }}
            </div>

          </div>
        </v-card>

        <div class="actions-container" :style="{[$vuetify.rtl ? 'left' : 'right']: '4px'}">

          <v-btn class="drag-handle" icon small>
            <v-icon>mdi-drag</v-icon>
          </v-btn>

          <v-menu v-if="!readonly" absolute>
            <template #activator="{ on }">
              <v-btn icon color="primary" small v-on="on">
                <v-icon small>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list dense min-width="200">
              <v-list-item color="error" @click="deletePart(index)">
                <v-list-item-content>
                  <v-list-item-title class="error--text">
                    حذف
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>

        </div>

      </drag-element>
    </drag-container>

    <div v-if="!readonly" class="add-bar text-center mt-4 mx-auto grey lighten-3 py-1 px-4 mb-4" style="max-width: 512px; border-radius: 32px;">

      <v-btn class="ms-2" icon @click="appendPart({ type: 'text', text: '' })">
        <v-icon>
          mdi-text
        </v-icon>
      </v-btn>

      <v-btn class="ms-2" icon @click="addImage">
        <v-icon>
          mdi-image
        </v-icon>
      </v-btn>

      <v-btn class="ms-2" icon @click="addLink">
        <v-icon>
          mdi-link
        </v-icon>
      </v-btn>

      <v-btn class="ms-2" icon @click="addMap">
        <v-icon>
          mdi-map
        </v-icon>
      </v-btn>

      <v-btn class="ms-2" icon @click="addFile">
        <v-icon>
          mdi-file
        </v-icon>
      </v-btn>

    </div>

  </div>
</template>

<script>

import { YNetwork } from 'ynetwork';

// import YMarkdownEditor from './y-markdown-editor';
import YHtmlEditor from './y-html-editor.vue';
import { Container, Draggable } from "vue-smooth-dnd";
import { latLng } from 'leaflet';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';

import 'leaflet/dist/leaflet.css';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

import { Icon } from 'leaflet';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl
});

export default {
  name: 'YRichEditor',
  components: {
    // 'y-markdown-editor': YMarkdownEditor,
    'y-html-editor': YHtmlEditor,
    'drag-container': Container,
    'drag-element': Draggable,
    'l-map': LMap,
    'l-tile-layer': LTileLayer,
    'l-marker': LMarker
  },
  props: {
    value: {
      type: String
    },
    readonly: Boolean,
    defaultMapLocation: Object
  },
  data: () => ({
    tileUrl: (window.__env__ && window.__env__.yMapTileUrl) ? window.__env__.yMapTileUrl : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  }),
  computed: {
    parsedValue() {
      return JSON.parse(this.value || '{"parts":[],"config":{}}');
    }
  },
  methods: {
    appendPart(newPart) {
      this.$emit('input', JSON.stringify({
        ...this.parsedValue,
        parts: [
          ...this.parsedValue.parts,
          {
            ...newPart,
            _id: this.$uuid()
          }
        ]
      }));
    },
    updatePart(index, updates) {
      this.$emit(
        'input',
        JSON.stringify({
          ...this.parsedValue,
          parts: this.parsedValue.parts.map((it, itIndex) => itIndex === index ? ({ ...it, ...updates }) : it)
        })
      );
    },
    deletePart(index) {
      this.$emit(
        'input',
        JSON.stringify({
          ...this.parsedValue,
          parts: this.parsedValue.parts.filter((_, itIndex) => itIndex !== index)
        })
      );
    },
    async addImage() {

      const form = await this.$dialogFormMaker({
        title: 'افزودن تصویر',
        description: 'لطفا فایل تصویر مورد نظر را انتخاب کنید.',
        fields: [
          {
            key: 'file', type: 'file', title: 'تصویر',
            rules: [v => !!v || 'تصویر الزامی است!']
          }
        ]
      }); if (!form) return;

      const { status, data } = await YNetwork.get(`${this.$apiBase}/media/${form.file}`);
      if (this.$generalHandle(status, data)) return;

      this.appendPart({ type: 'image', path: data.path });

    },
    async addLink() {

      const form = await this.$dialogFormMaker({
        title: 'افزودن لینک',
        description: 'اطلاعات لینک را در زیر وارد کنید.',
        fields: [
          {
            key: 'link', type: 'text', title: 'لینک', dir: 'ltr',
            rules: [v => !!v || 'وارد کردن لینک الزامی است!']
          },
          {
            key: 'title', type: 'text', title: 'عنوان',
            rules: [v => !!v || 'وارد کردن عنوان الزامی است!']
          },
          {
            key: 'image', type: 'file', title: 'تصویر'
          },
          {
            key: 'domain', type: 'text', title: 'دامنه', dir: 'ltr'
          },
          {
            key: 'description', type: 'textarea', title: 'توضیح'
          }
        ]
      }); if (!form) return;

      const { link, title, image, domain, description } = form;
      let imagePath;

      if (image) {
        const { status, data } = await YNetwork.get(`${this.$apiBase}/media/${image}`);
        if (this.$generalHandle(status, data)) return;
        imagePath = data.path;
      }

      this.appendPart({ type: 'link', link, title, image: imagePath, domain, description });

    },
    async addMap() {

      const form = await this.$dialogFormMaker({
        title: 'افزودن نقشه',
        description: 'اطلاعات را برای افزودن نقشه اضافه کنید.',
        fields: [
          {
            key: 'location', type: 'map', title: 'موقعیت مکانی',
            ...(this.defaultMapLocation || {}),
            rules: [v => !!v || 'موقعیت مکانی الزامی است!']
          },
          {
            key: 'height', type: 'text', title: 'ارتفاع', dir: 'ltr'
          }
        ]
      }); if (!form) return;

      const { location: { latitude, longitude, zoom }, height } = form;

      this.appendPart({ type: 'map', latitude, longitude, zoom, height });

    },
    async addFile() {

      const form = await this.$dialogFormMaker({
        title: 'افزودن فایل',
        description: 'اطلاعات فایل را برای افزودن انتخاب کنید.',
        fields: [
          {
            key: 'file', type: 'file', title: 'فایل',
            rules: [v => !!v || 'فایل الزامی است!']
          },
          {
            key: 'title', type: 'text', title: 'عنوان',
            rules: [v => !!v || 'عنوان الزامی است!']
          },
          {
            key: 'description', type: 'text', title: 'توضیح',
            rules: [v => !!v || 'توضیح الزامی است!']
          }
        ]
      }); if (!form) return;

      const { file, title, description } = form;

      const { status, data } = await YNetwork.get(`${this.$apiBase}/media/${file}`);
      if (this.$generalHandle(status, data)) return;
      const filePath = data.path;

      this.appendPart({ type: 'file', path: filePath, title, description });

    },
    handleDrop(dropResult) {

      const { removedIndex, addedIndex } = dropResult;

      const array = [...this.parsedValue.parts];
      array.splice(addedIndex, 0, array.splice(removedIndex, 1)[0] );

      this.$emit(
        'input',
        JSON.stringify({
          ...this.parsedValue,
          parts: array
        })
      );

    },
    makeLatLong(latitude, longitude) {
      return latLng(latitude, longitude);
    }
  }
}
</script>

<style lang="scss" scoped>
  .y-rich-editor {

    .editor-item {
      position: relative;
      & > .actions-container {
        position: absolute;
        top: 4px;
        opacity: 0;
        z-index: 900;
      }
      &:hover .actions-container {
        opacity: 1;
      }
    }
    .add-bar .v-btn {
      cursor: pointer !important;
    }
  }
</style>