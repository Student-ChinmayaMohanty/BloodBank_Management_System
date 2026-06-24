const Admin = require('../Models/admin');

class AdminController {
    signup = async (req, res) => {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ status: false, message: 'All fields are required.' });
            }

            // Check if admin already exists
            const existing = await Admin.findOne({ where: { email } });
            if (existing) {
                return res.status(400).json({ status: false, message: 'An account with this email already exists.' });
            }

            const newAdmin = await Admin.create({ name, email, password });
            res.status(201).json({ 
                status: true, 
                message: 'Admin account created successfully!', 
                data: { id: newAdmin.id, name: newAdmin.name, email: newAdmin.email } 
            });
        } catch (err) {
            console.error('Signup error:', err.message);
            res.status(500).json({ status: false, message: err.message });
        }
    }

    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ status: false, message: 'Email and password are required.' });
            }

            const admin = await Admin.findOne({ where: { email } });
            if (!admin || admin.password !== password) {
                return res.status(401).json({ status: false, message: 'Invalid email or password.' });
            }

            res.json({ 
                status: true, 
                message: 'Login successful!', 
                data: { id: admin.id, name: admin.name, email: admin.email } 
            });
        } catch (err) {
            console.error('Login error:', err.message);
            res.status(500).json({ status: false, message: err.message });
        }
    }

}

module.exports = AdminController;
