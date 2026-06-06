//Syntax validation of ISBNs (they may not have been assigned/used yet)
// User entered ISBNs can be checked against Google Books after syntax validation.

export function isValidISBN(isbn: string) {

  if (typeof isbn !== 'string') return {isValid: false, error: "Input must be a string"}
  const clean = isbn.replace(/[- ]/g,"")

  //ISBN10

  if (clean.length===10) {
    let sum = 0;

    for (let i = 0; i < 9; i++) {
      const digit = parseInt(clean[i],10);
      if (isNaN(digit)) return false;
      sum +=digit * (10-i)
    }

    const last = clean[9].toUpperCase();
    sum+= (last ==='X') ? 10 : parseInt(last, 10)
    return sum % 11 === 0
  }

  //ISBN13

  if (clean.length===13) {
    let sum = 0;

    for (let i = 0; i < 12; i++) {
      const digit = parseInt(clean[i], 10);
      if (isNaN(digit)) return false;
      sum += digit * (i % 2 === 0 ? 1 : 3) //alt weighting *1 (even indext),*3 (odd index)
    }

    const checkDigit = parseInt(clean[12], 10);
    return (10 - (sum % 10)) % 10 === checkDigit;
  }

  return false
}
