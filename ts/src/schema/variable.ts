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

import { z } from 'zod';

import {
  ListVariableDefinition,
  ListVariableSpec,
  TextVariableDefinition,
  TextVariableSpec,
  VariableDefinition,
  VariableDisplay,
} from '../dashboard';
import { PluginSchema, pluginSchema } from './plugin';

export const variableDisplaySchema: z.ZodSchema<VariableDisplay> = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  hidden: z.boolean().optional(),
});

export const variableListSpecSchema: z.ZodSchema<ListVariableSpec> = z.object({
  name: z.string().min(1),
  display: variableDisplaySchema.optional(),
  defaultValue: z.string().or(z.array(z.string())).optional(),
  allowAllValue: z.boolean(),
  allowMultiple: z.boolean(),
  customAllValue: z.string().optional(),
  capturingRegexp: z.string().optional(),
  sort: z
    .enum([
      'none',
      'alphabetical-asc',
      'alphabetical-desc',
      'numerical-asc',
      'numerical-desc',
      'alphabetical-ci-asc',
      'alphabetical-ci-desc',
    ])
    .optional(),
  plugin: pluginSchema,
});

export function buildVariableListSpecSchema(customPluginSchema: PluginSchema): z.ZodSchema<ListVariableSpec> {
  return z.object({
    name: z.string().min(1),
    display: variableDisplaySchema.optional(),
    defaultValue: z.string().or(z.array(z.string())).optional(),
    allowAllValue: z.boolean(),
    allowMultiple: z.boolean(),
    customAllValue: z.string().optional(),
    capturingRegexp: z.string().optional(),
    sort: z
      .enum([
        'none',
        'alphabetical-asc',
        'alphabetical-desc',
        'numerical-asc',
        'numerical-desc',
        'alphabetical-ci-asc',
        'alphabetical-ci-desc',
      ])
      .optional(),
    plugin: customPluginSchema,
  });
}

export const variableListSchema = z.object({
  kind: z.literal('ListVariable'),
  spec: variableListSpecSchema,
});

export function buildVariableListSchema(customPluginSchema: PluginSchema): typeof variableListSchema {
  return z.object({
    kind: z.literal('ListVariable'),
    spec: buildVariableListSpecSchema(customPluginSchema),
  });
}

export const variableTextSpecSchema: z.ZodSchema<TextVariableSpec> = z.object({
  name: z.string().min(1),
  display: variableDisplaySchema.optional(),
  value: z.string(),
  constant: z.boolean().optional(),
});

export const variableTextSchema = z.object({
  kind: z.literal('TextVariable'),
  spec: variableTextSpecSchema,
});

export const variableSpecSchema: z.ZodSchema<TextVariableDefinition | ListVariableDefinition> = z.discriminatedUnion(
  'kind',
  [variableTextSchema, variableListSchema]
);

export function buildVariableSpecSchema(customPluginSchema: PluginSchema): z.ZodSchema<VariableDefinition> {
  return z.union([variableTextSchema, buildVariableListSchema(customPluginSchema)]);
}

export const variableDefinitionSchema: z.ZodSchema<VariableDefinition> = variableSpecSchema;

export function buildVariableDefinitionSchema(customPluginSchema: PluginSchema): z.ZodSchema<VariableDefinition> {
  return z.discriminatedUnion('kind', [
    z.object({
      kind: z.literal('ListVariable'),
      spec: buildVariableListSpecSchema(customPluginSchema),
    }),
    z.object({
      kind: z.literal('TextVariable'),
      spec: variableTextSpecSchema,
    }),
  ]);
}
