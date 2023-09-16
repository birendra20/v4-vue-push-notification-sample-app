<template>
  <Suspense>
    <div>
      {{ location }}
      <router-view />
    </div>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import LoginComponent from "../src/components/Login/index.vue";

import {
  CometChatConversationsWithMessages,
  CometChatUIKit,
} from "@cometchat/chat-uikit-vue";

export default defineComponent({
  components: {
    LoginComponent,
    CometChatConversationsWithMessages,
  },
  setup() {
    const loggedInUser = ref<CometChat.User | null>();

    (async () => {
      await CometChatUIKit.getLoggedinUser()!
        .then((user) => {
          console.log("user", user);
          loggedInUser.value = user;
          //Login user
        })
        .catch((error) => {
          console.log("error");
        });
    })();

    const location = window.location.href;
    console.log("winpath", window.location.href);

    const handleUserLogin = (user: any) => {
      loggedInUser.value = user;
    };

    const logout = () => {
      console.log("clicked");
      CometChatUIKit.logout()
        ?.then(() => {
          loggedInUser.value = null;

          console.log("suc");
        })
        .catch((error) => {
          console.log(error);
        });
    };

    return { loggedInUser, logout, handleUserLogin, location };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
