import Joi from "joi-browser";

const schema = {
    workTime: Joi.number()
      .required()
      .min(1)
      .label("Time for work"),
    shortBreakTime: Joi.number()
      .required()
      .min(1)
      .label("Time for short break"),
    longBreakTime: Joi.number()
      .required()
      .min(1)
      .label("Time for long break"),
    lBDelay: Joi.number()
      .required()
      .label("Long break delay")
  };

export default schema;