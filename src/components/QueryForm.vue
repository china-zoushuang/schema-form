<template>
  <a-form layout="inline">
    <a-form-item>
      <a-radio-group
        :value="modelValue"
        size="small"
        @change="({ target: { value } }) => changeComponent(value)"
      >
        <a-radio-button v-for="item of types" :key="item" :value="item">
          {{ item }}
        </a-radio-button>
      </a-radio-group>
    </a-form-item>
    <!-- <a-form-item v-if="type === 'entities'" label="components">
      <a-radio-group
        :value="modelValue"
        size="small"
        @change="({ target: { value } }) => changeComponent(value)"
      >
        <a-radio-button v-for="item of entities" :key="item" :value="item">{{
          item
        }}</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item v-if="type === 'plugins'" label="components">
      <a-radio-group
        :value="modelValue"
        size="small"
        @change="({ target: { value } }) => changeComponent(value)"
      >
        <a-radio-button
          v-for="item of plugins"
          :key="item"
          :value="`plugins/${item}`"
          >{{ item }}</a-radio-button
        >
      </a-radio-group>
    </a-form-item> -->
  </a-form>
</template>

<script lang="ts">
// dependencies
import { defineComponent, ref } from "vue";
// constants
import examples from "@/constants/examples";

export default defineComponent({
  name: "QueryForm",

  props: ["modelValue"],
  emits: ["update:modelValue", "change"],

  setup(props, { emit }) {
    const types = Object.keys(examples);
    // const entities = ["services", "routes", "consumers"];
    // const plugins = ["jwt", "basic-auth"];
    // const type = ref("services");

    // methods
    // const changeType = (value) => {
    //   value === "entities"
    //     ? changeComponent(entities[0])
    //     : value === "plugins"
    //     ? changeComponent(`plugins/${plugins[0]}`)
    //     : null;
    // };
    const changeComponent = (key) => {
      emit("update:modelValue", key);
      emit("change", key);
    };

    return {
      types,
      // entities,
      // plugins,
      // type,
      // methhos
      // changeType,
      changeComponent,
    };
  },
});
</script>
