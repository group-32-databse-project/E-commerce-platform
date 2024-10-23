const Search = require('../models/search');

exports.search = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    console.log('Search term:', searchTerm);
    const results = await Search.getSearchResults(searchTerm);
    res.json(results);
    console.log('Search results:', results);
  } catch (error) {
    console.error('Error in search:', error);
    res.status(500).json({ message: 'Error searching', error: error.toString() });
  }
};








