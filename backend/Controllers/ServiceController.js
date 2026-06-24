const Service = require('../Models/service');

class ServiceController {
    getData = async (req, res) => {
        try {
            // Count existing services; if empty, seed default ones
            let services = await Service.findAll();
            if (services.length === 0) {
                const defaultServices = [
                    { name: 'Blood Donation', img: 'help.png', status: true },
                    { name: 'Blood Search', img: 'help.png', status: true },
                    { name: 'Emergency Request', img: 'help.png', status: true },
                    { name: 'Health Screening', img: 'help.png', status: true }
                ];
                await Service.bulkCreate(defaultServices);
                services = await Service.findAll();
                console.log('Seeded default services.');
            }
            res.json({ status: true, message: 'success', data: services });
        } catch (err) {
            console.error('Error fetching services:', err.message);
            res.status(500).json({ status: false, message: err.message });
        }
    }
}

module.exports = ServiceController;
