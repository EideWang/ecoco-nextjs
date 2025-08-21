import SubLayout from "@/components/layouts/SubLayout";

export default function SettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SubLayout>{children}</SubLayout>;
}
