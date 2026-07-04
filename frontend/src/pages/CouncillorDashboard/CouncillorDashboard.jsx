import React, { useEffect, useRef, useState } from 'react'
import { getToolbarData } from './constants/toolbarData'
import { sidebarItems } from './constants/sidebarItems'
import Loader from "../../components/Loader/Loader";
import Header from "../../components/Header/Header";
import HeaderToolbar from '../../components/Header/HeaderToolbar/HeaderToolbar';
import style from "../AdminDashboard/admindashboard.module.css";
import Sidebar from '../../components/Sidebar/Sidebar';
import WardComplaints from '../../components/WardComplaints/WardComplaints';
import CouncillorProfile from './Profile/CouncillorProfile';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import CouncillorDashboardOverview from '../../components/CouncillorDashboardOverview/CouncillorDashboardOverview';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CouncillorDashboard = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("Dashboard");
    const [loading, setLoading] = useState(false);
    const [loaderText, setLoaderText] = useState("");
    const [selectedFilters, setSelectedFilters] = useState({
        status: "",
        issueType: "",
    });

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const scrollRef = useRef(null);
    const navigate = useNavigate();
    const [searchBar, setSearchBar] = useState("");
    const [dashboardData, setDashboardData] = useState(null);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const response = await fetch("http://localhost:8080/councillor/profile", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setProfile(data);
          }
        } catch (err) {
          console.error("Failed to fetch profile in CouncillorDashboard:", err);
        }
      };
      fetchProfile();
    }, []);

    const headerData = {
        heading: activeSection,
        subtitle: sidebarItems
          .filter((val) => val.title === activeSection)
          .map((val) => val.subtitle),
        pfp: "https://t4.ftcdn.net/jpg/04/75/00/99/360_F_475009987_zwsk4c77x3cTpcI3W1C1LU4pOSyPKaqi.jpg",
      };

    const toolBarData = getToolbarData();

    const activeToolbar = toolBarData.find(
    (item) => item.heading === activeSection,
  );

  const fetchDashboardData = async () => {
    setLoaderText("Loading dashboard...");
    const loaderId = setTimeout(() => setLoading(true), 300);
    try {
      const response = await fetch("http://localhost:8080/councillor/dashboard", {
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
      setDashboardData(data);
    } catch (err) {
      toast.error("Unable to load dashboard data.");
    } finally {
      setLoading(false);
      clearTimeout(loaderId);
    }
  };

  useEffect(() => {
    if (activeSection === "Dashboard") {
      fetchDashboardData();
    }
  }, [activeSection]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleQuickAction = (action, val) => {
    if (action === "view_complaints") {
      setActiveSection("Ward Complaints");
      setSearchBar(val ? val.toString() : "");
    } else if (action === "update_profile") {
      setActiveSection("Profile");
    } else if (action === "view_ward_details") {
      const element = document.getElementById("ward-summary-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className={style.app_container}>
        {loading && <Loader text={loaderText} />}
        <div
        className={`${style.sidebar_overlay} ${isSidebarOpen ? style.active : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
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
          name={profile?.fullName}
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
              <CouncillorDashboardOverview
                dashboardData={dashboardData}
                onQuickAction={handleQuickAction}
              />
            </div>
          )}

          {activeSection === "Ward Complaints" && (
            <div className={style.page_transition}>
              <WardComplaints
                scrollRef={scrollRef}
                filtered={selectedFilters}
                setLoading={setLoading}
                setLoaderText={setLoaderText}
                searchBar={searchBar}
              />
            </div>
          )}

          {activeSection === "Profile" && (
            <div className={style.page_transition}>
              <CouncillorProfile
                setLoading={setLoading}
                setLoaderText={setLoaderText}
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
  )
}

export default CouncillorDashboard
