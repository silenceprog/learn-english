interface SettingsSectionProps {
  title: string;
  subTitle: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export default function SettingsSection({
  title,
  subTitle,
  children,
  icon,
  className = "",
}: SettingsSectionProps) {
  return (
    <section className={`rounded-lg border shadow-sm mb-4 ${className}`}>
      <div className="flex flex-row items-center px-6 pt-6">
        <div className="w-5 h-5 mr-2">{icon}</div>
        <h2 className="flex items-center text-2xl font-semibold gap-2">
          {title}
        </h2>
      </div>
      <p className="flex items-center px-6 text-gray-500">{subTitle}</p>
      <div className="p-6 ">{children}</div>
    </section>
  );
}
