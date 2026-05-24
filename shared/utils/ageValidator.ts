export function isOldEnoughToRegister(birthdateString: string): boolean {
  const birthdate = new Date (birthdateString)
  const today = new Date()

  if (isNaN(birthdate.getTime())) {
    return false; //Handle invalid input
  }

  const birthYear = birthdate.getFullYear();
  const birthMonth = birthdate.getMonth();
  const birthDay = birthdate.getDate()

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  let calculatedAge = currentYear - birthYear;

  //Comparing months directly gets us round the weird JS 0 indexing of months
  //Keep in mind for console logs and messaging
  
  const hasBirthdayPassed = 
  currentMonth > birthMonth ||
  (currentMonth === birthMonth && currentDay >= birthDay)

  if (!hasBirthdayPassed) { //Yet to have their birthday this year, ergo 1 year less
    calculatedAge --
  }

  return calculatedAge >= 18

}