const express = require('express');
const app = express();

app.set('PORT', process.env.PORT || 8080);

app.get('/', (_, res) => {
  res.json({ message: 'Hello world' });
});

app.get('/greet', (req, res) => {
  res.json({ message: `Hello ${req.query.name || 'Master'}!` });
});

app.listen(app.get('PORT'), () => console.log(`Rest server running on ${app.get('PORT')}`));