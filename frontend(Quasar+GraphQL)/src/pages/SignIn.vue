<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
        >
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img src="profile.webp" />
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">Log in</div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form
              @submit.prevent="onSubmit"
              class="q-gutter-md"
              ref="signInForm"
            >
              <q-input
                type="name"
                v-model="signInInput.name"
                label="Your name*"
                hint="Your name"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type your name',
                ]"
              />

              <q-input
                type="password"
                v-model="signInInput.password"
                label="Password*"
                lazy-rules
                :rules="[
                  (val) =>
                    (val !== null && val !== '') || 'Please type your password',
                ]"
              />

              <div class="text-center">
                <q-btn
                  label="Login"
                  type="submit"
                  color="purple"
                  class="full-width q-mb-md"
                />
                <q-btn
                  class="full-width q-mb-md"
                  :to="{ name: 'register' }"
                  borderless
                  flat
                  >Need to register?</q-btn
                >
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

import { SIGN_IN_MUTATION } from "../constants/graphql";

export default defineComponent({
  name: "SignIn",

  setup() {
    const signInInput = reactive({
      name: "",
      password: "",
    });
    const signInForm = ref(null);

    const $q = useQuasar();
    const router = useRouter();

    const { mutate: signInMutation, loading: loadingSignIn } =
      useMutation(SIGN_IN_MUTATION);

    const onSubmit = () => {
      signInForm.value.validate().then(async (success) => {
        if (success) {
          try {
            loadingSignIn.value = true;

            const { data } = await signInMutation(signInInput);

            $q.notify({
              type: "positive",
              message: "Login succeed!",
              position: "top-right",
            });
            router.push({ name: "userList" });
          } catch (err) {
            $q.notify({
              type: "negative",
              message: `${err}`,
              position: "top-right",
            });
          } finally {
            loadingSignIn.value = false;
          }
        } else {
          console.error("Error: Validation error!");
        }
      });
    };

    return {
      signInInput,
      signInForm,
      onSubmit,
      loadingSignIn,
    };
  },
});
</script>

<style>
.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
</style>
