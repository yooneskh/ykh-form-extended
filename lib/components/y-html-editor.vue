<template>
  <div
    class="y-form-editor"
    ref="editorEl"
  />
</template>

<script>

const EDITOR_CONFIG = {
  toolbar: {
    items: [
      'heading',
      '|',
      'undo',
      'redo',
      'exportPdf',
      'exportWord',
      '|',
      'fontFamily',
      'fontSize',
      'fontColor',
      'fontBackgroundColor',
      'highlight',
      'removeFormat',
      '|',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'subscript',
      'superscript',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'alignment',
      'indent',
      'outdent',
      '|',
      'MathType',
      'ChemType',
      'specialCharacters',
      '|',
      'mediaEmbed',
      'insertTable',
      'codeBlock',
      'imageUpload',
      'blockQuote',
      'htmlEmbed',
      'code',
      'horizontalLine'
    ]
  },
  language: 'fa',
  image: {
    toolbar: [
      'imageTextAlternative',
      'imageStyle:full',
      'imageStyle:side',
      'linkImage'
    ]
  },
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableCellProperties',
      'tableProperties'
    ]
  },
  removePlugins: [ 'Title' ],
  fontColor: {
    colors: [
      { label: 'White', color: 'rgba(255, 255, 255)' },
      { label: 'Light Grey', color: 'rgba(192, 192, 192)' },
      { label: 'Grey', color: 'rgba(128, 128, 128)' },
      { label: 'Dark Grey', color: 'rgba(64, 64, 64)' },
      { label: 'Black', color: 'rgba(0, 0, 0)' },
      { label: 'Green', color: 'rgba(30, 90, 30)' },
      { label: 'Light Green', color: 'rgba(60, 90, 30)' },
      { label: 'Lime', color: 'rgba(90, 90, 30)' },
      { label: 'Orange', color: 'rgba(90, 60, 30)' },
      { label: 'Red', color: 'rgba(90, 30, 30)' },
      { label: 'Purple', color: 'rgba(60, 30, 90)' },
      { label: 'Blue', color: 'rgba(30, 30, 90)' },
      { label: 'Light Blue', color: 'rgba(30, 60, 90)' },
      { label: 'Cyan', color: 'rgba(30, 90, 90)' },
      { label: 'Turqoise', color: 'rgba(30, 90, 60)' },
      { label: 'Sarv Green', color: 'rgba(124, 179, 66)' }
    ]
  },
  fontBackgroundColor: {
    colors: [
      { label: 'White', color: 'rgba(255, 255, 255)' },
      { label: 'Light Grey', color: 'rgba(192, 192, 192)' },
      { label: 'Grey', color: 'rgba(128, 128, 128)' },
      { label: 'Dark Grey', color: 'rgba(64, 64, 64)' },
      { label: 'Black', color: 'rgba(0, 0, 0)' },
      { label: 'Green', color: 'rgba(30, 90, 30)' },
      { label: 'Light Green', color: 'rgba(60, 90, 30)' },
      { label: 'Lime', color: 'rgba(90, 90, 30)' },
      { label: 'Orange', color: 'rgba(90, 60, 30)' },
      { label: 'Red', color: 'rgba(90, 30, 30)' },
      { label: 'Purple', color: 'rgba(60, 30, 90)' },
      { label: 'Blue', color: 'rgba(30, 30, 90)' },
      { label: 'Light Blue', color: 'rgba(30, 60, 90)' },
      { label: 'Cyan', color: 'rgba(30, 90, 90)' },
      { label: 'Turqoise', color: 'rgba(30, 90, 60)' },
      { label: 'Sarv Green', color: 'rgba(124, 179, 66)' }
    ]
  }
};

export default {
  name: 'YFormElementEditor',
  props: {
    value: { },
  },
  data: () => ({
    editor: undefined
  }),
  watch: {
    value() {
      if (this.editor?.getData() !== this.value) {
        this.editor?.setData(this.value || '');
      }
    }
  },
  mounted() {
    setTimeout(this.setupEditor, 500);
  },
  methods: {
    async setupEditor() {
      try {

        this.editor = await window.ClassicEditor.create(this.$refs.editorEl, EDITOR_CONFIG);
        this.editor.setData(this.value || '');

        this.editor.model.document.on('change:data', () => {
          this.$emit('input', this.editor.getData());
        });

      }
      catch (error) {
        return;
      }
    }
  }
}

</script>
