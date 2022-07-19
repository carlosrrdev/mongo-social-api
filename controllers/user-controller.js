// Create User model controller
const { User, Thought } = require("../models");

const userController = {
  // Get all users
  async getAllUsers(req, res) {
    try {
      const response = await User.find()
        .populate({ path: "thoughts", select: "-__v" })
        .populate({
          path: "friends",
          select: "-__v",
        });
      res.json(response);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },

  // Get single user by ID
  async getUserById({ params }, res) {
    try {
      const response = await User.findOne({ _id: params.userId })
        .populate({
          path: "friends",
          select: "-__v",
        })
        .populate({
          path: "thoughts",
          select: "-__v",
        });
      if (!response) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(response);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },

  // Create a new User
  async createUser({ body }, res) {
    try {
      const response = await User.create(body);
      res.json(response);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },

  // Update a User
  async updateUser({ params, body }, res) {
    try {
      const response = await User.findOneAndUpdate(
        {
          _id: params.userId,
        },
        body,
        { new: true, runValidators: true }
      );
      if (!response) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(response);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },

  // Delete a User
  async deleteUser({ params }, res) {
    try {
      const response = await User.findOneAndDelete({ _id: params.userId });
      if (!response) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      // Remove the user from others friends list
      await User.updateMany(
        { _id: { $in: response.friends } },
        { $pull: { friends: params.userId } }
      );
      // Remove Thoughts associated with the user
      await Thought.deleteMany({ username: response.username });

      res.json({ message: "Successfully deleted user" });
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },

  // Add a user to friends list
  async addFriend({ params }, res) {
    try {
      const response = await User.findOneAndUpdate(
        { _id: params.userId },
        { $addToSet: { friends: params.friendId } },
        { new: true, runValidators: true }
      );
      if (!response) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(response);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },

  // Remove a user from friends list
  async removeFriend({ params }, res) {
    try {
      const response = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true }
      );
      if (!response) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(response);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },
};

module.exports = userController;
