import env from '@config/env';
import {
  formatInTimeZone,
  toZonedTime,
  fromZonedTime,
  getTimezoneOffset,
  FormatOptionsWithTZ,
} from 'date-fns-tz';
import { parseISO } from 'date-fns';
import { Logger } from '@nestjs/common';

export class TimezoneUtils {
  private readonly logger = new Logger(TimezoneUtils.name);
  private static _timezone: string = env.TZ || 'America/Recife';

  constructor() {
    this.logger.debug(
      'TimezoneUtils initialized with timezone: ' + TimezoneUtils._timezone,
    );
  }

  static setTimezone(timezone: string) {
    TimezoneUtils._timezone = timezone;
  }

  static getTimezone(): string {
    return TimezoneUtils._timezone;
  }

  static toUTC(date: Date | string | number): Date {
    const zonedDate =
      typeof date === 'string' ? parseISO(date) : new Date(date);
    return fromZonedTime(zonedDate, this._timezone);
  }

  static fromUTC(date: Date | string | number): Date {
    const utcDate = typeof date === 'string' ? parseISO(date) : new Date(date);
    return toZonedTime(utcDate, this._timezone);
  }

  static formatDate(
    date: Date | string | number,
    formatStr: string,
    options?: FormatOptionsWithTZ,
  ): string {
    return formatInTimeZone(date, TimezoneUtils._timezone, formatStr, options);
  }

  static formatInTimeZone(
    date: Date | string | number,
    formatStr: string,
    timeZone?: string,
    options?: FormatOptionsWithTZ,
  ): string {
    return formatInTimeZone(
      date,
      timeZone || TimezoneUtils._timezone,
      formatStr,
      options,
    );
  }

  static getOffset(date: Date | string | number): number {
    return getTimezoneOffset(TimezoneUtils._timezone, new Date(date));
  }

  static toLocalTime(dateString: string): Date {
    const date = parseISO(dateString);
    return TimezoneUtils.fromUTC(date);
  }
}
