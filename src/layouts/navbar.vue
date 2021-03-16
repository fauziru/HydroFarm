<template>
  <v-app-bar fixed :color="bg" height="56px" elevate-on-scroll app :dark="dark">
    <v-app-bar-nav-icon @click.stop="draw()"></v-app-bar-nav-icon>
    <v-img
      alt="Vuetify Logo"
      class="shrink mr-2"
      contain
      :src="require('../assets/logo.png')"
      transition="scale-transition"
      width="40"
    />
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
            :content="notif.length"
            :value="notif.length"
            color="primary"
            offset-x="22"
            offset-y="22"
            bordered
          >
            <v-btn v-if="!isMobile" v-bind="attrs" v-on="on" icon depressed>
              <v-icon>mdi-bell-outline</v-icon>
            </v-btn>
            <v-btn v-else :to="{ name: 'notification' }" icon depressed link>
              <v-icon>mdi-bell-outline</v-icon>
            </v-btn>
          </v-badge>
        </div>
      </template>

      <v-card>
        <v-list dense three-line :max-width="400">
          <v-subheader class="pa-2 font-weight-bold">Notifikasi</v-subheader>
          <!-- component notifi list -->
          <div v-if="notif.length">
            <v-list-item
              v-for="(item, i) in notif"
              :key="i"
              :to="item.data.link || { name: 'notification' }"
              link
            >
              <v-list-item-avatar color="light-green lighten-4">
                <v-icon color="green">
                  {{ item.type | typeNotif("icon") }}
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>Notifikasi</v-list-item-title>
                <v-list-item-subtitle caption>
                  {{ item.data.data | truncate(50, "...") }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action class="align-self-center">
                <v-list-item-action-text>
                  {{ item.created_at | cD }}
                </v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
          </div>
          <!-- if nothing -->
          <div v-else>
            <div class="text-center primary--text">Belum ada notifikasi</div>
            <v-img
              :src="require('../assets/images/logoNotif.png')"
              class="my-3"
              contain
              height="120"
            />
          </div>

          <div class="text-center py-2">
            <v-btn :to="{ name: 'notification' }" small>
              Lihat Semua
            </v-btn>
          </div>
          <!-- end component notifi list -->
        </v-list>
      </v-card>
    </v-menu>

    <template v-if="tabs" v-slot:extension>
      <v-tabs fixed-tabs v-model="tab">
        <v-tabs-slider color="secondary"></v-tabs-slider>
        <v-tab v-for="(item, index) in tabs" :key="index">
          {{ item.title }}
        </v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data: () => ({
    text:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    bg: "secondary",
    dark: true,
    notif: []
  }),
  created() {
    this.getUnreadnotif();
  },
  mounted() {
    window.onscroll = () => {
      this.changeColor();
    };
  },
  computed: {
    ...mapState("layout", ["isMobile", "drawerSide", "tabs"]),
    tab: {
      get() {
        return this.$store.state.layout.tab;
      },
      set(value) {
        this.$store.commit("layout/setTab", value);
      }
    }
  },
  methods: {
    ...mapActions("layout", ["draw"]),
    async getUnreadnotif() {
      console.log("get notif");
      window.axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${this.$store.state.auth.access_token}`;
      try {
        const {
          data: { data }
        } = await window.axios.get("/notification/unread");
        this.notif = data;
      } catch (error) {
        console.log("error", error);
      }
    },
    changeColor() {
      if (
        document.body.scrollTop > 70 ||
        document.documentElement.scrollTop > 70
      ) {
        this.bg = "white";
        this.dark = false;
      } else {
        this.bg = "secondary";
        this.dark = true;
      }
    }
  }
};
</script>
