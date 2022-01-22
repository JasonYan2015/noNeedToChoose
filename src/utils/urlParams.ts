export const objectToQueryString = (queryParameters: Object): string => {
  return queryParameters
    ? Object.entries(queryParameters).reduce((queryString, [key, val], index) => {
        const symbol = queryString.length === 0 ? '?' : '&';
        queryString += typeof val !== 'object' ? `${symbol}${key}=${val}` : '';
        return queryString;
      }, '')
    : '';
};