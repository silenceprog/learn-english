import { useChangePassword } from "@/states/requests/useChangePassword";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="mb-2">
      <div className="font-medium">{title}</div>
      <div className="relative w-full ">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          required
          className="w-full border rounded-md px-3 py-2 pr-10" // додано pr-10 для місця під кнопку
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
