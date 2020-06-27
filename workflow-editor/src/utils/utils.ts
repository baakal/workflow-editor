
export function format(first: string, middle: string, last: string): string {
  return (
    (first || '') +
    (middle ? ` ${middle}` : '') +
    (last ? ` ${last}` : '')
  );
}
export function dist(aFrom,aTo){
  return Math.sqrt(Math.pow((aFrom.x + aFrom.xa) - (aTo.x + aTo.xa),2) + Math.pow((aFrom.y + aFrom.ya) - (aTo.y + aTo.ya),2));
}
