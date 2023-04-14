const express = require('express');
var multer = require('multer');
var forms = multer();

const usersRoutes = require('./routes/route');
const app = express();
const port = 4500;
app.use(express.json()); //this allows us to post json from our end points
// app.use(forms.array());

app.get('/',(req,res) =>{
    res
    .status(200)
    .send(`Hello welcome to the port ${port}`);
});

app.use('/api/v1/users' , usersRoutes)

app.listen(port,() => {
console.log(`app listening on port ${port}`)
});
