const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('PORT', process.env.PORT || 8080);

app.get('/', (_, res) => {
  res.json({ message: 'Hello world' });
});

app.post('/greet', (req, res) => {
  res.json({ message: `Hello ${req.body.name || 'Master'}!` });
});

app.listen(app.get('PORT'), () => console.log(`Rest server running on ${app.get('PORT')}`));