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

async function updateBook_(req, res) {
  try {
    const { id } = req.params; // ID from URL params
    const { title, author } = req.body; // Data to update
    const { db } = await connectToMongo();
    const booksCollection = db.collection('books');
    
    // Log the received ID
    console.log('ID received:', id);

    // Validate the ID is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        error: `Invalid ID format: ${id}`
      });
    }

    // Convert string ID to ObjectId
    const objectId = new ObjectId(id);

    // Log the objectId to ensure it's correctly created
    console.log('Converted ObjectId:', objectId);

    // Perform the update
    const result = await booksCollection.findOneAndUpdate(
      { _id: objectId },  // Use ObjectId directly in the query
      { $set: { title, author } },
      { returnDocument: 'after' } // Ensure we get the document after the update
    );

    // Log the result to see what was returned
    console.log(result._id);

    // Check if the document was found and updated
    if (result._id) {
      // Successful update
      res.status(200).json({
        message: `Book with ID ${id} updated successfully`,
        data: result.value
      });
    } else {
      // If no book was found with that ID
      res.status(404).json({
        error: `Book with ID ${id} not found`
      });
    }
  } catch (error) {
    // Catch any other errors
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
}

async function updateBook(req, res) {
  try {
    const { author } = req.params; // Get author from URL params (or req.body if it comes from body)
    const { newTitle, newAuthor } = req.body; // Data to update (new title, new author)
    console.log(author);
    // Check if `author` and `newTitle` / `newAuthor` are provided
    if (!author || !newTitle || !newAuthor) {
      return res.status(400).json({
        error: "Author, newTitle, and newAuthor are required"
      });
    }

    const { db } = await connectToMongo();
    const booksCollection = db.collection('books');
    
    // Log the received author and data
    console.log('Author received:', author);
    console.log('New Title:', newTitle);
    console.log('New Author:', newAuthor);

    // Perform the update by searching with the author
    const result = await booksCollection.findOneAndUpdate(
      { author: author },  // Query by author
      { $set: { title: newTitle, author: newAuthor } }, // Update title and author
      { returnDocument: 'after' } // Ensure we get the document after the update
    );

    // Log the result to see what was returned
    console.log('Update result:', result);

    // Check if the document was found and updated
    if (result._id) {
      // Successful update
      res.status(200).json({
        message: `Book by author "${author}" updated successfully`,
        data: result.value
      });
    } else {
      // If no book was found with that author
      res.status(404).json({
        error: `No book found by author "${author}"`
      });
    }
  } catch (error) {
    // Catch any other errors
    console.error('Error updating book:', error);
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