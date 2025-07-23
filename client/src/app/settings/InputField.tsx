import { useChangePassword } from "@/states/requests/useChangePassword";
import { useEffect, useState } from "react";

export default function InputField({
  title,
  placeholder,
  oldPassword,
  newPassword,
}: {
  title: string;
  placeholder: string;
  oldPassword?: boolean;
  newPassword?: boolean;
}) {
  const { setOldPassword, setNewPassword } = useChangePassword();
  const [value, setValue] = useState("");
  useEffect(() => {
    if (oldPassword) {
      setOldPassword(value);
    }
    if (newPassword) {
      setNewPassword(value);
    }
  }, [value]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  return (
    <div className="mb-2">
      <div className="text-red-600">{title}</div>
      <input
        type="email"
        name="email"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required
        className="w-full border rounded-md px-3 py-2"
      />
    </div>
  );
}
