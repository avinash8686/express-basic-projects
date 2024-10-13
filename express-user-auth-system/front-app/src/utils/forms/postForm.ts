import * as yup from "yup";

export const postForm = yup.object().shape({
  _id: yup.string().trim().notRequired(),
  title: yup.string().trim().min(2).required("This field can't be empty."),
  body: yup.string().trim().min(20, "Post is too short").required(),
});
