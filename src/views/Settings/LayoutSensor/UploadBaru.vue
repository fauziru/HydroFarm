<template>
  <div>
    <v-form
      :disabled="loadState"
      class="pt-3"
    >
      <v-text-field
        v-model="form.name_layout"
        :error-messages="nameErrors"
        label="Nama Layout"
        outlined
        required
        clearable
        @input="$v.form.name_layout.$touch"
      />
      <v-file-input
        type="file"
        :error-messages="gambarErrors"
        show-size
        truncate-length="15"
        placeholder="Pilih gambar ..."
        outlined
        dense
        @change="onSelectFile"
      />
      <v-img
        v-if="form.preview !== undefined"
        :src="form.preview"
        :style="{ borderRadius: '8px' }"
      />
    </v-form>
    <div :style="{ display: 'flex', justifyContent: 'space-between', marginTop: '24px'}">
      <v-spacer />
      <v-btn
        color="blue darken-1"
        text
        :disabled="loadState"
        @click="submit"
      >
        {{ loadState ? 'Menyimpan...' : 'Simpan' }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  props: {
    addLayoutCallback: {
      type: Function,
      default: () => {}
    }
  },
  data: () => ({
    form: {
      name_layout: '',
      preview: undefined
    },
    file: undefined
  }),
  validations: {
    form: {
      name_layout: {
        required,
        minLength: minLength(3)
      },
      preview: {
        required
      }
    }
  },
  computed: {
    ...mapState('layout', ['isMobile', 'loadState']),
    nameErrors () {
      const errors = []
      if (!this.$v.form.name_layout.$dirty) return errors
      !this.$v.form.name_layout.required && errors.push('nama layout dibutuhkan!')
      !this.$v.form.name_layout.minLength && errors.push('minimal 3 huruf!')
      return errors
    },
    gambarErrors () {
      const errors = []
      if (!this.$v.form.preview.$dirty) return errors
      !this.$v.form.preview.required && errors.push('gambar dibutuhkan!')
      return errors
    }
  },
  beforeDestroy () {
    if (this.form.preview !== undefined) {
      URL.revokeObjectURL(this.form.preview)
    }
  },
  methods: {
    async submit () {
      if (!this.$v.form.$invalid) {
        // tambah form
        try {
          this.loadstate(true)
          let data = new FormData()
          data.append('name_layout', this.form.name_layout)
          data.append('image', this.file)
          // console.log(Object.fromEntries(data))
          // console.log('data', data)
          const response = await this.axios.post('layout', data)
          this.addLayoutCallback(response.data.data)
          console.log('res', response)
          this.$store.dispatch('layout/alertFire', {
            type: 'success',
            message: 'Berhasil menambahkan layout!'
          })
          this.loadstate(false)
        } catch (error) {
          console.log('error', error)
          this.loadstate(false)
        }
      } else {
        this.$store.dispatch('layout/alertFire', {
          type: 'error',
          message: 'Semua kolom harus diisi!'
        })
      }
    },
    onSelectFile (file) {
      if (file) {
        const objectUrl = URL.createObjectURL(file)
        this.form.preview = objectUrl
        this.file = file
      } else {
        URL.revokeObjectURL(this.form.preview)
        this.form.preview = undefined
      }
    },
    loadstate (state) {
      this.$store.commit('layout/setLoadstate', state)
    }
  }
}
</script>

<style>
</style>
