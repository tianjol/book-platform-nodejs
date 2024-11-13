const express  = require("express");
const {
    getAllBooks,
    getDetail,
    createBook,
    updateBook,
    deleteBook
}    = require("./controllers/BookController");
const app      = express();
const PORT     = process.env.PORT || 3000;


app.use(express.json());

// app.post("/submit", function(req, res){
//     const { body, params, query } = req;
//     return res.status(200).json(req.body);
// });

app.get("/", function(req, res) {
    res.send("Selamat datang di API Buku Versi 1.0");
})

app.get("/api/buku", getAllBooks);
app.post("/api/buku", createBook);
app.post("/api/buku/:id", getDetail);
app.delete("/api/buku/:id", deleteBook);
app.put("/api/buku/:id", updateBook);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});