const express = require('express');
const router = express.Router();
const {body} =  require('express-validator');
const {getAllUsers, createUser, deleteUser, updateUser, getUserById} =  require('../controllers/userController');

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('date_of_birth').isDate().withMessage('Date of birth must be a valid date'),
    body('mobile_number').isMobilePhone().withMessage('Mobile number must be a valid'),
    body('address').notEmpty().withMessage('Address is required')
],createUser);
router.put(
  "/users/:id",
  [
    body("first_name").notEmpty().withMessage("First name is required"),
    body("last_name").notEmpty().withMessage("Last name is required"),
    body("date_of_birth").isDate().withMessage("Valid date of birth required"),
    body("mobile_number")
      .isMobilePhone().withMessage("Enter a valid mobile number"),
    body("address").notEmpty().withMessage("Address is required"),
  ],
  updateUser
);
router.delete('/users/:id', deleteUser);

module.exports = router;