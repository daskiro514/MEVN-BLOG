const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const compression = require("compression");

const uploadsdir = require("./utils/utils").uploadsdir;

const PORT = process.env.PORT || 4001;

//
// create our uploads dir
//
if (!fs.existsSync(path.join(__dirname, uploadsdir))) {
  fs.mkdirSync(path.join(__dirname, uploadsdir));
}
// connect to mongodb out in atlas
// hoist creds out to make it easier to update
const username = "lstavenhagen";
const password = "dalemace";
const dbname = "expresstest";

// connect to mongodb out on atlas
const atlas = `mongodb+srv://${username}:${password}@cluster0-g06zf.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(process.env.MONGODB_URI || atlas, {
  useNewUrlParser: true
});
//compress requests and
//responses
app.use(compression());

//middleware for parsing json
app.use(express.json());

//middleware for form submissions
app.use(express.urlencoded({ extended: false }));

// middleware to handle CORS
// leave it wide open for now
app.use(cors());

//
// make the uploads dir publicly accessible
//
app.use(`/${uploadsdir}`, express.static(path.join(__dirname, uploadsdir)));

//grab our router for posts API
app.use("/api/posts", require("./routes/posts"));
//grab users API router
app.use("/api/users", require("./routes/users"));
// grab images API router
app.use("/api/images", require("./routes/images"));

//
// https://www.youtube.com/watch?v=71wSzpLyW9k
// serve static assets if in production

if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("client/dist"));
  app.get("*", (request, response) => {
    response.sendFile(
      path.resolve(__dirname, "client", "dist", "index.html")
    );
  });
}
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
