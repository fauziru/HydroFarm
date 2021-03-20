<template>
  <!-- sigin modul, register, reset pass word, verify password -->
  <div class="w-full">
    <v-card
      class="text-center pa-1 elevation-1"
      rounded="xl"
    >
      <v-card-title class="justify-center dispay-1 mb-2">
        <v-img
          :src="require('../assets/logo.png')"
          class="my-3"
          contain
          height="100"
        />
      </v-card-title>
      <v-card-title class="display-2 mb-3 justify-center px-2 px-md-15">
        Danur Farm
      </v-card-title>
      <v-card-subtitle>Masuk ke akun anda</v-card-subtitle>
      <v-card-text>
        <v-form :disabled="loadState">
          <v-text-field
            v-model="form.email"
            label="email"
            outlined
            required
            :error-messages="emailErrors"
            clearable
            @input="$v.form.email.$touch"
          />
          <v-text-field
            v-model="form.password"
            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPass ? 'text' : 'password'"
            label="Password"
            outlined
            clearable
            :error-messages="passErrors"
            @input="$v.form.password.$touch"
            @click:append="showPass = !showPass"
          />
          <!-- <v-checkbox v-model="form.rememberMe" label="Ingat saya"></v-checkbox> -->
          <v-btn
            block
            is-elevated
            has-bg
            x-large
            color="primary"
            :disabled="loadState"
            @click="loginAttemp"
            @keypress.enter="loginAttemp"
            @keydown.enter="loginAttemp"
            @keyup.enter="loginAttemp"
          >
            <div v-if="!loadState">
              Masuk
            </div>
            <Loader v-else />
          </v-btn>
          <div class="mt-5">
            <a href="#">Lupa Password?</a>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
    <div class="text-center mt-6">
      <a href="#">Daftar</a>
    </div>
    <div class="overline mt-4 text-center">
      <a href="https://github.com/fauziru"> @fauziru </a>
    </div>
  </div>
  <!-- sigin modul, register, reset pass word, verify password -->
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/ProgressCircle.vue'
import { required, minLength, email } from 'vuelidate/lib/validators'

export default {
  components: {
    Loader
  },
  data: () => ({
    showPass: false,
    form: {
      email: '',
      password: '',
      rememberMe: false
    }
  }),
  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(8)
      }
    }
  },
  computed: {
    ...mapState('layout', ['loadState']),
    emailErrors () {
      const errors = []
      if (!this.$v.form.email.$dirty) return errors
      !this.$v.form.email.required && errors.push('email dibutuhkan!')
      !this.$v.form.email.email && errors.push('masukan email yang benar!')
      return errors
    },
    passErrors () {
      const errors = []
      if (!this.$v.form.password.$dirty) return errors
      !this.$v.form.password.required && errors.push('Password dibutuhkan!')
      !this.$v.form.password.minLength &&
        errors.push('Password minimal harus 8 karakter!')
      return errors
    }
  },
  methods: {
    loginAttemp () {
      if (this.$v.form.$invalid) {
        this.$store.dispatch('layout/alertFire', {
          type: 'error',
          message: 'Data email dan Password harus diisi!'
        })
      } else {
        this.loadstate(true)
        console.log('login', this.form)
        this.$store.dispatch('auth/login', this.form).then(() => {
          this.loadstate(false)
        })
      }
    },
    loadstate (state) {
      this.$store.commit('layout/setLoadstate', state)
    }
  }
}
</script>
