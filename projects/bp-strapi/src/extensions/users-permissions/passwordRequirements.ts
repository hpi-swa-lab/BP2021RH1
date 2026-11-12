const minimumPasswordLength = 12;
const minimumCharacterClasses = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/];
export const minimalPasswordSatisfyingRequirements = 'aA0!'.padEnd(minimumPasswordLength, '-');

const fulfillsPasswordRequirements = (password: string) => {
  if (password.length < minimumPasswordLength) {
    return false;
  }
  if (!minimumCharacterClasses.every(characterClass => password.match(characterClass))) {
    return false;
  }
  return true;
};

export const enforcePasswordRequirements = (password: string) => {
  if (!fulfillsPasswordRequirements(password)) {
    throw new Error(
      `password must be at least ${minimumPasswordLength} characters long ` +
        'and must contain at least a small letter, a capital letter, a number and a special character'
    );
  }
};
