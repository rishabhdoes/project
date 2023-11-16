const db = require("../db");

async function getPlans(req, res) {
  try {
    const { id } = req.query;

    const { rows, rowCount } = await db.query(
      `SELECT * FROM paymentplans WHERE id = $1`,
      [id]
    );
    if (rowCount === 0) {
      return res.status(400).json({
        message: "No Plans Found",
      });
    }
    const plan = rows[0];
    return res.status(400).json({
      plan,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(400).json({
      message: error.toString(),
    });
  }
}

async function updatePlans(req, res) {
  try {
    const {
      id,
      plan_type = null,
      price = null,
      no_of_contacts = null,
      discount = null,
      plan_description = null,
      gst = null,
      gst_percentage = null,
      total_price = null,
    } = req.body;

    const values = {
      id,
      plan_type,
      price,
      no_of_contacts,
      discount,
      plan_description,
      gst,
      gst_percentage,
      total_price,
    };

    const filteredObject = Object.entries(values)
      .filter(([key, value]) => value !== null && key !== "id")
      .map(([key, value]) => ({
        key,
        value,
      }));

    const updateDbQuery = `UPDATE paymentplans SET ${filteredObject
      .map((house, index) => `${house.key} = $${index + 1}`)
      .join(", ")} WHERE id = $${filteredObject.length + 1} RETURNING *`;

    //console.log(filteredObject);

    const values1 = filteredObject.map((cur) => {
      return cur.value;
    });
    console.log([...values1, id]);
    const { rows } = await db.query(updateDbQuery, [...values1, id]);

    res.status(200).json({
      message: "Updated PaymentPlans Successfully",
      rows,
    });
  } catch (exception) {}
}

async function createPlans(req, res) {
  try {
    const {
      plan_type,
      price,
      no_of_contacts,
      discount,
      plan_description,
      gst,
      gst_percentage,
      total_price,
    } = req.body;

    const { rows, rowCount } = await db.query(
      `insert into paymentplans (plan_type,price,no_of_contacts,discount,plan_description,gst,gst_percentage,total_price)
          values($1, $2, $3,$4,$5,$6,$7,$8)`,
      [
        plan_type,
        price,
        no_of_contacts,
        discount,
        plan_description,
        gst,
        gst_percentage,
        total_price,
      ]
    );

    return res.status(400).json({
      message: "Plan Succesfully Created",
    });
  } catch (error) {
    console.log("error:", error);
    res.status(400).json({
      message: error.toString(),
    });
  }
}

async function togglePlanStatus(req, res) {
  try {
    const { id } = req.query;

    //console.log(id);

    const query = `update paymentplans set status = not status where id=$1`;

    const { rows } = await db.query(query, [id]);

    res.status(200).json({
      message: "Updated PaymentPlan status Successfully",
    });
  } catch (exception) {}
}

module.exports = {
  getPlans,
  updatePlans,
  createPlans,
  togglePlanStatus,
};
