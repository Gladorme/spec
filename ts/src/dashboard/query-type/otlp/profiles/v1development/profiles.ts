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

import { AnyValue, InstrumentationScope } from '../../common/v1/common';
import { Resource } from '../../resource/v1/resource';

// https://github.com/open-telemetry/opentelemetry-proto/blob/v1.11.0/opentelemetry/proto/profiles/v1development/profiles.proto

/** OpenTelemetry Profiles data in its protobuf JSON representation. */
export interface ProfilesData {
  resourceProfiles: ResourceProfiles[];
  dictionary: ProfilesDictionary;
}

/** Dictionary tables shared by every profile in a ProfilesData message. */
export interface ProfilesDictionary {
  mappingTable: Mapping[];
  locationTable: Location[];
  functionTable: Function[];
  linkTable: Link[];
  stringTable: string[];
  attributeTable: KeyValueAndUnit[];
  stackTable: Stack[];
}

export interface ResourceProfiles {
  resource?: Resource;
  scopeProfiles: ScopeProfiles[];
  schemaUrl?: string;
}

export interface ScopeProfiles {
  scope?: InstrumentationScope;
  profiles: Profile[];
  schemaUrl?: string;
}

export interface Profile {
  sampleType: ValueType;
  samples: Sample[];
  /** Nanoseconds since the Unix epoch, encoded as a decimal string by protobuf JSON. */
  timeUnixNano?: string;
  /** Nanoseconds, encoded as a decimal string by protobuf JSON. */
  durationNano?: string;
  periodType?: ValueType;
  /** An int64 encoded as a decimal string by protobuf JSON. */
  period?: string;
  /** A 16-byte profile identifier encoded as base64 by protobuf JSON. */
  profileId?: string;
  droppedAttributesCount?: number;
  originalPayloadFormat?: string;
  /** Original payload bytes encoded as base64 by protobuf JSON. */
  originalPayload?: string;
  attributeIndices?: number[];
}

export interface Link {
  /** A 16-byte trace identifier encoded as base64 by protobuf JSON. */
  traceId?: string;
  /** An 8-byte span identifier encoded as base64 by protobuf JSON. */
  spanId?: string;
}

export interface ValueType {
  typeStrindex?: number;
  unitStrindex?: number;
}

export interface Sample {
  stackIndex?: number;
  attributeIndices?: number[];
  linkIndex?: number;
  /** Int64 values encoded as decimal strings by protobuf JSON. */
  values?: string[];
  /** Nanoseconds since the Unix epoch, encoded as decimal strings by protobuf JSON. */
  timestampsUnixNano?: string[];
}

export interface Mapping {
  /** A uint64 encoded as a decimal string by protobuf JSON. */
  memoryStart?: string;
  /** A uint64 encoded as a decimal string by protobuf JSON. */
  memoryLimit?: string;
  /** A uint64 encoded as a decimal string by protobuf JSON. */
  fileOffset?: string;
  filenameStrindex?: number;
  attributeIndices?: number[];
}

export interface Stack {
  /** References locations in leaf-first order. */
  locationIndices?: number[];
}

export interface Location {
  mappingIndex?: number;
  /** A uint64 encoded as a decimal string by protobuf JSON. */
  address?: string;
  lines?: Line[];
  attributeIndices?: number[];
}

export interface Line {
  functionIndex?: number;
  /** An int64 encoded as a decimal string by protobuf JSON. */
  line?: string;
  /** An int64 encoded as a decimal string by protobuf JSON. */
  column?: string;
}

export interface Function {
  nameStrindex?: number;
  systemNameStrindex?: number;
  filenameStrindex?: number;
  /** An int64 encoded as a decimal string by protobuf JSON. */
  startLine?: string;
}

export interface KeyValueAndUnit {
  keyStrindex?: number;
  value?: AnyValue;
  unitStrindex?: number;
}
