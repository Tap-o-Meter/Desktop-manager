import Vue from "vue";
import Vuetify from "vuetify/lib";
import {
  beerTap,
  beerTapOutline,
  addBarrel,
  addBeer,
  connectBeer,
  salesRecord,
  searchUser,
  keg,
  addWorker,
  fermenter
} from "../assets/icons";

Vue.use(Vuetify);

const opts = {
  icons: {
    values: {
      beerTap: {
        component: beerTap // our custom component
      },
      beerTapOutline: {
        component: beerTapOutline // our custom component
      },
      addBarrel: {
        component: addBarrel // our custom component
      },
      connectBeer: {
        component: connectBeer // our custom component
      },
      salesRecord: {
        component: salesRecord // our custom component
      },
      searchUser: {
        component: searchUser // our custom component
      },
      keg: {
        component: keg // our custom component
      },
      addBeer: {
        component: addBeer // our custom component
      },
      addWorker: {
        component: addWorker // our custom component
      },
      fermenter: {
        component: fermenter // our custom component
      }
    }
  }
};

export default new Vuetify(opts);
