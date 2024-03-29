<template>
  <div>
    <v-text-field
      readonly
      :filled="!field.unfilled"
      :solo="field.solo || field.simple"
      :flat="field.flat || field.simple"
      :outlined="field.outlined"
      :dense="field.dense"
      :loading="loading"
      :value="loading ? loadingText : title"
      :background-color="field.background"
      :label="field.title"
      :placeholder="field.placeholder"
      :class="field.classes"
      :dir="field.dir"
      :disabled="field.disabled"
      :autofocus="field.autofocus"
      :hide-details="!field.message && !field.hint"
      :success="field.success"
      :error="field.error"
      :messages="field.message"
      :hint="typeof field.hint === 'function' ? field.hint(value) : field.hint"
      persistent-hint
      @click="!field.readonly && $refs.fileInput.click()"
      @keyup.space="!field.readonly && $refs.fileInput.click()"
      @keyup.enter="!field.readonly && $refs.fileInput.click()"
      prepend-inner-icon="mdi-paperclip"
      :append-icon="path ? 'mdi-open-in-new' : undefined"
      @click:append="openPath"
      @blur="validateValue"
    />
    <input type="file" ref="fileInput" style="display: none;" @change.passive="handleUpdate" />
  </div>
</template>

<script>

import { YNetwork } from 'ynetwork';
import { YFormElementMixin } from 'ykh-form'

export default {
  name: 'YFormElementFile',
  props: {
    value: { },
    field: {
      type: Object,
      required: true
    }
  },
  mixins: [YFormElementMixin],
  data: () => ({
    loading: false,
    loadingText: '',
    error: false,
    title: '',
    path: undefined,
    selfUpload: false
  }),
  watch: {
    value: {
      immediate: true,
      handler() {
        if (this.selfUpload) {
          this.selfUpload = false;
          return;
        }

        this.loadMedia();

      }
    }
  },
  methods: {
    async handleUpdate(event) {

      const file = event.target.files[0];
      if (!file) return;

      if (this.field.fileValidator && !this.field.fileValidator(file)) return;

      const fileName = file.name.slice(0, file.name.lastIndexOf('.'));
      const fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1);
      const fileSize = file.size;


      const xhr = new XMLHttpRequest();
      const url = `${this.$apiBase}/media/upload`;

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', this.$token);

      const payload = new FormData();
      payload.append('file', file);
      xhr.send(payload);

      xhr.onreadystatechange = async () => {
        if (xhr.readyState === 4) {

          this.loading = false;

          if (xhr.status !== 200) {

            try {
              this.$toast.error(JSON.parse(xhr.response).message || 'مشکلی پیش آمده است');
            }
            catch {
              this.$toast.error('مشکلی پیش آمده است');
            }

            return;

          }

          const uploadResult = JSON.parse(xhr.response);
          this.selfUpload = true;
          this.$emit('input', uploadResult._id);

          this.title = `${uploadResult.name}.${uploadResult.extension}`;
          this.path = uploadResult.path;

          await this.$nextTick();
          this.validateValue();

        }
      };

      xhr.upload.onprogress = (progressEvent) => {
        this.loadingText = ( (progressEvent.loaded) * 100 / progressEvent.total ).toFixed(2) + '%';
      };

    },
    async loadMedia() {
      if (!this.value) return;

      const { status, data } = await YNetwork.get(`${this.$apiBase}/media/${this.value}`);
      if (this.$generalHandle(status, data)) return;

      this.title = `${data.name}.${data.extension}`;
      this.path = data.path;

    },
    openPath() {
      window.open(this.path);
    }
  }
}

</script>
