// Data sementara sebagai pengganti database
let books = [
    { id: 1, title: 'JavaScript for Beginners', author: 'John Doe' },
    { id: 2, title: 'Node.js in Action', author: 'Jane Smith' },
    { id: 3, title: 'Mastering Express', author: 'Bob Johnson' }
  ];
  
  // Fungsi untuk mendapatkan semua buku
  function getAllBooks(req, res) {
    res.status(200).json({
      message: 'List of all books',
      data: books
    });
  }
  
  // Fungsi untuk mendapatkan detail buku berdasarkan ID
  function getDetail(req, res) {
    const { id } = req.params;
    const book = books.find(b => b.id === parseInt(id));
  
    if (book) {
      res.status(200).json({
        message: 'Book detail found',
        data: book
      });
    } else {
      res.status(404).json({
        error: `Book with ID ${id} not found`
      });
    }
  }
  
  // Fungsi untuk menambahkan buku baru
  function createBook(req, res) {
    const { title, author } = req.body;
  
    // Membuat ID baru berdasarkan ID terakhir + 1
    const newBook = {
      id: books.length > 0 ? books[books.length - 1].id + 1 : 1,
      title,
      author
    };
  
    // Menambahkan buku baru ke dalam array books
    books.push(newBook);
  
    res.status(201).json({
      message: 'Book created successfully',
      data: newBook
    });
  }
  
  // Fungsi untuk memperbarui buku berdasarkan ID
  function updateBook(req, res) {
    const { id } = req.params;
    const { title, author } = req.body;
  
    const book = books.find(b => b.id === parseInt(id));
  
    if (book) {
      book.title = title || book.title;
      book.author = author || book.author;
  
      res.status(200).json({
        message: `Book with ID ${id} updated successfully`,
        data: book
      });
    } else {
      res.status(404).json({
        error: `Book with ID ${id} not found`
      });
    }
  }
  
  // Fungsi untuk menghapus buku berdasarkan ID
  function deleteBook(req, res) {
    const { id } = req.params;
    const index = books.findIndex(b => b.id === parseInt(id));
  
    if (index !== -1) {
      const deletedBook = books.splice(index, 1); // Menghapus satu buku dari array
      res.status(200).json({
        message: `Book with ID ${id} deleted successfully`,
        data: deletedBook
      });
    } else {
      res.status(404).json({
        error: `Book with ID ${id} not found`
      });
    }
  }
  
  // Mengekspor fungsi-fungsi controller
  module.exports = {
    getAllBooks,
    getDetail,
    createBook,
    updateBook,
    deleteBook
  };
  