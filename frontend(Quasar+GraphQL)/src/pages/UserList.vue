<template>
  <div class="q-pa-xl q-my-xl">
    <q-table
      title="User List"
      @row-click="handleUserClick"
      :rows="users"
      :columns="columns"
      color="primary"
      row-key="name"
      :loading="loading"
      :filter="filter"
    >
      <template v-slot:top-right>
        <q-input
          dense
          debounce="300"
          color="primary"
          v-model="filter"
          label="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>
    <user-detail-dialog ref="userDetailDialog" v-if="user" :user="user" />
  </div>
</template>

<script>
import { defineComponent, computed, ref } from "vue";
import { useQuery } from "@vue/apollo-composable";

import { GET_USERS_QUERY, GET_USER_QUERY } from "src/constants/graphql";

import UserDetailDialog from "src/components/UserDetailDialog.vue";

const columns = [
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "title",
    align: "center",
    label: "Title",
    field: "title",
    sortable: true,
  },
  { name: "description", label: "Description", field: "description" },
  { name: "email", label: "Email", field: "email" },
];

export default defineComponent({
  name: "UserList",
  components: { UserDetailDialog },

  setup() {
    let users = ref([]);
    let user = ref("");
    const filter = ref("");
    const userDetailDialog = ref({ dialog: false });

    const queryOptions = ref({
      enabled: false,
    });
    const selectedId = ref(null);

    const { result: userDetail } = useQuery(
      GET_USER_QUERY,
      { id: selectedId },
      queryOptions
    );

    const { result, loading } = useQuery(GET_USERS_QUERY);

    try {
      users = computed(() => result.value?.users ?? []);

      loading.value = true;
    } catch (err) {
    } finally {
      loading.value = false;
    }

    const handleUserClick = (evt, row) => {
      queryOptions.value.enabled = true;
      selectedId.value = row.id;

      try {
        user.value = computed(() => userDetail.value?.user ?? "");

        if (user.value) userDetailDialog.value.dialog = true;
      } catch (err) {
      } finally {
      }
    };

    return {
      users,
      user,
      columns,
      loading,
      filter,
      userDetailDialog,
      handleUserClick,
    };
  },
});
</script>
