const ContactMessage = require('../Models/contactMessage');

class ContactController {
    createMessage = async (req, res) => {
        try {
            const { name, email, mobile, message } = req.body;

            if (!name || !email || !mobile || !message) {
                return res.status(400).json({ status: false, message: 'All fields are required.' });
            }

            const newMessage = await ContactMessage.create({
                name,
                email,
                mobile,
                message
            });

            res.status(201).json({
                status: true,
                message: 'Your message has been received! We will contact you soon.',
                data: newMessage
            });
        } catch (err) {
            console.error('Error saving contact message:', err.message);
            res.status(500).json({ status: false, message: err.message });
        }
    }
}

module.exports = ContactController;
