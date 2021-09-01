const Joi = require('joi'); // for input validation
const logger = require('./middleware/logger');
const authenticate = require('./middleware/authentication')
const express = require('express');
const courses = require('./routes/courses');
const genres = require('./routes/genres');
const home = require('./routes/home');
const mongoose = require('mongoose')
const app = express();

app.set("view engine","pug");
app.set("views","./views");  //default path for views

app.use(express.json());
app.use(express.urlencoded({extended: true})); // key=value&key=value 
app.use(express.static('public'));
app.use('/api/courses', courses);
app.use('/api/genres', genres);
app.use('/', home);

app.use(logger);

app.use(authenticate);

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to mongodb.. ", err));

const courseSchema = new mongoose.Schema({
    name:String,
    author:String,
    tags: [String],
    date: {type: Date, default: Date.now},
    isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse(){
    const course = new Course({
        name : "Angular Course",
        author : "Mosh",
        tags: ["angular","backend"],
        isPublished : true
    });
    
    const result = await course.save();
    console.log(result);
}

async function getCourses(){
    const courses = await Course
    .find({ author:'Mosh', isPublished:true })
    .limit(10)
    .sort({ name:1 })
    .select({ name:1, tags:1 });
    console.log(courses);
}

/* Query First Approach
async function updateCourse(id){
    const course = await Course.findById(id);
    if(!course) return;
    course.isPublished = true;
    course.author = "Another Author";
    // other syntax
    //course.set({
    //    isPublished : true,
    //    author: "Another Author"   
    //}); 
   const result = await course.save()
   console.log(result);
}
*/

//Update First approach
async function updateCourse(id){
    const result = await Course.deleteOne({ _id:id },{
        $set : {
            author: 'Mosh',
            isPublished: false
        }
    });
   console.log(result);
}

/*
async function deleteCourse(id){
    const result = await Course.deleteOne({ _id:id });
    console.log(result);
}
*/

// To retrieve the docuemtn that was deleted
async function deleteCourse(id){
    const course = await Course.findByIdAndDelete(id);
    console.log(course);
}

deleteCourse('612e757dd971f5912fe25655');
//updateCourse('612e751a6864d2b524e9c3f7');
//getCourses();
//createCourse();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));