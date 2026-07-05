import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import HeaderToolbar from "../../components/Header/HeaderToolbar/HeaderToolbar";
import style from "../AdminDashboard/admindashboard.module.css";
import CreateComplaint from "./CreateComplaint/CreateComplaint";
import Loader from "../../components/Loader/Loader";

import { sidebarItems } from "./constants/sidebarItems";
import { getToolbarData } from "./constants/toolbarData";
import { useNavigate } from "react-router-dom";
import MyComplaints from "../../components/MyComplaints/MyComplaints";
import { toast } from "react-toastify";
import Profile from "./Profile/Profile";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import CitizenDashboardOverview from "../../components/CitizenDashboardOverview/CitizenDashboardOverview";

const CitizenDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Dashboard");
  // const [matchedToolbar, setMatchedToolbar] = useState(activeSection);
  const [ward, setWard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaderText, setLoaderText] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    status: "",
    issueType: "",
  });
  const [isCreatingComplaint, setIsCreatingComplaint] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchBar, setSearchBar] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [profile, setProfile] = useState(null);

  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("https://nagarseva-backend-oy56.onrender.com/citizen/profile", {
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
        console.error("Failed to fetch profile in CitizenDashboard:", err);
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

  const toolBarData = getToolbarData(ward);

  const activeToolbar = toolBarData.find(
    (item) => item.heading === activeSection,
  );

  const navigate = useNavigate();

  const fetchWard = async () => {
    setLoaderText("Loading data...");
    const loaderId = setTimeout(() => setLoading(true), 300);
    try {
      const response = await fetch("https://nagarseva-backend-oy56.onrender.com/citizen/wards", {
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

        const errorData = await response.json();
        console.log(errorData);
        return;
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
      const response = await fetch("https://nagarseva-backend-oy56.onrender.com/citizen/dashboard", {
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
    fetchWard();
  }, []);

  useEffect(() => {
    if (activeSection === "Dashboard") {
      fetchDashboardData();
    }
  }, [activeSection]);

  const handleQuickAction = (action, val) => {
    if (action === "create_complaint") {
      setActiveSection("My Complaints");
      setIsCreatingComplaint(true);
    } else if (action === "view_complaints") {
      setActiveSection("My Complaints");
      setIsCreatingComplaint(false);
      setSearchBar("");
    } else if (action === "update_profile") {
      setActiveSection("Profile");
    } else if (action === "view_details") {
      setActiveSection("My Complaints");
      setIsCreatingComplaint(false);
      setSearchBar(val ? val.toString() : "");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    toast.success("Logged out successfully");

    navigate("/login");
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
          setIsCreatingComplaint(false);
        }}
      />
      <main className={style.main_content}>
        <Header
          header={headerData.heading}
          subtitle={headerData.subtitle}
          name={profile?.fullName}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        {!isCreatingComplaint && (
          <HeaderToolbar
            heading={activeToolbar.heading}
            placeholder={activeToolbar.placeholder}
            filters={activeToolbar.filters}
            selectedFilters={setSelectedFilters}
            filtersVal={selectedFilters}
            searchVal={searchBar}
            buttonPlaceholder={activeToolbar.buttonPlaceholder}
            onCreateClick={(btn) => {
              if (btn === "Complaint") {
                setIsCreatingComplaint(true);
              }
            }}
            setSearchBar={(val) => setSearchBar(val)}
          />
        )}

        <div className={style.content_area} ref={scrollRef}>
          {activeSection === "Dashboard" && (
            <div className={style.page_transition}>
              <CitizenDashboardOverview
                dashboardData={dashboardData}
                onQuickAction={handleQuickAction}
              />
            </div>
          )}

          {activeSection === "My Complaints" && (
            <div className={style.page_transition}>
              <MyComplaints
                scrollRef={scrollRef}
                filtered={selectedFilters}
                setLoading={setLoading}
                setLoaderText={setLoaderText}
                isCreatingComplaint={isCreatingComplaint}
                setIsCreatingComplaint={setIsCreatingComplaint}
                ward={ward}
                searchBar={searchBar}
              />
            </div>
          )}

          {activeSection === "Profile" && (
            <div className={style.page_transition}>
              <Profile setLoading={setLoading} setLoaderText={setLoaderText} />
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

export default CitizenDashboard;
