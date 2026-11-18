import Navbar from "@/components/shared/Navbar";

const RootLayout = ({children}) => {
    return (
        <>
        <Navbar/>
            {children}
        </>
    );
};

export default RootLayout;