import { Request, Response, NextFunction } from 'express';

// Simple API key authentication middleware
export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  
  // Check if API key exists and matches expected value
  // In a real app, this would check against a database or environment variable
  if (!apiKey || apiKey !== 'test-api-key') {
    return res.status(401).json({ message: 'Unauthorized: Invalid API key' });
  }
  
  next();
}; 