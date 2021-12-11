<template>
  <div ref="editor" class="y-milkdown-editor" />
</template>

<script>

import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { nord } from '@milkdown/theme-nord';
import { commonmark } from '@milkdown/preset-commonmark';
import { gfm } from '@milkdown/preset-gfm';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { tooltip } from '@milkdown/plugin-tooltip';
import { math } from '@milkdown/plugin-math';
import 'katex/dist/katex.min.css';


export default {
  name: 'YMilkdownEditor',
  props: {
    value: String
  },
  data: () => ({
    editor: undefined
  }),
  mounted() {

    this.editor = Editor.make();

    this.editor.config((ctx) => {

      ctx.set(rootCtx, this.$refs.editor);

      ctx.set(defaultValueCtx, this.$props.value || '');

      ctx.set(listenerCtx, {
        markdown: [
          getMarkdown => {
            this.$emit('input', getMarkdown());
          }
        ]
      });

    });

    this.editor.use(nord);
    this.editor.use(commonmark);
    this.editor.use(gfm);
    this.editor.use(listener);
    this.editor.use(tooltip);
    this.editor.use(math);

    this.editor.create();

  }
}
</script>

<style>

  .y-milkdown-editor > .milkdown {
    padding: 8px;
  }

  .y-milkdown-editor > .milkdown .paragraph {
    margin: 16px 0 !important;
  }

  .y-milkdown-editor > .milkdown .heading {
    margin: 16px 0 !important;
  }

</style>