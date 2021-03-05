<template>
  <v-card
    hover
    outlined
    class="kegCell mt-7 ml-4 mr-4 d-flex flex-column align-start pl-3 pr-3"
    :class="status ? '' : 'disabled'"
    :to="{ name: 'line-details', params: { id: line._id } }"
  >
    <div class="iconWrapper d-flex justify-center align-center">
      <v-icon v-on="on" color="white" size="40">
        mdi-glass-mug-variant
      </v-icon>
    </div>
    <div class="titleBar d-flex flex-column mb-1">
      <span class="titles-bold mt-1">{{ beer.name }}</span>
      <span class="s-light-subtitles">{{ beer.brand }}</span>
      <div
        class="warn d-flex flex-column justify-center align-center"
        v-if="keg.available <= 4"
      >
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" style="color:#eb5e28; font-size:20px;">
              mdi-alert-circle
            </v-icon>
          </template>
          <span>Low levels</span>
        </v-tooltip>
      </div>
    </div>

    <v-container fluid class="py-0">
      <v-row>
        <v-col cols="3" class="d-flex">
          <div class="d-flex flex-column align-center mx-5 ">
            <span class="header-6-alt light">Linea</span>
            <span class="header-2-alt">{{ this.line.noLinea }}</span>
          </div>
        </v-col>
        <v-col cols="9" class="d-flex justify-start align-center">
          <div class="d-flex flex-column align-center mx-5 ">
            <span class="xs-subtitles bold light">Estilo</span>
            <span class="header-5-alt thin">{{ beer.style }}</span>
          </div>
          <div class="d-flex flex-column align-center mx-5 ">
            <span class="xs-subtitles bold light">ABV</span>
            <span class="header-5-alt thin">{{ keg.abv }}</span>
          </div>
          <div class="d-flex flex-column align-center mx-5 ">
            <span class="xs-subtitles bold light">IBU</span>
            <span class="header-5-alt thin">{{ keg.ibu }}</span>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-divider class="my-2" />
    <v-container class="mt-4 " fluid>
      <v-row>
        <v-col
          cols="5"
          class="d-flex align-center justify-center pr-2 pt-0 pl-0 pb-0"
        >
          <v-progress-circular
            :rotate="-90"
            :size="160"
            :width="5"
            :value="(keg.available / keg.capacity) * 100"
            :color="
              (keg.available / keg.capacity) * 100 > 50 ? '#2ecc71' : '#e74c3c'
            "
          >
            <div class="d-flex justify-center align-center flex-column">
              <p
                class="header-fg-alt ultra-thin mb-1 accented"
                v-resize-text="{ minFontSize: '38px', maxFontSize: '100px' }"
              >
                {{ fixIt(keg.available) }}
                <span class="header-4-alt light thin" style="margin-left:-13px">
                  /{{ fixIt(keg.capacity) }}L
                </span>
              </p>
              <span class="header-4-alt light bold">Restantes</span>
            </div>
          </v-progress-circular>
        </v-col>
        <v-col cols="7" class="left-line">
          <v-row>
            <v-col cols="6" class="d-flex flex-column align-center pa-1">
              <span class="header-1-alt ultra-thin">
                {{ keg.soldPints }}
              </span>
              <span class="header-5-alt light bold">V. vendidos</span>
            </v-col>
            <v-col cols="6" class="d-flex flex-column align-center pa-1">
              <span class="header-1-alt ultra-thin">
                {{ (keg.capacity - keg.available).toFixed(1) }}
              </span>
              <span class="header-5-alt light bold">L. vendidos</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" class="d-flex flex-column align-center pa-1">
              <span class="header-1-alt ultra-thin">{{ keg.taster }}</span>
              <span class="header-5-alt light bold">Tasters</span>
            </v-col>
            <v-col cols="6" class="d-flex flex-column align-center pa-1">
              <span class="header-1-alt ultra-thin">
                {{ fixIt(keg.merma) }}
              </span>
              <span class="header-5-alt light bold">Merma</span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
import { mapGetters } from "vuex";
import ResizeText from "vue-resize-text";
export default {
  name: "BarrelCell",
  props: {
    line: Object,
    on: Function
  },
  directives: {
    ResizeText
  },
  computed: {
    ...mapGetters("Lines", ["getKeg", "getBeer", "getStatus"]),
    keg() {
      return this.getKeg(this.line.idKeg);
    },
    beer() {
      return this.getBeer(this.keg.beerId);
    },
    status() {
      return this.getStatus(this.line);
    }
  },
  methods: {
    fixIt(n) {
      return n - Math.floor(n) !== 0 ? n.toFixed(1) : n;
    }
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/colors";
@import "@/assets/styles/texts";
.kegCell {
  width: 391px;
  height: 390px;
  border-radius: 5px;
  padding-top: 0;
  border: none !important;
  .my-2 {
    width: 100%;
  }
  .accented {
    color: $accent;
    // display: -webkit-box;
    // -webkit-line-clamp: 1;
    // -webkit-box-orient: vertical;
    max-width: 125px;
    max-height: 49px;
  }

  .iconWrapper {
    position: absolute;
    top: -15px;
    left: 10px;
    height: 60px;
    width: 60px;
    border-radius: 2px;
    background: $blue-gradient;
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px $light-blue;
  }
  .left-line {
    border-left: 1px solid lightgray;
  }
  .titleBar {
    height: 50px;
    width: 100%;
    padding-left: 70px;
    .warn {
      position: absolute;
      width: 40px;
      height: 50px;
      right: 0;
      top: 0;
    }
  }
}
.disabled {
  filter: grayscale(100%);
}
</style>
