import * as yup from "yup";

export const loginForm = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email.")
    .required("This field can't be empty."),
  password: yup.string().trim().min(8, "Password is too short").required(),
});
