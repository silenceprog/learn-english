export default function InputField({
  title,
  placeholder,
}: {
  title: string;
  placeholder: string;
}) {
  return (
    <div>
      <div>{title}</div>
      <input
        type="email"
        name="email"
        placeholder={placeholder}
        required
        className="w-full border rounded-md px-3 py-2"
      />
    </div>
  );
}
