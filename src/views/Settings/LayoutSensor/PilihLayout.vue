<template>
  <div>
    <v-switch
      v-model="isDelete"
      inset
      :disabled="loadState"
      label="Delete"
    />
    <v-row>
      <!-- <v-btn @click="deleteHandler">delete</v-btn> -->
      <v-col
        v-for="layout in data.layouts"
        :key="layout.id"
        :style="{ height: '100%'}"
        cols="6"
      >
        <v-btn
          v-if="isDelete && selectedLayout !== layout.id"
          color="red"
          icon
          class="delete-button"
          :disabled="loadState"
          @click="deleteLayout(layout.id)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <div :class="`d-flex child-flex ${isDelete ? 'overlap-layout-item' : ''}`">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :style="{ height: 'auto' }"
                :color="selectedLayout === layout.id ? 'primary' : 'default'"
                :disabled="loadState"
                v-bind="attrs"
                v-on="on"
                @click="changeLayout(layout.id)"
              >
                <v-img
                  :src="`${sourceImage}${layout.file_name}`"
                  aspect-ratio="1"
                  class="grey lighten-2"
                />
              </v-btn>
            </template>
            <span>{{ layout.name_layout }}</span>
          </v-tooltip>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    deleteLayoutCallback: {
      type: Function,
      default: () => {}
    }
  },
  data: () => ({
    isDelete: false,
    selectedLayout: '',
    sourceImage: process.env.VUE_APP_IMAGE_BASE + 'storage/images/layout/'
  }),
  computed: {
    ...mapState('layout', ['isMobile', 'loadState'])
  },
  created () {
    this.selectedLayout = this.data.selectedLayouts
  },
  methods: {
    async changeLayout (id) {
      console.log('id', id)
      this.selectedLayout = id
      try {
        this.loadstate(true)
        const response = await this.axios.put('layout/' + id, {})
        this.loadstate(false)
        console.log('response', response)
        this.alert('Berhasil merubah layout!', 'success')
      } catch (error) {
        this.loadstate(false)
        console.log('error', error)
      }
    },
    async deleteLayout (id) {
      console.log('delete', id)
      try {
        this.loadstate(true)
        await this.axios.delete('layout/' + id)
        this.deleteLayoutCallback(id)
        this.loadstate(false)
        this.alert('Berhasil menghapus layout!', 'success')
      } catch (error) {
        this.loadstate(false)
        console.log('error', error)
      }
    },
    alert (message, type) {
      this.$store.dispatch('layout/alertFire', {
        type: type,
        message: message
      })
    },
    loadstate (state) {
      this.$store.commit('layout/setLoadstate', state)
    }
  }
}
</script>

<style scoped>
.delete-button {
  z-index: 2;
  position: absolute;
}
.overlap-layout-item {
  position: relative;
}
</style>
