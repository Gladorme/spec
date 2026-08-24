// Copyright The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { describe, expect, it } from 'vitest';

import { ProfileData } from './profile-data';

// Based on the CPU profile with resource attributes and a span link in the OTel Profiles specification.
const profileData: ProfileData = {
  profile: {
    dictionary: {
      stringTable: [
        '',
        'samples',
        'count',
        'cpu',
        'nanoseconds',
        'handleRequest',
        'db.Query',
        'server.go',
        'db.go',
        'service.name',
        'process.executable.name',
        'my-service',
        'my-service.bin',
      ],
      functionTable: [{}, { nameStrindex: 5, filenameStrindex: 7 }, { nameStrindex: 6, filenameStrindex: 8 }],
      locationTable: [
        {},
        { lines: [{ functionIndex: 1, line: '45' }] },
        { lines: [{ functionIndex: 2, line: '112' }] },
      ],
      stackTable: [{}, { locationIndices: [2, 1] }, { locationIndices: [1] }],
      linkTable: [{}, { traceId: 'ESKqu8zd7v8AAAAAAAAAAA==', spanId: '/wECAwQFBgc=' }],
      mappingTable: [{}],
      attributeTable: [{}],
    },
    resourceProfiles: [
      {
        resource: {
          attributes: [
            { keyStrindex: 9, value: { stringValueStrindex: 11 } },
            { keyStrindex: 10, value: { stringValueStrindex: 12 } },
          ],
        },
        scopeProfiles: [
          {
            profiles: [
              {
                sampleType: { typeStrindex: 1, unitStrindex: 2 },
                samples: [
                  { stackIndex: 1, values: ['5'], linkIndex: 1 },
                  { stackIndex: 2, values: ['3'] },
                ],
                timeUnixNano: '2000000000000000000',
                durationNano: '1000000000',
                periodType: { typeStrindex: 3, unitStrindex: 4 },
                period: '50000000',
              },
            ],
          },
        ],
      },
    ],
  },
};

describe('ProfileData', () => {
  it('represents OTel profiles with dictionary-backed resource attributes and span links', () => {
    const dictionary = profileData.profile.dictionary;
    const profile = profileData.profile.resourceProfiles[0]?.scopeProfiles[0]?.profiles[0];

    expect(dictionary.stringTable[9]).toBe('service.name');
    expect(dictionary.linkTable[1]).toEqual({
      traceId: 'ESKqu8zd7v8AAAAAAAAAAA==',
      spanId: '/wECAwQFBgc=',
    });
    expect(profile?.samples).toHaveLength(2);
    expect(profile?.period).toBe('50000000');
  });
});
