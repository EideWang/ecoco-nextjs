import MainAppBar from "@/components/MainAppBar";
import BottomNavigation from "@/components/BottomNavigation";
import AppContentWrapper from "@/components/layouts/AppContentWrapper";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MainAppBar />
      <AppContentWrapper hasBottomNavigation={true}>
        {children}
      </AppContentWrapper>
      <BottomNavigation />
    </>
  );
};

export default MainLayout;
