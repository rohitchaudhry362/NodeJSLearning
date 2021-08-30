const express = require('express')
const router = express.Router();

const courses = [
    { id: 1 , name: "Course1"},
    { id: 2 , name: "Course2"},
    { id: 3 , name: "Course3"},
];

router.get('/', (req,res) => {
    res.send(courses);
});

router.get('/:id', (req,res) => {
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

router.post('/', (req,res) => {
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

router.put('/:id',(req,res) => {
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

router.delete('/:id', (req,res) => {
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

module.exports = router;