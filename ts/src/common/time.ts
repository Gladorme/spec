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

import { sub } from 'date-fns';
import {
  DurationString,
  ONE_DAY_IN_MS,
  ONE_HOUR_IN_MS,
  ONE_MINUTE_IN_MS,
  ONE_SECOND_IN_MS,
  ONE_WEEK_IN_MS,
  ONE_YEAR_IN_MS,
  parseDurationString,
} from './duration';

export type UnixTimeMs = number;

export type DateTimeFormat = number | string;

export interface AbsoluteTimeRange {
  start: Date;
  end: Date;
}

export interface RelativeTimeRange {
  // End date or undefined if relative to the current Date
  end?: Date;
  pastDuration: DurationString;
}

export type TimeRangeValue = AbsoluteTimeRange | RelativeTimeRange;

/**
 * Determine whether a given time range is relative
 */
export function isRelativeTimeRange(timeRange: TimeRangeValue): timeRange is RelativeTimeRange {
  return (timeRange as RelativeTimeRange).pastDuration !== undefined;
}

/**
 * Determine whether a given time range is absolute
 */
export function isAbsoluteTimeRange(timeRange: TimeRangeValue): timeRange is AbsoluteTimeRange {
  return (timeRange as AbsoluteTimeRange).start !== undefined && (timeRange as AbsoluteTimeRange).end !== undefined;
}

/**
 * Returns an absolute time range from a RelativeTimeRange.
 */
export function toAbsoluteTimeRange(timeRange: RelativeTimeRange): AbsoluteTimeRange {
  const end = timeRange.end ?? new Date();

  return {
    start: sub(end, parseDurationString(timeRange.pastDuration)),
    end,
  };
}

const DEFAULT_STEP_MS = 15000;

const ROUNDED_STEP_INTERVALS = [
  // max: 0.015s
  { maxMs: 15, roundedStepMs: 10, display: '0.01s' },
  // max: 0.035s
  { maxMs: 35, roundedStepMs: 20, display: '0.02s' },
  // max: 0.075s
  { maxMs: 75, roundedStepMs: 50, display: '0.05s' },
  // max: 0.15s
  { maxMs: 150, roundedStepMs: 100, display: '0.1s' },
  // max: 0.35s
  { maxMs: 350, roundedStepMs: 200, display: '0.2s' },
  // max: 0.75s
  { maxMs: 750, roundedStepMs: 500, display: '0.5s' },
  // max: 1.5s
  { maxMs: ONE_SECOND_IN_MS * 1.5, roundedStepMs: ONE_SECOND_IN_MS, display: '1s' },
  // max: 3.5s
  { maxMs: ONE_SECOND_IN_MS * 3.5, roundedStepMs: ONE_SECOND_IN_MS * 2, display: '2s' },
  // max: 7.5s
  { maxMs: ONE_SECOND_IN_MS * 7.5, roundedStepMs: ONE_SECOND_IN_MS * 5, display: '5s' },
  // max: 12.5s
  { maxMs: ONE_SECOND_IN_MS * 12.5, roundedStepMs: ONE_SECOND_IN_MS * 10, display: '10s' },
  // max: 17.5s
  { maxMs: ONE_SECOND_IN_MS * 17.5, roundedStepMs: ONE_SECOND_IN_MS * 15, display: '15s' },
  // max: 25s
  { maxMs: ONE_SECOND_IN_MS * 25, roundedStepMs: ONE_SECOND_IN_MS * 20, display: '20s' },
  // max: 45s
  { maxMs: ONE_SECOND_IN_MS * 45, roundedStepMs: ONE_SECOND_IN_MS * 30, display: '30s' },
  // max: 1.5m
  { maxMs: ONE_MINUTE_IN_MS * 1.5, roundedStepMs: ONE_MINUTE_IN_MS, display: '1m' },
  // max: 3.5m
  { maxMs: ONE_MINUTE_IN_MS * 3.5, roundedStepMs: ONE_MINUTE_IN_MS * 2, display: '2m' },
  // max: 7.5m
  { maxMs: ONE_MINUTE_IN_MS * 7.5, roundedStepMs: ONE_MINUTE_IN_MS * 5, display: '5m' },
  // max: 12.5m
  { maxMs: ONE_MINUTE_IN_MS * 12.5, roundedStepMs: ONE_MINUTE_IN_MS * 10, display: '10m' },
  // max: 12.5m
  { maxMs: ONE_MINUTE_IN_MS * 12.5, roundedStepMs: ONE_MINUTE_IN_MS * 15, display: '15m' },
  // max: 25m
  { maxMs: ONE_MINUTE_IN_MS * 25, roundedStepMs: ONE_MINUTE_IN_MS * 20, display: '20m' },
  // max: 45m
  { maxMs: ONE_MINUTE_IN_MS * 45, roundedStepMs: ONE_MINUTE_IN_MS * 30, display: '30m' },
  // max: 1.5h
  { maxMs: ONE_HOUR_IN_MS * 1.5, roundedStepMs: ONE_HOUR_IN_MS, display: '1h' },
  // max: 2.5h
  { maxMs: ONE_HOUR_IN_MS * 2.5, roundedStepMs: ONE_HOUR_IN_MS * 2, display: '2h' },
  // max: 4.5h
  { maxMs: ONE_HOUR_IN_MS * 4.5, roundedStepMs: ONE_HOUR_IN_MS * 3, display: '3h' },
  // max: 9h
  { maxMs: ONE_HOUR_IN_MS * 9, roundedStepMs: ONE_HOUR_IN_MS * 6, display: '6h' },
  // max: 1d
  { maxMs: ONE_DAY_IN_MS, roundedStepMs: ONE_HOUR_IN_MS * 12, display: '12h' },
  // max: 1w
  { maxMs: ONE_WEEK_IN_MS, roundedStepMs: ONE_DAY_IN_MS, display: '1d' },
  // max: 3w
  { maxMs: ONE_WEEK_IN_MS * 3, roundedStepMs: ONE_WEEK_IN_MS, display: '1w' },
  // max: 6w
  { maxMs: ONE_WEEK_IN_MS * 6, roundedStepMs: ONE_DAY_IN_MS * 30, display: '30d' },
  // max: 2y
  { maxMs: ONE_YEAR_IN_MS * 2, roundedStepMs: ONE_YEAR_IN_MS, display: '1y' },
];

/**
 * Round interval to clearer increments
 */
export function roundStepInterval(stepMs: number): number {
  for (const { maxMs, roundedStepMs } of ROUNDED_STEP_INTERVALS) {
    if (stepMs < maxMs) {
      return roundedStepMs;
    }
  }
  return DEFAULT_STEP_MS;
}

/**
 * Gets a suggested step/interval size for a time range based on the width of a visual component.
 */
export function getSuggestedStepMs(timeRange: AbsoluteTimeRange, width: number): number {
  const queryRangeMs = timeRange.end.valueOf() - timeRange.start.valueOf();
  const stepMs = Math.floor(queryRangeMs / width);
  return roundStepInterval(stepMs);
}
