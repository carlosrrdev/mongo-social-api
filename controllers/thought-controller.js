// Create Thought model controller
const { Thought, User } = require("../models");

const thoughtController = {
  //Get all thoughts
  async getAllThoughts(req, res) {
    try {
      const response = await Thought.find().select("-__v").sort({ _id: 1 });
      res.json(response);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },

  // Get single thought using ID
  async getThoughtById({ params }, res) {
    try {
      const response = await Thought.findOne({ _id: params.thoughtId });
      if (!response) {
        res.status(404).json({ message: "No thought found with this id" });
        return;
      }
      res.json(response);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },

  // Create a thought
  createThought({ body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((response) => {
        if (!response) {
          res.status(404).json({ message: "No user found with this id" });
          return;
        }
        res.json(response);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // Update a thought
  async updateThought({ params, body }, res) {
    try {
      const response = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        body,
        { new: true, runValidators: true }
      );
      if (!response) {
        res.status(404).json({ message: "No thought found with this id" });
        return;
      }
      res.json(response);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },

  // Delete a thought
  async deleteThought({ params }, res) {
    try {
      const response = await Thought.findOneAndDelete({
        _id: params.thoughtId,
      });
      if (!response) {
        res.status(404).json({ message: "No thought found with this id" });
        return;
      }
      const userData = await User.findOneAndUpdate(
        { username: response.username },
        { $pull: { thoughts: params.thoughtId } },
        { new: true }
      );
      if (!userData) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },

  // Add a reaction
  async addReaction({ params, body }, res) {
    try {
      const response = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
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

  // Remove a thought
  async removeReaction({ params }, res) {
    try {
      const response = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
      );
      res.json(response);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },
};

module.exports = thoughtController;
