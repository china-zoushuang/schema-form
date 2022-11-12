<template>
  <div ref="editorRef" class="monaco-editor"></div>
</template>

<script lang="ts">
// dependencies
import { defineComponent, ref, watch, onBeforeUnmount, onMounted } from "vue";
import * as monaco from "monaco-editor";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

export default defineComponent({
  name: "MonacoEditor",

  props: ["modelValue", "language"],
  emits: ["update:modelValue", "change"],

  setup(props, { emit }) {
    self.MonacoEnvironment = {
      getWorker(_: string, label: string) {
        if (label === "json") {
          return new jsonWorker();
        }
        return new EditorWorker();
      },
    };

    let editor;

    const editorRef = ref();

    // methods
    const init = () => {
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
      });
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
      });

      editor = monaco.editor.create(editorRef.value, {
        value: JSON.stringify(props.modelValue),
        language: props.language,
        theme: "vs-dark",
        minimap: {
          enabled: false,
        },
      });

      // watch the value and emit
      editor.onDidChangeModelContent(() => {
        const value = editor.getValue();
        emit("update:modelValue", value);
        emit("change", value);
      });
    };

    watch(
      () => props.modelValue,
      (newValue) => {
        if (editor) {
          const value = editor.getValue();
          if (newValue !== value) {
            editor.setValue(newValue);
          }
        }
      }
    );

    // life cycle
    onMounted(() => {
      init();
    });

    onBeforeUnmount(() => {
      editor.dispose();
    });

    return { editorRef };
  },
});
</script>

<style>
.monaco-editor,
.monaco-editor > .monaco-editor,
.monaco-editor > .monaco-editor > div {
  width: 100% !important;
  height: 100% !important;
}
</style>
