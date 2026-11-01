import test from 'node:test';
import assert from 'node:assert/strict';
import { activitiesForPlace, parseFollows, placeKey, writeFollows, getFollowsSnapshot, subscribeFollows, FOLLOWS_KEY } from '../src/lib/follows.ts';

test('follows validate storage and deduplicate normalized places', () => {
  assert.deepEqual(parseFollows('{broken'), []);
  assert.deepEqual(parseFollows('{}'), []);
  assert.deepEqual(parseFollows('x'.repeat(500001)), []);
  const result = parseFollows(JSON.stringify([
    { name: ' Röda  Sten ', knownIds: ['one', 'one', null] },
    { name: 'röda sten', knownIds: [] },
    { name: '', knownIds: [] },
    { name: 'Invalid', knownIds: null },
  ]));
  assert.equal(result.length, 1);
  assert.deepEqual(result[0].knownIds, ['one']);
  assert.equal(placeKey('Ro\u0308da Sten'), placeKey('Röda Sten'));
});

test('feed matches exact venue, excludes expired and permanent entries, sorts activities', () => {
  const base = { venue: 'Röda Sten', dateLabel: 'November', startDate: '2026-11-02' };
  const events = [
    { ...base, id: 'later', startDate: '2026-11-04' },
    { ...base, id: 'new' },
    { ...base, id: 'ended', startDate: '2026-10-01' },
    { ...base, id: 'other', venue: 'Röda Sten café' },
    { ...base, id: 'directory', dateLabel: 'Permanent', isOngoing: true },
  ];
  const feed = activitiesForPlace(' röda sten ', events, '2026-10-28|1|12:00');
  assert.deepEqual(feed.map(e => e.id), ['new', 'later']);
  const follow = { name: 'Röda Sten', knownIds: ['later'] };
  assert.deepEqual(feed.filter(e => !follow.knownIds.includes(e.id)).map(e => e.id), ['new']);
});

test('follow storage persists, broadcasts, unfollows and reports blocked storage', () => {
  const original = globalThis.window;
  const events = new EventTarget();
  const storage = new Map();
  globalThis.window = Object.assign(events, { localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, val) => storage.set(key, val) } });
  try {
    let count = 0;
    const unsubscribe = subscribeFollows(() => count++);
    assert.equal(writeFollows([{ name: 'Test', knownIds: [] }]), true);
    assert.equal(parseFollows(getFollowsSnapshot())[0].name, 'Test');
    assert.ok(storage.has(FOLLOWS_KEY));
    assert.equal(count, 1);
    window.dispatchEvent(new Event('storage'));
    assert.equal(count, 2);
    writeFollows([]);
    assert.deepEqual(parseFollows(getFollowsSnapshot()), []);
    unsubscribe();
    window.localStorage.setItem = () => { throw new Error('blocked'); };
    assert.equal(writeFollows([]), false);
  } finally { globalThis.window = original; }
});

test('directory venue addresses resolve to their explicit place name', () => {
  const events = [
    { id: 'place', title: 'Galleri Test', venue: 'Galleri Test, Gatan 2', dateLabel: 'Permanent', startDate: '2026-01-01', isOngoing: true },
    { id: 'show', title: 'Ny utställning', venue: 'Galleri Test', dateLabel: 'November', startDate: '2026-11-01' },
  ];
  assert.deepEqual(activitiesForPlace('Galleri Test, Gatan 2', events, '2026-10-29|0|09:00').map(e => e.id), ['show']);
});
