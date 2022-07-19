// Create Thought model
const { Schema, model, Types } = require("mongoose");

// ReactionSchema
const ReactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: "Please enter a reaction",
      trim: true,
      maxLength: [200, "Exceeded character limit of 200"],
    },
    username: {
      type: String,
      required: "Provide your username",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

// Thought schema
const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: "Provide a thought",
      trim: true,
      maxLength: [200, "Exceeded character limit of 200"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      required: "Provide your username",
    },
    reactions: [ReactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
    versionKey: false,
  }
);

// Grab reaction count for a Thought
ThoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

// Create Thought model
const Thought = model("Thought", ThoughtSchema);

module.exports = Thought;
