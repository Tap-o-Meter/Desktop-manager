<template>
  <div class="wrapper custom-scroll">
    <div class="background" />
    <v-card
      color="#f5f5f5"
      class="d-flex flex-column pa-10 "
      width="440"
      style="border-radius:10px"
    >
      <!-- <div class="poligon" /> -->
      <v-card-text style="z-index:2 ">
        <span
          class="display-1 pl-4 text--primary headerText mb-10 font-weight-light"
        >
          Login
        </span>
        <p>adjective</p>
        <v-text-field
          v-model="email"
          prepend-inner-icon="mdi-account"
          :rules="[rules.required, rules.email]"
          label="Email"
          class="mt-10"
        />
        <v-text-field
          v-model="password"
          prepend-inner-icon="mdi-lock"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.required, rules.min]"
          :type="show1 ? 'text' : 'password'"
          name="input-10-1"
          label="Password"
          hint="At least 8 characters"
          counter
          @click:append="show1 = !show1"
        />
      </v-card-text>
      <v-card-actions d-flex>
        <v-btn
          height="50"
          class="mr-1 mb-2 logIn white--text"
          :to="{ name: 'dashboard' }"
        >
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      show1: false,
      password: "",
      email: "",
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 characters",
        emailMatch: () => "The email and password you entered don't match",
        counter: value => value.length <= 20 || "Max 20 characters",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        }
      }
    };
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/colors";
@import "@/assets/styles/components";
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: black;
}
.background {
  opacity: 0.5;
  height: 100%;
  position: fixed;
  width: 100%;
  background-image: url("~@/assets/shit2.gif");
  background-repeat: no-repeat;
  background-size: cover;
  filter: blur(4px);
}
.loginCard {
  height: 470px;
  display: flex;
}
.logIn {
  flex: 1;
  border-radius: 30px;
  background: $blue-gradient;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px $light-blue;
}
.headerText {
  border-left: 5px solid $light-blue;
  z-index: 2;
}
.poligon {
  z-index: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: $blue-gradient;
  height: 150px;
  clip-path: polygon(0% 0%, 100% 0%, 100% 80px, 0% 150px);
}
</style>
