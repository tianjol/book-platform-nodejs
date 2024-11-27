const { Pool } = require('pg');

// Create a PostgreSQL connection pool
const pool = new Pool({
  host: 'localhost',  // Replace with your PostgreSQL host
  user: 'root',  // Replace with your PostgreSQL username
  password: 'example',  // Replace with your PostgreSQL password
  database: 'digitalbooks',  // Replace with your PostgreSQL database name
  port: 5432  // Default PostgreSQL port
});

// Promisify the pool for async/await support
const promisePool = pool;

async function getAllBooksP(req, res) {
  try {
    const result = await promisePool.query('SELECT * FROM books');
    
    res.status(200).json({
      message: 'List of all books',
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving books', error: error.message });
  }
}

async function getDetailP(req, res) {
  try {
    const { id } = req.params;
    const result = await promisePool.query('SELECT * FROM books WHERE id = $1', [id]);

    if (result.rows.length > 0) {
      res.status(200).json({
        message: 'Book detail found',
        data: result.rows[0]
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

async function createBookP(req, res) {
  try {
    const { title, author } = req.body;
    
    const result = await promisePool.query(
      'INSERT INTO books (title, author) VALUES ($1, $2) RETURNING *', 
      [title, author]
    );

    res.status(201).json({
      message: 'Book created successfully',
      data: result.rows[0]  // Return the newly created book
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating book', error: error.message });
  }
}

async function updateBookP(req, res) {
  try {
    const { id } = req.params; // Get `id` from URL params
    const { newTitle, newAuthor } = req.body; // Data to update (new title, new author)

    console.log('ID received from params:', id);
    console.log('New Title:', newTitle);
    console.log('New Author:', newAuthor);

    // Prepare the update query dynamically based on the fields provided
    let query = 'UPDATE books SET ';
    let params = [];
    let setClause = [];

    if (newTitle) {
      setClause.push('title = $' + (params.length + 1));
      params.push(newTitle);
    }
    if (newAuthor) {
      setClause.push('author = $' + (params.length + 1));
      params.push(newAuthor);
    }

    if (setClause.length === 0) {
      return res.status(400).json({
        error: "At least one of newTitle or newAuthor is required to update"
      });
    }

    query += setClause.join(', ') + ' WHERE id = $' + (params.length + 1) + ' RETURNING *';
    params.push(id);

    const result = await promisePool.query(query, params);

    if (result.rows.length > 0) {
      res.status(200).json({
        message: `Book with ID ${id} updated successfully`,
        data: result.rows[0]
      });
    } else {
      res.status(404).json({
        error: `No book found with ID ${id}`
      });
    }
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
}

async function deleteBookP(req, res) {
  try {
    const { id } = req.params;

    const result = await promisePool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length > 0) {
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
  getAllBooksP,
  getDetailP,
  createBookP,
  updateBookP,
  deleteBookP
};
