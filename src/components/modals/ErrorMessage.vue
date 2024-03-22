<template>
    <v-dialog
      persistent
      :value="dialog"
      :hide-overlay="fistLoad"
      :transition="fistLoad ? false : 'dialog-transition'"
      :max-width="fistLoad ? '0px' : '450px'"
    >
      <v-card v-show="!fistLoad">
        <v-container fluid>
          <v-row class="row-container">
            <div id="animation" class="green-check"></div>
            <span class="header-3-alt thin msg" v-text="message" />
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </template>
  <script>
  import lottie from "lottie-web";
  import config from "../../config";
  export default {
    name: "errorMessage",
    data: () => ({
      dialog: false,
      animation: null
    }),
    props: {
      visible: Boolean,
      fistLoad: Boolean,
      handleClose: Function,
      message: String
    },
    methods: {
      closeModal: function() {
        this.handleClose();
      },
      getAnimation() {
        if (this.animation !== null) this.animation.destroy();
        this.animation = lottie.loadAnimation({
          container: document.getElementById("animation"),
          renderer: "svg",
          loop: false,
          autoplay: true,
          rendererSettings: {
            scaleMode: "centerCrop",
            clearCanvas: true,
            progressiveLoad: false,
            hideOnTransparent: true
          },
          animationData: config.animations.error
        });
      }
    },
    watch: {
      visible: function(value) {
        this.dialog = this.visible;
        if (value) {
          this.getAnimation();
          setTimeout(() => this.handleClose(), 1500);
        }
      }
    }
  };
  </script>
  
  <style lang="scss" scoped>
  @import "@/assets/styles/texts";
  .row-container {
    position: relative;
    height: 250px;
    overflow: hidden;
    justify-content: center;
  }
  .msg {
    text-align: center;
    position: absolute;
    width: 100%;
    margin-top: 200px;
    z-index: 100;
  }
  .green-check {
    width: 200px !important;
    height: 160px !important;
    position: absolute;
    left: 0;
    right: 0;
    margin-top: 15px !important;
    margin-left: auto;
    margin-right: auto;
  }
  </style>