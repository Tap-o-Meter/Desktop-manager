<template>
  <v-dialog
    :value="open"
    min-width="350px"
    max-width="430px"
    @input="handleClose(false)"
  >
    <v-card class="pt-3 pb-10">
      <v-card-text>
        <h3 class="header-3-alt thin">Opciones</h3>
      </v-card-text>
      <div class="d-flex px-5 justify-center flex-wrap">
        <v-avatar
          v-for="option in options"
          :key=""
          tile
          size="120"
          color="orange"
          @click.stop="openModal(option.action)"
          class="d-flex flex-column ma-1"
          :class="option.color"
        >
          <v-icon color="white" size="80">{{ option.icon }}</v-icon>
          <h2 class="header-5-alt white--text">{{ option.name }}</h2>
        </v-avatar>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    open: Boolean,
    options: Array,
    handleClose: Function
  },
  methods: {
    openModal(action) {
      this.handleClose(false);
      action(true);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors";
@import "@/assets/styles/texts";
@import "@/assets/styles/components";
</style>
