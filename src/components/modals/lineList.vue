<template>
  <v-dialog
    :value="open"
    transition="dialog-bottom-transition"
    max-width="400"
    scrollable
    persistent
  >
    <v-card class="pt-3 pl-3 pr-3 pb-0" style="height: 400px;">
      <v-card-title class="pb-0 pt-4">
        <v-icon
          v-text="'mdi-format-list-checks'"
          color="green"
          class="mr-2"
        />Elige una línea:
      </v-card-title>
      <span class="pl-6 mb-4 s-light-subtitles">
        <v-icon small v-text="'mdi-account'" color="green" class="mr-1" />
        {{ worker.nombre + " " + worker.apellidos }}
      </span>
      <v-divider color="lightgray" class="mb-3" />
      <v-card-text class="d-flex flex-column ">
        <v-btn
          text
          height="50"
          class="justify-start pl-0"
          v-for="(line, index) in lines"
          :key="line.id"
          v-if="line.idKeg.length > 0"
          @click="redeemBeer(line._id)"
          v-html="index + 1 + '.- ' + beerName(line.idKeg)"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="closeModal()">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Api from "../../service/api";
export default {
  name: "lineList",
  computed: {
    ...mapState("Lines", ["lines"]),
    ...mapGetters("Lines", ["getKeg", "getBeer"])
  },
  data: () => ({}),
  props: {
    open: Boolean,
    handleClose: Function,
    worker: Object
  },
  methods: {
    closeModal: function() {
      this.handleClose();
    },
    beerName(kegId) {
      const keg = this.getKeg(kegId);
      if (keg) {
        return keg.beerId ? this.getBeer(keg.beerId).name : null;
      } else {
        console.warn(kegId);
      }
    },
    async redeemBeer(lineId) {
      const { cardId } = this.worker;
      console.warn(cardId);
      const url = "/remote-sale";
      const data = { lineId, concept: "Oz_10", cardId };
      this.loader = true;
      let response = await Api().post(url, data);
      this.loader = false;
      if (response.data.confirmation === "success") {
        this.closeModal();
      } else {
        console.log(response.data);
        console.log("valiste");
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/texts";
</style>
