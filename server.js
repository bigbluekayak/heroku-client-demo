const path = require('path');
const express = require('express');

const app = new express();

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, './build')));

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './build', 'index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});