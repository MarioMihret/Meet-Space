import { IAgoraRTCClient } from "agora-rtc-sdk-ng";

// Agora App Configuration
export const agoraConfig = {
  appId: "f9703cf9a9884bd7a0254ee2cf088150",
  token:
    "007eJxTYNhVPU0iT6x5E3tTz0eTU0Wm9w3nLw4z5kwvD1xp55V9plaBIc3S3MA4Oc0y0dLCwiQpxTzRwMjUJDXVKDnNwMLC0NTgX65NekMgI8Nk83lMjAwQCOKzMxQU5WelJpcwMAAAPLYfOw==",
  channel: "project",
  certificate: "da44aa03d88a449db087e0ac233dc39d",
};

export const initializeAgoraClient = async (
  client: IAgoraRTCClient,
  channelName: string
) => {
  if (!agoraConfig.appId) {
    throw new Error("Agora App ID is not configured");
  }

  try {
    // Always use the default channel name if none provided
    const channel = channelName || agoraConfig.channel;

    // Join the channel with the provided credentials
    await client.join(agoraConfig.appId, channel, agoraConfig.token, null);

    console.log("Successfully joined Agora channel:", channel);
  } catch (error: any) {
    console.error("Failed to join Agora channel:", error);

    if (error.code === "CAN_NOT_GET_GATEWAY_SERVER") {
      throw new Error(
        "Failed to connect to Agora servers. Please check your App ID and token."
      );
    } else if (error.code === "INVALID_OPERATION") {
      throw new Error(
        "Invalid operation. Please check your token and channel name."
      );
    } else if (error.code === "DYNAMIC_KEY_TIMEOUT") {
      throw new Error("Token has expired. Please refresh the token.");
    } else {
      throw new Error(
        error.message || "Failed to join the meeting. Please try again."
      );
    }
  }
};

export const leaveAgoraChannel = async (client: IAgoraRTCClient) => {
  if (!client) return;

  try {
    await client.leave();
    console.log("Successfully left Agora channel");
  } catch (error) {
    console.error("Error leaving Agora channel:", error);
    throw new Error("Failed to leave the meeting properly");
  }
};
