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

// https://github.com/open-telemetry/opentelemetry-proto/blob/v1.11.0/opentelemetry/proto/common/v1/common.proto

interface KeyValueBase {
  value: AnyValue;
}

export type KeyValue = KeyValueBase &
  (
    | {
        key: string;
        keyStrindex?: never;
      }
    | {
        key?: never;
        keyStrindex: number;
      }
  );

export type AnyValue =
  | { stringValue: string }
  | { intValue: string }
  | { doubleValue: number }
  | { boolValue: boolean }
  | { arrayValue: ArrayValue }
  | { kvlistValue: KeyValueList }
  | { bytesValue: string }
  | { stringValueStrindex: number };

export interface ArrayValue {
  values?: AnyValue[];
}

export interface KeyValueList {
  values?: KeyValue[];
}

export interface InstrumentationScope {
  name?: string;
  version?: string;
  attributes?: KeyValue[];
  droppedAttributesCount?: number;
}

export interface EntityRef {
  schemaUrl?: string;
  type: string;
  idKeys: string[];
  descriptionKeys?: string[];
}
