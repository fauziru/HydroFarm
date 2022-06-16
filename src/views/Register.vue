<template>
  <div>
    <v-stepper
      v-model="e6"
      vertical
      class="w-full rounded-xl pa-1 elevation-1"
      :style=" isMobile ? '' : 'width: 450px' "
    >
      <v-stepper-step
        :complete="e6 > 1"
        :rules="[() => form1.validKey]"
        step="1"
      >
        <span>
          Masukan Kode Pendaftaran
        </span>
        <small>Dapat diminta kepada admin</small>
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-text-field
          v-model="form1.keyRegister"
          :error-messages="keyErrors"
          class="pt-3"
          label="Key"
          outlined
          required
          clearable
          @input="$v.form1.keyRegister.$touch"
          @keyup.enter.native="validationKey"
        />
        <v-btn
          color="primary"
          :disabled="loadState"
          @click="validationKey"
        >
          <div v-if="!loadState">
            Cek
          </div>
          <Loader v-else />
        </v-btn>
      </v-stepper-content>

      <v-stepper-step
        :complete="e6 > 2"
        step="2"
      >
        Form Registrasi
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-form
          :disabled="loadState"
          class="pt-3"
        >
          <v-text-field
            v-model="form2.email"
            :error-messages="emailErrors"
            label="Email"
            outlined
            required
            clearable
            @input="$v.form2.email.$touch"
          />
          <v-text-field
            v-model="form2.name_user"
            :error-messages="nameErrors"
            label="Nama"
            outlined
            required
            clearable
            @input="$v.form2.name_user.$touch"
          />
          <v-text-field
            v-model="form2.password"
            :error-messages="passwordErrors"
            label="Password"
            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPass ? 'text' : 'password'"
            outlined
            required
            clearable
            @click:append="showPass = !showPass"
            @input="$v.form2.password.$touch"
          />
          <v-text-field
            v-model="form2.coPassword"
            :error-messages="coPasswordErrors"
            label="Confirm Password"
            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPass ? 'text' : 'password'"
            outlined
            required
            clearable
            @click:append="showPass = !showPass"
            @input="$v.form2.coPassword.$touch"
            @keyup.enter.native="registrationAttemp"
          />
        </v-form>
        <v-btn
          color="primary"
          :disabled="loadState"
          @click="registrationAttemp"
        >
          Daftar
        </v-btn>
      </v-stepper-content>

      <v-stepper-step
        :complete="e6 > 2"
        step="3"
      >
        Selesai
      </v-stepper-step>

      <v-stepper-content
        :class="e6 == 3 ? 'mb-1': ''"
        step="3"
      >
        <Loader />
      </v-stepper-content>
    </v-stepper>
    <div class="text-center mt-6">
      <router-link :to="{ name: 'login' }">
        Masuk
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/ProgressCircle.vue'
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'

export default {
  components: {
    Loader
  },
  data: () => ({
    e6: 1,
    showPass: false,
    form1: {
      keyRegister: '',
      validKey: true
    },
    form2: {
      email: '',
      name_user: '',
      password: '',
      coPassword: ''
    },
    isEmailUniqe: true
  }),
  validations: {
    form1: {
      keyRegister: {
        required
      }
    },
    form2: {
      email: {
        required,
        email
      },
      name_user: {
        required
      },
      password: {
        required,
        minLength: minLength(8)
      },
      coPassword: {
        required,
        sameAsPassword: sameAs('password')
      }
    }
  },
  updated () {
    if (this.$v.form2.email.email && this.$v.form2.email.required) {
      this.getCekEmail()
      console.log('cek email', this.isEmailUniqe)
    }
  },
  computed: {
    ...mapState('layout', ['isMobile', 'loadState']),
    keyErrors () {
      const errors = []
      if (!this.$v.form1.keyRegister.$dirty) return errors
      !this.$v.form1.keyRegister.required && errors.push('key dibutuhkan!')
      return errors
    },
    nameErrors () {
      const errors = []
      if (!this.$v.form2.name_user.$dirty) return errors
      !this.$v.form2.name_user.required && errors.push('nama dibutuhkan!')
      return errors
    },
    emailErrors () {
      const errors = []
      if (!this.$v.form2.email.$dirty) return errors
      !this.isEmailUniqe && errors.push('email sudah digunakan!')
      !this.$v.form2.email.required && errors.push('email dibutuhkan!')
      !this.$v.form2.email.email && errors.push('email tidak valid!')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.form2.password.$dirty) return errors
      !this.$v.form2.password.required && errors.push('password dibutuhkan!')
      !this.$v.form2.password.minLength && errors.push('password minimal harus 8 karakter!')
      return errors
    },
    coPasswordErrors () {
      const errors = []
      if (!this.$v.form2.coPassword.$dirty) return errors
      !this.$v.form2.coPassword.required && errors.push('confirm password dibutuhkan!')
      !this.$v.form2.coPassword.sameAsPassword && errors.push('confirm tidak sama!')
      return errors
    }
  },
  methods: {
    validationKey () {
      if (this.$v.form1.$invalid) {
        this.alert('Harap masukan key', 'error')
      } else {
        this.loadstate(true)
        this.axios.post('registrasiKey', this.form1)
          .then(response => {
            console.log('response key validation', response.data)
            if (!response.data.data.validKey) {
              this.alert('Key registrasi tidak valid!', 'error')
            } else {
              this.alert('Key registrasi valid!', 'success')
              this.e6 = 2
            }
            this.form1.validKey = response.data.data.validKey
            this.loadstate(false)
          })
      }
    },
    async registrationAttemp () {
      if (this.$v.form2.$invalid || !this.isEmailUniqe) {
        this.alert('Harap isi form dengan benar!', 'error')
      } else {
        try {
          this.loadstate(true)
          this.e6 = 3
          await this.$store.dispatch('auth/register', this.form2)
          this.loadstate(false)
        } catch (error) {
          this.e6 = 2
          this.loadstate(false)
        }
      }
    },
    async getCekEmail () {
      const response = await this.axios.post(`cek-email?secret=${process.env.VUE_APP_API_SECRET_KEY}`, { email: this.form2.email })
      // console.log('response cek email', response.data.success)
      this.isEmailUniqe = response.data.success
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
