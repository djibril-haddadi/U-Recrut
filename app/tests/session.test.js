const { isConnected } = require('../session');

describe('session helpers', () => {
  test('isConnected returns false when userid is missing', () => {
    expect(isConnected({})).toBe(false);
    expect(isConnected({ userid: undefined })).toBe(false);
  });

  test('isConnected returns true when userid is set', () => {
    expect(isConnected({ userid: 'a@test.com', role: 'candidat' })).toBe(true);
  });

  test('isConnected enforces expected role when provided', () => {
    const session = { userid: 'a@test.com', role: 'candidat' };
    expect(isConnected(session, 'candidat')).toBe(true);
    expect(isConnected(session, 'admin')).toBe(false);
  });
});
