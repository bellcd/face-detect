const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors())

app.use(express.static('dist'));
app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));