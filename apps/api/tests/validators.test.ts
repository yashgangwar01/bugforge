import { describe, expect, it } from 'vitest';
import { loginSchema, projectSchema, taskSchema, registerSchema } from '../src/validators/schemas.js';

describe('projectSchema', () => {
  it('accepts a valid uppercase project key', () => {
    expect(projectSchema.parse({ name: 'Web app', key: 'WEB' }).key).toBe('WEB');
  });

  it('normalises a lowercase key to uppercase', () => {
    // The schema applies .toUpperCase() before the regex check
    expect(projectSchema.parse({ name: 'Web app', key: 'web' }).key).toBe('WEB');
  });

  it('rejects a key with invalid characters', () => {
    expect(() => projectSchema.parse({ name: 'Web app', key: 'WEB-1' })).toThrow();
  });

  it('rejects a key that is too short (single char)', () => {
    expect(() => projectSchema.parse({ name: 'Web app', key: 'W' })).toThrow();
  });
});

describe('taskSchema', () => {
  it('rejects unsupported task status values', () => {
    expect(() => taskSchema.parse({ title: 'Ship it', status: 'blocked' })).toThrow();
  });

  it('accepts a valid partial update (title only)', () => {
    expect(taskSchema.partial().parse({ title: 'New title' })).toEqual({ title: 'New title' });
  });

  it('strips unknown fields to prevent mass-assignment', () => {
    // taskSchema.partial() should not carry through unknown keys
    const parsed = taskSchema.partial().parse({ title: 'x', createdBy: 'evil-id', project: 'evil' });
    expect(parsed).not.toHaveProperty('createdBy');
    expect(parsed).not.toHaveProperty('project');
  });
});

describe('loginSchema', () => {
  it('rejects an empty password', () => {
    expect(() => loginSchema.parse({ email: 'a@b.com', password: '' })).toThrow();
  });

  it('rejects a password shorter than 8 characters', () => {
    expect(() => loginSchema.parse({ email: 'a@b.com', password: '1234567' })).toThrow();
  });

  it('rejects an invalid email format', () => {
    expect(() => loginSchema.parse({ email: 'not-an-email', password: 'ValidPass1' })).toThrow();
  });
});

describe('registerSchema', () => {
  it('rejects a name shorter than 2 characters', () => {
    expect(() => registerSchema.parse({ name: 'A', email: 'a@b.com', password: '12345678' })).toThrow();
  });

  it('accepts a valid registration payload', () => {
    const result = registerSchema.parse({ name: 'Alice', email: 'alice@example.com', password: 'Secur3Pass' });
    expect(result.name).toBe('Alice');
    expect(result.email).toBe('alice@example.com');
  });
});
