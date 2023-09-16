<template>
  <div class="home">
    <AppComponent></AppComponent>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import LoginComponent from "../components/Login/index.vue";
import AppComponent from "../components/App/index.vue";
// import "@cometchat/chat-uikit-vue/dist/style.css";

import {
  CometChatConversationsWithMessages,
  CometChatUIKit,
} from "@cometchat/chat-uikit-vue";
export default defineComponent({
  name: "HomeView",
  components: {
    AppComponent,
    // LoginComponent,
    // ChatView,
    // CometChatConversationsWithMessages
  },

  setup() {
    const loggedInUser = ref<CometChat.User | null>();
    console.log("HOME TRIGRGGR");
    // (async () => {
    //   await CometChatUIKit.getLoggedinUser()!
    //     .then((user) => {
    //       console.log("user", user);
    //       loggedInUser.value = user;
    //       //Login user
    //     })
    //     .catch((error) => {
    //       console.log("error");
    //     });
    // })();

    console.log("loggedInUser", loggedInUser.value);

    const logout = () => {
      console.log("clicked");
      CometChatUIKit.logout()
        ?.then(() => {
          console.log("suc");
        })
        .catch((error) => {
          console.log(error);
        });
    };

    return { loggedInUser, logout };
  },
});
</script>

<style>
/* .home {
  width: 100vh;
  height: 100vh;
  border: 1px solid red;
} */
</style>
