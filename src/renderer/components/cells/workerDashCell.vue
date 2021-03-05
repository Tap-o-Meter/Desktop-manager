<template>
  <v-card
    hover
    color="white"
    class="workerCell d-flex pt-3 mr-2 ml-2 mb-5 flex-column align-center"
  >
    <img :src="worker.foto" class="workerImage mb-2 mx-auto" />
    <p class="thin-light-header-4">
      {{ worker.nombre + " " + worker.apellidos }}
    </p>
  </v-card>
</template>
<script>
export default {
  name: "WorkerDashCell",
  props: {
    worker: Object
  }
};
</script>
<style scoped lang="scss">
.workersList {
  width: 100%;
  max-width: 100%;
  overflow: scroll;
  .workerCell {
    position: relative;
    height: 370px;
    min-width: 310px;
    border-radius: 5px;
    .workerImage {
      transition: all 0.3s cubic-bezier(0.34, 1.61, 0.7, 1);
      transform: translateZ(0);
      object-fit: cover;
      width: 110px;
      height: 110px;
      border-radius: 55px;
      border: 1px solid lightgray;
      left: 0;
      right: 0;
      background-color: white;
    }
  }
  .workerCell:hover .workerImage {
    transform: translate3d(0, -30px, 0);
  }
}
</style>
