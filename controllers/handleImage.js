const handleHouseImageUpload = async (req, res) => {
  const imageFiles = req.files;
  const { houseId } = req.params;

  const user_id = req.user.id;

  console.log(houseId, imageFiles);

  const imageData = imageFiles.map((f) => {
    try {
      const fetchData = async (f) => {
        const { rows } = await db.query(
          `INSERT INTO TABLE propertyMediaTable (house_id, user_id, filename, media_url) values ($1, $2, $3, $4) RETURNING id, media_url, filename`,
          [houseId, user_id, f.filename, f.url]
        );
        const data = rows[0];

        return data;
      };

      return fetchData(f);
    } catch (err) {
      return res.status(400).json("Error in image uploading");
    }
  });

  return res.status(200).json(imageData);
};

module.exports = {
  handleHouseImageUpload,
};
