const router = require("express").Router();
const {
  createNewTransferController,
  getTransferByIdController,
  getAllTransfers
} = require("../controllers/transferController");
const checkAuth = require("../middlewares/authMiddleware");

router.get("/", checkAuth, getAllTransfers);

// get invoice by id
router.get("/single-invoice/:id", checkAuth, getTransferByIdController);

// create new invoice
router.post("/", checkAuth, createNewTransferController);

module.exports = router;
