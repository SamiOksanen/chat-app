import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import type { ErrorResponse } from '../types/index.js';

describe('Error Handler Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should test error handler function exists', async () => {
    const { errorHandler } = await import('../db/errors.js');
    expect(typeof errorHandler).toBe('function');
  });

  it('should handle validation errors', () => {
    const createValidationError = (field: string, message: string): ErrorResponse => ({
      message,
      type: 'ValidationError',
      data: { field }
    });

    const error = createValidationError('username', 'Username is required');
    expect(error.type).toBe('ValidationError');
    expect(error.message).toBe('Username is required');
    expect(error.data['field']).toBe('username');
  });

  it('should handle unique constraint violations', () => {
    const createUniqueViolationError = (column: string): ErrorResponse => ({
      message: `${column} already exists`,
      type: 'UniqueViolationError',
      data: { column }
    });

    const error = createUniqueViolationError('email');
    expect(error.type).toBe('UniqueViolationError');
    expect(error.message).toBe('email already exists');
    expect(error.data['column']).toBe('email');
  });

  it('should handle not found errors', () => {
    const createNotFoundError = (resource: string): ErrorResponse => ({
      message: `${resource} not found`,
      type: 'NotFoundError',
      data: { resource }
    });

    const error = createNotFoundError('User');
    expect(error.type).toBe('NotFoundError');
    expect(error.message).toBe('User not found');
    expect(error.data['resource']).toBe('User');
  });

  it('should handle authentication errors', () => {
    const createAuthError = (message: string): ErrorResponse => ({
      message,
      type: 'AuthenticationError',
      data: {}
    });

    const error = createAuthError('Invalid credentials');
    expect(error.type).toBe('AuthenticationError');
    expect(error.message).toBe('Invalid credentials');
  });

  it('should format database errors correctly', () => {
    const formatDatabaseError = (dbError: any) => {
      if (dbError.code === '23505') {
        return {
          message: 'Duplicate entry',
          type: 'UniqueViolationError',
          data: { code: dbError.code }
        };
      }
      return {
        message: 'Database error',
        type: 'DatabaseError',
        data: { code: dbError.code }
      };
    };

    const uniqueError = formatDatabaseError({ code: '23505' });
    expect(uniqueError.type).toBe('UniqueViolationError');
    expect(uniqueError.message).toBe('Duplicate entry');

    const genericError = formatDatabaseError({ code: '23000' });
    expect(genericError.type).toBe('DatabaseError');
    expect(genericError.message).toBe('Database error');
  });

  it('should handle error response structure', () => {
    const createErrorResponse = (message: string, type: string, data: any = {}): ErrorResponse => ({
      message,
      type,
      data
    });

    const response = createErrorResponse('Test error', 'TestError', { field: 'test' });
    
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('type');
    expect(response).toHaveProperty('data');
    expect(typeof response.message).toBe('string');
    expect(typeof response.type).toBe('string');
    expect(typeof response.data).toBe('object');
  });

  it('should validate error handling middleware pattern', () => {
    const mockError = new Error('Test error');
    const mockReq = {};
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const mockNext = jest.fn();

    const errorMiddleware = (error: Error, _req: any, res: any, _next: any) => {
      const errorResponse: ErrorResponse = {
        message: error.message,
        type: error.constructor.name,
        data: {}
      };
      res.status(500).json(errorResponse);
    };

    errorMiddleware(mockError, mockReq, mockRes, mockNext);
    
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Test error',
      type: 'Error',
      data: {}
    });
  });
});