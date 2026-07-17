
export const getisotime = (obj: any) => {

    try {
        return obj.now().toUTC().toISO()

    } catch (error) {
        console.log(error);
    }
}


export const validateEmail = (email: string): boolean => {
    const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return emailFormat.test(email.trim());
}


export const validateName = (name: string): boolean => {
    const nameFormat = /^([a-zA-Z',.-]+( [a-zA-Z',.-]+)*){2,30}/;
    if (name !== '' && name.match(nameFormat)) {
        return true;
    } else {
        return false;
    }
}


export const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{7,15}$/;
    return passwordRegex.test(password);
};
export function generateRandomPassword(length = 10) {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  
  // Ensure at least one uppercase, one lowercase, one number
  let password = "";
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  
  // Fill the rest of the password randomly
  const allChars = upper + lower + numbers + symbols;
  for (let i = 3; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password so first 3 chars are not predictable
  password = password.split("").sort(() => 0.5 - Math.random()).join("");
  return password;
}