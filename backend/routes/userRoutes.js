const express = require('express');
const router = express.Router();
const {getAllUsers, createUser, deleteUser, updateUser} =  require('../controllers/userController');

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;