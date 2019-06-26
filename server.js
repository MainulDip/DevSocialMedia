const express = require('express')

const app = express()

app.get('/', (req, res) => res.send('API Running'))

// check if server port variable is set default at heroku servers
const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server Started On Port ${PORT}`))
