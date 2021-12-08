const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const request = require("request");
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
const port = 7080;
const consumerKey = "p5lDJyvTDdnnhTsXPjGrkpXeq67R3Wr0";
const consumerSecret = "491N3hNKFpDPYMGt";
const shortCode = 600990;

// Routes
app.get("/", (req, res) => {
  res.send("hello");
});

// Generate Access Tokens

app.get("/access_token", access, (req, res) => {
  res.status(200).json({ access_token: req.access_token });
});

// Register urls.
app.get("/register", access, (req, res) => {
  const url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
  const auth = "Bearer " + req.access_token;

  request(
    {
      url: url,
      method: "POST",
      headers: { Authorization: auth },
      json: {
        ShortCode: shortCode,
        ResponseType: "Completed",
        ConfirmationURL: "https://178.79.144.23/confirmation",
        ValidationURL: "https://178.79.144.23/validation"
      }
    },
    (error, response, body) => {
      if (error) {
        console.log(error);
      }
      res.status(200).json(body);
    }
  );
});

// Confirmation message from Mpesa
app.post("/confirmation", access, (req, res) => {
  console.log(".............confirmation.................");
  res.send(req.body);
  console.log(req.body);
});

// Validation message from Mpesa
app.post("/validation", access, (req, res) => {
  res.send(req.body);
  console.log(".............validation.................");
  console.log(req.body);
  console.log(res);
});

// Simulate lipa na Mpesa or Paybell..

app.get("/simulate", access, (req, res) => {
  const url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate";
  const auth = "Bearer " + req.access_token;
  request(
    {
      url: url,
      method: "POST",
      headers: {
        Authorization: auth
      },
      json: {
        CommandID: "CustomerPayBillOnline",
        Amount: "10",
        Msisdn: "254708374149",
        BillRefNumber: "TestAPI",
        ShortCode: shortCode.toString()
      }
    },
    (error, response, body) => {
      if (error) {
        console.log(error);
      }
      res.status(200).json(body);
    }
  );
});
// Query Balance
app.get("/balance", access, (req, res) => {
  const url = "https://sandbox.safaricom.co.ke/mpesa/accountbalance/v1/query";
  const auth = "Bearer " + req.access_token;
  request(
    {
      url: url,
      method: "POST",
      headers: {
        Authorization: auth
      },
      json: {
        CommandID: "AccountBalance",
        PartyA: shortCode,
        IdentifierType: "4",
        Remarks: "sequence of characters up to 100 ",
        Initiator: "testapi",
        SecurityCredential:
          "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
        QueueTimeOutURL: "https://Your public IP/AccountBalance/queue/",
        ResultURL: "https://Your public IP/AccountBalance/result/"
      }
    },
    (error, response, body) => {
      if (error) {
        console.log(error);
      }
      res.status(200).json(body);
    }
  );
});

app.post("/queue", access, (req, res) => {
  console.log(".............queue.................");
  res.send(req.body);
  console.log(req.body);
});

app.post("/result", access, (req, res) => {
  res.send(req.body);
  console.log(".............result.................");
  console.log(req.body);
  console.log(res);
});

// Stk request phone to pay
app.get("/stk", access, (req, res) => {
  const url = "";
  const auth = "Bearer " + req.access_token;

  request(
    {
      url: url,
      method: "POST",
      headers: {
        Authorization: "Basic " + auth
      },
      json: {}
    },
    (error, response, body) => {
      if (error) {
        console.log(error);
      }
      res.status(200).json(body);
    }
  );
});

// Business to Transaction
app.get("/b2c", access, (req, res) => {
  const url = "";
  const auth = "Bearer " + req.access_token;

  request(
    {
      url: url,
      method: "POST",
      headers: {
        Authorization: "Basic " + auth
      },
      json: {}
    },
    (error, response, body) => {
      if (error) {
        console.log(error);
      }
      res.status(200).json(body);
    }
  );
});

//generating access tokens
function access(req, res, next) {
  const url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const auth = new Buffer.from(consumerKey + ":" + consumerSecret).toString(
    "base64"
  );
  request(
    {
      url: url,
      headers: {
        Authorization: "Basic " + auth
      }
    },
    (error, response, body) => {
      if (error) {
        console.log(error);
      } else {
        req.access_token = JSON.parse(body).access_token;
        next();
      }
    }
  );
}

// Listen
app.listen(port, (err, live) => {
  if (err) {
    console.error(err);
  }
  console.log(`server is running: http://127.0.0.1:${port}`);
});
