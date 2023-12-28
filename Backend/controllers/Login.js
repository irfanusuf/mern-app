const User = require('./UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;


        const isUser = await User.findOne({ email });

        if (email !== '' && password !== '') {
            if (isUser) {
                const passVerify = await bcrypt.compare(password, isUser.password);

                if (passVerify) {
                 
                    const token = jwt.sign({ userId: isUser._id, email: isUser.email }, `${secretKey}` , {
                        expiresIn: '1h', 
                    });

                    res.status(200).json({ message: 'Logged In Successfully' , token });
                } else {
                    res.json({ message: 'Password Does Not Match' });
                }
            } else {
                res.json({ message: 'User Not Found' });
            }
        } else {
            res.json({ message: 'All Credentials Required' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = handleLogin;
