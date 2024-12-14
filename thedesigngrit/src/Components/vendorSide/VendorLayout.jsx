import NavbarVendor from "../../Components/vendorSide/navbarVendor";
import SidebarVendor from "../../Components/vendorSide/sideBarVendor";
const VendorPageLayout = ({ children }) => {
  return (
    <div className="app-container-vendor">
      <NavbarVendor />
      <div className="main-content-vendor">
        <SidebarVendor />
        <div className="content-vendor">{children}</div>
      </div>
    </div>
  );
};

export default VendorPageLayout;
