<template>
  <v-app-bar fixed color="white" height="56px" elevate-on-scroll app>
    <v-app-bar-nav-icon @click.stop="draw()"></v-app-bar-nav-icon>

    <v-spacer></v-spacer>

    <!-- menu navbar -->
    <v-menu v-if="!isMobile" left offset-y>
      <template v-slot:activator="{ on, attrs }">
        <div class="mr-1">
          <v-btn v-bind="attrs" v-on="on" icon depressed>
            <v-icon>mdi-view-grid-outline</v-icon>
          </v-btn>
        </div>
      </template>

      <v-card class="d-flex flex-row flex-wrap">
        <div class="app-title pa-3 text-center">
          <v-icon color="primary">mdi-view-grid-outline</v-icon>
          <div class="font-weight-bold mt-1">Menu 1</div>
          <div class="caption">SubMenu 1</div>
        </div>
        <div class="app-title pa-3 text-center">
          <v-icon color="primary">mdi-view-grid-outline</v-icon>
          <div class="font-weight-bold mt-1">Menu 1</div>
          <div class="caption">SubMenu 1</div>
        </div>
        <div class="app-title pa-3 text-center">
          <v-icon color="primary">mdi-view-grid-outline</v-icon>
          <div class="font-weight-bold mt-1">Menu 1</div>
          <div class="caption">SubMenu 1</div>
        </div>
      </v-card>
    </v-menu>

    <!-- notification -->
    <v-menu left offset-y>
      <template v-slot:activator="{ on, attrs }">
        <div>
          <v-badge
            :content="drawerSide"
            :value="3"
            color="primary"
            offset-x="22"
            offset-y="22"
            bordered
          >
            <v-btn v-bind="attrs" v-on="on" icon depressed>
              <v-icon>mdi-bell-outline</v-icon>
            </v-btn>
          </v-badge>
        </div>
      </template>

      <v-card>
        <v-list dense three-line :max-width="400">
          <v-subheader class="pa-2 font-weight-bold">Notification</v-subheader>
          <!-- component notifi list -->
          <div>
            <v-list-item link>
              <v-list-item-avatar color="light-green lighten-4">
                <v-icon color="green">mdi-account-circle</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>Notification</v-list-item-title>
                <v-list-item-subtitle caption>{{
                  text | truncate(50, "...")
                }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action class="align-self-center">
                <v-list-item-action-text>3 min</v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
          </div>
          <!-- end component notifi list -->
        </v-list>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data: () => ({
    text:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  }),
  computed: {
    ...mapState("layout", ["isMobile", "drawerSide"])
  },
  methods: {
    ...mapActions("layout", ["draw"])
  }
};
</script>
