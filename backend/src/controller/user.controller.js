import { getAuth, clerkClient } from "@clerk/express";
import User from "../modal/user.modal.js";

/**
 * POST /api/user/sync
 *
 * Called from the mobile app after Clerk sign-in.
 * Verifies the Clerk session via requireAuth(), then upserts
 * the user record in MongoDB so we have a local copy.
 */
export const syncUser = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    // Fetch full Clerk user profile
    const clerkUser = await clerkClient.users.getUser(userId);

    const email =
      clerkUser.emailAddresses?.[0]?.emailAddress ?? "";
    const name =
      `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() ||
      email.split("@")[0];
    const avatar = clerkUser.imageUrl ?? "";
    const phone = clerkUser.phoneNumbers?.[0]?.phoneNumber ?? "";

    // Upsert: create user if new, update profile fields if returning
    const user = await User.findOneAndUpdate(
      { clerkUserId: userId },
      {
        $set: {
          email,
          name,
          avatar,
          phone,
        },
        $setOnInsert: { clerkUserId: userId },
      },
      { upsert: true, new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        clerkUserId: user.clerkUserId,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("[syncUser] Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

/**
 * GET /api/user/me
 *
 * Returns the current user's stored profile from MongoDB.
 */
export const getMe = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    const user = await User.findOne({ clerkUserId: userId }).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found. Call /sync first." });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("[getMe] Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};
