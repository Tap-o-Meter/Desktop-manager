<template>
  <div class="qty-selector">
    <span class="header-4-alt mb-2" v-text="type" />
    <div class="input-wrapper">
      <v-icon />
      <v-btn
        class="qty-buttons header-3-alt bold white--text"
        large
        color="primary"
        tile
        @click.stop="qty -= 1"
        :disabled="qty <= min"
        v-text="'-'"
      />

      <input :value="qty" type="Number" class="qty-text header-3-alt thin" />
      <!-- <span class="qty-text" v-text="qty" /> -->
      <v-btn
        class="qty-buttons header-3-alt bold white--text"
        large
        color="primary"
        tile
        @click.stop="qty += 1"
        :disabled="!(qty + 1 <= max)"
        v-text="'+'"
      />
    </div>
    <span class="light mb-2 sub-total" v-text="'$' + qty * price" />
  </div>
</template>
<script>
export default {
  name: "QtySelector",
  data: () => ({
    qty: 0,
    max: 100,
    min: 0
  }),
  props: {
    logo: String,
    type: String,
    value: Number,
    price: Number
  },
  watch: {
    qty: function() {
      this.$emit("input", this.qty);
    },
    value: function(value) {
      this.qty = value;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors";
@import "@/assets/styles/texts";
.qty-selector {
  display: flex;
  flex-direction: column;
  .sub-total {
    text-align: right;
  }
  // width: 270px;
  // max-width: 270px;
  .input-wrapper {
    display: flex;
    flex-direction: row;
    border: 1px solid lightgrey;
    flex-shrink: 1;
    // justify-content: center;
    align-items: center;
    max-width: 276px;
    .qty-text {
      display: flex;
      height: 44px;
      color: gray;
      text-align: center;
      max-width: 120px;
      pointer-events: none !important;
      cursor: none !important;
    }
    .qty-buttons {
      width: 44px !important;
    }
  }
}
</style>
