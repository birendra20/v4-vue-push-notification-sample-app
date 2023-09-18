/* eslint-disable no-restricted-globals */

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { CometChat } from "@cometchat/chat-sdk-javascript";

export default async function firebaseInitialize() {
  var firebaseConfig = {
    apiKey: "AIzaSyD4_CRdM-pi7b8nj2CFBf_oM66bkNG11-k",
    authDomain: "v4-sample.firebaseapp.com",
    projectId: "v4-sample",
    storageBucket: "v4-sample.appspot.com",
    messagingSenderId: "34414941085",
    appId: "1:34414941085:web:c6983b17c0f8adc8719574",
    measurementId: "G-SW4PL4TL58",
  };

  const app = initializeApp(firebaseConfig); // Initialize Firebase App
  const messaging = getMessaging(app); // Initialize Firebase Messaging

  // Your Firebase Messaging and CometChat setup code here

  getToken(messaging, {
    vapidKey:
      "BDkz-CXEbkL9H2lMxDQvyMsBtxeTrYQUmRp1knKwEBtWcOCP6vj-RuWWMGEeX3FAcqOr4HEYUKJWoQvbV-wzNDU",
  })
    .then((currentToken) => {
      if (currentToken) {
        CometChat.registerTokenForPushNotification(currentToken)
          .then((payload) => {
            console.log("from comet", payload);
            console.log("curr token", currentToken);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });

  onMessage(messaging, function (payload) {
    const messageData = JSON.parse(payload?.data?.message!);
    const uid = messageData.sender;
    const guid = messageData?.data?.entities?.receiver?.entity?.guid;
    const callType = messageData.type;
    const receiverType = messageData.receiverType;
    const sessionid = messageData?.data?.entities?.on?.entity?.sessionid;
    const myIcon =
      messageData?.data?.entities?.sender?.entity?.avatar ||
      messageData?.data?.entities?.by?.entity?.avatar;

    var notificationTitle = payload?.data?.title;
    var notificationOptions = {
      body: `${payload?.data?.title}: ${payload?.data?.alert}`,
      icon: myIcon,
    };
    var notification = new Notification(
      notificationTitle!,
      notificationOptions
    );

    notification.onclick = function (event) {
      // Define the relative URL path for your chat page
      let chatUrl = "/chats";

      if (
        messageData.category === "call" ||
        callType === "audio" ||
        callType === "video" ||
        sessionid
      ) {
        // Add query parameters to the chat URL if necessary
        chatUrl += `?uid=${uid}&callType=${callType}&receiverType=${receiverType}&sessionid=${sessionid}`;
      } else if (guid) {
        // Add query parameters to the chat URL if 'guid' is available
        chatUrl += `?guid=${guid}`;
      } else {
        // Add query parameters to the chat URL if 'uid' is available
        chatUrl += `?uid=${uid}`;
      }

      // Open a new window with the dynamically generated chat URL
      window.open(chatUrl);

      // Close the notification
      notification.close();
    };
  });
}
