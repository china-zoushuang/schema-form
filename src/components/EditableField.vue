<template>
  <template v-for="(tag, tagIndex) in modelValue" :key="tag">
    <a-tag :closable="true" @close="deleteTag(tag, tagIndex)">
      {{ tag }}
    </a-tag>
  </template>
  <a-form
    v-if="isEdit"
    ref="formRef"
    :model="model"
    style="display: inline-block"
  >
    <a-form-item name="value" :rules="elements['ui:rules']">
      <component
        ref="formItemRef"
        v-bind:is="elements['ui:widget']"
        v-model:value="model.value"
        :checked="model.value"
        :min="elements['ui:min']"
        :max="elements['ui:max']"
        :disabled="elements['ui:auto']"
        :options="elements['ui:enum']"
        :mode="elements['ui:mode']"
        :placeholder="`${elements.type} please`"
        size="small"
        @blur="hideInput"
        @keyup.enter="confim"
      />
    </a-form-item>
  </a-form>
  <a-tag
    v-else
    style="background: #fff; border-style: dashed"
    @click="showInput"
  >
    <plus-outlined />
    New
  </a-tag>
</template>
<script>
// dependencies
import { defineComponent, ref, nextTick, watch } from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  name: "EditableField",

  components: {
    PlusOutlined,
  },

  props: ["modelValue", "elements"],
  emits: ["update:modelValue", "change"],

  setup(props, { emit }) {
    const formRef = ref();
    const formItemRef = ref();
    const tags = ref([]);
    const isEdit = ref(false);
    const model = ref({ value: null });

    // methods
    const deleteTag = (tag, index) => {
      switch (true) {
        case tags.value instanceof Set:
          tags.value.delete(tag);
          break;
        case tags.value instanceof Array:
          tags.value.splice(index, 1);
      }
      change();
    };

    const showInput = () => {
      isEdit.value = true;
      nextTick(() => {
        formItemRef.value.focus();
      });
    };

    const hideInput = () => {
      isEdit.value = false;
      model.value.value = null;
      formRef.value.validate();
    };

    const confim = () => {
      formRef.value.validate().then(() => {
        const newValue = model.value.value;
        switch (true) {
          case tags.value instanceof Set:
            tags.value.add(newValue);
            break;
          case tags.value instanceof Array:
            tags.value.push(newValue);
        }
        change();
      });
    };

    const change = () => {
      model.value.value = null;
      emit("update:modelValue", [...tags.value]);
      emit("change", [...tags.value]);
    };

    watch(
      () => props.modelValue,
      (newValue) => {
        tags.value = [...newValue];
      }
    );

    return {
      formRef,
      formItemRef,
      tags,
      model,
      isEdit,
      // methods
      deleteTag,
      showInput,
      hideInput,
      confim,
    };
  },
});
</script>

<style scoped>
.ant-form > .ant-form-item {
  margin-bottom: 0;
}
</style>
