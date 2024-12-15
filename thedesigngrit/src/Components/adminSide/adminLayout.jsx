import NavbarAdmin from "./adminNav";
import SidebarAdmin from "./adminSideBar";
const AdminPageLayout = ({ children }) => {
  return (
    <div className="app-container-vendor">
      <NavbarAdmin />
      <div className="main-content-vendor">
        <SidebarAdmin />
        <div className="content-vendor">{children}</div>
      </div>
    </div>
  );
};

export default AdminPageLayout;
