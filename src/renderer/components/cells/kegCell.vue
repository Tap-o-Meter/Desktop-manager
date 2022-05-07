<template>
  <v-card
    outlined
    hover
    class="d-flex mt-7 ml-4 mr-4"
    style="border: none !important;"
    width="400"
    height="300"
    :to="{ name: 'keg-details', params: { id: keg._id } }"
  >
    <v-img
      width="200"
      :lazy-src="require('@/assets/no-beer.svg')"
      :src="
        keg.image !== null
          ? BASE_URL + '/getImage/' + keg.image
          : require('@/assets/no-beer.svg')
      "
    >
      <v-chip small color="white" class="available" label>
        {{ keg.type }}
      </v-chip>
    </v-img>
    <v-card-text style="position: relative;">
      <div class="d-flex flex-column" style="height:100%">
        <span class="header-3-alt thin">{{ keg.name }}</span>
        <span class="header-6-alt light">{{ keg.style }} - {{ keg.abv }}%</span>
        <span class="s-light-subtitles">{{ keg.brand }}</span>
        <div class="d-flex flex-column align-end available">
          <span class="bold-names">DISPONIBLES</span>
          <span class="header-4-alt light">
            {{ count }} <v-icon class="mb-1"> mdi-keg </v-icon>
          </span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapGetters, mapState } from "vuex";
export default {
  name: "kegCell",
  props: {
    keg: Object
  },
  computed: {
    ...mapGetters("Lines", ["getKegCount"]),
    ...mapState("Session", ["BASE_URL"]),
    count() {
      return this.getKegCount(this.keg._id);
    }
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/colors";
@import "@/assets/styles/texts";
.available {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.v-card {
  overflow: hidden;
  border-radius: 10px !important;
}
</style>
