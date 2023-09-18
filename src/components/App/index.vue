<template>
  <div class="app">
    <div v-if="loggedInUser" class="main">
      <div class="tooltip">
        <button
          @click="logout"
          :style="computedStyles.logOutStyle"
          class="logout"
        ></button>
        <span class="tooltiptext">Logout</span>
      </div>

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
  props: {
    tooltipText: {
      type: String,
      default: "Tooltip text",
    },
    position: {
      default: "top",
      type: String,
    },
  },

  setup() {
    const loggedInUser = ref<CometChat.User | null>();
    const { theme }: any = inject("theme");
    const showText = ref(false);

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

    return { loggedInUser, logout, handleUserLogin, computedStyles, showText };
  },
});
</script>

<style scoped>
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

.logout {
  position: relative;
  cursor: pointer;
}

.tooltip {
  width: fit-content;
  position: relative;
  right: 0;
  flex-direction: row-reverse;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
