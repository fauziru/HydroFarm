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
        />
        <v-btn
          color="primary"
          @click="validationKey()"
        >
          Cek
        </v-btn>
      </v-stepper-content>

      <v-stepper-step
        :complete="e6 > 2"
        step="2"
      >
        Form Registrasi
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-form class="pt-3">
          <v-text-field
            label="Email"
            outlined
            required
            clearable
          />
          <v-text-field
            label="Nama"
            outlined
            required
            clearable
          />
          <v-text-field
            label="Password"
            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPass ? 'text' : 'password'"
            outlined
            required
            clearable
            @click:append="showPass = !showPass"
          />
          <v-text-field
            label="Confirm Password"
            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPass ? 'text' : 'password'"
            outlined
            required
            clearable
            @click:append="showPass = !showPass"
          />
        </v-form>
        <v-btn
          color="primary"
          @click="e6 = 3"
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
      validKey: false
    },
    form2: {
      email: '',
      nama: '',
      password: '',
      coPassword: ''
    }
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
      nama: {
        required
      },
      password: {
        required,
        minLength: minLength(8)
      },
      coPassword: {
        sameAsPassword: sameAs('password')
      }
    }
  },
  computed: {
    ...mapState('layout', ['isMobile']),
    keyErrors () {
      const errors = []
      if (!this.$v.form1.keyRegister.$dirty) return errors
      !this.$v.form1.keyRegister.required && errors.push('key dibutuhkan!')
      return errors
    }
  },
  methods: {
    validationKey () {
      if (this.$v.form1.$invalid) {
        this.$store.dispatch('layout/alertFire', {
          type: 'error',
          message: 'Harap masukan key!'
        })
      }
    }
  }
}
</script>
