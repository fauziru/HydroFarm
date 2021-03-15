<template>
  <v-container v-if="isMobile" fluid>
    <v-app-bar bottom app>
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
  </v-container>
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
  }
};
</script>
