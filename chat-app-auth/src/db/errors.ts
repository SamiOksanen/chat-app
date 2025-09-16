import { Response } from 'express';
import { ValidationError, NotFoundError } from 'objection';

import objectionDbErrors from 'objection-db-errors';

const {
    DBError,
    UniqueViolationError,
    NotNullViolationError,
    ForeignKeyViolationError,
    CheckViolationError,
    DataError,
} = objectionDbErrors;

import type { ErrorResponse } from '../types/index.js';

export function errorHandler(err: Error, res: Response): void {
    if (err instanceof ValidationError) {
        switch (err.type) {
            case 'ModelValidation':
                res.status(400).send({
                    message: err.message,
                    type: 'ModelValidation',
                    data: err.data,
                } satisfies ErrorResponse);
                break;
            case 'RelationExpression':
                res.status(400).send({
                    message: err.message,
                    type: 'InvalidRelationExpression',
                    data: {},
                } satisfies ErrorResponse);
                break;
            case 'UnallowedRelation':
                res.status(400).send({
                    message: err.message,
                    type: 'UnallowedRelation',
                    data: {},
                } satisfies ErrorResponse);
                break;
            case 'InvalidGraph':
                res.status(400).send({
                    message: err.message,
                    type: 'InvalidGraph',
                    data: {},
                } satisfies ErrorResponse);
                break;
            default:
                res.status(400).send({
                    message: err.message,
                    type: 'UnknownValidationError',
                    data: {},
                } satisfies ErrorResponse);
                break;
        }
    } else if (err instanceof NotFoundError) {
        res.status(404).send({
            message: err.message,
            type: 'NotFound',
            data: {},
        } satisfies ErrorResponse);
    } else if (err instanceof UniqueViolationError) {
        res.status(409).send({
            message: err.message,
            type: 'UniqueViolation',
            data: {
                columns: err.columns,
                table: err.table,
                constraint: err.constraint,
            },
        } satisfies ErrorResponse);
    } else if (err instanceof NotNullViolationError) {
        res.status(400).send({
            message: err.message,
            type: 'NotNullViolation',
            data: {
                column: err.column,
                table: err.table,
            },
        } satisfies ErrorResponse);
    } else if (err instanceof ForeignKeyViolationError) {
        res.status(409).send({
            message: err.message,
            type: 'ForeignKeyViolation',
            data: {
                table: err.table,
                constraint: err.constraint,
            },
        } satisfies ErrorResponse);
    } else if (err instanceof CheckViolationError) {
        res.status(400).send({
            message: err.message,
            type: 'CheckViolation',
            data: {
                table: err.table,
                constraint: err.constraint,
            },
        } satisfies ErrorResponse);
    } else if (err instanceof DataError) {
        res.status(400).send({
            message: err.message,
            type: 'InvalidData',
            data: {},
        } satisfies ErrorResponse);
    } else if (err instanceof DBError) {
        res.status(500).send({
            message: err.message,
            type: 'UnknownDatabaseError',
            data: {},
        } satisfies ErrorResponse);
    } else {
        res.status(500).send({
            message: err.message,
            type: 'UnknownError',
            data: {},
        } satisfies ErrorResponse);
    }
}
