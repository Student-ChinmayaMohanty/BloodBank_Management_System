const Subscriber = require('../Models/subscriber');

class SubscriberController {
    subscribe = async (req, res) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ status: false, message: 'Email address is required.' });
            }

            // Check if already subscribed
            const existing = await Subscriber.findOne({ where: { email } });
            if (existing) {
                return res.status(200).json({ status: true, message: 'You are already subscribed!' });
            }

            const newSubscriber = await Subscriber.create({ email });

            res.status(201).json({
                status: true,
                message: 'Thank you for subscribing to our newsletter!',
                data: newSubscriber
            });
        } catch (err) {
            console.error('Error in newsletter subscription:', err.message);
            res.status(500).json({ status: false, message: err.message });
        }
    }
}

module.exports = SubscriberController;
