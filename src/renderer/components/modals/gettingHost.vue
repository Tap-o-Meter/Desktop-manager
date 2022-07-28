<template>
  <v-dialog
    fullscreen
    v-model="open"
    hide-overlay
    persistent
    transition="dialog-bottom-transition"
  >
    <div class="card-loader">
      <div show="true" class="loader-container">
        <div id="animation" :class="animationClass"></div>
        <span class="header-3-alt thin msg" v-text="message" />
        <v-btn v-if="error" @click="onRetry()">
          <v-icon v-text="'mdi-refresh'" /> Re-intentar
        </v-btn>
      </div>
      <!-- <v-container v-else>
        <v-row> </v-row>
      </v-container> -->
    </div>
  </v-dialog>
</template>
<script>
import config from "../../config";
import lottie from "lottie-web";
export default {
  components: {},
  name: "GettingHost",
  props: {
    open: Boolean,
    handleClose: Function,
    error: Boolean,
    onRetry: Function
  },
  data: () => ({
    loop: true,
    animation: null,
    animationList: ["hostLoad", "error"],
    message: null,
    animationClass: "",
    animationClasses: ["animation-loading", "animation-connect", "green-check"],
    messageList: [
      "Buscando servidor",
      "No se pudo encontrar el servidor",
      "Número de tarjeta capturado"
    ]
  }),
  methods: {
    getAnimation(index) {
      if (this.animation) this.animation.destroy();
      this.animation = lottie.loadAnimation({
        container: document.getElementById("animation"),
        renderer: "svg",
        loop: this.loop,
        autoplay: true,
        rendererSettings: {
          scaleMode: "centerCrop",
          clearCanvas: true,
          progressiveLoad: false,
          hideOnTransparent: true
        },
        animationData: config.animations[this.animationList[index]]
      });
    },
    setAnimation(index, loop) {
      this.loop = loop;
      this.getAnimation(index);
      this.message = this.messageList[index];
      this.animationClass = this.animationClasses[index];
    }
  },
  mounted: function() {
    this.setAnimation(0, true);
  },
  watch: {
    error: function(newVal, oldVal) {
      if (newVal) this.setAnimation(1, false);
      else if (!newVal && oldVal) this.setAnimation(0, true);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/texts";
.card-loader {
  background-color: rgba(255, 255, 255, 0.92);
  .loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
  }
  .animation-loading {
    width: 400px !important;
    height: 300px !important;
    // position: absolute;
    left: 0;
    right: 0;
    margin-top: -20px !important;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
