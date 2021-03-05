<template>
  <v-card
    class="pa-3"
    hover
    outlined
    style="border: none !important;"
    :to="{ name: data.href }"
  >
    <div class="d-flex grow flex-wrap justify-space-between">
      <v-sheet
        class="v-sheet--offset d-flex justify-center align-center"
        elevation="12"
        height="90"
        width="90"
        :class="data.color"
      >
        <v-icon dark size="32">{{ data.icon }}</v-icon>
      </v-sheet>
      <div class="ml-6">
        <div class="ml-auto text-right">
          <div class="body-4 grey--text font-weight-light">{{ data.type }}</div>
          <h3 class="body-5 font-weight-light text--primary">
            {{ data.data }}
          </h3>
        </div>
      </div>
    </div>
    <v-divider />

    <span class="caption grey--text font-weight-light">
      <v-icon size="16">{{ data.miniIcon }}</v-icon>
      {{ data.message }}
    </span>
  </v-card>
</template>
<script>
export default {
  props: {
    data: Object
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/components";
.v-sheet--offset {
  top: -24px;
  position: relative;
  //background: linear-gradient(60deg, #ffa726, #fb8c00);
}
</style>
