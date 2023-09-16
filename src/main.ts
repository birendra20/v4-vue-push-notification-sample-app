import { createApp, ref } from "vue";
import App from "./App.vue";
import router from "./router";
import { UIKitSettingsBuilder } from "@cometchat/uikit-shared";
import { CometChatTheme, CometChatUIKit } from "@cometchat/chat-uikit-vue";
import { CometChatConstants } from "./const";
import firebaseInitialize from "./firebase";
import { Utils } from "./utils/Utils";
import "@cometchat/chat-uikit-vue/dist/style.css";

// createApp(App).use(router).mount("#app");

(async () => {
  const uiKitSettings = new UIKitSettingsBuilder()
    .setAppId(CometChatConstants.appId)
    .setRegion(CometChatConstants.region)
    .setAuthKey(CometChatConstants.authKey)
    .subscribePresenceForFriends()
    .build();

  try {
    await CometChatUIKit.init(uiKitSettings);
    console.log("Initialization completed successfully");

    const app = createApp(App);

    // createApp(App).use(router).mount("#app");
    askPermission();

    function switchView() {
      console.log("CHECK RESIZE: ", isMobileView.value);
      if (window.innerWidth >= 320 && window.innerWidth <= 760) {
        console.log("IS MOBILE TRUE");
        isMobileView.value = true;
      } else {
        console.log("IS MOBILE FALSE");
        isMobileView.value = false;
      }
    }

    function switchThemeMode() {
      if (theme.value.palette.mode == "dark") {
        theme.value.palette.setMode("light");
      } else {
        theme.value.palette.setMode("dark");
      }
    }
    const theme: any = ref(new CometChatTheme({}));
    const isMobileView: any = ref(false);
    app.provide("theme", { theme, switchThemeMode });
    app.provide("isMobileView", { isMobileView, switchView });
    Utils.theme = theme.value;

    app.use(router).mount("#app");

    firebaseInitialize();
  } catch (error) {
    console.log("Initialization failed with error:", error);
  }
})();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then(function (registration) {
      console.log("Registration successful, scope is:", registration.scope);
    })
    .catch((error) => console.log("Registration error", error));
}

async function askPermission() {
  return new Promise(function (resolve, reject) {
    const permissionResult = Notification.requestPermission(function (result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then(function (permissionResult) {
    if (permissionResult !== "granted") {
      throw new Error("We weren't granted permission.");
    }
  });
}
