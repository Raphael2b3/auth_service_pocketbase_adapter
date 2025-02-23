import pocketbase from "pocketbase";

/** Create a new user */
export async function createUser(req, res) {
    try {
        const user = await pocketbase.collection("users").create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

/** Get all users with optional filters */
export async function getAllUsers(req, res) {
    try {
        const filters = req.query || {};
        const users = await pocketbase.collection("users").getFullList({ filter: filters });
        res.json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

/** Get a single user by ID */
export async function getUser(req, res) {
    try {
        const user = await pocketbase.collection("users").getOne(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(404).json({ error: "User not found" });
    }
}

/** Update a user */
export async function updateUser(req, res) {
    try {
        const updatedUser = await pocketbase.collection("users").update(req.params.id, req.body);
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

/** Delete a user */
export async function deleteUser(req, res) {
    try {
        await pocketbase.collection("users").delete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
