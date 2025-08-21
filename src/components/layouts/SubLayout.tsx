import BackAppBar from "@/components/BackAppBar";
import AppContentWrapper from "@/components/layouts/AppContentWrapper";

const SubLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <BackAppBar />
      <AppContentWrapper hasBottomNavigation={false}>
        {children}
      </AppContentWrapper>
    </>
  );
};

export default SubLayout;
