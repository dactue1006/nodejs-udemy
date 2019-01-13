const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/mongo-exercises", { useNewUrlParser: true })
  .then(()=> console.log("Connect to the database..."))
  .catch((err)=> console.log(err))

const courseShema = mongoose.Schema({
  tags: [ String ],
  date: { type: Date, default: new Date() },
  name: String,
  author: String,
  isPublished: Boolean,
  price: Number
})

const Course = mongoose.model("Course", courseShema);

// get all course
async function getCourses() {
  const courses = await Course
    .find({ isPublished: true })
    .sort({ name: 1 })
    .select({ name: 1, author: 1 })
  console.log(courses);
}
//getCourses();

// get all the published frontend and backend courses,
// sort them by their price in descending order,
// pick only their name and author
async function queryCourse() {
  return await Course
    .find({ isPublished: true, tags: { $in: ['frontend', 'backend']} })
    // you can rewrite tags: { $in: [] } like this
    //.or({ tags: 'frontend' }, { tags: 'backend' })
    .sort('-price')
    .select('name author price')
}

async function run() {
  const result = await queryCourse();
  console.log(result);
}
//run();

// get all the published courses that are $15 or more, 
//or have the word 'by' in their title
async function queryAnotherCourse() {
  return await Course
    .find()
    .or([{ price: { $gte: 15 }}, { name: /.*by.*/i }])
}
async function run2() {
  const result = await queryAnotherCourse();
  console.log(result);
}
run2();