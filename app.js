const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;
const db = require('./config/keys').mongoURI;
const users = require("./routes/api/users");
const bodyParser = require('body-parser');
const passport = require('passport');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());  
app.use("/api/users", users);
app.use(passport.initialize());
require('./config/passport')(passport);

app.listen(port, () => console.log(`Server is running on port ${port}`));

// async function postImage({image, description}) {
//   const formData = new FormData();
//   formData.append("avatar-image", image)
//   formData.append("description", description)

//   const result = await axios.post('/images', 
//     formData, {headers: {'Content-Type': 'multipart/form-data'}})
//   return result.data
// }