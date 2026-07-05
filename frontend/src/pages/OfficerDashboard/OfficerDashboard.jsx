import React, { useEffect, useRef, useState } from "react";
import { getToolbarData } from "./constants/toolbardata";
import { sidebarItems } from "./constants/sidebarItems";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import HeaderToolbar from "../../components/Header/HeaderToolbar/HeaderToolbar";
import style from "../AdminDashboard/admindashboard.module.css";
import AssignedComplaint from "../../components/AssignedComplaint/AssignedComplaint";
import ResolvedComplaint from "../../components/ResolvedComplaint/ResolvedComplaint";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import OfficerDashboardOverview from "../../components/OfficerDashboardOverview/OfficerDashboardOverview";

const OfficerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [matchedToolbar, setMatchedToolbar] = useState(activeSection);
  const [ward, setWard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaderText, setLoaderText] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    status: "",
    ward: "",
  });

  const toolBarData = getToolbarData(ward);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [searchBar, setSearchBar] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const headerData = {
    heading: activeSection,
    subtitle: sidebarItems
      .filter((val) => val.title === activeSection)
      .map((val) => val.subtitle),
    pfp: "https://t4.ftcdn.net/jpg/04/75/00/99/360_F_475009987_zwsk4c77x3cTpcI3W1C1LU4pOSyPKaqi.jpg",
  };

  const activeToolbar = toolBarData.find(
    (item) => item.heading === activeSection,
  );

  const fetchWard = async () => {
    setLoaderText("Loading data...");

    const loaderId = setTimeout(() => setLoading(true), 300);

    try {
      const response = await fetch("https://nagarseva-backend-oy56.onrender.com/officer/wards", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.code === "PASSWORD_UPDATE_REQUIRED") {
          toast.warning("Please update your password to activate your account");
          navigate("/change-password");
          return;
        }

        if (response.status === 401) {
          navigate("/login");
        }

        const authErrors = [
          "TOKEN_EXPIRED",
          "SIGNATURE_FAILED",
          "INVALID_TOKEN",
        ];

        if (authErrors.includes(errorData.code)) {
          navigate("/login");
          toast.warning("Session Expired, Kindly Login again");
          return;
        }
      }

      const data = await response.json();
      setWard(data.wards);
    } catch (err) {
      toast.error("Unable to connect to server.");
    } finally {
      setLoading(false);
      clearTimeout(loaderId);
    }
  };

  const fetchDashboardData = async () => {
    setLoaderText("Loading dashboard...");
    const loaderId = setTimeout(() => setLoading(true), 300);
    try {
      const response = await fetch("https://nagarseva-backend-oy56.onrender.com/officer/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          navigate("/login");
        }
        return;
      }

      const data = await response.json();
      console.log(data)
      setDashboardData(data);
    } catch (err) {
      toast.error("Unable to load dashboard data.");
    } finally {
      setLoading(false);
      clearTimeout(loaderId);
    }
  };

  useEffect(() => {
    fetchWard();
  }, []);

  useEffect(() => {
    if (activeSection === "Dashboard") {
      fetchDashboardData();
    }
  }, [activeSection]);

  const handleQuickAction = (action, val) => {
    if (action === "view_assigned") {
      setActiveSection("Assigned Complaints");
      setSearchBar("");
    } else if (action === "update_profile") {
      navigate("/change-password");
    } else if (action === "view_details") {
      setActiveSection("Assigned Complaints");
      setSearchBar(val ? val.toString() : "");
    }
  };

  return (
    <div className={style.app_container}>
      <div
        className={`${style.sidebar_overlay} ${isSidebarOpen ? style.active : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      {loading && <Loader text={loaderText} />}
      <Sidebar
        sidebarItems={sidebarItems}
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

        {activeSection !== "Dashboard" && (
          <HeaderToolbar
            heading={activeToolbar.heading}
            placeholder={activeToolbar.placeholder}
            filters={activeToolbar.filters}
            selectedFilters={setSelectedFilters}
            filtersVal={selectedFilters}
            searchVal={searchBar}
            setSearchBar={(val) => setSearchBar(val)}
          />
        )}

        <div className={style.content_area} ref={scrollRef}>
          {activeSection === "Dashboard" && (
            <div className={style.page_transition}>
              <OfficerDashboardOverview
                dashboardData={dashboardData}
                onQuickAction={handleQuickAction}
              />
            </div>
          )}

          {activeSection === "Assigned Complaints" 
          && (
            <div className={style.page_transition}>
              <AssignedComplaint 
                filtered={selectedFilters}
                scrollRef={scrollRef}
                setLoading={setLoading}
                setLoaderText={setLoaderText}
                searchBar={searchBar}
              />
            </div>
          )}


          {activeSection === "Resolved Complaints" 
          && (
            <div className={style.page_transition}>
              <ResolvedComplaint 
                filtered={selectedFilters}
                scrollRef={scrollRef}
                setLoading={setLoading}
                setLoaderText={setLoaderText}
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

export default OfficerDashboard;
