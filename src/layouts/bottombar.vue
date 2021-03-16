<template>
  <div>
    <v-app-bar v-if="isMobile && this.$route.meta.bottomNav" bottom app>
      <v-bottom-navigation fixed color="primary" grow shift>
        <v-btn
          v-for="(item, index) in itemBottombar"
          :key="index"
          :to="item.link"
        >
          <span>{{ item.name }}</span>
          <v-icon large>{{ item.icon }}</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-app-bar>

    <v-fab-transition>
      <v-btn
        @click="hasHistory() ? $router.go(-1) : $router.push('/')"
        v-if="this.$route.meta.backButton && isMobile"
        color="secondary"
        elevation="2"
        fixed
        fab
        small
        right
        bottom
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </v-fab-transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    itemBottombar: [
      {
        name: "Dashboard",
        icon: "mdi-view-dashboard",
        link: { name: "dashboard" }
      },
      {
        name: "Activity",
        icon: "mdi-history",
        link: { name: "activity" }
      },
      {
        name: "Schedule",
        icon: "mdi-sprout",
        link: { name: "schedule" }
      }
    ]
  }),
  computed: {
    ...mapState("layout", ["isMobile", "drawerSide"])
  },
  methods: {
    hasHistory() {
      return window.history.length > 2;
    }
  }
};
</script>
