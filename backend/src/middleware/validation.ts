import { body } from 'express-validator';
import { TaskStatus } from '../models/Task';

export const validateTaskCreation = [
  body('title')
    .notEmpty()
    .withMessage('Task title is required')
    .isString()
    .withMessage('Task title must be a string')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Task title must be between 1 and 200 characters')
];

export const validateStatusUpdate = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isString()
    .withMessage('Status must be a string')
    .trim()
    .custom((value) => {
      if (!Object.values(TaskStatus).includes(value as TaskStatus)) {
        throw new Error(`Status must be one of: ${Object.values(TaskStatus).join(', ')}`);
      }
      return true;
    })
]; 