<template>
  <v-dialog persistent v-model="open" max-width="500px">
    <v-card>
      <v-card-title>
        {{ this.isExtracting ? "Extraer" : "Agregar" }} Inventario
      </v-card-title>
      <v-card-text class="d-flex flex-row align-center">
        <v-list three-line style="width:100%">
          <template v-for="(item, index) in items">
            <v-list-item v-if="items.length > 0" :key="index" @click="">
              <v-list-item-avatar tile size="70" class="my-1">
                <v-img
                  :src="
                    item.image.length > 2
                      ? BASE_URL + '/getImage/' + item.image
                      : require('@/assets/no-image.svg')
                  "
                />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.brand }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-text-field
                placeholder="20"
                label="Cantidad"
                v-model="qty[index].value"
                :suffix="item.unity"
                :hint="
                  isExtracting ? 'max. ' + item.volume + ' ' + item.unity : ''
                "
                persistent-hint
                @keypress="isNumber($event, qty[index].value, item.volume)"
              />
            </v-list-item>
            <v-divider style="margin-left:100px" :inset="true" />
          </template>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" text @click="handleClose()">
          Close
        </v-btn>
        <v-spacer />
        <v-btn
          :disabled="isDisabled"
          color="primary"
          text
          @click="subtractInventory()"
        >
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import Api from "../../service/api";
export default {
  data() {
    return {
      qty: []
    };
  },
  computed: {
    ...mapState("Session", ["BASE_URL"]),
    isDisabled() {
      var disabled = false;
      this.qty.forEach((item, i) => {
        if (isNaN(parseFloat(item.value))) disabled = true;
      });
      return disabled;
    }
  },
  props: {
    items: Array,
    open: Boolean,
    isExtracting: Boolean,
    handleClose: Function
  },
  methods: {
    isNumber: function(evt, value, max) {
      evt = evt ? evt : window.event;
      var code = evt.which ? evt.which : evt.keyCode;
      if (code > 31 && (code < 48 || code > 57) && code !== 46)
        evt.preventDefault();
      else if (
        parseFloat(value + String.fromCharCode(code)) > max ||
        parseFloat(value + String.fromCharCode(code)) < 1
      ) {
        if (this.isExtracting) evt.preventDefault();
        else return true;
      } else return true;
    },
    async subtractInventory() {
      const { qty, isExtracting } = this;
      try {
        this.loader = true;
        const path = isExtracting ? "/subtract_inventory" : "/add_inventory";
        let response = await Api().post(path, { items: qty });
        this.loader = false;
        if (response.data.confirmation === "success") {
          const action = this.worker ? "Stock/takeStock" : "Stock/refillStock";
          this.$store.dispatch(action, qty);
          this.qty.forEach((item, i) => (item.value = null));
          this.handleClose(true);
        } else {
          console.log(response.data);
          console.log("valiste");
        }
      } catch (e) {
        this.loader = false;
      }
    }
  },
  watch: {
    items: function(newVal, oldVal) {
      var qtyArray = [];
      if (oldVal.length === 0) {
        newVal.forEach(item => {
          qtyArray.push({ id: item._id, value: "" });
        });
        this.qty = qtyArray;
      } else if (newVal.length > oldVal.length) {
        const numOfAdded = newVal.length - oldVal.length; // 5-6 =  1
        for (var i = 0; i < numOfAdded; i++) {
          const index = oldVal.length + i; //  index = 5 + 0
          console.log(newVal[index]);
          this.qty.push({ id: newVal[index]._id, value: "" });
        }
      } else if (newVal.length < oldVal.length) {
        this.qty = this.qty.filter(entry1 =>
          newVal.some(entry2 => entry1.id === entry2._id)
        );
      }
    }
  }
};
</script>
<style scoped>
.v-input__control {
  height: 35px !important;
}
.v-text-field {
  max-width: 75px;
}
</style>
