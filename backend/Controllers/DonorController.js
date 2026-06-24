const DonorRequest = require('../Models/donorRequest');

class DonorController {
    createDonorRequest = async (req, res) => {
        try {
            const { name, email, mobile, bloodGroup, remarks } = req.body;

            // Simple validations
            if (!name || !email || !mobile || !bloodGroup) {
                return res.status(400).json({ status: false, message: 'All mandatory fields must be filled.' });
            }

            const newRequest = await DonorRequest.create({
                name,
                email,
                mobile,
                bloodGroup,
                remarks
            });

            res.status(201).json({
                status: true,
                message: 'Donor request submitted successfully!',
                data: newRequest
            });
        } catch (err) {
            console.error('Error creating donor request:', err.message);
            res.status(500).json({ status: false, message: err.message });
        }
    }

    getDonors = async (req, res) => {
        try {
            const donors = await DonorRequest.findAll({
                where: { status: true },
                order: [['createdAt', 'DESC']]
            });
            res.json({ status: true, message: 'success', data: donors });
        } catch (err) {
            console.error('Error fetching donors:', err.message);
            res.status(500).json({ status: false, message: err.message });
        }
    }

    getAllDonorRequests = async (req, res) => {
        try {
            const requests = await DonorRequest.findAll({
                order: [['createdAt', 'DESC']]
            });
            res.json({ status: true, message: 'success', data: requests });
        } catch (err) {
            console.error('Error fetching all requests:', err.message);
            res.status(500).json({ status: false, message: err.message });
        }
    }

    updateRequestStatus = async (req, res) => {
        try {
            const { id } = req.params;
            const request = await DonorRequest.findByPk(id);
            if (!request) {
                return res.status(404).json({ status: false, message: 'Request not found' });
            }

            // Toggle active status
            request.status = !request.status;
            await request.save();

            res.json({
                status: true,
                message: `Status updated successfully! Request is now ${request.status ? 'Active' : 'Processed'}.`,
                data: request
            });
        } catch (err) {
            console.error('Error updating status:', err.message);
            res.status(500).json({ status: false, message: err.message });
        }
    }

    deleteRequest = async (req, res) => {
        try {
            const { id } = req.params;
            const request = await DonorRequest.findByPk(id);
            if (!request) {
                return res.status(404).json({ status: false, message: 'Request not found' });
            }

            await request.destroy();
            res.json({ status: true, message: 'Donor request deleted successfully!' });
        } catch (err) {
            console.error('Error deleting request:', err.message);
            res.status(500).json({ status: false, message: err.message });
        }
    }
}

module.exports = DonorController;
