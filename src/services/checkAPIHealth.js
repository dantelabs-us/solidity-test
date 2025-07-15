const checkAPIHealth = async (req, res) => {
  try {
    return res.status(200).json({ status: "OK" });
  } catch (error) {
    return res.status(500).json({ status: "unavailable" });
  }
};

exports.checkAPIHealth = checkAPIHealth;
