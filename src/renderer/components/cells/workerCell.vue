<template>
  <v-card
    hover
    outlined
    min-width="260"
    height="360"
    class=" mt-7 d-flex flex-column align-center workerCell"
    :to="{ name: 'worker-details', params: { id: worker._id } }"
  >
    <!-- <v-btn icon class="options">
      <v-icon size="27">mdi-dots-vertical</v-icon>
    </v-btn> -->
    <v-avatar color="#d7dde6" size="110" class="mt-10 workerImage">
      <v-img
        :src="'http://beer-control.local:3000/getImage/' + worker.foto"
        v-if="worker.foto"
      />
      <span class="white--text header-1-alt" v-else>
        {{ worker.nombre.charAt(0) + worker.apellidos.charAt(0) }}
      </span>
    </v-avatar>
    <p class="subtitle-1 mt-3">
      {{ worker.nombre + " " + worker.apellidos }}
      <v-icon size="14" :color="worker.onWork ? 'green' : 'gray'">
        mdi-checkbox-blank-circle{{ worker.onWork ? "" : "-outline" }}
      </v-icon>
    </p>
    <v-container>
      <v-row>
        <v-col cols="6" class="d-flex flex-column pr-0">
          <span class="header-2-alt bold text-center ">
            24 <v-icon size="30">mdi-beer</v-icon>
          </span>
          <p class="bold-names text-center ">en la semana</p>
        </v-col>
        <v-col cols="6" class="d-flex justify-start align-center ">
          <span class="text-left header-4-alt light">
            <span class="">L</span>
            <span class="dayWork">M</span>
            <span class="">M</span>
            <span class="dayWork">J</span>
            <span class="">V</span>
            <span class="dayWork">S</span>
            <span class="dayWork">D</span>
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
export default {
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
  transition: all 0.3s cubic-bezier(0.34, 1.61, 0.7, 1);
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
