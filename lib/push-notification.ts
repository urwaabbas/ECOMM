import User from "@/models/User";
import { getFirebaseAdminMessaging } from "@/lib/firebase-admin";

interface PushContent {
  title: string;
  message: string;
  link: string;
}

const invalidTokenCodes = new Set([
  "messaging/invalid-registration-token",
  "messaging/registration-token-not-registered",
]);

function getErrorCode(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    return String((error as { code?: unknown }).code || "");
  }

  return "";
}

export async function sendPushToUser(
  userId: string,
  content: PushContent,
) {
  try {
    const user = await User.findById(userId).select("fcmToken");

    const token =
      typeof user?.fcmToken === "string" ? user.fcmToken.trim() : "";

    if (!token) {
      console.log("User push skipped: no FCM token found");
      return false;
    }

    await getFirebaseAdminMessaging().send({
      token,
      data: {
        title: content.title,
        body: content.message,
        link: content.link,
      },
      webpush: {
        headers: {
          Urgency: "high",
        },
      },
    });

    console.log("User push sent successfully");
    return true;
  } catch (error) {
    const code = getErrorCode(error);

    if (invalidTokenCodes.has(code)) {
      await User.findByIdAndUpdate(userId, {
        $set: { fcmToken: null },
      });
    }

    console.error("User push failed:", error);
    return false;
  }
}

export async function sendPushToAdmins(content: PushContent) {
  try {
    const admins = await User.find({
      role: "admin",
      fcmToken: {
        $exists: true,
        $type: "string",
        $ne: "",
      },
    }).select("fcmToken");

    const tokens = admins
      .map((admin) =>
        typeof admin.fcmToken === "string"
          ? admin.fcmToken.trim()
          : "",
      )
      .filter((token): token is string => token.length > 0);

    if (tokens.length === 0) {
      console.log("Admin push skipped: no FCM tokens found");
      return {
        successCount: 0,
        failureCount: 0,
      };
    }

    const response =
      await getFirebaseAdminMessaging().sendEachForMulticast({
        tokens,
        data: {
          title: content.title,
          body: content.message,
          link: content.link,
        },
        webpush: {
          headers: {
            Urgency: "high",
          },
        },
      });

    const invalidTokens = response.responses
      .map((result, index) => {
        const code = getErrorCode(result.error);
        return invalidTokenCodes.has(code) ? tokens[index] : null;
      })
      .filter((token): token is string => Boolean(token));

    if (invalidTokens.length > 0) {
      await User.updateMany(
        { fcmToken: { $in: invalidTokens } },
        { $set: { fcmToken: null } },
      );
    }

    console.log(
      `Admin push sent: ${response.successCount} successful, ${response.failureCount} failed`,
    );

    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  } catch (error) {
    console.error("Admin push failed:", error);

    return {
      successCount: 0,
      failureCount: 1,
    };
  }
}
