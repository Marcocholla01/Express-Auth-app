const crypto = require("crypto");

// const uuid = crypto.randomUUID();

//  Functin for Generating UUID Math.random method
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
module.exports = { generateUUID };
