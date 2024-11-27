const express  = require("express");
const {
    getAllBooks,
    getDetail,
    createBook,
    updateBook,
    deleteBook
}    = require("./controllers/BookController");

const {
  getAllBooksP,
  getDetailP,
  createBookP,
  updateBookP,
  deleteBookP
}    = require("./controllers/BookPsqlController");


const app      = express();
const PORT     = process.env.PORT || 3000;


app.use(express.json());

app.get("/", function(req, res) {
    res.send("Selamat datang di API Buku Versi 1.0");
})

app.get("/api/buku", getAllBooks);
app.post("/api/buku", createBook);
app.get("/api/buku/:id", getDetail);
app.delete("/api/buku/:id", deleteBook);
app.put("/api/buku/:id", updateBook);

app.get("/apip/buku", getAllBooksP);
app.post("/apip/buku", createBookP);
app.get("/apip/buku/:id", getDetailP);
app.delete("/apip/buku/:id", deleteBookP);
app.put("/apip/buku/:id", updateBookP);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});