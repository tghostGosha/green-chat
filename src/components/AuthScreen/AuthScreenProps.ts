import type { Credentials } from "../../types";
type AuthScreenProps = {
  value: Credentials;
  error: string;
  onChange: (v: Credentials) => void;
  onSubmit: () => void;
};
export default AuthScreenProps;
