import * as Yup from "yup";

export const rentalSchema = Yup.object().shape({
  boatName: Yup.string().required("title is required"),
  boatType: Yup.string().required("activity type is required"),
  description: Yup.string().required("description is required"),
  imageUrls: Yup.string().required("first image  upload is required"),
  maxPassengers: Yup.string().required("maximum passengers is required"),
  minPeople: Yup.string().required("people count required"),
  discount: Yup.string().required("discount is required"),
  perPerson: Yup.string().required("price Per Person is required"),
  cancelationPolicy: Yup.array()
    .min(1, "cancellation policy is required")
    .of(
      Yup.object().shape({
        refund: Yup.string().required("refund percentage is required"),
        priorHours: Yup.number().min(1).required("prior hours required"),
      }),
    )
    .required("cancellation policy is required"),
  securityAllowance: Yup.number().required("security allowance is required"),
  currency: Yup.string().required("currency is required"),
  latLng: Yup.object()
    .shape({
      latitude: Yup.number().required(
        "select specific address of your boat from dropdown",
      ),
      longitude: Yup.number().required(
        "select specific address of your boat from dropdown",
      ),
    })
    .required("select specific address of your boat from dropdown"),
  city: Yup.string().required(
    "select specific address of your boat from dropdown",
  ),
  state: Yup.string().required(
    "select specific address of your boat from dropdown",
  ),
  address: Yup.string().required(
    "select specific address of your boat from dropdown",
  ),
  zipCode: Yup.string().required(
    "select specific address of your boat from dropdown",
  ),
});
