<template>
  <div class="grid">
    <div
      :style="{
        gridColumnStart: 1,
        gridColumnEnd: 5,
      }"
    >
      <!-- top query form to query any eneities or plugins -->
      <QueryForm v-model="component" @change="query" />
    </div>
    <div
      :style="{
        gridColumnStart: 1,
        gridColumnEnd: 3,
      }"
    >
      <!-- schema code view -->
      <h4>#Schema</h4>
      <MonacoEditor
        v-model="schema"
        language="json"
        @change="changeSchema"
        @keydown="isEditingSchema = true"
        @keyup="isEditingSchema = false"
      />
    </div>
    <div>
      <!-- ui schema code view -->
      <h4>#UISchema</h4>
      <MonacoEditor v-model="UISchema" language="json" />
    </div>
    <div>
      <!-- form data code view -->
      <h4>#FormData</h4>
      <MonacoEditor v-model="model" language="json" />
    </div>
    <div
      :style="{
        gridColumnStart: 3,
        gridColumnEnd: 5,
        gridRowStart: 2,
        gridRowEnd: 4,
      }"
    >
      <!-- generated form  -->
      <h4>#SchemaForm</h4>
      <SchemaForm
        :fields="JSON.parse(UISchema)"
        :dataSource="JSON.parse(model)"
        @keydown="isEditingModel = true"
        @keyup="isEditingModel = false"
        @change="changeModel"
      />
    </div>
  </div>
</template>

<script>
// dependencies
import { defineComponent, ref, onMounted } from "vue";
import { notification } from "ant-design-vue";
// components
import QueryForm from "@/components/QueryForm.vue";
import MonacoEditor from "@/components/MonacoEditor.vue";
import SchemaForm from "@/components/SchemaForm.vue";
// utils
import service from "@/utils/service";
import { generateModel, generateUI } from "@/utils/methods";

export default defineComponent({
  name: "IndexView",

  components: {
    QueryForm,
    MonacoEditor,
    SchemaForm,
  },

  setup() {
    const component = ref("services");
    const schema = ref("{ fields: [] }");
    const model = ref("{}");
    const UISchema = ref("{}");
    const isEditingSchema = ref(false);
    const isEditingModel = ref(false);

    // methods
    const changeSchema = (value) => {
      model.value = "{}";
      UISchema.value = "{}";
      generateModel(value).then((res) => {
        model.value = JSON.stringify(res, null, "  ");
      });
      generateUI(value).then((res) => {
        UISchema.value = JSON.stringify(res, null, "  ");
      });
    };

    const query = () => {
      service({
        url: `/schemas/${component.value}`,
        method: "get",
      })
        .then((res) => {
          schema.value = JSON.stringify(res, null, "  ");
          changeSchema(schema.value);
        })
        .catch((err) => {
          notification.error({
            message: err.code,
            description: err.message,
          });
        });
    };

    const changeModel = (value) => {
      model.value = JSON.stringify(value, null, "  ");
    };

    // life cycle
    onMounted(() => {
      query();
    });

    return {
      component,
      schema,
      model,
      UISchema,
      isEditingSchema,
      isEditingModel,
      // methods
      query,
      changeSchema,
      changeModel,
    };
  },
});
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 68px 1fr 1fr;
  width: 100vw;
  height: 100vh;
  padding: 12px;
  background-color: rgb(240, 240, 240);
  overflow: hidden;
}

.grid > div {
  padding: 12px;
  margin: 8px;
  background-color: #fff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s;
}
.grid > div > .monaco-editor {
  /* cut the padding and the height of h4 off*/
  height: calc(100% - 34px) !important;
}
</style>
