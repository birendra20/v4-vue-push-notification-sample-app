<template>
  <div class="Main">
    <div v-if="chatWithUser && queryParams">
      <div ref="myElementRef" v-if="isCallAccepted" class="chats"></div>
      <div v-else class="chats">
        <CometChatMessages :user="chatWithUser"></CometChatMessages>

        <CometChatIncomingCall
          v-if="callObject"
          :call="callObject"
          :onAccept="
            () => queryParams.sessionid && acceptCall(queryParams.sessionid)
          "
          :onDecline="
            () => queryParams.sessionid && cancelCall(queryParams.sessionid)
          "
        />
      </div>
    </div>
    <div v-if="chatWithGroup && queryParams">
      <div ref="myElementRef" v-if="isCallAccepted" class="chats"></div>
      <div>
        <CometChatMessages :group="chatWithGroup"></CometChatMessages>
        <CometChatIncomingCall
          v-if="callObject"
          :call="callObject"
          :onAccept="
            () => queryParams.sessionid && acceptCall(queryParams.sessionid)
          "
          :onDecline="
            () => queryParams.sessionid && cancelCall(queryParams.sessionid)
          "
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, reactive, ref } from "vue";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { useRoute, useRouter } from "vue-router";
import { CometChatCalls } from "@cometchat/calls-sdk-javascript";

import {
  CometChatIncomingCall,
  CometChatMessages,
  CometChatUIKit,
} from "@cometchat/chat-uikit-vue";

export default defineComponent({
  components: {
    CometChatMessages,
    CometChatIncomingCall,
  },
  async setup() {
    let chatWithUser = ref<CometChat.User>();
    let chatWithGroup = ref<CometChat.Group>();
    let callObject = ref<CometChat.Call>();
    const loggedInUser = ref<CometChat.User | undefined | null>();
    const myElementRef = ref(null);
    const isCallAccepted = ref(false);

    const route = useRoute();
    const router = useRouter();

    const queryParams = reactive(route.query);

    let { uid, callType, guid, sessionid, receiverType } = queryParams;

    onMounted(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(searchParams.entries());

      if (Object.keys(params).length > 0) {
        // Remove the query parameters from the URL without affecting the browser history
        const urlWithoutQueryParams = window.location.href.replace(
          window.location.search,
          ""
        );
        window.history.replaceState({}, document.title, urlWithoutQueryParams);
      }

      Object.assign(queryParams, params);
    });

    const initializeUserAndListeners = async () => {
      await CometChatUIKit.getLoggedinUser()!
        .then((user) => {
          console.log("user", user);
          loggedInUser.value = user;
          //Login user
        })
        .catch((error) => {
          console.log("error");
        });

      if (uid) {
        await CometChat.getUser(uid)
          .then((user: CometChat.User) => {
            chatWithUser.value = user;
          })
          .catch((error: any) => {
            console.log("user does not exit", error);
          });
      }

      if (guid) {
        await CometChat.getGroup(guid)
          .then((group: CometChat.Group) => {
            chatWithGroup.value = group;
          })
          .catch((error: any) => {
            console.log("user does not exit", error);
          });
      }

      if (uid && callType && receiverType) {
        let call: CometChat.Call = new CometChat.Call(
          uid,
          callType,
          receiverType
        );
        if (call) {
          callObject.value = call;
        }
      }
    };

    const acceptCall = async (sessionid: any) => {
      await CometChat.acceptCall(sessionid).then(
        async (call: any) => {
          isCallAccepted.value = true;
          // setIsCallAccepted(true);
          callObject.value = undefined;
          // setCallObject(undefined);

          let CurrentSessionId = call.sessionId;
          const authToken: string = loggedInUser.value?.getAuthToken()!;
          let callToken = await CometChatCalls.generateToken(
            CurrentSessionId,
            authToken
          );
          let isAudioOnly = callType === "audio" || call.type === "audio";
          const callSettings = new CometChatCalls.CallSettingsBuilder()
            .enableDefaultLayout(true)
            .setIsAudioOnlyCall(isAudioOnly)
            .setCallListener(
              new CometChatCalls.OngoingCallListener({
                onUserListUpdated: (userList: any) => {
                  console.log("user list:", userList);
                },

                onCallEndButtonPressed: () => {
                  CometChatCalls.endSession();
                  CometChat.endCall(CurrentSessionId);

                  router.push({ path: "/" });
                },
                onCallEnded: () => {
                  console.log("Call ended");

                  CometChatCalls.endSession();
                  CometChat.endCall(CurrentSessionId);
                  router.push({ path: "/" });
                },

                onError: (error: any) => {
                  console.log("Error :", error);
                },
                onMediaDeviceListUpdated: (deviceList: any) => {
                  console.log("Device List:", deviceList);
                },
                onUserMuted: (event: any) => {
                  // This event will work in JS SDK v3.0.2-beta1 & later.
                  console.log("Listener => onUserMuted:", {
                    userMuted: event.muted,
                    userMutedBy: event.mutedBy,
                  });
                },
                onScreenShareStarted: () => {
                  // This event will work in JS SDK v3.0.3 & later.
                  console.log("Screen sharing started.");
                },
                onScreenShareStopped: () => {
                  // This event will work in JS SDK v3.0.3 & later.
                  console.log("Screen sharing stopped.");
                },
                onCallSwitchedToVideo: (event: any) => {
                  // This event will work in JS SDK v3.0.8 & later.
                  console.log("call switched to video:", {
                    sessionId: event.sessionId,
                    callSwitchInitiatedBy: event.initiator,
                    callSwitchAcceptedBy: event.responder,
                  });
                },
                onUserJoined: (user: any) =>
                  console.log("event => onUserJoined", user),
                onUserLeft: (user: any) => {
                  console.log("event => onUserLeft", user);
                },
              })
            )
            .build();

          const htmlElement = myElementRef.value;
          CometChatCalls.startSession(
            callToken.token,
            callSettings,
            htmlElement!
          );
        },
        (error: any) => {
          console.log("Call acceptance failed with error", error);
        }
      );
    };

    const cancelCall = async (sessionid: string) => {
      // setCallObject(undefined);
      let status: string = CometChat.CALL_STATUS.REJECTED;
      callObject.value = undefined;

      await CometChat.rejectCall(sessionid, status).then(
        (call: CometChat.Call) => {
          console.log("Call rejected successfully", call);
        },
        (error: CometChat.Call) => {
          console.log("Call rejection failed with error:", error);
        }
      );
    };

    const callListeners = () => {
      let listnerID = "UNIQUE ID";
      CometChat.addCallListener(
        listnerID,
        new CometChat.CallListener({
          onIncomingCallReceived: (call: CometChat.Call) => {
            console.log("Incoming call:", call);
          },
          onOutgoingCallAccepted: (call: CometChat.Call) => {
            console.log("Outgoing call accepted:", call);
          },
          onOutgoingCallRejected: (call: CometChat.Call) => {
            console.log("Outgoing call rejected:", call);
          },
          onIncomingCallCancelled: (call: CometChat.Call) => {
            console.log("Incoming call cancelled:", call);
          },
          onCallEndedMessageReceived: (call: CometChat.Call) => {
            console.log("CallEnded Message:", call);
          },
        })
      );
    };

    onBeforeMount(() => {
      callListeners();
      initializeUserAndListeners();
    });

    return {
      chatWithUser,
      chatWithGroup,
      callObject,
      acceptCall,
      cancelCall,
      sessionid,
      myElementRef,
      isCallAccepted,
      queryParams,
    };
  },
});
</script>

<style scoped>
.chats {
  width: 100vw;
  height: 100vh;
  max-height: 100vh !important;
}
</style>
