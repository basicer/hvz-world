let express = require('express');
let path = require("node:path");

let app = express();
app.use(express.static(path.join(__dirname, "dist")));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});
app.listen(process.env.PORT || 3000);