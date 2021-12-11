import { YFormVuetify, YFormElementMixin as _Mixin } from 'ykh-form';
import _YEditableText from './lib/components/y-editable-text.vue';
import _YMarkdownEditor from './lib/components/y-markdown-editor.vue';


export const YKhFormExtended = {
  name: 'YFormExtended',
  extends: YFormVuetify,
  components: {
    'y-form-element-file': () => import('./lib/y-form-elements/y-form-element-file.vue' /* webpackChunkName: 'y-form-element-file' */),
    'y-form-element-file-array': () => import('./lib/y-form-elements/y-form-element-file-array.vue' /* webpackChunkName: 'y-form-element-file-array' */),
    'y-form-element-editor': () => import('./lib/y-form-elements/y-form-element-editor.vue' /* webpackChunkName: 'y-form-element-editor' */),
    'y-form-element-map': () => import('./lib/y-form-elements/y-form-element-map.vue' /* webpackChunkName: 'y-form-element-map' */)
  }
};


export const YFormElementMixin = _Mixin;
export const YEditableText = _YEditableText;
export const YMarkdownEditor = _YMarkdownEditor;
