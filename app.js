const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = 3000;

# Initialization
//Database
const veterans = [];
const dollsSold = [];
let jointAccount = 0;

# Define Middleware
// Custom Logger Middleware
const loggerMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

// Custom Authentication Middleware
const authenticateMiddleware = (req, res, next) => {
  const isAuthenticated = req.session && req.session.user;

  if (isAuthenticated) {
    next();
  } else {
    res.status(401).send('Unauthorized. Please login.');
  }
};

app.use(loggerMiddleware);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'your_secret_key', resave: true, saveUninitialized: true }));

# Define Routes

# Home Page
app.get('/', (req, res) => {
  res.send('Welcome to Tilda Dolls for Veterans');
});

# Doll Selection
app.get('/dolls', (req, res) => {
  // Display Tilda dolls with information about associated veterans
  res.send('Display Tilda dolls');
});

# Purchase Doll
app.post('/purchase', authenticateMiddleware, (req, res) => {
  // Parse request data (doll type, shipping address, payment details)
  const { dollType, shippingAddress, paymentDetails } = req.body;

  // Validate and process payment

  // Update jointAccount with the payment amount
  jointAccount += /* Process payment amount */;

  // Add a record to dollsSold
  dollsSold.push({ dollType, veteranAssociation: /* Get veteran associated with dollType */, shippingAddress });

  // Redirect to order confirmation page
  res.redirect('/order/123'); // Use a dynamic transaction number

});

# Order Confirmation Page
app.get('/order/:transactionNumber', authenticateMiddleware, (req, res) => {
  // Display transaction details, including transaction number, total dolls sold, customer's shipping address, and amount collected
  res.send(`Order Confirmation for Transaction Number: ${req.params.transactionNumber}`);
});

# Veteran Allocation Table (Track Impact)
app.get('/track-impact', authenticateMiddleware, (req, res) => {
  // Display a table showing types of dolls sold, amount allocated for each veteran, and number of dolls sold for each veteran
  res.send('Veteran Allocation Table');
});

# How it Works Page
app.get('/how-it-works', (req, res) => {
  // Display information on how to browse dolls, make a purchase, track impact, and spread the word
  res.send('How it Works');
});

# Run the Express Server
app.listen(port, () => {
  console.log(`Tilda Dolls for Veterans server listening at http://localhost:${port}`);
});
