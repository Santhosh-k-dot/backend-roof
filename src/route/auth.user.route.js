const express = require('express');

const User = require('../model/user.model');
const generateToken = require('../middleware/generateToken');

const router = express.Router();

// Register a new user
// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const user = new User({ email, password, username });
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({ message: 'Registration failed' });
    }
});
// Login a user

router.post('/login', async (req, res) => {

    try {



        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid password' });
        }
        // Generate token
        const token = await generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,   // Prevents client-side JavaScript from accessing the cookie
            secure: true,     // Ensures the cookie is sent only over HTTPS
            sameSite: 'strict' // Ensures the cookie is not sent along with cross-site requests
        });


        res.status(200).send({
            message: 'Login successful', token, user:
            {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role
            }
        });




    } catch (error) {
        console.error("Failed to login  :", error);
        res.status(500).json({ message: 'login Failed Try Again' });

    }
})

// logout user

router.post('/logout', async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).send({ message: 'Logout successful' });
    } catch (error) {
        console.error("Failed to logout  :", error);
        res.status(500).json({ message: 'logout Failed Try Again' });

    }

})

// Get all users

router.get('/users', async (req, res) => {

    try {

        const users = await User.find({}, 'id email role');
        res.status(200).send({ message: "Users find successfully", users });

    } catch (error) {
        console.error("Failed to get users  :", error);
        res.status(500).json({ message: 'get users Failed Try Again' });
    }

})

// Delete a user

router.delete('/users/:id', async (req, res) => {

    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send({ message: 'User deleted successfully' });
    }
    catch (error) {

        console.error("Failed to delete user  :", error);
        res.status(500).json({ message: 'delete user Failed Try Again' });

    }
})

// Update a user

router.put('/users/:id', async (req, res) => {

    try {

        const { id } = req.params;
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(id, { role }, { new: true });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send({ message: 'User updated successfully', user });

    }
    catch (error) {

        console.error("Failed to update user  :", error);
        res.status(500).json({ message: 'update user Failed Try Again' });

    }
})



module.exports = router;