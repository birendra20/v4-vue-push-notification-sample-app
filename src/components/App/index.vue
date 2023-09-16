<template>
  <div class="home">
    <div v-if="loggedInUser">
      <button @click="logout">logout</button>
      <CometChatConversationsWithMessages key="test" />
      <!-- <CometChatIncomingCall v-if="callObject" :call="callObject" /> -->
      <CometChatIncomingCall />
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
import { defineComponent, ref } from "vue";
import { CometChat } from "@cometchat/chat-sdk-javascript";

// import "@cometchat/chat-uikit-vue/dist/style.css";
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
    let callObject = ref<CometChat.Call>();

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

    console.log("redirected??????????????????????????????????????");

    console.log("loggedInUser", loggedInUser.value);
    console.log("first");
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

    let uid = "superhero3";
    let callType = "audio";
    let receiverType = "user";

    if (uid && callType && receiverType) {
      var call: CometChat.Call = new CometChat.Call(
        uid,
        callType,
        receiverType
      );
      if (call) {
        callObject.value = call;
      }
    }

    return { loggedInUser, logout, handleUserLogin, callObject };
  },
});
</script>
