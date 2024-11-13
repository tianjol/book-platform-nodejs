const express  = require("express");
const app      = express();
const PORT     = process.env.PORT || 3000;

app.get("/", function(req, res){
    return res.json("Hello world");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});