import { body, param } from "express-validator";

// Reusable string checker
const requiredString = (field, label) =>
  body(field)
    .isString().withMessage(`${label} must be a string!`)
    .bail()
    .trim()
    .notEmpty().withMessage(`${label} is required!`);

const MODE_VALUES = ["In-Person", "Online"];
const STATUS_VALUES = ["PENDING", "CONFIRMED", "DECLINED", "CANCELLED"];

// Use the SAME name as your route: /appointments/:appointmentId
export const idParamCheck = [
  param("appointmentId").isMongoId().withMessage("Invalid appointment ID!"),
];

function isFutureISODate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("StartsAt must be a valid date!");
  }
  if (date.getTime() <= Date.now()) {
    throw new Error("StartsAt must be a future date!");
  }
  return true;
}

export const createAppointmentChecks = [
  requiredString("service", "Service"),
  body("mode")
    .isIn(MODE_VALUES)
    .withMessage(`Mode must be one of: ${MODE_VALUES.join(", ")}`),

  // For now you require startsAt (ISO). If you plan to allow date+time later, we can extend this.
  body("startsAt").custom(isFutureISODate),

  body("notes")
    .optional({ nullable: true })
    .isString()
    .withMessage("Notes must be a string!")
    .bail()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Notes can be up to 2000 characters long!"),
];

export const updateAppointmentChecks = [
  body("service")
    .optional({ nullable: true })
    .isString()
    .withMessage("Service must be a string!")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Service cannot be empty!"),

  body("mode")
    .optional({ nullable: true })
    .isIn(MODE_VALUES)
    .withMessage(`Mode must be one of: ${MODE_VALUES.join(", ")}`),

  body("startsAt")
    .optional({ nullable: true })
    .custom(isFutureISODate),

  body("notes")
    .optional({ nullable: true })
    .isString()
    .withMessage("Notes must be a string!")
    .bail()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Notes can be up to 2000 characters long!"),

  body("status")
    .optional({ nullable: true })
    .isIn(STATUS_VALUES)
    .withMessage(`Status must be one of: ${STATUS_VALUES.join(", ")}`),
];
