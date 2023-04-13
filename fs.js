const message = require("./message");
let fs = require("fs");
// let readfile=require('./story.json')
//writing token in a file
function tokenwrite(token, id) {
  let readtokenfile = fs.readFileSync("token.json");
  let readtokenfileparse = JSON.parse(readtokenfile);
  objtoken = { id: id, token: token };
  readtokenfileparse.push(objtoken);
  fs.writeFileSync("token.json", JSON.stringify(readtokenfileparse));
}

//writing data of user and author to a file after signup
function writefile(readfiles, res) {
  fs.writeFileSync("admin.json", JSON.stringify(readfiles));
  console.log("success");
  res.json({ message: message.writeFileSuccess });
}
//writing story to a file by author
function writestory(tokenver, res, req) {
  let index = tokenver.index1;
  let data_Admin = tokenver.readfileparse;
  let data_Recieved = req.body;
  if (data_Admin[index].role == "author") {
    let read_Story = JSON.parse(
      fs.readFileSync("story.json", { encoding: "utf-8" })
    );
    let story_Id = JSON.parse(
      fs.readFileSync("storyid.txt", { encoding: "utf-8" })
    );
    let indexstoryid = read_Story.findIndex((element) => {
      return (
        element.id == data_Recieved.id && element.story == data_Recieved.story
      );
    });
    if (indexstoryid != -1) {
      return res.json({ message: message.story_Exist });
    }
    data_Recieved.story_Id = story_Id;
    read_Story.push(data_Recieved);
    story_Id++;
    fs.writeFileSync("storyid.txt", JSON.stringify(story_Id));
    fs.writeFileSync("story.json", JSON.stringify(read_Story));
    res.json({ message: message.story_Write });
  }
  // res.end('permission not allowed');
}
//reading story form a file by user and author
function readstory(fs) {
  let readfile = fs.readFileSync("story.json", { encoding: "utf-8" });

  return JSON.parse(readfile);
}
// deleting existing story from a file
function deletestory(req, res, tokenver) {
  let data = req.body;
  let readfile = fs.readFileSync("admin.json", { encoding: "utf-8" });
  let readfileparse = JSON.parse(readfile);
  let index = readfileparse.findIndex((element) => {
    return element.id == tokenver.ver && element.role == "author";
  });
  if (index == -1) {
    res.json({ message: message.authenticate });
    return;
  }
  let readfilestory = fs.readFileSync("story.json", { encoding: "utf-8" });
  let readfileparsestory = JSON.parse(readfilestory);
  let index1 = readfileparsestory.findIndex((element) => {
    return element.id == tokenver && element.story == data.story;
  });
  readfileparsestory.splice(index1, 1);
  fs.writeFileSync("story.json", JSON.stringify(readfileparsestory));
  res.json({ message: message.deleteStory });
}
//modifying the existing story from a file
function updatestory(req, res, message) {
  let readfile = fs.readFileSync("admin.json");
  let readfileparse = JSON.parse(readfile);
  let data = req.body;
  let index = readfileparse.findIndex((element) => {
    return Number(element.id) == Number(data.id) && element.role == "author";
  });
  if (index == -1) {
    return res.json({ message: message.authenticate });
  } else {
    let readfilestory = fs.readFileSync("story.json", { encoding: "utf-8" });
    let readfileparsestory = JSON.parse(readfilestory);
    let indexparse = readfileparsestory.findIndex((element) => {
      return element.id == data.id;
    });
    if (indexparse == -1) {
      res.json({ message: message.authenticate });
      return;
    }
    readfileparsestory[index] = data;
    fs.writeFileSync("story.json", JSON.stringify(readfileparsestory));
    res.json({ message: message.updateStory });
  }
}
//deleting the profile of a user whether a user or author
function deleteprofile(readfiles, req, res) {
  let data = readfiles.readfileparse;
  let index = readfiles.index1;
  data.splice(index, 1);
  fs.writeFileSync("admin.json", JSON.stringify(data));
  res.json({ message: message.data_Deleted });
}
//exporting all the required function
module.exports = {
  tokenwrite,
  writefile,
  writestory,
  readstory,
  deletestory,
  updatestory,
  deleteprofile,
};
