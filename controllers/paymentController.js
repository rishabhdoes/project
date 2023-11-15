const db = require("../db");
const http = require("http"),
  fs = require("fs"),
  ccav = require("../ccavutil.js"),
  crypto = require("crypto"),
  qs = require("querystring");
const { CLIENT_URL } = require("../config/index.js");

const paymentInitiation = async (request, response) => {
  var body = "",
    workingKey = "720702AAB0A040750D93E088C061049E", //Put in the 32-Bit key shared by CCAvenues.
    accessCode = "AVYV17KJ86AH05VYHA", //Put in the Access Code shared by CCAvenues.
    encRequest = "",
    formbody = "";
  const { data } = request.body;

  //Generate Md5 hash for the key and then convert in base64 string
  var md5 = crypto.createHash("md5").update(workingKey).digest();
  var keyBase64 = Buffer.from(md5).toString("base64");

  //Initializing Vector and then convert in base64 string
  var ivBase64 = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]).toString("base64");

  if (data) {
    body += JSON.stringify(data);
  }
  const jsonData = JSON.parse(body);

  const queryString = Object.keys(jsonData)
    .map((key) => {
      if (typeof jsonData[key] === "string") {
        return `${key}=${encodeURIComponent(jsonData[key])}`;
      }
      return `${key}=${jsonData[key]}`;
    })
    .join("&");

  // request.on("end", function () {
  if (data) {
    encRequest = ccav.encrypt(queryString, keyBase64, ivBase64);
    formbody = `<form id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${encRequest}&access_code=${accessCode}"/> <input type="hidden" id="encRequest" name="encRequest" value="' +
        encRequest +
        '"><input type="hidden" name="access_code" id="access_code" value="' +
        accessCode +
        '"><input type="hidden" name="currency" id="currency" value="INR"><script language="javascript">document.redirect.submit();</script></form>`;
    // response.writeHeader(200, { "Content-Type": "text/html" });
    // response.write(formbody);
    const script =
      '<script language="javascript">console.log("Before form submission"); document.getElementById("nonseamless").submit(); console.log("After form submission");</script>';

    // Send the formbody and script in the response
    response.write(formbody + script);

    // End the response after sending all the data
    response.end();
  }
  // });
  return;
};

function parseDecryptedReq(decryptedReq) {
  // Split the string into key-value pairs
  const pairs = decryptedReq.split("&");

  // Create an object to store the key-value pairs
  const result = {};

  // Loop through each pair and add it to the object
  pairs.forEach((pair) => {
    const [key, value] = pair.split("=");
    result[key] = decodeURIComponent(value || "");
  });

  // Convert the object to JSON
  const jsonResult = JSON.stringify(result, null, 2);

  return jsonResult;
}

const paymentStatus = async (req, res) => {
  const { encResp, orderNo } = req.body;
  const workingKey = "720702AAB0A040750D93E088C061049E";
  const md5 = crypto.createHash("md5").update(workingKey).digest();
  const keyBase64 = Buffer.from(md5).toString("base64");

  //Initializing Vector and then convert in base64 string
  const ivBase64 = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]).toString("base64");
  const decryptedResp = ccav.decrypt(encResp, keyBase64, ivBase64);

  const jsonResponse = JSON.parse(parseDecryptedReq(decryptedResp));

  const jsonParam = encodeURIComponent(JSON.stringify(jsonResponse));
  console.log("Hey NIKHIL MC", jsonResponse);

  res.redirect(`${CLIENT_URL}/payment/status?jsonData=${jsonParam}`);
  return;
};

const getAllPaymentPlans = async (req, res) => {
  const { rows, rowCount } = await db.query(`SELECT * FROM paymentplans`);
  if (rowCount === 0) {
    return res.sendMsg(res, 400, false, "Payment plans not found!");
  } else {
    const paymentPlans = rows;
    return res.status(200).json(paymentPlans);
  }
};

const getPlanData = async (req, res) => {
  const { planId } = req.query;

  const { rows, rowCount } = await db.query(
    `SELECT * FROM paymentplans WHERE id=$1`,
    [planId]
  );

  if (rowCount === 0) {
    return res.sendMsg(res, 400, false, "Payment plans not found!");
  } else {
    const planData = rows[0];
    return res.status(200).json(planData);
  }
};

module.exports = {
  paymentInitiation,
  paymentStatus,
  getAllPaymentPlans,
  getPlanData,
};
