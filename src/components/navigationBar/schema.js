import Joi from "joi-browser";

const schema = {
  work: Joi.number()
    .required()
    .integer()
    .min(1)
    .label("Time for work"),
  shortBreak: Joi.number()
    .required()
    .integer()
    .min(1)
    .label("Time for short break"),
  longBreak: Joi.number()
    .required()
    .integer()
    .min(1)
    .label("Time for long break"),
  delay: Joi.number()
    .required()
    .integer()
    .label("Long break delay")
};

export default schema;
