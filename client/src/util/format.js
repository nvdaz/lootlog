import numeral from 'numeral';

export default function format(value, { sign = false } = {}) {
  if (value instanceof Date) {
    return `${value.getMonth() + 1}-${value.getDate()}`;
  }
  if (!Number.isNaN(value)) {
    return numeral(value).format(`${sign ? '+' : ''}0.[0]a`);
  }

  return '';
}
