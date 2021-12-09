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
const shortCode = "600991";

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
        ConfirmationURL: "https://mydomain.com/confirmation",
        ValidationURL: "https://mydomain.com/validation"
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

// Simulate lipa na Mpesa or Paybill..

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
        ShortCode: shortCode
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
        QueueTimeOutURL: "https://mydomain.com/AccountBalance/queue",
        ResultURL: "https://mydomain.com/AccountBalance/result"
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
//simulation Result

app.post("/AccountBalance/queue", access, (req, res) => {
  console.log(".............AccountBalance queue.................");
  res.send(req.body);
  console.log(req.body);
});

app.post("/AccountBalance/result", access, (req, res) => {
  res.send(req.body);
  console.log(".............AccountBalance result.................");
  console.log(req.body);
  console.log(res);
});

// Stk request phone to pay
app.get("/stk", access, (req, res) => {
  const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
  const auth = "Bearer " + req.access_token;

  let date = new Date();
  const timestamp =
    date.getFullYear() +
    "" +
    "" +
    date.getMonth() +
    "" +
    "" +
    date.getDate() +
    "" +
    "" +
    date.getHours() +
    "" +
    "" +
    date.getMinutes() +
    "" +
    "" +
    date.getSeconds();
  const password = new Buffer.from(
    "174379" +
      "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" +
      timestamp
  ).toString("base64");
  request(
    {
      url: url,
      method: "POST",
      headers: {
        Authorization: "Basic " + auth
      },
      json: {
        BusinessShortCode: "174379",
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: "1",
        PartyA: "254708374149",
        PartyB: "174379",
        PhoneNumber: "254708374149",
        CallBackURL: "https://mydomain.com/stk_callback",
        AccountReference: "CompanyXLTD",
        TransactionDesc: "Payment of X"
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

//STK response
app.post("/stk_callback", (req, res) => {
  console.log(".......... STK Callback ..................");
  console.log(JSON.stringify(req.body.Body.stkCallback));
});

// Business to Transaction
app.get("/b2c", access, (req, res) => {
  const url = "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest";
  const auth = "Bearer " + req.access_token;

  request(
    {
      url: url,
      method: "POST",
      headers: {
        Authorization: "Basic " + auth
      },
      json: {
        InitiatorName: "testapi",
        SecurityCredential:
          "SLobAnHr19DCtX69AYBdInop1pT3kdnwaDqBxu2xgZ2WhpznCzAqdrvdL032Qjr/RbTIHGIRZMVmqwUjMCP2s/3IZzTv2QYvXQrKqinBPPpq7la/CCkbHH34lWN/YUZDIDEpwVbjTiILfcIQ4EuuJlCSnuw4sGmtOUgtwZRDuYDSvPfUbpJc+xcdnoIm/wVtFbvUEZWJwwPv48wjp6XEDPfKZZqPW6rFcha5LztZW3n4bYxiBNvS7tnX0qsEr3RXaahsnI3B+trhAdpTBH2zForWw50FsPrqqMdJ5reulOUmPrICt8AaxOG3QFI6BybUpIrNncvUeIZF6zTma9tJEQ==",
        CommandID: "BusinessPayment",
        Amount: "1",
        PartyA: "600981",
        PartyB: "254708374149",
        Remarks: "Test remarks ",
        QueueTimeOutURL: "https://mydomain.com/b2c/queue",
        ResultURL: "https://mydomain.com/b2c/result",
        Occassion: "Sent Wrongly"
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

//B2C REsponse
app.post("/b2c/result", (req, res) => {
  console.log("-------------------- B2C Result -----------------");
  console.log(JSON.stringify(req.body.Result));
});

app.post("/b2c/queue", (req, res) => {
  console.log("-------------------- B2C Timeout -----------------");
  console.log(req.body);
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
