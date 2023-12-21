const db = require("../db");
const http = require("http"),
  fs = require("fs"),
  ccav = require("../ccavutil.js"),
  crypto = require("crypto"),
  qs = require("querystring");
const { CLIENT_URL } = require("../config/index.js");
const axios = require("axios");
const paymentInitiation = async (req, res) => {
  let user = req.user;
  const id = user?.id;
  var body = "",
    workingKey = process.env.WORKING_KEY, //Put in the 32-Bit key shared by CCAvenues.
    accessCode = process.env.ACCESS_CODE, //Put in the Access Code shared by CCAvenues.
    encRequest = "",
    formbody = "";

  let { plan_id } = req.body;

  const {rows} = await db.query(`SELECT * FROM paymentplans where id = $1`, [plan_id]);

  const timestamp = Date.now();
  const orderId = `${id.slice(0, 5)}-${timestamp}`;
  const data = {
    merchant_id: process.env.MERCHANT_ID,
    order_id:orderId,
    amount: rows[0].total_price, 
    no_of_contacts: rows[0].no_of_contacts, 
    currency: 'INR',
    language: `EN`,
    redirect_url: `https://homewale.com/api/public/api/payment-status`,
    cancel_url: `https://homewale.com/api/public/api/payment-status`,
  }

  const date_now = new Date();

  await db.query(
    `Insert into payments (user_id, amount, status, order_id, currency, no_of_contacts, payment_date, plan_id)
  values($1, $2, $3, $4, $5, $6, $7, $8)`,

    [
      req.user.id,
      data.amount,
      "pending",
      data.order_id,
      data.currency,
      rows[0].no_of_contacts,
      date_now,
      plan_id
    ]
  );

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

  // req.on("end", function () {
  if (data) {
    encRequest = ccav.encrypt(queryString, keyBase64, ivBase64);
    formbody = `<form id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${encRequest}&access_code=${accessCode}"/> <input type="hidden" id="encRequest" name="encRequest" value="' +
        encRequest +
        '"><input type="hidden" name="access_code" id="access_code" value="' +
        accessCode +
        '"><input type="hidden" name="currency" id="currency" value="INR"><script language="javascript">document.redirect.submit();</script></form>`;
    // res.writeHeader(200, { "Content-Type": "text/html" });
    // res.write(formbody);
    const script =
      '<script language="javascript">console.log("Before form submission"); document.getElementById("nonseamless").submit(); console.log("After form submission");</script>';

    // Send the formbody and script in the res
    res.write(formbody + script);

    // End the res after sending all the data
    res.end();
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

  const {
    tracking_id,
    bank_ref_no,
    order_status,
    payment_mode,
    trans_date,
    order_id,
  } = jsonResponse;

  let date;

  if (trans_date !== "null") {
    const [day, month, year, hour, minute, second] =
      trans_date.split(/\/|\s|:/);
    date = new Date(year, month - 1, day, hour, minute, second);
  } else {
    date = new Date(); // Use the current date when trans_date is null
    const formattedDate = date.toLocaleString("en-IN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false, // 24-hour format
    });

    jsonResponse.trans_date = formattedDate;
  }

  const jsonParam = encodeURIComponent(JSON.stringify(jsonResponse));

  await db.query(
    `Update payments SET tracking_id=$1, bank_ref_no=$2, status=$3, payment_mode=$4, payment_date=$5 WHERE order_id=$6`,
    [tracking_id, bank_ref_no, order_status, payment_mode, date, order_id]
  );

  res.redirect(`${CLIENT_URL}/payment/status?jsonData=${jsonParam}`);

  return;
};

const paymentTransactionStatus = async  (req, res) => {
  var body = "",
    workingKey = "720702AAB0A040750D93E088C061049E", //Put in the 32-Bit key shared by CCAvenues.
    accessCode = "AVYV17KJ86AH05VYHA", //Put in the Access Code shared by CCAvenues.
    encRequest = "",
    formbody = "";
  const  data  = req.query;
  const {order_no} = data;
  const {rows} = await db.query(
    `SELECT plan_id from payments WHERE order_id=$1`,
    [order_no]
  );
  const {plan_id} = rows[0];
  console.log("plan_id:", plan_id)

  const {rows: planDetails} = await db.query(
    `SELECT * from paymentplans WHERE id=$1`,
    [plan_id]
  );
  console.log("planDetails:", planDetails)


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


  if (data) {
    encRequest = ccav.encrypt(body, keyBase64, ivBase64);
    try {
      var config = {
        method: "post",
        url: `https://apitest.ccavenue.com/apis/servlet/DoWebTrans?enc_request=${encRequest}&access_code=${accessCode}&request_type=JSON&command=orderStatusTracker&version=1.2`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
  
      const response = await axios(config);

      const result = response.data;
      let status = '';
      const information = result.split('&');

      information.forEach(info => {
        const info_value = info.split('=');
        if (info_value[0] === 'enc_response') {
          status = ccav.decrypt(info_value[1].trim(), keyBase64, ivBase64);
        }
      });
      return res.status(200).json({status:status, planDetails:planDetails?.[0]});

    } catch (error) {
      return null;
    }
  }
  return;
}

const getAllTransactionByUser = async (req, res) => {
  const {id} = req.user;

  const { rows, rowCount } = await db.query(
    "SELECT * FROM payments where user_id = $1",
    [id]
  );
  return res.status(200).json(rows);
    
  
}
const getAllPaymentPlans = async (req, res) => {
  const { id } = req.user;
  const { rows } = await db.query(
    `Select is_user_admin from users WHERE id = $1`,
    [id]
  );

  if (rows && rows[0].is_user_admin) {
    const { rows, rowCount } = await db.query(`SELECT * FROM paymentplans`);
    if (rowCount === 0) {
      return res.sendMsg(res, 400, false, "Sorry, No Payment plans found!");
    } else {
      const paymentPlans = rows;
      return res.status(200).json(paymentPlans);
    }
  } else {
    const { rows, rowCount } = await db.query(
      `SELECT * FROM paymentplans WHERE status = true`
    );
    if (rowCount === 0) {
      return res.sendMsg(res, 400, false, "Sorry, No Payment plans found!");
    } else {
      const paymentPlans = rows;
      return res.status(200).json(paymentPlans);
    }
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

const increaseContacts = async (req, res) => {
  const id = req.user.id;
  const { order_id } = req.body;

  const { rows, rowCount } = await db.query(
    `SELECT no_of_contacts, added_contacts from payments WHERE order_id = $1`,
    [order_id]
  );

  if (rowCount === 0) {
    return res.status(404).json("Order not found");
  } else if (!rows[0].added_contacts) {
    await db.query(
      `UPDATE payments SET added_contacts = $1 WHERE order_id = $2`,
      [true, order_id]
    );
    await db.query(
      `UPDATE users SET count_owner_contacted = count_owner_contacted + $1 WHERE id = $2`,
      [rows[0].no_of_contacts, id]
    );
    return res.status(200).json("Successfully added contacts to user");
  } else {
    return res.status(200).json("Successfully added contacts to user");
  }
};

module.exports = {
  paymentInitiation,
  paymentStatus,
  paymentTransactionStatus,
  getAllTransactionByUser,
  getAllPaymentPlans,
  getPlanData,
  increaseContacts,
};
