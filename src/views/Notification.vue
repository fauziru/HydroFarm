<template>
  <div>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        All
      </v-tab-item>
      <v-tab-item>
        Sensor
      </v-tab-item>
      <v-tab-item>
        Activity
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
// import { mapState } from "vuex";
export default {
  data: () => ({
    tabItem: [{ title: "All" }, { title: "Sensor" }, { title: "Activity" }]
  }),
  created() {
    console.log("cerated notification");
    this.$store.commit("layout/setTabs", this.tabItem);
    this.$store.commit("layout/setTab", true);
  },
  beforeDestroy() {
    this.$store.commit("layout/setTabs", null);
    this.$store.commit("layout/setTab", null);
  },
  computed: {
    tab: {
      get() {
        return this.$store.state.layout.tab;
      },
      set(value) {
        this.$store.commit("layout/setTab", value);
      }
    }
  }
};
</script>
