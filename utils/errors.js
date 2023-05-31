exports.sendMsg = (res, status, success, message) => {
  res.status(status).json({ success, message });
};
