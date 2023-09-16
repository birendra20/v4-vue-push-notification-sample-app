import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ChatsView from "../views/ChatView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },

  {
    path: "/chats",
    name: "chat",
    component: ChatsView,
    // beforeEnter: (to, from, next) => {
    //   to.query = {}; // Clear the query parameters
    //   next();
    // },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
