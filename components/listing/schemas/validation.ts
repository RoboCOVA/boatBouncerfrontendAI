import * as Yup from "yup";

export const formUpdateSchema = Yup.object().shape({
  boatName: Yup.string().required("Boat name is required"),
  boatType: Yup.string().required("Boat type is required"),
  description: Yup.string().required("Description is required"),
  manufacturer: Yup.string().required("Manufacturer is required"),
  model: Yup.string().required("Model is required"),
  year: Yup.number().required("Year is required"),
  length: Yup.number().required("Length is required"),
  perHourPrice: Yup.number().required("Field required *"),
  maxPassengers: Yup.string().required("maximum passengers is required"),
  hours: Yup.number().required("Field required *"),
  days: Yup.number().optional(),
  perDayPrice: Yup.number().optional(),
  dailyDiscount: Yup.number().optional(),
  minDaysForDiscount: Yup.number().optional(),
  hourlyDiscount: Yup.number().optional(),
  minHoursForDiscount: Yup.number().optional(),
  imageUrls: Yup.string().required("First image  upload is required"),
  features: Yup.array()
    .min(1, "Feature is required")
    .required("Feature is required"),
  cancelationPolicy: Yup.array()
    .min(1, "cancellation policy is required")
    .of(
      Yup.object().shape({
        refund: Yup.string().required("refund percentage is required"),
        priorHours: Yup.number().min(1).required("prior hours required"),
      }),
    )
    .required("cancellation policy is required"),
  securityAllowance: Yup.number().required("Security allowance is required"),
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
