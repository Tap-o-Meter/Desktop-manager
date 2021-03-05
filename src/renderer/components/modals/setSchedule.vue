<template>
  <div>
    <v-dialog v-model="open" persistent width="820px">
      <v-card class="pt-3 pl-3 pr-3 pb-1">
        <v-card-title>
          <span class="header-2-alt thin">Editar Horario</span>
        </v-card-title>
        <!-- <v-divider color="lightgray" class="mb-3" /> -->

        <!-- <span class="header-3-alt light">Día {{ day.name }}</span> -->
        <v-container fluid class="pb-0">
          <v-row>
            <v-col cols="9">
              <v-row class="pb-0" style="max-height:60px">
                <v-col class="py-0 mt-1">
                  <v-menu
                    ref="menu"
                    v-model="turns.menuFrom"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    max-width="220px"
                    min-width="220px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        v-model="turns.from"
                        label="Desde"
                        prepend-inner-icon="mdi-clock-time-eight-outline"
                        readonly
                        placeholder="20:00"
                        v-bind="attrs"
                        v-on="on"
                      />
                    </template>
                    <v-time-picker
                      v-if="turns.menuFrom"
                      v-model="turns.from"
                      full-width
                    />
                  </v-menu>
                </v-col>
                <v-col class="py-0 mt-1">
                  <v-menu
                    ref="menu"
                    v-model="turns.menuTo"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    max-width="220px"
                    min-width="220px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        placeholder="11:00"
                        v-model="turns.to"
                        label="Hasta"
                        prepend-inner-icon="mdi-clock-time-eight-outline"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      />
                    </template>
                    <v-time-picker
                      v-if="turns.menuTo"
                      v-model="turns.to"
                      full-width
                    />
                  </v-menu>
                </v-col>
              </v-row>
              <span class="s-light-subtitles">Seleccionar días</span>
              <v-row class="pl-4">
                <v-checkbox v-model="days.lunes" class="mx-2" label="Lunes" />
                <v-checkbox v-model="days.martes" class="mx-2" label="Martes" />
                <v-checkbox
                  v-model="days.miércoles"
                  class="mx-2"
                  label="Miércoles"
                />
                <v-checkbox v-model="days.jueves" class="mx-2" label="Jueves" />
              </v-row>
              <v-row class="pl-4">
                <v-checkbox
                  v-model="days.viernes"
                  class="mx-2"
                  label="Viernes"
                />
                <v-checkbox v-model="days.sábado" class="mx-2" label="Sábado" />
                <v-checkbox
                  v-model="days.domingo"
                  class="mx-2"
                  label="Domingo"
                />
                <v-spacer></v-spacer>
                <v-btn
                  icon
                  color="indigo"
                  style="float:right"
                  class="mt-5"
                  @click="addTurn()"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-row>
            </v-col>
            <v-col cols="3" class="pt-0">
              <span class="header-4-alt light pb-1">Turnos</span>
              <div
                class="d-flex flex-column turn-list"
                v-if="schedules.length > 0"
              >
                <v-card
                  v-for="(schedule, index) in schedules"
                  :key="schedule.from + schedule.to"
                  class="mx-1 pa-2 mt-2"
                  elevation="2"
                >
                  <span class="header-5-alt">
                    {{ schedule.from }} - {{ schedule.to }}
                  </span>
                  <p class="mb-0">
                    <span v-for="day in schedule.days" :key="">
                      {{ day.charAt(0).toUpperCase() + day.charAt(1) }},
                    </span>
                  </p>
                  <v-btn
                    icon
                    class="close-btn"
                    small
                    @click="removeTurn(index)"
                  >
                    <v-icon size="20">mdi-close</v-icon>
                  </v-btn>
                </v-card>
              </div>
              <div
                class="d-flex turn-list justify-center align-center light-titles light "
                v-else
              >
                No hay horarios
              </div>
            </v-col>
          </v-row>
        </v-container>

        <v-divider />
        <v-card-actions class="">
          <v-spacer />
          <v-btn color="blue darken-1" text @click="closeModal()">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="createUser()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay z-index="2000" :value="loader">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
import Api from "../../service/api";
import axios from "axios";
export default {
  name: "SetSchedule",
  data() {
    return {
      loader: false,
      schedules: [],
      turns: { from: null, to: null, menuFrom: false, menuTo: false },
      days: {
        lunes: false,
        martes: false,
        miércoles: false,
        jueves: false,
        viernes: false,
        sábado: false,
        domingo: false
      }
    };
  },
  props: {
    open: Boolean,
    handleClose: Function,
    workerId: String,
    schedule: Array
  },
  methods: {
    async createUser() {
      if (this.schedules.length > 0) {
        const { schedules, workerId } = this;
        this.loader = true;
        let response = await Api().post("/setSchedule", {
          id: workerId,
          horario: JSON.stringify(schedules)
        });
        this.loader = false;
        if (response.data.confirmation) {
          this.$store.dispatch("Session/updateWorker", response.data.data);
          this.closeModal();
        } else {
          console.log(response.data);
          console.log("valiste");
        }
      } else {
        alert("No hay horarios agragados");
      }
    },
    addTurn() {
      const keys = Object.keys(this.days);
      const workDays = keys.filter(key => this.days[key]);
      this.schedules.push({
        from: this.turns.from,
        to: this.turns.to,
        days: workDays
      });
      this.turns = { from: null, to: null, menuFrom: false, menuTo: false };
      for (var i = 0; i < keys.length; i++) {
        this.days[keys[i]] = false;
      }
    },
    removeTurn(index) {
      this.schedules.splice(index, 1);
    },
    closeModal() {
      this.schedules = [];
      this.turns = { from: null, to: null, menuFrom: false, menuTo: false };
      this.days = {
        lunes: false,
        martes: false,
        miércoles: false,
        jueves: false,
        viernes: false,
        sábado: false,
        domingo: false
      };
      this.handleClose(false);
    }
  },
  beforeMount: function() {
    this.schedules = this.schedule ? [...this.schedule] : [];
  }
};
</script>
<style lang="scss">
.v-dialog {
  overflow: visible !important;
}

.v-window__container {
  height: 100% !important;
  .v-window-item--active {
    height: 100% !important;
  }
}
</style>
<style lang="scss" scoped>
@import "@/assets/styles/texts";
@import "@/assets/styles/colors";
.image-picker {
  position: relative;
  background-color: transparent;
  height: 220px;
  width: 190px;
}
.image-wrapper {
  display: flex;
  overflow: hidden;
  border: 1px solid lightgray;
  border-radius: 10px;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  img {
    object-fit: cover;
  }
}
.online {
  color: $alert-hover;
}
.turn-list {
  height: 180px;
  overflow-y: scroll;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
}
.free {
  color: $green-hover;
}
</style>
