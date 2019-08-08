const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // Middleware

app.listen(port, () => {
    console.log("Listening on " + port);
})

app.get("/:base/:equation", (req, res) => {

    let params = req.params;
    // let base = parseFloat(params.base);

    if (isNaN(params.base)) {
        res.status(400).send();
        return;
    }

    console.log(req.params);

    res.status(200).json(req.params);
})

