<template>
  <textarea ref="editor" class="y-markdown-editor" />
</template>

<script>

import EasyMDE from 'easymde';


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
      this.editor.value(this.value);
    }
  },
  mounted() {

    this.editor = new EasyMDE({
      element: this.$el,
      autoDownloadFontAwesome: false,
      indentWithTabs: false,
      initialValue: this.value,
      status: false
    });

    this.editor.value(this.value);

    this.editor.codemirror.on('change', this.onValueChange);

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