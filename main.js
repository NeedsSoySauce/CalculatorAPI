const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // Middleware

app.listen(port, () => {
    console.log("Listening on " + port);
})
