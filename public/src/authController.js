import PocketBase from "pocketbase";
import dotenv from "dotenv";

dotenv.config();

const pb = new PocketBase(process.env.POCKETBASE_URL);

export const authController = {
  async register(req, res) {
    try {
      const { id, password, passwordConfirm } = req.body;

      const data = {
        password: password,
        passwordConfirm: passwordConfirm,
        email: id,
        emailVisibility: false,
        verified: false,
        role: "read-write", //admin
      };
      const user = await pb.collection("users").create(data);
      res.json({ token: user.token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { id, password } = req.body;
      const authData = await pb
        .collection("users")
        .authWithPassword(id, password);
      res.json({ token: authData.token });
    } catch (error) {
      res.status(401).json({ error: "Invalid credentials" });
    }
  },

  async logout(req, res) {
    pb.authStore.clear();
    res.json({ message: "Logged out" });
  },

  async verifyAccess(req, res) {
    if (pb.authStore.isValid) {
      res.json({ hasAccess: true });
    } else {
      res.status(401).json({ hasAccess: false });
    }
  },

  async getUserData(req, res) {
    try {
      if (!pb.authStore.isValid)
        return res.status(401).json({ error: "Unauthorized" });
      const user = await pb.collection("users").getOne(pb.authStore.record.id);
      res.json({ data: user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateUserData(req, res) {
    try {
      if (!pb.authStore.isValid)
        return res.status(401).json({ error: "Unauthorized" });
      const updatedUser = await pb
        .collection("users")
        .update(pb.authStore.record.id, req.body);
      res.json({ message: "Updated successfully", data: updatedUser });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async verifyUser(req, res) {
    res.json({ verified: pb.authStore.isValid });
  },

  async refreshToken(req, res) {
    if (!pb.authStore.isValid)
      return res.status(401).json({ error: "Unauthorized" });
    res.json({ token: pb.authStore.token });
  },

  async unregister(req, res) {
    try {
      if (!pb.authStore.isValid)
        return res.status(401).json({ error: "Unauthorized" });
      await pb.collection("users").delete(pb.authStore.record.id);
      pb.authStore.clear();
      res.json({ message: "User deleted" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async passwordReset(req, res) {
    try {
      const { id } = req.body;
      await pb.collection("users").requestPasswordReset(id);
      res.json({ message: "Reset link sent" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};
