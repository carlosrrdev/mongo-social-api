const router = require("express").Router();
const {
  addReaction,
  createThought,
  deleteThought,
  getAllThoughts,
  getThoughtById,
  removeReaction,
  updateThought,
} = require("../../controllers/thought-controller");

// Create thoughts routes
router.route("/").get(getAllThoughts).post(createThought);
router
  .route("/:thoughtId")
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);
router.route("/:thoughtId/reactions").post(addReaction);
router.route("/:thoughtId/reactions/:reactionId").delete(removeReaction);

module.exports = router;
