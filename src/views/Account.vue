<template>
  <div class="mx-auto col-12 col-md-6 text-center no-padding">
    <!-- dialog upload avatar -->
    <v-dialog
      v-model="uploadAvatar"
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Upload Avatar</span>
        </v-card-title>
        <v-card-text :style="{ paddingBottom: '0px !important'}">
          <!-- preview image -->
          <v-img
            v-if="preview !== undefined"
            :src="preview"
            :style="{ borderRadius: '100%', marginBottom: '20px', height: '100px', width: '100px', marginInline: 'auto' }"
          />
          <v-file-input
            type="file"
            :error-messages="gambarErrors"
            show-size
            truncate-length="15"
            placeholder="Pilih gambar ..."
            outlined
            dense
            :disabled="loadState"
            @change="onSelectFile"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            :disabled="loadState"
            @click="saveAvatar"
          >
            {{ loadState ? '...menyimpan' : 'simpan' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- dialog upload avatar -->
    <v-btn
      icon
      :style="{ zIndex: 10, width: '92px', height: '92px' }"
      :disabled="loadState"
      @click="() => {this.uploadAvatar = !this.uploadAvatar}"
    >
      <v-avatar
        color="primary"
        size="100"
        class="border"
      >
        <v-img :src="srcImage" alt="Avatar User"/>
      </v-avatar>
    </v-btn>
    <v-card
      class="h-full elevation-1"
      color="white"
      rounded="xl"
      min-height="140"
      :style="{ marginTop: '-25px', paddingTop: '30px'}"
    >
      <v-card-text>
        <!-- badge role -->
        <div v-if="user.role === 'admin'" :style="{ paddingInline: '30px' }">
          <v-chip
            color="primary"
            outlined
            class="text-capitalize"
          >
            {{ user.role }}
          </v-chip>
        </div>
        <!-- email -->
        <div :style="{ paddingInline: '30px' }">
          <p
            class="text-truncate"
            :style="{ fontSize: '16px' }"
          >
            {{ user.email_address }}
          </p>
        </div>
        <!-- form user -->
        <v-form :disabled="loadState || !isEdit">
          <v-text-field
            v-model="form.name_user"
            :error-messages="nameErrors"
            label="Nama"
            outlined
            required
            clearable
            @input="$v.form.name_user.$touch"
          />
          <v-text-field
            v-model="form.phone"
            label="Nomor Handphone"
            outlined
            required
            clearable
            @input="$v.form.phone.$touch"
          />
          <v-textarea
            v-model="form.adress"
            label="Alamat"
            outlined
            required
            clearable
            auto-grow
            @input="$v.form.adress.$touch"
          />
        </v-form>
        <v-btn
          color="blue darken-1"
          text
          :disabled="loadState"
          @click="save"
        >
          {{ loadState ? '...menyimpan' : isEdit ? 'simpan' : 'ubah' }}
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { required } from 'vuelidate/lib/validators'

export default {
  data: () => ({
    uploadAvatar: false,
    isEdit: false,
    form: {
      name_user: '',
      phone: '',
      adress: ''
    },
    preview: undefined,
    file: undefined,
    sourceImage: process.env.VUE_APP_IMAGE_BASE + 'storage/images/avatar/'
  }),
  validations: {
    form: {
      name_user: {
        required
      },
      phone: {},
      adress: {}
    },
    preview: {
      required
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapState('layout', ['loadState']),
    srcImage () {
      return this.user.img_path ? this.sourceImage + this.user.img_path : `https://ui-avatars.com/api/?name=${this.user.name}&background=b0d388`
    },
    nameErrors () {
      const errors = []
      if (!this.$v.form.name_user.$dirty) return errors
      !this.$v.form.name_user.required && errors.push('nama dibutuhkan!')
      return errors
    },
    gambarErrors () {
      const errors = []
      if (!this.$v.preview.$dirty) return errors
      !this.$v.preview.required && errors.push('gambar dibutuhkan!')
      return errors
    }
  },
  created () {
    this.form = Object.assign(this.form, {
      name_user: this.user.name,
      adress: this.user.address,
      phone: this.user.phone_number
    })
  },
  updated () {
    if (!this.uploadAvatar) {
      if (this.preview !== undefined) {
        URL.revokeObjectURL(this.preview)
        this.preview = undefined
        this.file = undefined
      }
    }
  },
  beforeDestroy () {
    if (this.preview !== undefined) {
      URL.revokeObjectURL(this.preview)
    }
  },
  methods: {
    async save () {
      if (this.isEdit) {
        if (!this.$v.form.$invalid) {
          // save fetch
          try {
            this.loadstate(true)
            console.log('form', this.form)
            await this.axios.put('user', this.form)
            this.$store.dispatch('auth/updateUser', this.form)
            this.loadstate(false)
            this.isEdit = !this.isEdit
            this.alert('Berhasil memperbarui data!', 'success')
          } catch (error) {
            this.loadstate(false)
            console.log('error', error)
          }
        } else {
          this.alert('Semua kolom harus diisi!', 'error')
          console.log('form', this.form)
        }
      } else {
        // change condition
        this.isEdit = !this.isEdit
      }
    },
    async saveAvatar () {
      if (!this.$v.preview.$invalid) {
        try {
          this.loadstate(true)
          let formData = new FormData()
          formData.append('image', this.file)
          console.log(Object.fromEntries(formData))
          const response = await this.axios.post('user/avatar', formData)
          const imagePath = response.data.data
          this.$store.dispatch('auth/updateAvatar', imagePath)
          this.alert('Berhasil mengupload gambar!', 'success')
          this.loadstate(false)
        } catch (error) {
          this.loadstate(false)
          console.log('error update avatar', error)
        }
      } else {
        this.alert('Semua kolom harus diisi!', 'error')
      }
    },
    onSelectFile (file) {
      if (file) {
        const objectUrl = URL.createObjectURL(file)
        this.preview = objectUrl
        this.file = file
      } else {
        URL.revokeObjectURL(this.preview)
        this.preview = undefined
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
.border {
  border: 4px solid;
  border-color: white !important;
}
.no-padding {
  padding-inline: 0px !important;
}
.theme--light.v-input--is-disabled {
  color: blue !important;
}
</style>
