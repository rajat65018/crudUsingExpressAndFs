//recieving the token and verfiying it
let fs = require("fs");
let message = require("./message.js");
function verify(req, res, jwt, securitykey) {
  //checking header exist or not
  console.log(req.headers.auth);
  if (!req.headers.auth) {
    res.json({ message: message.authenticate });
    return;
  }
  let ver;
  //verifying the token if exist
  try {
    ver = jwt.verify(req.headers.auth, securitykey);
  } catch (err) {
    res.json({ message: message.authenticate });
  }
  //process tocheck whether token exist at server side or not
  // console.log(ver);
  let tokenread = fs.readFileSync("token.json", { encoding: "utf-8" });
  let tokenreadparse = JSON.parse(tokenread);
  let index = tokenreadparse.findIndex((element) => {
    let a = jwt.verify(element.token, securitykey);
    return (a = ver);
  });
  if (index == -1) {
    res.json({ message: message.authenticate });
    return;
  }
  let readfile = fs.readFileSync("admin.json");
  let readfileparse = JSON.parse(readfile);
  let index1 = readfileparse.findIndex((element) => {
    return element.id == ver;
  });
  if (index1 == -1) {
    res.send(message.authenticate);
    return;
  }
  Number(index1);
  return { readfileparse, index1, ver };
}
module.exports = { verify };
