import Admin from "../services/firebase/firebaseConfig.js";

export const verifyOuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = await Admin.auth().verifyIdToken(token);
    console.log(decoded);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
