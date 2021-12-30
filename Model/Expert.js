const mongoose = require("mongoose");

const expertSchema = new mongoose.Schema({
  salutation: {
    type: String,
    default: "Dr",
    required: true,
  },
  Fname: {
    type: String,
    required: true,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  cv: String,

  LName: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  medicoLegalSecrtaryPhone: {
    type: String,
    unique: [true, "The phone number is already taken"],
    required: [true, "Please enter phone number"],
  },
  medicoLegalPostcode1: String,
  GMC: Number,
  email: { type: String, unique: true },
  qualifications: String,
  specialInterests: String,
  company: String,
  area: {
    type: String,
    required: true,
  },
  medicoLegalSummary: {
    type: String,
    default:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Mollitia veritatis praesentium libero cumque placeat vitae natus fugiat et nesciunt officia velit est animi sed dolor, iste, id ullam ipsum. Ducimus at aperiam nostrum itaque adipisci labore saepe expedita optio quae?",
  },
});

module.exports = Expert = mongoose.model("Expert", expertSchema);
