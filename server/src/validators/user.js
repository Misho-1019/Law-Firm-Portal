import { body, param } from "express-validator";

const requiredEmail = (field, label) => 
    body(field)
        .isEmail().withMessage(`${label} must be a valid email address!`)
        .bail()
        .trim()
        .notEmpty().withMessage(`${label} is required!`)
        .bail()
        .matches(/\@[a-zA-Z]+.[a-zA-Z]+$/).withMessage(`${label} must be a valid email address!`);

const requiredUsername = (field, label) =>
    body(field)
        .isString().withMessage(`${label} must be a string!`)
        .bail()
        .trim()
        .isLength({ min: 2 }).withMessage(`${label} must be at least 2 characters long!`)
        .notEmpty().withMessage(`${label} is required!`);

const requiredPassword = (field, label) =>
    body(field)
        .notEmpty().withMessage(`${label} is required!`)
        .bail()
        .isLength({ min: 6 }).withMessage(`${label} must be at least 6 characters long!`)
        .bail()

const requiredString = (field, label) =>
    body(field)
        .isString().withMessage(`${label} must be a string!`)
        .bail()
        .trim()
        .notEmpty().withMessage(`${label} is required!`);

export const registerUserChecks = [
    requiredString('firstName', 'First name'),
    requiredString('lastName', 'Last name'),
    requiredUsername('username', 'Username'),
    requiredEmail('email', 'Email'),
    requiredPassword('password', 'Password'),
    body('phone')
        .optional({ nullable: true })
        .isString().withMessage('Phone must be a string!')
        .bail()
        .trim(),
]

export const loginUserChecks = [
    requiredEmail('email', 'Email'),
    requiredPassword('password', 'Password'),
]