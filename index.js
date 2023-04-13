/**
 * importing all the necessary modules and library
 */
let express = require("express");
let fs = require("fs");
let jwt = require("jsonwebtoken");
let message = require("./message");

const {
  tokenwrite,
  readfile,
  writefile,
  writestory,
  deletestory,
  updatestory,
  deleteprofile,
} = require("./fs.js");
const { verify } = require("./token.js");
let app = express();
let securitykey = "hello";
app.use(express.json());
// making  all the required system for signup for author and user
app.post("/signup", (req, res) => {
  //checking the user already exist or not
  let data = req.body;
  if (Object.keys(data).length == 0) {
    return res.json({ message: message.invalid_Data });
  }
  let readFile = fs.readFileSync("admin.json");
  let readFileParse = JSON.parse(readFile);
  let index = readFileParse.findIndex((element) => {
    return data.email == element.email;
  });
  if (index != -1) {
    res.json({ message: message.exist });
    return;
  }
  if (data.name && data.password && data.email && data.role) {
    let id = fs.readFileSync("id.txt", { encoding: "utf-8" });
    let idparse = +JSON.parse(id);
    id++;
    data.id = id;
    readFileParse.push(data);
    fs.writeFileSync("admin.json", JSON.stringify(readFileParse));
    res.json({ userid: id });
    fs.writeFileSync("id.txt", String(id));
    return;
  }
  res.send(message.invalid_Data);
});
// making all the required system for login for author and user
app.post("/login", (req, res) => {
  //checking the user exist or not
  let data = req.body;
  if (Object.keys(data).length == 0) {
    return res.json({ message: message.invalid_Data });
  }
  let readFile = fs.readFileSync("admin.json", { encoding: "utf-8" });
  let readFileParse = JSON.parse(readFile);
  let index = readFileParse.findIndex((element) => {
    return data.password == element.password && data.id == element.id;
  });
  if (index == -1) {
    res.send({ message: message.notexist });
    return;
  } else {
    //generating the token if user does not exist
    let token = jwt.sign(data.id, securitykey);
    tokenwrite(token, data.id);
    res.json({ token: token });
    res.json({ message: message.login });
    return;
  }
});
//making all the required system for update profile of author and user
app.put("/update", (req, res) => {
  //verifying the token
  if (Object.keys(req.body).length === 0) {
    res.json({ message: message.invalid_Data });
    return;
  }
  let tokenver = verify(req, res, jwt, securitykey);
  //checking whether user exist or not
  console.log(tokenver.readfileparse);
  let indexs = tokenver.index1;
  let objectdata = tokenver.readfileparse;
  let data = req.body;
  //updating the data
  if (data.name) {
    objectdata[indexs].name = data.name;
  }
  if (data.password) {
    objectdata[indexs].password = data.password;
  }
  if (data.city) {
    objectdata[indexs].city = data.password;
  }
  if (data.email) {
    objectdata[indexs].email = data.email;
  }
  //after successful update writing data to a file
  writefile(objectdata, res);
});
//making all the required system for deletion of a profile of user and author
app.delete("/delete", (req, res) => {
  //verifying the token
  if (Object.keys(req.body).length === 0) {
    res.json({ message: message.invalid_Data });
    return;
  }
  let tokenver = verify(req, res, jwt, securitykey);
  //function to delete a data from the file
  deleteprofile(tokenver, req, res);
});

//story to be written
app.post("/writestory", (req, res) => {
  //verifying the token

  let tokenver = verify(req, res, jwt, securitykey);
  //writing data back to the file
  writestory(tokenver, res, req);
});

// story to be updated
app.put("/updatestory", (req, res) => {
  //verifying the token
  let tokenver = verify(req, res, jwt, securitykey);
  //updating data to a file
  updatestory(req, res, message);
});

//deleting the story
app.delete("/deletestory", (req, res) => {
  //process to authenticate the user
  let tokenver = verify(req, res, jwt, securitykey);
  //following function will delete the data from the file
  deletestory(req, res, tokenver);
});

//story to be read by user as well as author
app.get("/showstory", (req, res) => {
  //process to authenticate the user
  let tokenver = verify(req, res, jwt, securitykey);
  let readFileStory = JSON.parse(
    fs.readFileSync("story.json", { encoding: "utf-8" })
  );
  let index = readFileStory.findIndex((element) => {
    return element.id == tokenver.ver;
  });
  res.json({ readStory: readFileStory[index] });
});

app.listen(8000, () => {
  console.log("running");
});
