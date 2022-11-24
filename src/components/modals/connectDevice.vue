<template>
  <v-dialog persistent v-model="open" max-width="500px">
    <v-card>
      <v-form ref="form" lazy-validation>
        <v-card-title>
          Conectar sensor
        </v-card-title>
        <v-card-text class="d-flex flex-row align-center">
          <v-select
            persistent-hint
            :rules="portRules"
            hint="El sensor debe estar conectado a un puero USB"
            v-model="selectedPort"
            :items="ports"
            label="Selecionar puerto"
            item-value="text"
          />

          <v-btn small icon class="ml-2" @click="refresh()">
            <v-icon size="24" color="primary">mdi-refresh</v-icon>
          </v-btn>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="closeScreen()">
            Close
          </v-btn>
          <v-spacer />
          <v-btn color="primary" text @click="connect()">
            Connectar
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script>
import { portList, connectPort } from "../../api/index.js";
export default {
  data() {
    return {
      ports: [],
      portRules: [v => !!v || "El nombre es requerido"],
      selectedPort: ""
    };
  },
  props: {
    open: Boolean,
    handleClose: Function
  },
  methods: {
    async refresh() {
      var puertos = await portList();
      if(puertos.length > 0) this.ports = puertos.map(port => port.path);  
    },
    closeScreen() {
      selectedPort: "";
      this.$refs.form.resetValidation();
      this.handleClose();
    },
    connect() {
      if (this.$refs.form.validate()) {
        connectPort(this.selectedPort, this.$store);
      }
    }
  },
  beforeMount: function() {
    this.refresh()
  }
};
</script>
<style scoped>
.v-input__control {
  height: 35px !important;
}
</style>
