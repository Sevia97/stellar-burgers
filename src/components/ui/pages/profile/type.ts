export type ProfileUIProps = {
  formValue: {
    name: string;
    email: string;
    password: string;
  };
  isFormChanged: boolean;
  handleCancel: (e: React.SyntheticEvent) => void;
  handleSubmit: (e: React.SyntheticEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogout: () => void;
  updateUserError?: string;
};
