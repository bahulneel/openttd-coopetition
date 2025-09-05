/*
 * OpenTTD GameScript Special String Constants
 * This file contains constants for OpenTTD's special strings that can be used
 * throughout the codebase for consistent formatting and display.
 */

// Currency symbols
const POUND_SIGN = "{POUNDSIGN}";

// Font formatting
const BIG_FONT = "{BIGFONT}";

// Arrow symbols
const LEFT_ARROW = "{LARROW}";
const RIGHT_ARROW = "{RARROW}";
const UP_ARROW = "{UARROW}";
const DOWN_ARROW = "{DARROW}";

// Vehicle/object icons
const TRAIN_ICON = "{TRAIN}";

// Text formatting helpers
const BULLET_POINT = "-";  // ASCII fallback since {BULLET} doesn't exist
const ARROW_RIGHT = "->";  // ASCII fallback for right arrow
const ARROW_LEFT = "<-";   // ASCII fallback for left arrow

// Common formatting patterns
const CURRENCY_FORMAT = "{POUNDSIGN}";  // Use pound sign for currency display
const LIST_ITEM = "-";                  // Use dash for list items
