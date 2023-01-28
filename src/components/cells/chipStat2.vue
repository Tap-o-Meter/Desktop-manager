<template>
  <v-card
    class="pa-3 chip-card"
    hover
    outlined
    style="border: none !important"
    :to="{ name: data.href }"
  >
    <div class="d-flex grow flex-wrap justify-space-between">
      <div class="d-flex flex-column" height="100%">
        <!-- :class="data.color" -->
        <div class="body-4 grey--text ">{{ data.type }}</div>
        <!-- <v-icon class="mt-3" size="30">{{ data.icon }}</v-icon> -->
      </div>
      <div class="mr-4 d-flex right-chip">
        <div class="ml-auto text-right">
          <h3 class="header-1 text--primary">
            {{ data.data }}
          </h3>
        </div>
      </div>
    </div>
    <!-- <v-divider /> -->

    <!-- <span class="caption grey--text font-weight-light">
      <v-icon size="16">{{ data.miniIcon }}</v-icon>
      {{ data.message }}
    </span> -->
  </v-card>
</template>
<script>
export default {
  props: {
    data: Object,
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/components";
@import "@/assets/styles/texts";
.v-sheet--offset {
  // top: -24px;
  position: relative;
  //background: linear-gradient(60deg, #ffa726, #fb8c00);
}
.chip-card {
  display: flex;
  height: 100px;
  border-radius: 17px;
}
.right-chip{
  flex-direction: column-reverse
}
</style>
