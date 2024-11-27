const connectToMongo = require("../config/connection");
const { ObjectId } = require('mongodb');
async function getAllBooks(req, res) {
  try {
    const { db } = await connectToMongo();
    const booksCollection = db.collection('books');
    const books = await booksCollection.find().toArray();
    
    res.status(200).json({
      message: 'List of all books',
      data: books
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving books', error: error.message });
  }
}

async function getDetail(req, res) {
  try {
    const { id } = req.params;
    const { db } = await connectToMongo();
    const booksCollection = db.collection('books');
    
    const book = await booksCollection.findOne({ _id: new ObjectId(id) });

    //const book = await booksCollection.findOne({ _id: new require('mongodb').ObjectId(id) });

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
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving book', error: error.message });
  }
}

async function createBook(req, res) {
  try {
    const { title, author } = req.body;
    const { db } = await connectToMongo();
    const booksCollection = db.collection('books');

    const newBook = {
      title,
      author
    };

    console.log(newBook);

    const result = await booksCollection.insertOne(newBook);
    
    res.status(201).json({
      message: 'Book created successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating book', error: error.message });
  }
}

async function updateBook(req, res) {
  try {
    const { id } = req.params;
    const { title, author } = req.body;
    const { db } = await connectToMongo();
    const booksCollection = db.collection('books');
    

    const result = await booksCollection.findOneAndUpdate(
      
      { _id: new ObjectId(id) },  // Use `new ObjectId(id)` correctly
      { $set: { title, author } },
      { returnDocument: 'after' }
    );
    console.log(result.title);
    if (result.value) {
      res.status(200).json({
        message: `Book with ID ${id} updated successfully`,
        data: result.value
      });
    } else {
      res.status(404).json({
        error: `Book with ID ${id} not found`
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
}

async function deleteBook(req, res) {
  try {
    const { id } = req.params;
    const { db } = await connectToMongo();
    const booksCollection = db.collection('books');

    const result = await booksCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.status(200).json({
        message: `Book with ID ${id} deleted successfully`
      });
    } else {
      res.status(404).json({
        error: `Book with ID ${id} not found`
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
}

module.exports = {
  getAllBooks,
  getDetail,
  createBook,
  updateBook,
  deleteBook
};