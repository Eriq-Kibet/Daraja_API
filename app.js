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

// Routes
app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/access_token", access, (req, res) => {
  res.status(200).json({ access_token: req.access_token });
});

app.get("/register", access, (req, res) => {
  const url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
  const auth = "Bearer " + req.access_token;

  request(
    {
      url: url,
      method: "POST",
      headers: { Authorization: auth },
      json: {
        ShortCode: 600990,
        ResponseType: "Completed",
        ConfirmationURL: "https://publicIP/confirmation_url",
        ValidationURL: "https://publicIP/validation_url",
      },
    },
    (error, response, body) => {
      if (error) {
        console.log(error);
      }
      res.status(200).json(body);
    }
  );
});

app.post("/confirmation", access, (req, res) => {
  console.log(".............confirmation.................");
  res.send(req.body);
  console.log(req.body);
});

app.post("/validation", access, (req, res) => {
  res.send(req.body);
  console.log(".............validation.................");
  console.log(req.body);
  console.log(res);
});

app.get("/simulate", access, (req, res) => {
  const url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate";
  const auth = "Bearer " + req.access_token;
  request(
    {
      url: url,
      method: "POST",
      headers: {
        Authorization: auth,
      },
      json: {
        CommandID: "CustomerPayBillOnline",
        Amount: "10",
        Msisdn: "254708374149",
        BillRefNumber: "TestAPI",
        ShortCode: "600990",
      },
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
        Authorization: "Basic " + auth,
      },
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
