const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

class Doll {
  constructor(dollId, dollType, description, imageUrl, price, veteranId) {
    this.dollId = dollId;
    this.dollType = dollType;
    this.description = description;
    this.imageUrl = imageUrl;
    this.price = price;
    this.veteranId = veteranId;
  }
}

class Transaction {
  constructor(transactionId, customerName, dollType, shippingAddress, paymentDetails, transactionAmount) {
    this.transactionId = transactionId;
    this.customerName = customerName;
    this.dollType = dollType;
    this.shippingAddress = shippingAddress;
    this.paymentDetails = paymentDetails;
    this.transactionAmount = transactionAmount;
    this.timestamp = new Date().toISOString();
  }
}

class Veteran {
  constructor(veteranId, name, medicalNeeds, rehabilitationDetails, donationAllocation) {
    this.veteranId = veteranId;
    this.name = name;
    this.medicalNeeds = medicalNeeds;
    this.rehabilitationDetails = rehabilitationDetails;
    this.donationAllocation = donationAllocation;
  }
}

class TildaDollsApp {
  constructor() {
    this.app = express();
    this.port = 3000;

    // Database
    this.dolls = [];
    this.transactions = [];
    this.veterans = [];
    this.jointAccount = 0;

    // Middleware
    this.app.use(this.loggerMiddleware);
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(session({ secret: 'your_secret_key', resave: true, saveUninitialized: true }));
    this.app.use(this.errorHandlerMiddleware);

    // Routes
    this.app.get('/', this.homePage.bind(this));
    this.app.get('/dolls', this.dollSelection.bind(this));
    this.app.post('/purchase', this.authenticateMiddleware.bind(this), this.purchaseDoll.bind(this));
    this.app.get('/order/:transactionNumber', this.authenticateMiddleware.bind(this), this.orderConfirmationPage.bind(this));
    this.app.get('/track-impact', this.authenticateMiddleware.bind(this), this.veteranAllocationTable.bind(this));
    this.app.get('/how-it-works', this.howItWorks.bind(this));

    // Server
    this.app.listen(this.port, () => {
      console.log(`Tilda Dolls for Veterans server listening at http://localhost:${this.port}`);
    });
  }

  // Middleware
  loggerMiddleware(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  }

  authenticateMiddleware(req, res, next) {
    const isAuthenticated = req.session && req.session.user;

    if (isAuthenticated) {
      next();
    } else {
      res.status(401).send('Unauthorized. Please login.');
    }
  }

  errorHandlerMiddleware(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
  }

    // Routes
  exposeDolls(req, res) {
    res.json(this.dolls);
  }

  exposeTransactions(req, res) {
    res.json(this.transactions);
  }

  exposeVeterans(req, res) {
    res.json(this.veterans);
  }
  homePage(req, res) {
    res.send('Welcome to Tilda Dolls for Veterans');
  }

  dollSelection(req, res) {
    res.json(this.dolls);
  }

  purchaseDoll(req, res) {
    const { dollType, shippingAddress, paymentDetails } = req.body;

const tildaDollsApp = new TildaDollsApp();
tildaDollsApp.app.get('/api/dolls', tildaDollsApp.exposeDolls.bind(tildaDollsApp));
tildaDollsApp.app.get('/api/transactions', tildaDollsApp.exposeTransactions.bind(tildaDollsApp));
tildaDollsApp.app.get('/api/veterans', tildaDollsApp.exposeVeterans.bind(tildaDollsApp));
    // Validate and process payment
    // Update jointAccount with the payment amount
    this.jointAccount += /* Process payment amount */;

    // Add a record to transactions
    const transactionId = this.transactions.length + 1;
    const transaction = new Transaction(transactionId, req.session.user, dollType, shippingAddress, paymentDetails, /* Processed payment amount */);
    this.transactions.push(transaction);

    // Add or update veteran information
    const veteranId = /* Get veteran ID associated with dollType */;
    const existingVeteran = this.veterans.find(v => v.veteranId === veteranId);
    if (existingVeteran) {
      existingVeteran.donationAllocation += /* Processed payment amount */;
    } else {
      const veteran = new Veteran(veteranId, /* Veteran name */, /* Veteran medical needs */, /* Veteran rehabilitation details */, /* Processed payment amount */);
      this.veterans.push(veteran);
    }

    // Redirect to order confirmation page
    res.redirect(`/order/${transactionId}`);
  }

  orderConfirmationPage(req, res) {
    const transactionId = parseInt(req.params.transactionNumber);
    const transaction = this.transactions.find(t => t.transactionId === transactionId);
    res.json(transaction);
  }

  veteranAllocationTable(req, res) {
    res.json(this.veterans);
  }

  howItWorks(req, res) {
    res.send('How it Works');
  }
}

// Create an instance of the TildaDollsApp class to start the application
const tildaDollsApp = new TildaDollsApp();
