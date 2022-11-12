<template>
  <a-form
    :model="model"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 16 }"
    class="custom-form"
  >
    <a-form-item
      v-for="(value, key) in fields"
      :key="key"
      :name="key"
      :label="key"
      :rules="value['ui:rules']"
    >
      <SchemaForm
        v-if="value['ui:fields']"
        :fields="value['ui:fields']"
        :dataSource="model[key]"
        @change="change"
      />
      <template v-else>
        <component
          v-bind:is="value['ui:widget']"
          v-model="model[key]"
          :value="
            value['ui:widget'] === 'a-date-picker'
              ? dayjs(model[key])
              : model[key]
          "
          :checked="model[key]"
          :min="value['ui:min']"
          :max="value['ui:max']"
          :disabled="value['ui:auto']"
          :options="value['ui:enum']"
          :mode="value['ui:mode']"
          :elements="value['ui:elements']"
          :placeholder="`${value.type} please`"
          @change="(val) => change(key, val)"
        />
      </template>
    </a-form-item>
  </a-form>
</template>

<script>
// dependencies
import { defineComponent, ref, watch } from "vue";
import dayjs from "dayjs";
// components
import EditableField from "@/components/EditableField.vue";

export default defineComponent({
  name: "SchemaForm",

  components: {
    EditableField,
  },

  props: ["fields", "dataSource"],
  emits: ["change"],

  setup(props, { emit }) {
    const model = ref({ ...props.dataSource });
    // methods
    const change = (key, val) => {
      if (val?.target) {
        model.value[key] = val.target.value;
      } else {
        model.value[key] = val;
      }
      emit("change", model.value);
    };
    watch(
      () => props.dataSource,
      (newValue) => {
        model.value = newValue;
      }
    );
    return {
      model,
      // methods
      dayjs,
      change,
    };
  },
});
</script>

<style scoped>
.custom-form {
  height: calc(100% - 30px);
  overflow-y: auto;
}
.ant-form-item-control-input-content > .custom-form {
  background-color: rgb(250, 250, 250);
  border: 1px dashed #d9d9d9;
  padding: 6px 12px 12px 12px;
}
.ant-form-item-control-input-content > .custom-form > .ant-form-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
}
.ant-form-item-control-input-content
  > .custom-form
  > .ant-form-item
  :deep(.ant-form-item-label),
.ant-form-item-control-input-content
  > .custom-form
  > .ant-form-item:deep(.ant-form-item-control) {
  flex: 1;
  width: 100%;
  max-width: 100%;
  text-align: left;
}

.ant-picker,
.ant-input-number {
  width: 100%;
}

:deep(.ant-tag) {
  background-color: #fff;
}
</style>
