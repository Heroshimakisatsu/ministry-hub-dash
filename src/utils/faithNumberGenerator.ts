// Faith Number ID Generator
// Format: Gender Letter + Name Initial + Date of Birth (DDMMYYYY) + Surname Initial
// Example: mt17041999h (Male, Troy, born 17/04/1999, surname Hot)
// Duplicate handling: Change to last letters of name/surname

export interface MemberForFaithNumber {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD format
  gender?: 'male' | 'female' | 'other';
}

export function generateFaithNumber(
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  existingMembers: MemberForFaithNumber[] = [],
  gender: 'male' | 'female' | 'other' = 'other'
): string {
  // Gender letter
  const genderLetter = gender === 'male' ? 'm' : gender === 'female' ? 'f' : 'o';
  
  // Extract letters from first name
  const firstNameLetters = firstName.toUpperCase().replace(/[^A-Z]/g, '').split('');
  const firstNameInitial = firstNameLetters[0] || 'X';
  const firstNameLastLetter = firstNameLetters[firstNameLetters.length - 1] || firstNameInitial;
  
  // Format date of birth as DDMMYYYY
  const dob = new Date(dateOfBirth);
  const day = String(dob.getDate()).padStart(2, '0');
  const month = String(dob.getMonth() + 1).padStart(2, '0');
  const year = dob.getFullYear();
  const formattedDOB = `${day}${month}${year}`;
  
  // Extract letters from surname
  const lastNameLetters = lastName.toUpperCase().replace(/[^A-Z]/g, '').split('');
  const surnameInitial = lastNameLetters[0] || 'X';
  const surnameLastLetter = lastNameLetters[lastNameLetters.length - 1] || surnameInitial;
  
  // Base faith number: gender + name_initial + DDMMYYYY + surname_initial
  let faithNumber = `${genderLetter}${firstNameInitial}${formattedDOB}${surnameInitial}`;
  
  // Check for duplicates with same gender, DOB, name, and surname
  const duplicates = existingMembers.filter(
    (member) => member.gender === gender && 
                member.dateOfBirth === dateOfBirth &&
                member.firstName.toLowerCase() === firstName.toLowerCase() &&
                member.lastName.toLowerCase() === lastName.toLowerCase()
  );
  
  // If duplicates exist, modify the faith number
  if (duplicates.length > 0) {
    const duplicateCount = duplicates.length;
    
    if (duplicateCount === 1) {
      // First duplicate: use last letter of name instead of first
      faithNumber = `${genderLetter}${firstNameLastLetter}${formattedDOB}${surnameInitial}`;
    } else if (duplicateCount === 2) {
      // Second duplicate: use last letter of surname instead of first
      faithNumber = `${genderLetter}${firstNameInitial}${formattedDOB}${surnameLastLetter}`;
    } else if (duplicateCount === 3) {
      // Third duplicate: use last letters of both
      faithNumber = `${genderLetter}${firstNameLastLetter}${formattedDOB}${surnameLastLetter}`;
    } else {
      // Fourth+ duplicate: add counter
      faithNumber = `${genderLetter}${firstNameInitial}${formattedDOB}${surnameInitial}${String(duplicateCount + 1).padStart(2, '0')}`;
    }
  }
  
  return faithNumber;
}

export function parseFaithNumber(faithNumber: string): {
  firstInitial: string;
  dateOfBirth: Date;
  surnameInitial: string;
} | null {
  // Expected format: XDDMMYYYYX (10 characters)
  if (faithNumber.length !== 10) {
    return null;
  }
  
  const firstInitial = faithNumber.charAt(0);
  const day = parseInt(faithNumber.substring(1, 3));
  const month = parseInt(faithNumber.substring(3, 5));
  const year = parseInt(faithNumber.substring(5, 9));
  const surnameInitial = faithNumber.charAt(9);
  
  // Validate date
  const dateOfBirth = new Date(year, month - 1, day);
  if (isNaN(dateOfBirth.getTime())) {
    return null;
  }
  
  return {
    firstInitial,
    dateOfBirth,
    surnameInitial,
  };
}

export function validateFaithNumber(faithNumber: string): boolean {
  return parseFaithNumber(faithNumber) !== null;
}
