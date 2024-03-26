const timesWorkes = {
  everySecond: '* * * * * *',
  everyMinute: '0 * * * * *',
  everyFiveMinutes: '0 */5 * * * *',
  everyTenMinutes: '0 */10 * * * *',
  everyFifteenMinutes: '0 */15 * * * *',
  everyThirtyMinutes: '0 */30 * * * *',
  everyHour: '0 0 * * * *',
  everyDay: '0 0 0 * * *',
  everyWeek: '0 0 0 * * 0',
  everyMonth: '0 0 0 0 * *',
  everyYear: '0 0 0 0 0 *',
  roundedHour: '0 0 0-23 * * *',
  sevenAMandTwoPM: '0 0 7,14 * * *',
  allInitialOfMouth: '0 0 0 1 * *',
};

export default timesWorkes;
