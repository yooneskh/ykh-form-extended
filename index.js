import { YFormVuetify, YFormElementMixin as _Mixin } from 'ykh-form';

export const YKhFormExtended = {
  name: 'YFormExtended',
  extends: YFormVuetify,
  components: {
    'y-form-element-file': () => import('./lib/y-form-elements/y-form-element-file.vue' /* webpackChunkName: 'y-form-element-file' */),
    'y-form-element-file-array': () => import('./lib/y-form-elements/y-form-element-file-array.vue' /* webpackChunkName: 'y-form-element-file-array' */),
    'y-form-element-editor': () => import('./lib/y-form-elements/y-form-element-editor.vue' /* webpackChunkName: 'y-form-element-editor' */),
  }
};

export const YFormElementMixin = _Mixin;
