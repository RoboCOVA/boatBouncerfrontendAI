import * as Yup from "yup";

const lowerLetterRegex = /(?=.*?[a-z])/; // Password should contain a lower case letter
const upperLetterRegex = /(?=.*?[A-Z])/; // Password should contain an upper case letter
const numberRegex = /(?=.*[0-9])/; // Password should contain number
const specialCharRegex = /(?=.*[!@#$%^&*])(?=.{8,})/; // Password should contain one of these symbols (!@#$%^&*).
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const formRegisterSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  newPassword: Yup.string()
    .min(8, "Password should be at least 8 cahracters")
    .max(60, "Password should not be greater than 60!")
    .matches(lowerLetterRegex, "Password should contain a lowercase letter")
    .matches(upperLetterRegex, "Password should contain an uppercase letter")
    .matches(numberRegex, "Password should contain a number")
    .matches(specialCharRegex, "Password should contain a special character")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .required("Confirmation password is required!")
    .oneOf([Yup.ref("newPassword"), ""], "Passwords must match"),
  phoneNumber: Yup.string().required("Phone number is required"),
});

export const formUpdateSchema = Yup.object().shape({
  firstName: Yup.string(),
  lastName: Yup.string(),
  email: Yup.string().email("Invalid email"),
  oldPassword: Yup.string()
    .min(8, "Password should be at least 8 cahracters")
    .max(60, "Password should not be greater than 60!")
    .matches(lowerLetterRegex, "Password should contain a lowercase letter")
    .matches(upperLetterRegex, "Password should contain an uppercase letter")
    .matches(numberRegex, "Password should contain a number")
    .matches(specialCharRegex, "Password should contain a special character"),
  newPassword: Yup.string()
    .min(8, "Password should be at least 8 cahracters")
    .max(60, "Password should not be greater than 60!")
    .matches(lowerLetterRegex, "Password should contain a lowercase letter")
    .matches(upperLetterRegex, "Password should contain an uppercase letter")
    .matches(numberRegex, "Password should contain a number")
    .matches(specialCharRegex, "Password should contain a special character"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("newPassword"), ""],
    "Passwords must match",
  ),
  phoneNumber: Yup.string(),
});

export const basicInfo = [
  {
    label: "First name",
    name: "firstName",
    type: "text",
    id: "firstnameInput",
    placeholder: "First name",
  },
  {
    label: "Last name",
    name: "lastName",
    type: "text",
    id: "lastnameInput",
    placeholder: "Last name",
  },
  {
    label: "Phone number",
    name: "phoneNumber",
    type: "tel",
    id: "phoneNumberInput",
    placeholder: "phone number",
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    id: "emailInput",
    placeholder: "Email",
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    id: "passwordInput",
    placeholder: "Password",
  },
];

export const additionalInfo = [
  {
    label: "Address",
    name: "address",
    type: "text",
    id: "addressInput",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    type: "text",
    id: "cityInput",
    placeholder: "City",
  },
  {
    label: "State",
    name: "state",
    type: "text",
    id: "lastnameInput",
    placeholder: "State",
  },
  {
    label: "Zip code",
    name: "zipCode",
    type: "text",
    id: "zipCodeInput",
    placeholder: "zipCode",
  },
];
