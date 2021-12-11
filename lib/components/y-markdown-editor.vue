<template>
  <textarea ref="editor" class="y-markdown-editor" />
</template>

<script>

import EasyMDE from 'easymde';
import 'easymde/dist/easymde.min.css';


export default {
  name: 'YMarkdownEditor',
  props: {
    value: String
  },
  data: () => ({
    editor: undefined
  }),
  watch: {
    value() {
      if (this.value !== this.editor.value()) {
        this.editor.value(this.value);
      }
    }
  },
  mounted() {

    if (!this.editor) {

      this.editor = new EasyMDE({
        element: this.$el,
        indentWithTabs: false,
        initialValue: this.value,
        status: false
      });

      this.editor.codemirror.on('change', this.onValueChange);

    }

  },
  beforeDestroy() {
    this.editor.codemirror.off('change', this.onValueChange);
  },
  methods: {
    onValueChange() {
      this.$emit('input', this.editor.value());
    }
  }
}
</script>