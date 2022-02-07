/**
 * Extracted in order to make the current DateTime mockable in tests.
 */
const getCurrentDateTimeString = () => new Date().toISOString();

export default getCurrentDateTimeString;
