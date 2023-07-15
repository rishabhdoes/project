const db = require("../db");
const { cloudinary } = require("../cloudinary");

const handleHouseImageUpload = async (req, res) => {
  const imageFiles = req.files;
  const { houseId } = req.params;
  const user_id = req.user.id;

  try {
    const imageData = await Promise.all(
      imageFiles.map(async (f) => {
        const { rows } = await db.query(
          `INSERT INTO propertyMediaTable (house_id, user_id, filename, media_url) values ($1, $2, $3, $4) RETURNING id, media_url, filename, description`,
          [houseId, user_id, f.filename, f.path]
        );

        const data = rows[0];
        return data;
      })
    );

    await db.query(
      `UPDATE houses SET media_count = media_count + ${imageFiles.length} WHERE id = $1`,
      [houseId]
    );

    return res.status(200).json(imageData);
  } catch (err) {
    return res.status(400).json("Error in image uploading");
  }
};

const handleDescription = async (req, res) => {
  try {
    const { imageId } = req.params;

    if (!imageId) {
      throw new Error("imageId not exists");
    }

    const data = await db.query(
      "SELECT id, user_id FROM propertyMediaTable WHERE id = $1",
      [imageId]
    );

    const { description } = req.body;
    const { rows } = data;

    if (!rows.length) {
      throw new Error("Image does not exist");
    } else if (rows[0].user_id !== req.user.id) {
      throw new Error("You are not authorized!");
    } else {
      await db.query(
        `UPDATE propertyMediaTable SET description = $1 WHERE id = $2`,
        [description, imageId]
      );
      res.status(200).json("image description changed");
    }
  } catch (err) {
    return res.status(400).json(err);
  }
};

const handleDeleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    if (!imageId) {
      throw new Error("imageId not exists");
    }

    const data = await db.query(
      "SELECT id, user_id, filename, house_id FROM propertyMediaTable WHERE id = $1",
      [imageId]
    );

    const { rows } = data;

    if (!rows.length) {
      throw new Error("Image does not exist");
    } else if (rows[0].user_id !== req.user.id) {
      throw new Error("You are not authorized");
    } else {
      const houseId = rows[0].house_id;

      await cloudinary.uploader.destroy(rows[0].filename);
      await db.query(`DELETE FROM propertyMediaTable WHERE id = $1`, [imageId]);
      await db.query(
        `UPDATE houses SET media_count = media_count - 1 WHERE id = $1`,
        [houseId]
      );

      res.status(200).json("Image deleted");
    }
  } catch (err) {
    console.log(err);
  }
};

const getImages = async (req, res) => {
  const { houseId } = req.params;

  try {
    const { rows } = await db.query(
      "SELECT id, filename, description, media_url FROM propertyMediatable WHERE house_id = $1",
      [houseId]
    );
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(400).json(err);
  }
};

module.exports = {
  handleHouseImageUpload,
  handleDescription,
  handleDeleteImage,
  getImages,
};
