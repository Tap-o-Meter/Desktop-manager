<template>
  <div class="barrelsWrapper d-flex flex-column">
    <div
      class="titleWrapper d-flex pl-5 pr-5 align-center justify-space-between"
    >
      <span class="header-1-alt ultra-thin">Trabajadores</span>
    </div>
    <v-container fluid>
      <v-row>
        <v-col cols="2">
          <v-text-field
            dense
            solo
            flat
            v-model="search"
            placeholder="Buscar"
            background-color="white"
            prepend-inner-icon="mdi-magnify"
            v-on:keydown="onChange"
          />
        </v-col>
        <v-col cols="2" class="ml-auto">
          <v-select
            dense
            background-color="white"
            placeholder="Ordenar: # Linea"
            item-text="noLinea"
            item-value="_id"
            solo
            flat
          />
        </v-col>
        <v-col cols="2">
          <v-select
            dense
            background-color="white"
            placeholder="Categoría: Todas"
            item-text="noLinea"
            item-value="_id"
            label="Filtrar"
            solo
            flat
          />
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex
          xs12
          sm6
          md4
          lg3
          xl3
          class="align-center justify-center d-flex"
          v-for="(worker, index) in onChange(this.search)"
          :key="index"
        >
          <WorkerCell :worker="worker" />
        </v-flex>
      </v-layout>
    </v-container>
    <v-btn
      class="mx-2"
      dark
      fab
      medium
      color="#00acc1"
      @click.stop="dialog = true"
    >
      <v-icon dark>mdi-plus</v-icon>
    </v-btn>
    <AddWorker
      content-class="dialog"
      :open="dialog"
      :handleClose="closeModal"
    />
  </div>
</template>
<script>
import { mapState } from "vuex";
import { WorkerCell } from "../components/cells";
import { AddWorker } from "../components/modals";
export default {
  name: "Barrels",
  components: { WorkerCell, AddWorker },
  data() {
    return {
      search: "",
      dialog: false,
      filteredWorkers: []
    };
  },
  computed: { ...mapState("Session", ["workers"]) },
  beforeMount: function() {
    this.filteredWorkers = this.workers;
  },
  methods: {
    closeModal() {
      this.dialog = false;
    },
    onChange(search) {
      return this.workers.filter(worker =>
        (worker.nombre + " " + worker.apellidos)
          .toUpperCase()
          .includes(search.toString().toUpperCase())
      );
    }
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/colors";
@import "@/assets/styles/texts";
.barrelsWrapper {
  flex: 1;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  overflow: scroll;
  background: rgb(244, 245, 249);
  padding-top: 0px;
  .titleWrapper {
    z-index: 1;
    position: sticky;
    width: 100%;
    top: 0;
    background-color: snow;
    min-height: 60px;
    box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.1) !important;
    .search {
      width: 300px;
    }
  }
  .container {
    height: 60px;
    margin-top: 10px;
    padding: 0;
    padding-right: 3%;
    padding-left: 3%;
    .row {
      height: unset;
    }
  }
  .v-text-field {
    border-radius: 9px;
    font-size: 14px;
  }
  .row {
    height: 60px;
  }
  .dialog {
    position: absolute;
    z-index: 4000;
  }

  .mx-2 {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
}
</style>
