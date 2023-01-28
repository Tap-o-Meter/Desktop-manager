<template>
  <div class="expanded-list d-flex flex-column no-scroll">
    <div class="titleWrapper d-flex pl-5 pr-5 align-center">
      <v-btn class="ma-2" text color="success" @click="$router.go(-1)">
        <v-icon large left>mdi-chevron-left</v-icon>
        <!-- back -->
      </v-btn>
      <span class="header-1-alt main-title ultra-thin">{{ names[type] }}</span>
    </div>
    <v-card class="ma-10 elevation-0" style="min-height: 80%">
      <v-container fluid class="pa-1" style="position: stiky">
        <v-row class="ma-0">
          <!-- <v-col cols="2">
            <v-text-field
              dense
              solo
              flat
              v-model="search"
              placeholder="Buscar"
              background-color="#f5f5f5"
              prepend-inner-icon="mdi-magnify"
            />
          </v-col> -->
        </v-row>
      </v-container>
      <v-data-table
        :headers="headers[type]"
        :items="data"
        dense
        class="elevation-0 d-flex flex-column pt-2"
        style="min-height: 80vh"
        :items-per-page="60"
        item-key="_id"
      >
        <template v-slot:item="{ item }">
          <tr v-if="type === 0" :class="getClass(item.concept, item.workerId)">
            <td
              v-if="key !== '_id'"
              v-for="key in Object.keys(item)"
              :key="key"
              :class="key"
              v-html="renderSellCell(item, key)"
            ></td>
          </tr>
          <tr v-if="type === 1">
            <td v-for="key in Object.keys(item)" :key="key" :class="key">
              {{ item[key] }}
            </td>
          </tr>
        </template>
        <template v-slot:no-data>
          <p class="header-3-alt thin black--text mt-10 secundary">
            <v-icon size="35" class="pb-1">
              mdi-calendar-remove-outline
            </v-icon>
            No hay ventas que mostrar
          </p>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import config from "@/config";
import { mapGetters, mapState } from "vuex";
export default {
  name: "ExpandedList",
  data: () => ({
    names: ["Reporte de ventas"],
    headers: [
      [
        { text: "TRABAJADOR", value: "workerId", sortable: false },
        { text: "VENTA", value: "concept", sortable: false, align: "end" },
        { text: "CANTIDAD", value: "qty", sortable: false, align: "end" },
        { text: "Fecha", value: "date", width: "190", align: "end" },
      ],
    ],
  }),
  methods: {
    getClass(concept, workerId) {
      if (workerId.length < 4 && workerId.length != 0) return "claimed";
      if (concept == "MERMA") return "merma";
    },
    worker(workerId) {
      return this.getWorker(workerId);
    },
    parseDate(date) {
      return config.parseDate(date);
    },
    parseQty(qty) {
      var formatedQty;
      if (qty.charAt(0) == "." || qty.charAt(0) == ".") {
        formatedQty = parseInt(qty.slice(qty.indexOf(".") + 1)).toString();
        formatedQty += " mL";
      } else {
        formatedQty = qty + " L";
      }
      return formatedQty;
    },
    renderSellCell(item, key) {
      if (key == "workerId") {
        if (item.workerId.length < 4 && item.workerId.length != 0)
          return "Cortesía reclamada";
        if (item.workerId.length > 4) {
          const { nombre, apellidos } = this.worker(item.workerId);
          return `${nombre} ${apellidos}`;
        } else return item; 
      } else if (key == "qty") return this.parseQty(item.qty);
      else if (key == "date") return this.parseDate(item.date);
      else return item[key];
    },
    fixSalesTable(table){
      if(table.length < 1) return []
      var new_table = table.map( element => {
        const {workerId, concept, qty, date} = element;
        return {workerId, concept, qty, date} 
      })
      return new_table
    }, 
  },
  computed: {
    ...mapGetters("Session", ["getWorker"]),
    type() {
      return this.$route.params.type;
    },
    data() {
      return this.$route.params.data;
    },
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/colors";
@import "@/assets/styles/texts";
@import "@/assets/styles/components";
.expanded-list {
  position: relative;
  flex: 1;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  overflow: scroll;
  background: rgb(244, 245, 249);
  padding-top: 0px;
}
.titleWrapper {
  z-index: 1;
  position: sticky;
  // width: 100%;
  top: 0;

  background-color: snow;
  min-height: 60px;
  box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.1) !important;
  .main-title {
    text-transform: none !important;
  }
  .search {
    width: 300px;
  }
}
.merma {
  background-color: rgba(255, 70, 75, 0.8);
}
.merma td:first-child {
  // border-top-left-radius: 5px;
  // border-bottom-left-radius: 5px;
}

.merma td {
  color: azure;
  // border-top-left-radius: 5px;
  // border-bottom-left-radius: 5px;
}

td:last-child {
  text-align: end;
  // border-top-right-radius: 5px;
  // border-bottom-right-radius: 5px;
}
.qty {
  text-align: end;
}

.merma:hover {
  background: rgba(255, 70, 75, 0.7) !important;
}

.concept {
  font-size: 11px !important;
  font-weight: bold;
  text-align: end;
}

.claimed {
  background-color: green;
}

.claimed:hover {
  background: rgba(0, 128, 0, 0.7) !important;
}

.claimed td {
  color: azure;
  // border-top-left-radius: 5px;
  // border-bottom-left-radius: 5px;
}
</style>
