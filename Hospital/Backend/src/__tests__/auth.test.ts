import { describe, it, expect, beforeAll } from 'vitest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@hospital.com';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

describe('Auth - JWT Token Generation', () => {
  const signToken = (payload: { id: number; role: string; nombre: string }) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  };

  it('should sign a valid JWT for admin', () => {
    const token = signToken({ id: 0, role: 'ADMIN', nombre: 'Admin' });
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    expect(decoded.role).toBe('ADMIN');
    expect(decoded.id).toBe(0);
  });

  it('should sign a valid JWT for paciente', () => {
    const token = signToken({ id: 1, role: 'PACIENTE', nombre: 'Test Paciente' });
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    expect(decoded.role).toBe('PACIENTE');
    expect(decoded.id).toBe(1);
  });

  it('should sign a valid JWT for medico', () => {
    const token = signToken({ id: 2, role: 'MEDICO', nombre: 'Test Medico' });
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    expect(decoded.role).toBe('MEDICO');
    expect(decoded.id).toBe(2);
  });

  it('should reject an expired token', () => {
    const token = jwt.sign({ id: 0, role: 'ADMIN', nombre: 'Admin' }, JWT_SECRET, { expiresIn: '0s' });
    expect(() => jwt.verify(token, JWT_SECRET)).toThrow();
  });

  it('should reject a token with wrong secret', () => {
    const token = jwt.sign({ id: 0, role: 'ADMIN', nombre: 'Admin' }, 'wrong-secret');
    expect(() => jwt.verify(token, JWT_SECRET)).toThrow();
  });
});

describe('Auth - Password Hashing', () => {
  it('should verify bcrypt hash for admin', async () => {
    const plainPassword = 'admin123';
    const isValid = bcrypt.compareSync(plainPassword, ADMIN_PASSWORD_HASH);
    expect(isValid).toBe(true);
  });

  it('should reject wrong password for admin', async () => {
    const isValid = bcrypt.compareSync('wrong-password', ADMIN_PASSWORD_HASH);
    expect(isValid).toBe(false);
  });
});

describe('Auth - Admin Login (Integration)', () => {
  it('should have ADMIN_EMAIL configured', () => {
    expect(ADMIN_EMAIL).toBeTruthy();
    expect(ADMIN_EMAIL).toContain('@');
  });

  it('should have ADMIN_PASSWORD_HASH configured', () => {
    expect(ADMIN_PASSWORD_HASH).toBeTruthy();
    expect(ADMIN_PASSWORD_HASH.startsWith('$2a$') || ADMIN_PASSWORD_HASH.startsWith('$2b$')).toBe(true);
  });
});
