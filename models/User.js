// Create User model
const { Schema, model } = require("mongoose");

// User Schema
const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: "Please provide a username",
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: "Please provide a valid email address",
      validate: {
        validator(validEmail) {
          return /^([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z]{2,6})(\.[a-z]{2,6})?$/.test(
            validEmail
          );
        },
        message: "Enter a valid email address",
      },
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
    versionKey: false,
  }
);

// Grab friend count
UserSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

// Create User model
const User = model("User", UserSchema);

module.exports = User;
