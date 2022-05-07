<template>
  <v-card
    hover
    outlined
    min-width="260"
    height="360"
    class=" mt-7 d-flex flex-column align-center workerCell"
    :to="{ name: 'worker-details', params: { worker: worker } }"
  >
    <!-- <v-btn icon class="options">
      <v-icon size="27">mdi-dots-vertical</v-icon>
    </v-btn> -->
    <v-avatar color="#d7dde6" size="110" class="mt-10 workerImage">
      <v-img :src="BASE_URL + '/getImage/' + worker.foto" v-if="worker.foto" />
      <span class="white--text header-1-alt" v-else>
        {{ worker.nombre.charAt(0) + worker.apellidos.charAt(0) }}
      </span>
    </v-avatar>
    <p class="subtitle-1 mt-3">
      {{ worker.nombre + " " + worker.apellidos }}
    </p>
    <v-container>
      <v-row>
        <v-col class="d-flex flex-column pr-0">
          <span class="header-2-alt bold text-center ">
            {{ this.worker.qty }} L
          </span>
          <p class="bold-names text-center ">en el mes</p>
        </v-col>
        <v-col
          v-if="worker.horario.length > 0"
          class="d-flex justify-start align-center "
        >
          <span class="text-left header-4-alt light">
            <span :class="days.indexOf('lunes') > 1 ? 'dayWork' : ''">L</span>
            <span :class="days.indexOf('martes') > 1 ? 'dayWork' : ''">M</span>
            <span :class="days.indexOf('miércoles') > 1 ? 'dayWork' : ''">
              M
            </span>
            <span :class="days.indexOf('jueves') > 1 ? 'dayWork' : ''">J</span>
            <span :class="days.indexOf('viernes') > 1 ? 'dayWork' : ''">V</span>
            <span :class="days.indexOf('sábado') > 1 ? 'dayWork' : ''">S</span>
            <span :class="days.indexOf('domingo') > 1 ? 'dayWork' : ''">D</span>
          </span>
        </v-col>
      </v-row>
    </v-container>

    <v-card-actions class="d-flex justify-end" style="width:100%">
      <v-btn small text color="primary" dark>ver más</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapState } from "vuex";
import config from "../../config";
export default {
  computed: {
    ...mapState("Session", ["BASE_URL"]),
    days() {
      var days = [];
      this.worker.horario.forEach((horario, i) => {
        days = [...days, ...horario.days];
      });

      return [...new Set(days)];
    },
    fixedQty() {
      const { qty } = this.worker;
      return qty > 0 ? parseFloat(qty).fixed(2) : qty;
    }
  },
  props: {
    worker: Object
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/colors";
@import "@/assets/styles/texts";
.options {
  position: absolute;
  right: 2px;
  top: 4px;
}
.workerImage {
  transition: all 2s cubic-bezier(0.34, 1.61, 0.7, 1);
  transform: translateZ(0);
  border-radius: 50% !important;
}
// .workerCell:hover .workerImage {
//   transform: translate3d(0, -30px, 0);
// }
.workerCell {
  max-width: 260px;
  border: none !important;
}
.dayWork {
  color: $blue;
  font-weight: 600;
}
</style>
