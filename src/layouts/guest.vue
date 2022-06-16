<template>
  <div
    class="d-flex text-center flex-column flex-md-row flex-grow-1"
    style="min-height: 100vh"
  >
    <v-sheet class="layout-side mx-auto mx-md-1 d-none d-md-flex flex-md-column justify-space-between px-2">
      <div class="mt-3 mt-md-10 pa-2">
        <div class="display-2 font-weight-bold primary--text">
          Dhydro
        </div>
        <p class="title my-2">
          100% All natural & Fresh for health
        </p>
      </div>
      <v-img
        :src="require('../assets/Login/Loginbg.png')"
        contain
        height="700"
        width="500"
      />
    </v-sheet>
    <div class="pa-2 pa-md-4 flex-grow-1 align-center justify-space-between d-flex flex-column">
      <div class="layout-content ma-auto w-full">
        <v-container fluid>
          <router-view />
        </v-container>
      </div>
    </div>
  </div>
</template>
