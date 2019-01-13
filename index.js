const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/playground", { useNewUrlParser: true })
  .then(()=> console.log("Connect to mongodb..."))
  .catch((err)=> console.log(err));

  const courseSchema = mongoose.Schema({
    name: {
      type: String, 
      required: true,
      minLength: 10,
      maxLength: 255,
     // match: //
    },
    category: {
      type: String,
      lowercase: true,
      enum: ["web", "mobile", "network", "security"],
      trim: true
    },
    author: String,
    tags: {
      type: Array,
      validate: {
        // asynchronous validator
        isAsync: true,
        validator: function(v, callback) {
          setTimeout(()=> {
            const result = v && v.length>0;
            callback(result);
          }, 4000)
        },
        message: "The tags should have at least one tag" 
      }
    },
    date: { type: String, default: new Date() },
    isPublish: Boolean,
    price: {
      type: Number,
      required: function() {
        return this.isPublish
      },
      get: v => Math.round(v),
      set: v => Math.round(v)
    }
  })

  const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "Reactjs",
    category: "Web",
    author: "tuenguyen",
    tags: ["javascript", "frontend", "reactjs"],
    // tags: [],
    isPublish: false,
    price: 15.8
  })
  try {
    const result = await course.save();
    console.log(result);
  } catch(ex) {
    for (const field in ex.errors) {
      console.log(ex.errors[field].message)
    }
  }

}


async function getCourses() {
  // logical query operator
  // or
  // and
  const courses = await 
    Course
      // comparison
      // .find({ price: { $gt: 10, $lt: 20 }})
      // .find({ price: { $in: [10, 15, 20] }})
      //.find()
      // logical query
      //.or([ { author: 'tuenguyen'}, { isPublish: true} ])
      // .and()

      // regular expression
      // .find({ author: /^tue/ }) // begin by tue ...
      .find({ _id: "5c3abe01f9ddde3322cd202b" })
      .limit(10)
      .sort({ name: 1 }) // name: 1 ascending, name: -1 descending
      .select({ name: 1, tags: 1, price: 1 })
  console.log(courses[0].price);
}
//getCourses();

// comparison
// eq: equal
// ne: not equal
// gt: greater than
// gte: greater than or equal
// lt: less than
// lte: less than or equal
// in
// nin: not in

async function updateCourse(id) {
  // Approach: query first
  // findById
  // modified it
  // save()

  // const course = await Course
  //   .findById(id) 
  // course.author = 'tue';
  // course.price = '50';
  // const result = await course.save();
  // console.log(result);


  // Approach: Update first
  // Update directly
  // Optionall: get the updated document
  const result = await Course.updateOne({ _id: id }, {
    $set: {
      name: "mosh",
      isPublish: false
    }
  })
  console.log(result);
}

// updateCourse("5c39565292f8eb2e7178252d");

async function deleteCourse(id) {
  const result = await Course.deleteOne({ _id: id });
  console.log(result);
}
// deleteCourse("5c39565292f8eb2e7178252d");

getCourses();
