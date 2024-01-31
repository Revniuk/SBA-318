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

class Database {
  constructor() {
    this.dolls = [];
    this.transactions = [];
    this.veterans = [];
    this.jointAccount = 0;
  }

  addDoll(doll) {
    this.dolls.push(doll);
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
  }

  addOrUpdateVeteran(veteran) {
    const existingVeteran = this.veterans.find(v => v.veteranId === veteran.veteranId);
    if (existingVeteran) {
      existingVeteran.donationAllocation += veteran.donationAllocation;
    } else {
      this.veterans.push(veteran);
    }
  }
    //Filter dolls based on query parameters
  getFilteredDolls(queryParams) {
    let filteredDolls = [...this.dolls];
    
    // Filter by doll type if query parameter is provided
    if (queryParams.dollType) {
      filteredDolls = filteredDolls.filter(doll => doll.dollType === queryParams.dollType);
    }

    return filteredDolls;
  }
    // One more  method for filtering dolls based on dollType
  getDollsByType(dollType) {
    return this.dolls.filter(doll => doll.dollType === dollType);
  }
}
    // Handle filtered dolls request
  getFilteredDolls(req, res) {
    const queryParams = req.query;
    const filteredDolls = this.database.getFilteredDolls(queryParams);
    res.json(filteredDolls);
  }
}
}

class TildaDollsApp {
  constructor(database) {
    this.app = express();
    this.port = 3000;
    this.database = database;

    // Middleware
     this.app.use(this.loggerMiddleware);
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(session({ secret: 'secret_key', resave: true, saveUninitialized: true }));
    this.app.use(express.static('public')); // Serve static files from the 'public' directory
    this.app.use(this.errorHandlerMiddleware);

    // Routes
    this.app.get('/', this.homePage.bind(this));
      this.app.get('/dolls', this.dollSelection.bind(this));
      this.app.get('/', this.homePage.bind(this));
    this.app.get('/dolls', this.getAllDolls.bind(this));
    this.app.post('/dolls', this.createDoll.bind(this));
    this.app.get('/dolls/:dollId', this.getDollById.bind(this));
    this.app.get('/transactions', this.getAllTransactions.bind(this));
    this.app.get('/veterans', this.getAllVeterans.bind(this));
    this.app.post('/purchase', this.authenticateMiddleware.bind(this), this.makePurchase.bind(this));
    this.app.get('/order/:transactionNumber', this.authenticateMiddleware.bind(this), this.orderConfirmationPage.bind(this));
    this.app.get('/track-impact', this.authenticateMiddleware.bind(this), this.veteranAllocationTable.bind(this));
    this.app.get('/how-it-works', this.howItWorks.bind(this));
    this.app.get('/api/dolls', this.exposeDolls.bind(this));
    this.app.get('/api/transactions', this.exposeTransactions.bind(this));
    this.app.get('/api/veterans', this.exposeVeterans.bind(this));
    this.app.delete('/api/dolls/:dollId', this.deleteDoll.bind(this));
    this.app.delete('/api/veterans/:veteranId', this.deleteVeteran.bind(this));
    this.app.patch('/api/dolls/:dollId', this.updateDoll.bind(this));
    this.app.put('/api/veterans/:veteranId', this.replaceVeteran.bind(this));
    app.get('/api/dolls/filter', this.getFilteredDolls.bind(this));
    exposeDolls(req, res) {
    const { dollType } = req.query;

    if (dollType) {
      const filteredDolls = this.database.getDollsByType(dollType);
      res.json(filteredDolls);
    } else {
      res.json(this.database.dolls);
    }
  }

  // GET route for exposing a specific doll using route parameters
  exposeDollById(req, res) {
    const dollId = req.params.dollId;
    const doll = this.database.dolls.find(doll => doll.dollId === dollId);

    if (doll) {
      res.json(doll);
    } else {
      res.status(404).json({ message: 'Doll not found' });
    }
  }
      / POST route for creating a new doll
  createDoll(req, res) {
    const { dollId, dollType, description, imageUrl, price, veteranId } = req.body;
    const doll = new Doll(dollId, dollType, description, imageUrl, price, veteranId);
    this.database.addDoll(doll);
    res.status(201).json({ message: 'Doll created successfully', doll });
  }

  // GET route for retrieving all dolls
  getAllDolls(req, res) {
    const { dollType } = req.query;

    if (dollType) {
      const filteredDolls = this.database.getDollsByType(dollType);
      res.json(filteredDolls);
    } else {
      res.json(this.database.dolls);
    }
  }

  // GET route for retrieving a specific doll by ID
  getDollById(req, res) {
    const dollId = req.params.dollId;
    const doll = this.database.dolls.find(doll => doll.dollId === dollId);

    if (doll) {
      res.json(doll);
    } else {
      res.status(404).json({ message: 'Doll not found' });
    }
  }

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
    res.json(this.database.dolls);
  }

  exposeTransactions(req, res) {
    res.json(this.database.transactions);
  }

  exposeVeterans(req, res) {
    res.json(this.database.veterans);
  }

  homePage(req, res) {
    res.send('Welcome to Tilda Dolls for Veterans');
  }

  dollSelection(req, res) {
    res.json(this.database.dolls);
  }

  makePurchase(req, res) {
    const { dollType, shippingAddress, paymentDetails } = req.body;

    // Validate and process payment
    // Update jointAccount with the payment amount
    this.database.jointAccount += /* Payment amount */;

    // Record a transaction
    const transactionId = this.database.transactions.length + 1;
    const transaction = new Transaction(transactionId, req.session.user, dollType, shippingAddress, paymentDetails, /* Processed payment amount */);
    this.database.addTransaction(transaction);

    // Add or update veteran information
    const veteranId = /* Get veteran ID associated with dollType */;
    const existingVeteran = this.database.veterans.find(v => v.veteranId === veteranId);
    if (existingVeteran) {
      existingVeteran.donationAllocation += /* Processed payment amount */;
    } else {
      const veteran = new Veteran(veteranId, /* Veteran name */, /* Veteran medical needs */, /* Veteran rehabilitation details */, /* Processed payment amount */);
      this.database.addOrUpdateVeteran(veteran);
    }

    // Redirect to order confirmation page
    res.redirect(`/order/${transactionId}`);
  }

  orderConfirmationPage(req, res) {
    const transactionId = parseInt(req.params.transactionNumber);
    const transaction = this.database.transactions.find(t => t.transactionId === transactionId);
    res.json(transaction);
  }

  veteranAllocationTable(req, res) {
    res.json(this.database.veterans);
  }

  howItWorks(req, res) {
    res.send('How it Works');
  }

  // DELETE route to delete a doll
  deleteDoll(req, res) {
    const dollId = req.params.dollId;
    const dollIndex = this.database.dolls.findIndex(doll => doll.dollId === dollId);

    if (dollIndex !== -1) {
      // Remove the doll from the array
      const deletedDoll = this.database.dolls.splice(dollIndex, 1)[0];
      res.json({ message: 'Doll deleted successfully', doll: deletedDoll });
    } else {
      res.status(404).json({ message: 'Doll not found' });
    }
  }

  // PATCH route to update a doll's information
  updateDoll(req, res) {
    const dollId = req.params.dollId;
    const { dollType, description, imageUrl, price, veteranId } = req.body;

    // Find the doll by dollId
    const dollToUpdate = this.database.dolls.find(doll => doll.dollId === dollId);

    if (dollToUpdate) {
      // Update the doll's information
      dollToUpdate.dollType = dollType || dollToUpdate.dollType;
      dollToUpdate.description = description || dollToUpdate.description;
      dollToUpdate.imageUrl = imageUrl || dollToUpdate.imageUrl;
      dollToUpdate.price = price || dollToUpdate.price;
      dollToUpdate.veteranId = veteranId || dollToUpdate.veteranId;

      res.json({ message: 'Doll information updated successfully', doll: dollToUpdate });
    } else {
      res.status(404).json({ message: 'Doll not found' });
    }
  }

  // PUT route to replace a veteran's information
  replaceVeteran(req, res) {
    const veteranId = req.params.veteranId;
    const { name, medicalNeeds, rehabilitationDetails, donationAllocation } = req.body;
    const veteranToReplace = this.database.veterans.find(veteran => veteran.veteranId === veteranId);

    if (veteranToReplace) {
      // Replace the veteran's information
      veteranToReplace.name = name;
      veteranToReplace.medicalNeeds = medicalNeeds;
      veteranToReplace.rehabilitationDetails = rehabilitationDetails;
      veteranToReplace.donationAllocation = donationAllocation;

      res.json({ message: 'Veteran information replaced successfully', veteran: veteranToReplace });
    } else {
      res.status(404).json({ message: 'Veteran not found' });
    }
  }

  // DELETE route to delete a veteran
  deleteVeteran(req, res) {
    const veteranId = req.params.veteranId;
    const veteranIndex = this.database.veterans.findIndex(veteran => veteran.veteranId === veteranId);

    if (veteranIndex !== -1) {
      // Remove the veteran from the array
      const deletedVeteran = this.database.veterans.splice(veteranIndex, 1)[0];
      res.json({ message: 'Veteran deleted successfully', veteran: deletedVeteran });
    } else {
      res.status(404).json({ message: 'Veteran not found' });
    }
  }
}

// Create an instance of the Database class
const database = new Database();

// Create an instance of the TildaDollsApp class to start the application
const tildaDollsApp = new TildaDollsApp(database);
