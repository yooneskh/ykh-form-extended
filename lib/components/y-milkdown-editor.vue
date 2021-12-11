<template>
  <div ref="editor" class="y-milkdown-editor" />
</template>

<script>

import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { nord } from '@milkdown/theme-nord';
import { commonmark } from '@milkdown/preset-commonmark';
import { tooltip } from '@milkdown/plugin-tooltip';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { history } from '@milkdown/plugin-history';
import { clipboard } from '@milkdown/plugin-clipboard';
import { indent } from '@milkdown/plugin-indent';
import { table } from '@milkdown/plugin-table';
import { menu } from '@milkdown/plugin-menu';


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
    this.editor.use(tooltip);
    this.editor.use(listener);
    this.editor.use(history);
    this.editor.use(clipboard);
    this.editor.use(indent);
    this.editor.use(table);
    this.editor.use(menu());

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