<template>
  <div>
    <v-dialog v-model="open" persistent width="750px">
      <v-card class="pt-3 pl-3 pr-3 pb-1">
        <v-card-title>
          <span class="header-2-alt thin">Recargar Tarjeta</span>
        </v-card-title>
        <v-divider color="lightgray" class="mb-3" />
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                class="d-flex align-center flex-column pt-0 pr-0 pl-6"
                cols="4"
              >
                <span class="info-text header-3-alt pt-0 mt-0 mb-7">
                  Información
                </span>
                <v-avatar class="mb-3" color="orange" size="160">
                  <span class="white--text header-fg-alt">
                    {{ worker.nombre.charAt(0) + worker.apellidos.charAt(0) }}
                  </span>
                </v-avatar>
                <span class="header-4-alt bold pt-0 mb-7">
                  {{ worker.nombre + " " + worker.apellidos }}
                </span>

                <div class="worker-info">
                  <div class="d-flex justify-space-between mb-2">
                    <div class="header-4-alt light">Cervezas:</div>
                    <div
                      class="header-3-alt bold qty-value"
                      v-text="worker.beers.beers"
                    />
                  </div>

                  <div class="d-flex justify-space-between mb-2">
                    <div class="header-4-alt light">Tasters:</div>
                    <div
                      class="header-3-alt bold qty-value"
                      v-text="worker.beers.tasters"
                    />
                  </div>
                  <div class="d-flex justify-space-between mb-2">
                    <div class="header-4-alt light">Flights:</div>
                    <div
                      class="header-3-alt bold qty-value"
                      v-text="worker.beers.flight"
                    />
                  </div>
                </div>
              </v-col>
              <v-col class="d-flex align-end flex-column mt-12" cols="8">
                <QtySelector
                  class="mb-10 mt-7"
                  :logo="'shit'"
                  :price="prices.pint"
                  :type="'Pint'"
                  v-model="pint"
                />
                <QtySelector
                  class="mb-10"
                  :logo="'shit'"
                  :price="prices.taster"
                  :type="'Taster'"
                  v-model="taster"
                />
                <QtySelector
                  class=""
                  :logo="'shit'"
                  :price="prices.flight"
                  :type="'Flight'"
                  v-model="flight"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col class="mt- d-flex justify-space-between px-5">
                <div class="header-fg-alt light">
                  Total
                </div>
                <div class="header-fg-alt">${{ total }}</div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions class="">
          <v-spacer />
          <v-btn color="error darken-1" text @click="closeModal()">
            Cancelar
          </v-btn>
          <v-btn color="success darken-1" text @click="rechargeCard()">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay z-index="2000" :value="loader">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
import QtySelector from "../form/QtySelector";
import Api from "../../service/api";
import axios from "axios";
import config from "../../config";
import { mapState, mapGetters } from "vuex";
export default {
  name: "RechargeCard",
  computed: {
    ...mapState("Session", ["prices"])
    // ...mapGetters("Session", ["getWorkerByCardId"])
  },
  components: { QtySelector },
  data: () => ({
    loader: false,
    pint: 0,
    taster: 0,
    flight: 0,
    total: 0
    // worker: "24 63 0A 2B",
    // worker: {
    //   _id: "222222",
    //   nombre: "Karen",
    //   apellidos: "Lastra",
    //   beers: { beers: 3, tasters: 1, flight: 5 }
    // }
  }),
  props: {
    worker: Object,
    open: Boolean,
    handleClose: Function
  },
  methods: {
    closeModal: function() {
      this.reset();
      this.handleClose(false);
    },
    getTotal() {
      const { flight, taster, pint, prices } = this;
      this.total =
        flight * prices.flight + taster * prices.taster + pint * prices.pint;
    },
    reset() {
      this.pint = 0;
      this.taster = 0;
      this.flight = 0;
      this.total = 0;
    },
    async rechargeCard() {
      const { pint, taster, flight, worker } = this;
      this.loader = true;
      let response = await Api().post("/recharge-card", {
        cardId: worker._id,
        beers: { beers: pint, tasters: taster, flight: flight }
      });
      this.loader = false;
      if (response.data.confirmation === "success") {
        // this.$store.dispatch("Lines/replaceLine", {
        //   data: response.data.data,
        //   newStatus: status
        // });
        this.closeModal();
      } else {
        console.log(response.data);
        console.log("valiste");
      }
    }
  },
  watch: {
    flight: function() {
      this.getTotal();
    },
    taster: function() {
      this.getTotal();
    },
    pint: function() {
      this.getTotal();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors";
@import "@/assets/styles/texts";
.info-text {
  margin: 10px 10px 10px 0;
  display: flex;
  align-self: stretch;
}
.worker-info {
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
  .qty-value {
    width: 30px;
    padding-top: 3px;
    color: #26c6da;
    text-align: center;
  }
}
</style>
