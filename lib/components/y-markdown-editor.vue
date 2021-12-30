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
        status: false,
        promptURLs: true,
        spellChecker: false,
        direction: this.$vuetify.rtl ? 'rtl' : 'ltr',
        hideIcons: ['guide', 'image'],
        showIcons: ['strikethrough', 'heading-smaller', 'heading-bigger', 'heading-1', 'heading-2', 'heading-3', 'quote', 'code', 'clean-block', 'table', 'horizontal-rule', ]
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