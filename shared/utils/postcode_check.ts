export function isValidNZPostcode(postcode: string) {
  const nzPostcodeRegex = /^\d{4}$/; //Four digits only, must start at digit,end with 4th
  return nzPostcodeRegex.test(postcode.trim()) //Simple boolean for error message trigger
}