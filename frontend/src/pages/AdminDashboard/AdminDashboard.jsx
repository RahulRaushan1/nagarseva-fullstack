import React, { act, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getToolbarData } from "./constants/toolbardata";
import { adminSidebarItems } from "./constants/adminSidebarItems";
import Loader from '../../components/Loader/Loader';
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import DashboardOverview from "../../components/DashboardOverview/DashboardOverview";
import Complaint from "../../components/Complaints/Complaint";
import OfficerManagement from "../../components/Officer Management/OfficerManagement";
import WardManagement from "../../components/Ward Management/WardManagement";
import HeaderToolbar from "../../components/Header/HeaderToolbar/HeaderToolbar";
import style from "./admindashboard.module.css";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [ward, setWard] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [matchedToolbar, setMatchedToolbar] = useState(activeSection);
  
  const [isCreateWardModalOpen, setIsCreateWardModalOpen] = useState(false);
  const [isCreateOfficerModalOpen, setIsCreateOfficerModalOpen] = useState(false);
  const [isCreateCouncillorModalOpen, setIsCreateCouncillorModalOpen] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false)
  const [loaderText, setLoaderText] = useState("")
  const [selectedFilters, setSelectedFilters] = useState({
    status: "",
    ward: "",
    department: "",
    issueType: ""
  })
  const [refreshWard, setRefreshWard] = useState(false)  
  const [councillorWard, setCouncillorWard] = useState("")
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchBar, setSearchBar] = useState("")

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const createOfficer = searchParams.get("createOfficer");
    const createWard = searchParams.get("createWard");
    const createCouncillor = searchParams.get("createCouncillor");

    if (createOfficer === "true") {
      setActiveSection("Officer Management");
      setIsCreateOfficerModalOpen(true);
      setSearchParams({}, { replace: true });
    } else if (createWard === "true") {
      setActiveSection("Ward Management");
      setIsCreateWardModalOpen(true);
      setSearchParams({}, { replace: true });
    } else if (createCouncillor === "true") {
      setActiveSection("Ward Management");
      setIsCreateCouncillorModalOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    navigate("/login");
  };
  const scrollRef = useRef(null); 

  const toolBarData = getToolbarData(ward);

  const headerData = {
    heading: activeSection,
    subtitle: adminSidebarItems
      .filter((val) => val.title === activeSection)
      .map((val) => val.subtitle),
    pfp: "https://t4.ftcdn.net/jpg/04/75/00/99/360_F_475009987_zwsk4c77x3cTpcI3W1C1LU4pOSyPKaqi.jpg",
  };

  const activeToolbar = toolBarData.find(
    (item) => item.heading === activeSection,
  );

  const fetchWard = async () => {

    setLoaderText("Loading data...")

    const loaderId = setTimeout(() => setIsLoading(true),300)

      try {
        const response = await fetch("http://https://nagarseva-backend-oy56.onrender.com/admin/wards", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();

          if (errorData.code === "PASSWORD_UPDATE_REQUIRED") {
            navigate("/change-password");
            return;
          }

          if (response.status === 401) {
            navigate("/login");
          }

          const authErrors = [
            "TOKEN_EXPIRED",
            "SIGNATURE_FAILED",
            "INVALID_TOKEN"
          ];

          if (authErrors.includes(errorData.code)) {
            navigate("/login");
            toast.warning("Session Expired, Kindly Login again")
            return;
          }
        }

        const data = await response.json();
        setWard(data.wards);
      } catch (err) {
        // console.log(err);
        toast.error("Unable to connect to server.")
      } finally {
        setIsLoading(false)
        clearTimeout(loaderId)
      }
    };

  const fetchDashboardData = async () => {
    setLoaderText("Loading dashboard data...");
    const loaderId = setTimeout(() => setIsLoading(true), 300);

    try {
      const response = await fetch("http://https://nagarseva-backend-oy56.onrender.com/admin/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.code === "PASSWORD_UPDATE_REQUIRED") {
          navigate("/change-password");
          return;
        }
        if (response.status === 401) {
          navigate("/login");
          return;
        }
      }

      const data = await response.json();
      if (data.success) {
        setDashboardData(data);
      }
    } catch (err) {
      toast.error("Unable to connect to server.");
    } finally {
      setIsLoading(false);
      clearTimeout(loaderId);
    }
  };

  useEffect(() => {
    fetchWard();
    if (activeSection === "Dashboard") {
      fetchDashboardData();
    }
  }, [refreshWard, activeSection]);

  return (
    <div className={style.app_container}>
      {isLoading && <Loader text={loaderText} />}
      <div
        className={`${style.sidebar_overlay} ${isSidebarOpen ? style.active : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      <Sidebar
        sidebarItems={adminSidebarItems}
        isOpen={isSidebarOpen}
        activeSection={activeSection}
        setActiveSection={(section) => {
          if (section === "Logout") {
            setShowLogoutModal(true);
            return;
          }
          setActiveSection(section);
        }}
      />
      <main className={style.main_content}>
        <Header
          header={headerData.heading}
          subtitle={headerData.subtitle}
          pfp={headerData.pfp}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <HeaderToolbar
          heading={activeToolbar.heading}
          placeholder={activeToolbar.placeholder}
          filters={activeToolbar.filters}
          selectedFilters={setSelectedFilters}
          filtersVal={selectedFilters}
          searchVal={searchBar}
          buttonPlaceholder={activeToolbar.buttonPlaceholder}
          onCreateClick={(btn) => {
            if (btn === "ward") {
              setIsCreateWardModalOpen(true);
            }

            if (btn === "councillor") {
              setIsCreateCouncillorModalOpen(true)
            }

            if (btn === "Officer") {
              setIsCreateOfficerModalOpen(true);
            }
          }}
          setSearchBar={(val) => setSearchBar(val)}
        />

        <div className={style.content_area} ref={scrollRef}>

          {activeSection === "Dashboard"
            && (
              <div className={style.page_transition}>
                <DashboardOverview
                  onCreateOfficerClick={() => setIsCreateOfficerModalOpen(true)}
                  onCreateCouncillorClick={() => setIsCreateCouncillorModalOpen(true)}
                  onCreateWardClick={() => setIsCreateWardModalOpen(true)}
                  dashboardData={dashboardData}
                />
              </div>
            )}

          {activeSection === "Complaints"
            && (
              <div className={style.page_transition}>
                <Complaint
                  scrollRef={scrollRef}
                  filtered={selectedFilters}
                  setLoading={setIsLoading}
                  setLoaderText={setLoaderText}
                  searchBar={searchBar}
                />
              </div>
            )}

          {activeSection === "Officer Management"
            && (
              <div className={style.page_transition}>
                <OfficerManagement
                  filtered={selectedFilters}
                  scrollRef={scrollRef}
                  setLoading={setIsLoading}
                  setLoaderText={setLoaderText}
                  isCreateOfficerModalOpen={isCreateOfficerModalOpen}
                  setIsCreateOfficerModalOpen={setIsCreateOfficerModalOpen}
                  searchBar={searchBar}
                />
              </div>
            )}

          {activeSection === "Ward Management"
            && (
              <div className={style.page_transition}>
                <WardManagement 
                  setLoading={setIsLoading}
                  setLoaderText={setLoaderText}
                  isCreateCouncillorModalOpen={isCreateCouncillorModalOpen}
                  setIsCreateCouncillorModalOpen={setIsCreateCouncillorModalOpen}
                  isCreateWardModalOpen={isCreateWardModalOpen}
                  setIsCreateWardModalOpen={setIsCreateWardModalOpen}
                  refreshWard={setRefreshWard}
                  searchBar={searchBar}
                />
              </div>
            )}

          {showLogoutModal && (
            <ConfirmationModal
              title="Logout Confirmation"
              message="Are you sure you want to logout from NagarSeva?"
              confirmText="Logout"
              cancelText="Stay Logged In"
              danger={true}
              onClose={() => setShowLogoutModal(false)}
              onConfirm={handleLogout}
            />
          )}

        </div>
      </main>

      
        
        
      
      

     
    </div>
  );
};

export default AdminDashboard;
