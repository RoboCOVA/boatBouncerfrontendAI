export type Props = {
  handleSubmit: (values: {
    email: string;
    password: string;
    userName: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
  }) => void;
  type: String | null | undefined;
  initialValues: {
    email: string;
    newPassword: string;
    confirmPassword: string;
    userName: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    id: string | undefined | null;
  };
  page: String | null | undefined;
};
