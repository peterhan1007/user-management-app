<template>
  <q-dialog
    v-model="dialog"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="bg-primary text-white">
      <q-bar>
        <q-space />

        <q-btn
          dense
          flat
          icon="minimize"
          @click="maximizedToggle = false"
          :disable="!maximizedToggle"
        >
          <q-tooltip v-if="maximizedToggle" class="bg-white text-primary"
            >Minimize</q-tooltip
          >
        </q-btn>
        <q-btn
          dense
          flat
          icon="crop_square"
          @click="maximizedToggle = true"
          :disable="maximizedToggle"
        >
          <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary"
            >Maximize</q-tooltip
          >
        </q-btn>
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <div class="text-h6">{{ userProps.name }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ userProps.title }}
        {{ userProps.email }}
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "UserDetailDialog",
  props: {
    user: {
      type: Object || null,
    },
  },

  setup(props) {
    let userProps = ref(props.user);

    watch(
      () => props.user,
      () => {
        userProps = props.user;
        console.error(userProps.value.name);
      }
    );

    return {
      dialog: ref(false),
      maximizedToggle: ref(true),
      userProps,
    };
  },
});
</script>
