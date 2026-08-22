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

import { type Duration } from 'date-fns';

import { type AbsoluteTimeRange } from './time';

export const ONE_SECOND_IN_MS = 1000;
export const ONE_MINUTE_IN_MS = 60000;
export const ONE_HOUR_IN_MS = 3600000;
export const ONE_DAY_IN_MS = 86400000; // assuming a day has always 24h
export const ONE_WEEK_IN_MS = 604800000; // assuming a week has always 7d
export const ONE_YEAR_IN_MS = 31536000000; // assuming a year has always 365d

type MillisecondsDurationString = `${number}ms`;
type SecondsDurationString = `${number}s`;
type MinutesDurationString = `${number}m`;
type HoursDurationString = `${number}h`;
type DaysDurationString = `${number}d`;
type WeeksDurationString = `${number}w`;
type YearsDurationString = `${number}y`;

export type DurationString = Exclude<
  `${YearsDurationString | ''}${WeeksDurationString | ''}${DaysDurationString | ''}${HoursDurationString | ''}${
    | MinutesDurationString
    | ''}${SecondsDurationString | ''}${MillisecondsDurationString | ''}`,
  ''
>;

export const DURATION_REGEX = /^(?:(\d+)y)?(?:(\d+)w)?(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?(?:(\d+)ms)?$/;

/**
 * Parses a DurationString into a Duration object with numeric values that can
 * be used to do Date math. Throws if not a valid duration string.
 */
export function parseDurationString(durationString: string): Duration {
  const matches = DURATION_REGEX.exec(durationString);
  if (matches === null) {
    throw new Error(`Invalid duration string '${durationString}'`);
  }

  return {
    years: parseInt(matches[1] ?? '0'),
    months: 0,
    weeks: parseInt(matches[2] ?? '0'),
    days: parseInt(matches[3] ?? '0'),
    hours: parseInt(matches[4] ?? '0'),
    minutes: parseInt(matches[5] ?? '0'),
    seconds: parseInt(matches[6] ?? '0') + parseInt(matches[7] ?? '0') / 1000,
  };
}

/**
 * Returns true if the given string is a valid DurationString.
 */
export function isDurationString(maybeDuration: string): maybeDuration is DurationString {
  if (maybeDuration === '') return false;
  return DURATION_REGEX.test(maybeDuration);
}

export function formatDuration(duration: Duration): DurationString {
  const result: string[] = [];
  if (duration.years) {
    result.push(`${duration.years}y`);
  }
  if (duration.weeks) {
    result.push(`${duration.weeks}w`);
  }
  if (duration.days) {
    result.push(`${duration.days}d`);
  }
  if (duration.hours) {
    result.push(`${duration.hours}h`);
  }
  if (duration.minutes) {
    result.push(`${duration.minutes}m`);
  }
  if (duration.seconds) {
    const seconds = Math.trunc(duration.seconds);
    if (seconds) {
      result.push(`${seconds}s`);
    }
    const ms = Math.round((duration.seconds - seconds) * 1000);
    if (ms) {
      result.push(`${ms}ms`);
    }
  }
  return result.join('') as DurationString;
}

export function intervalToDuration(timeRange: AbsoluteTimeRange): Duration {
  const durationInMs = timeRange.end.valueOf() - timeRange.start.valueOf();
  return convertTimeToDuration(durationInMs);
}

export function convertTimeToDuration(durationInMs: number): Duration {
  const years = Math.trunc(durationInMs / ONE_YEAR_IN_MS);
  if (years > 0) durationInMs -= years * ONE_YEAR_IN_MS;
  const weeks = Math.trunc(durationInMs / ONE_WEEK_IN_MS);
  if (weeks > 0) durationInMs -= weeks * ONE_WEEK_IN_MS;
  const days = Math.trunc(durationInMs / ONE_DAY_IN_MS);
  if (days > 0) durationInMs -= days * ONE_DAY_IN_MS;
  const hours = Math.trunc(durationInMs / ONE_HOUR_IN_MS);
  if (hours > 0) durationInMs -= hours * ONE_HOUR_IN_MS;
  const minutes = Math.trunc(durationInMs / ONE_MINUTE_IN_MS);
  if (minutes > 0) durationInMs -= minutes * ONE_MINUTE_IN_MS;

  return {
    years: years,
    months: 0,
    weeks: weeks,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: durationInMs / 1000,
  };
}
