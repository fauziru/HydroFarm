<template>
  <v-container v-if="isMobile" fluid>
    <v-app-bar bottom app>
      <v-bottom-navigation fixed color="primary" grow shift>
        <v-btn :to="{ name: 'dashboard' }">
          <span>Dashboard</span>

          <v-icon large>mdi-view-dashboard</v-icon>
        </v-btn>

        <v-btn :to="{ name: 'about' }">
          <span>Activity</span>

          <v-icon large>mdi-history</v-icon>
        </v-btn>

        <v-btn>
          <span>Schedule</span>

          <v-icon large>mdi-sprout</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-app-bar>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    //
  }),
  computed: {
    ...mapState("layout", ["isMobile", "drawerSide"])
  }
};
</script>
