import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// });

app.post("/mail", (req, res) => {
  console.log("mail button clicked");
  
});

app.listen(port, () => {
  console.log(process.env.SENSITIVE_DATA);
  console.log(`Example app listening on port ${port}`);
});