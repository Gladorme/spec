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

import { type Definition, type Display, type UnknownSpec } from '../common';

export type VariableName = string;

export type VariableValue = string | string[] | null;

export interface VariableDisplay extends Display {
  hidden?: boolean;
}

export interface VariableSpec {
  name: VariableName;
  display?: VariableDisplay;
}

export interface TextVariableDefinition extends Definition<TextVariableSpec> {
  kind: 'TextVariable';
}

export interface TextVariableSpec extends VariableSpec {
  value: string;
  constant?: boolean;
}

export interface ListVariableDefinition extends Definition<ListVariableSpec> {
  kind: 'ListVariable';
}

export interface ListVariableSpec<PluginSpec = UnknownSpec> extends VariableSpec {
  defaultValue?: VariableValue;
  allowMultiple: boolean;
  allowAllValue: boolean;
  customAllValue?: string;
  capturingRegexp?: string;
  sort?: string;
  plugin: Definition<PluginSpec>;
}

export interface BuiltinVariableDefinition extends Definition<BuiltinVariableSpec> {
  kind: 'BuiltinVariable';
}

export interface BuiltinVariableSpec extends VariableSpec {
  value: () => string;
  source: string;
}

export type VariableDefinition = TextVariableDefinition | ListVariableDefinition;

export const DEFAULT_ALL_VALUE = '$__all' as const;
