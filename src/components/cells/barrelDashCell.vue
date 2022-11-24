<template>
  <div
    class="kegCell d-flex mr-2 ml-2 flex-column align-center"
    @click="clickHandler($vnode.key)"
    :class="selected ? 'selected mt-4 mb-4' : ''"
  >
    <div class=""></div>
    <div class=" d-flex pa-3 kegData light">
      {{ line.noLinea }} .-
      <v-avatar v-if="beer.image !== null" color="lightgray" size="50" tile>
        <v-img contain :src="BASE_URL + '/getImage/' + beer.image" />
      </v-avatar>
      <v-icon v-else size="50" class="mt-3">mdi-glass-mug-variant</v-icon>
      <div class="keg-info d-flex flex-column pt-3 ml-3">
        <span class="xs-subtitles">Nombe</span>
        <span class="header-5-alt">{{ beer.name }}</span>
      </div>
      <div class="keg-detail d-flex justify-center align-end flex-column">
        <v-icon>mdi-chevron-right</v-icon>
      </div>
    </div>
    <v-divider class="my-2" />
    <div class="announcements pl-2 pr-2 d-flex align-center">
      <span class="xs-bold-subtitles center-text" v-if="keg.available <= 4">
        <v-icon size="18" color="red" class="mb-1 warn">mdi-alert</v-icon>
        Low levels
      </span>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
export default {
  name: "BarrelDashCell",
  props: {
    line: Object,
    clickHandler: { type: Function },
    selected: Boolean
  },
  computed: {
    ...mapState("Session", ["BASE_URL"]),
    ...mapGetters("Lines", ["getBeer", "getKeg"]),
    beer() {
      return this.getBeer(this.keg.beerId);
    },
    keg() {
      return this.getKeg(this.line.idKeg);
    }
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/colors";
@import "@/assets/styles/texts";
@import "@/assets/styles/components";
.kegCell {
  transition: all 0.3s cubic-bezier(0.34, 1.61, 0.7, 1);
  width: 86%;
  height: 100px;
  min-height: 100px;
  border-radius: 5px;
  box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.1), 0 1px 15px 0 rgba(0, 0, 0, 0.05);
  .kegData {
    padding-bottom: 0 !important;
    width: 100%;
  }
  .announcements {
    height: 25px;
    width: 100%;
    .warn {
      animation: wiggle 1.5s infinite alternate;
    }
  }
  .keg-info {
    height: 100%;
    flex: 1;
  }
}
.selected {
  transform: scale(1.1);
  border: 2px solid transparent;
  background-image: linear-gradient(white, white), $blue-gradient;
  background-origin: border-box;
  background-clip: content-box, border-box;
}
.my-2 {
  margin: 0 !important;
  width: 95%;
}
</style>
