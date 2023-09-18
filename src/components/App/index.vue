<template>
  <div class="app">
    <div v-if="loggedInUser" class="main">
      <button
        @click="logout"
        :style="computedStyles.logOutStyle"
        class="logout"
      >
        logout
      </button>
      <div class="chats">
        <CometChatConversationsWithMessages key="test" />
        <CometChatIncomingCall />
      </div>
    </div>
    <div v-else>
      <LoginComponent
        :loggedInUser="loggedInUser"
        @loggedInUser="handleUserLogin"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref } from "vue";
import * as Assets from "../../assets";

import LoginComponent from "../Login/index.vue";

import {
  CometChatConversationsWithMessages,
  CometChatIncomingCall,
  CometChatUIKit,
} from "@cometchat/chat-uikit-vue";

export default defineComponent({
  name: "AppComponent",

  components: {
    LoginComponent,
    CometChatConversationsWithMessages,
    CometChatIncomingCall,
  },

  setup() {
    const loggedInUser = ref<CometChat.User | null>();
    const { theme }: any = inject("theme");

    (async () => {
      await CometChatUIKit.getLoggedinUser()!
        .then((user) => {
          console.log("user", user);
          loggedInUser.value = user;
          //Login user
        })
        .catch((error) => {
          console.log("error", error);
        });
    })();

    const handleUserLogin = (user: any) => {
      loggedInUser.value = user;
    };

    const logout = () => {
      CometChatUIKit.logout()
        ?.then(() => {
          loggedInUser.value = null;
        })
        .catch((error) => {
          console.error(error);
        });
    };

    const computedStyles: any = computed(() => {
      return theme.value.palette.mode
        ? {
            logOutStyle: {
              WebkitMask: `url(${Assets.PowerSettingsNew})  center center no-repeat`,
              background: theme.value.palette.getAccent(),
              height: "34px",
              width: "34px",
              border: "1px solid red",
            },
          }
        : {};
    });

    return { loggedInUser, logout, handleUserLogin, computedStyles };
  },
});
</script>

<style>
.main {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: none;
  position: relative;
}

.chats {
  width: 100vw;
  height: 95vh;
  max-height: 95vh;
}
</style>
