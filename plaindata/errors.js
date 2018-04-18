// TODO: Error implementation refinements ? regarding output

class PlainDataError extends Error {
  constructor(message, snippet, ranges) {
    super(message);

    if(ranges) {
      this.snippet = snippet;
      this.ranges = ranges;
    } else {
      this.ranges = snippet;
    }

    Error.captureStackTrace(this, PlainDataError);
  }
}

class PlainDataParseError extends Error {
  constructor(message, snippet, range) {
    super(message);

    this.snippet = snippet;

    this.ranges = [range];

    Error.captureStackTrace(this, PlainDataParseError);
  }
}

module.exports = {
  PlainDataError: PlainDataError,
  PlainDataParseError: PlainDataParseError
};