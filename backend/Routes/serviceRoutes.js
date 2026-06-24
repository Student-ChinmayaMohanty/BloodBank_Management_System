const express = require('express');
const router = express.Router();

const ServiceController = require('../Controllers/ServiceController');
const DonorController = require('../Controllers/DonorController');
const ContactController = require('../Controllers/ContactController');
const SubscriberController = require('../Controllers/SubscriberController');
const AdminController = require('../Controllers/AdminController');

const serviceController = new ServiceController();
const donorController = new DonorController();
const contactController = new ContactController();
const subscriberController = new SubscriberController();
const adminController = new AdminController();

// Admin auth routes
router.post('/admin/signup', adminController.signup);
router.post('/admin/login', adminController.login);


// Service routes
router.get('/services', serviceController.getData);

// Donor request routes
router.post('/donor-requests', donorController.createDonorRequest);
router.get('/donor-requests', donorController.getDonors);
router.get('/donor-requests/all', donorController.getAllDonorRequests);
router.put('/donor-requests/:id', donorController.updateRequestStatus);
router.delete('/donor-requests/:id', donorController.deleteRequest);

// Contact message routes
router.post('/contacts', contactController.createMessage);

// Subscriber routes
router.post('/subscribers', subscriberController.subscribe);

module.exports = router;