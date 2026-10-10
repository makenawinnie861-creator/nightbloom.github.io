/* ------------------------------------------------------------
   EDIT THIS FILE to change your studio settings.
   No other code needs to be touched for day-to-day changes.
------------------------------------------------------------ */
const STUDIO_CONFIG = {
  // Your Cash App $cashtag WITHOUT the $ sign (e.g. "NightbloomInk")
  cashTag: "YourCashTag",

  // Deposit in US dollars (Cash App works in USD)
  depositAmount: 50,

  // Minimum age
  minAge: 18,

  // How many days ahead clients can book
  bookingWindowDays: 90,

  // Minimum days notice (1 = earliest is tomorrow)
  minNoticeDays: 1,

  // Days you are closed. 0 = Sunday, 1 = Monday ... 6 = Saturday
  closedWeekdays: [0, 1],

  // Specific dates already taken or closed (format YYYY-MM-DD)
  blockedDates: [
    // "2026-12-25",
  ],

  // Time slots offered each open day
  timeSlots: ["10:00", "12:30", "15:00", "17:30"],

  // Slots already booked on specific dates: { "YYYY-MM-DD": ["10:00", "15:00"] }
  bookedSlots: {
    // "2026-10-20": ["10:00"],
  }
};
