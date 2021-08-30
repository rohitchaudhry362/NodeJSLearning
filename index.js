const Joi = require('joi'); // for input validation
const express = require('express');
const app = express();
app.use(express.json());

const courses = [
    { id: 1 , name: "Course1"},
    { id: 2 , name: "Course2"},
    { id: 3 , name: "Course3"},
];

const genres = [
    { id: 1, name: "Genre 1" },
    { id: 2, name: "Genre 2" },
    { id: 3, name: "Genre 3" }
];

app.get('/', (req,res)=> {
    res.send("Hello World");
});

app.get('/api/courses', (req,res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req,res) => {
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send("Given id not found");
        return;
    };

    /*
    Another way to write above code
    if (!course) return res.status(404).send("Given id not found");
    */

    res.send(course);
});

app.post('/api/courses', (req,res) => {
    const result = validateCourse(req.body);

    if (result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const course = {
      id: courses.length + 1,
      name: req.body.name    
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id',(req,res) => {
    //look up the coourse exists
    // if not, 404
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send("Given id not found");
        return;
    };

    /*
    Another way to write above code
    if (!course) return res.status(404).send("Given id not found");
    */

    const result = validateCourse(req.body);

    //validate
    //invalid - 4-- bad request
    
    if (result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    //update course
    course.name = req.body.name;
    //return updated course to client
    res.send(course);

});

app.delete('/api/courses/:id', (req,res) => {
    // look up the course, if does not exists, return 404
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send("Given id not found");
        return;
    };

    /*
    Another way to write above code
    if (!course) return res.status(404).send("Given id not found");
    */


    //delete
    const index = courses.indexOf(course);
    courses.splice(index,1);
    
    //return the same course
    res.send(course);
});

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

// Getting all Genres
app.get('/api/genres', (req,res) => {
    res.send(genres);
});

app.get('/api/genres/:id', (req,res) => {
    const genre = genres.find( c => c.id === parseInt(req.params.id));
    if (!genre) {
        res.status(404).send("Given id not found");
        return;
    };

    res.send(genre);
});

app.post('/api/genres', (req,res) => {
    const result = validateGenre(req.body);

    if (result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const genre = {
      id: genres.length + 1,
      name: req.body.name    
    };
    genres.push(genre);
    res.send(genre);
});

app.put('/api/genres/:id',(req,res) => {
    
    const genre = genres.find( c => c.id === parseInt(req.params.id));
    if (!genre) {
        res.status(404).send("Given id not found");
        return;
    };

    const result = validateGenre(req.body);
    
    if (result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    genre.name = req.body.name;
    
    res.send(genre);

});

app.delete('/api/genres/:id', (req,res) => {
    
    const genre = genres.find( c => c.id === parseInt(req.params.id));
    if (!genre) {
        res.status(404).send("Given id not found");
        return;
    };

    const index = genres.indexOf(genre);
    genres.splice(index,1);
    
    res.send(genre);
});

function validateGenre(genre){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(genre, schema);
}



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));