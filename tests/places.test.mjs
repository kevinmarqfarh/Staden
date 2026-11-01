import test from 'node:test';
import assert from 'node:assert/strict';
import { places, findPlace, placeForEvent, placeProgramme } from '../src/lib/places.ts';
import { parseFollows } from '../src/lib/follows.ts';

test('place IDs and routes are unique; room and street aliases share the museum ID', () => {
  assert.equal(new Set(places.map(p => p.id)).size, places.length);
  assert.equal(new Set(places.map(p => p.slug)).size, places.length);
  for (const name of ['Världskulturmuseet', 'Världskulturmuseet, Studion', 'Världskulturmuseet, Södra vägen 54']) assert.equal(findPlace(name)?.id, 'obj-varldskulturmuseet');
  assert.equal(findPlace('Världskulturmuseet café'), undefined);
  assert.equal(findPlace('okänd plats'), undefined);
});

test('programme excludes directory/expired/other venues and splits ongoing from upcoming', () => {
  const base = { venue: 'Världskulturmuseet, Trappscenen', dateLabel: 'Program', startDate: '2026-11-02' };
  const events = [
    {...base, id:'late', startDate:'2026-11-12'}, {...base, id:'next'},
    {...base, id:'ongoing', startDate:'2026-10-01', endDate:'2026-11-10'},
    {...base, id:'old', startDate:'2026-10-01'},
    {...base, id:'place', dateLabel:'Permanent', isOngoing:true},
    {...base, id:'other', venue:'Annat museum'},
  ];
  const result = placeProgramme('obj-varldskulturmuseet', events, '2026-11-01|0|10:00');
  assert.deepEqual(result.upcoming.map(e=>e.id), ['next','late']);
  assert.deepEqual(result.ongoing.map(e=>e.id), ['ongoing']);
  assert.equal(placeForEvent(events[0]).slug, 'varldskulturmuseet');
});

test('legacy follows migrate to stable place IDs and retain known activities', () => {
  const follows = parseFollows(JSON.stringify([{name:'Världskulturmuseet, Studion',knownIds:['known']}]));
  assert.equal(follows[0].placeId, 'obj-varldskulturmuseet');
  assert.deepEqual(follows[0].knownIds, ['known']);
  const renamed = parseFollows(JSON.stringify([{...follows[0],name:'Gammalt namn'}]));
  assert.equal(renamed[0].name,'Världskulturmuseet');
});
