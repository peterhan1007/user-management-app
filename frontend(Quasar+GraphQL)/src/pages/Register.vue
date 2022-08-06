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
              <div class="col text-h6 ellipsis">Register</div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form
              @submit.prevent="onSubmit"
              class="q-gutter-md"
              ref="signUpForm"
            >
              <q-input
                type="text"
                v-model="signUpInput.name"
                label="Your name *"
                :disable="loadingSignUp"
                hint="Jone Deo"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type your name',
                ]"
              />

              <q-input
                type="text"
                :disable="loadingSignUp"
                v-model="signUpInput.title"
                label="Your title *"
                hint="Web developer"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type your title',
                ]"
              />

              <q-input
                type="text"
                :disable="loadingSignUp"
                v-model="signUpInput.description"
                label="Description *"
                hint="I'm a full-stack developer"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type description',
                ]"
              />

              <q-input
                type="email"
                :disable="loadingSignUp"
                v-model="signUpInput.email"
                label="Your email *"
                hint="Deo@gmail.com"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type your email',
                ]"
              />

              <q-input
                type="password"
                :disable="loadingSignUp"
                v-model="signUpInput.password"
                label="Password"
                lazy-rules
                :rules="[
                  (val) =>
                    (val !== null && val !== '') || 'Please type your password',
                ]"
              />

              <div>
                <q-btn
                  label="Register"
                  :loading="loadingSignUp"
                  type="submit"
                  class="full-width q-mb-md"
                  color="primary"
                />
                <q-btn
                  class="full-width q-mb-md"
                  :to="{ name: 'login' }"
                  borderless
                  flat
                  >Need to login?</q-btn
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

import { SIGN_UP_MUTATION } from "../constants/graphql";

export default defineComponent({
  name: "SignUp",

  setup() {
    const signUpInput = reactive({
      name: "",
      title: "",
      description: "",
      email: "",
      password: "",
    });
    const signUpForm = ref(null);

    const $q = useQuasar();
    const router = useRouter();

    const { mutate: signUpMutation, loading: loadingSignUp } =
      useMutation(SIGN_UP_MUTATION);

    const onSubmit = () => {
      signUpForm.value.validate().then(async (success) => {
        if (success) {
          try {
            loadingSignUp.value = true;

            const { data } = await signUpMutation(signUpInput);

            $q.notify({
              type: "positive",
              message: "Register succeed",
              position: "top-right",
            });
            router.push({ name: "login" });
          } catch (err) {
            $q.notify({
              type: "negative",
              message: `${err}`,
              position: "top-right",
            });
          } finally {
            loadingSignUp.value = false;
          }
        } else {
          console.error("Error: Validation error!");
        }
      });
    };

    return {
      signUpInput,
      signUpForm,
      loadingSignUp,
      onSubmit,
    };
  },
});
</script>

<style>
.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
</style>
