import React, { useEffect, useState } from "react";
import WardCard from "./WardCard";
import style from "./wardManagement.module.css";
import { toast } from "react-toastify";
import AssignCouncillorModal from "../AssignCouncillorModal/AssignCouncillorModal";
import UpdateWardModal from "../UpdateWardModal/UpdateWardModal";
import { useNavigate } from "react-router-dom";
import CreateCouncillorModal from "../CreateCouncillorModal/CreateCouncillorModal";
import CreateWardModal from "../../components/CreateWardModal/CreateWardModal";

const WardManagement = ({
  setLoading,
  setLoaderText,
  isCreateCouncillorModalOpen,
  setIsCreateCouncillorModalOpen,
  isCreateWardModalOpen,
  setIsCreateWardModalOpen,
  refreshWard,
  searchBar,
}) => {
  const [wardData, setWardData] = useState([]);
  const [selectedWard, setSelectedWard] = useState({
    wardName: "",
    wardId: "",
  });
  const [isFetching, setIsFetching] = useState(true);

  const [councillors, setCouncillors] = useState([]);
  const [refreshWardDetails, setRefreshWardDetails] = useState(false);
  const [refreshCouncillor, setRefreshCouncillor] = useState(false);

  const [isUpdateWardModalOpen, setIsUpdateWardModalOpen] = useState(false);
  const [isAssignCouncillorModalOpen, setIsAssignCouncillorModalOpen] =
    useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const navigate = useNavigate();

  const handleAssignCouncillor = (wardId, wardName) => {
    setSelectedWard({ wardId: wardId, wardName: wardName });
    setIsAssignCouncillorModalOpen(true);
  };

  const handleEditWard = (wardId, wardName) => {
    setSelectedWard({ wardId: wardId, wardName: wardName });
    setIsUpdateWardModalOpen(true);
  };

  const fetchWardData = async () => {
    setIsFetching(true);
    setLoaderText("Loading wards...");

    const loaderId = setTimeout(() => setLoading(true), 300);
    try {
      const response = await fetch("https://nagarseva-backend-oy56.onrender.com/admin/wards", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 401) {
        localStorage.clear("token");
        navigate("/login");
      }

      if (!response.ok) {
        const errorData = await response.json();

        // console.log(errorData)

        if (response.status === 401) {
          navigate("/login");
        }

        return;
      }

      const data = await response.json();
      setWardData(data.wards);
    } catch (err) {
      // console.log(err)
      toast.error("Unable to connect to server.");
    } finally {
      setLoading(false);
      clearTimeout(loaderId);
      setIsFetching(false);
    }
  };

  const fetchWardCouncillors = async () => {
    try {
      const response = await fetch("https://nagarseva-backend-oy56.onrender.com/admin/councillors", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        // console.log(errorData)
        if (response.status === 401) {
          navigate("/login");
        }
        return;
      }

      const data = await response.json();
      setCouncillors(data.councillorList);
    } catch (err) {
      toast.error("Unable to connect to server.");
    }
  };

  const searchWards = async () => {
    setIsFetching(true);
    setLoaderText("Finding complaints...");

    const loaderId = setTimeout(() => {
      setLoading(true);
    }, 300);

    let url = `https://nagarseva-backend-oy56.onrender.com/admin/wards/search?`;
    if (debouncedSearch.trim() != "") {
      url += `&keyword=${debouncedSearch}`;
    }
    try {
      console.log("url is", url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        console.log("error");
        return;
      }

      const data = await response.json();
      const newData = data.wards;
      setWardData(newData);
      console.log("last")
    } catch (err) {
      toast.error("Unable to connect to server.");
    } finally {
      clearInterval(loaderId);
      setLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (debouncedSearch.trim() === "") {
      fetchWardData();
      fetchWardCouncillors();
    } else {
      searchWards();
    }
  }, [refreshWardDetails, refreshCouncillor, debouncedSearch]);

  // useEffect(() => {
  //   searchWards();
  // }, [debouncedSearch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchBar);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchBar]);

  const showEmptyState = !isFetching && wardData.length === 0;

  return (
    <>
      {showEmptyState ? (
        <div className={style.empty_state_container}>
          <div className={style.empty_state_card}>
            <i className="ph ph-map-trifold"></i>
            <h3>No wards found</h3>
            <p>There are no municipal wards configured in the system yet.</p>
          </div>
        </div>
      ) : (
        <div className={style.ward_grid}>
          {wardData.map((ward) => (
            <WardCard
              key={ward.wardId}
              wardId={ward.wardId}
              wardName={ward.wardName}
              wardCouncillor={ward.wardCouncillor}
              handleAssignCouncillor={handleAssignCouncillor}
              handleEditWard={handleEditWard}
            />
          ))}
        </div>
      )}

      <CreateCouncillorModal
        isOpen={isCreateCouncillorModalOpen}
        onClose={() => setIsCreateCouncillorModalOpen(false)}
        invokeRefreshCouncillor={() => setRefreshCouncillor((prev) => !prev)}
      />

      <CreateWardModal
        isOpen={isCreateWardModalOpen}
        onClose={() => setIsCreateWardModalOpen(false)}
        refreshWard={() => refreshWard((prev) => !prev)}
        refreshWardDetails={() => setRefreshWardDetails((prev) => !prev)}
      />

      <AssignCouncillorModal
        isOpen={isAssignCouncillorModalOpen}
        onClose={() => setIsAssignCouncillorModalOpen(false)}
        ward={selectedWard}
        councillors={councillors}
        setLoading={setLoading}
        setLoaderText={setLoaderText}
        refreshWard={() => setRefreshWardDetails((prev) => !prev)}
        refreshCouncillor={() => setRefreshCouncillor((prev) => !prev)}
      />

      <UpdateWardModal
        isOpen={isUpdateWardModalOpen}
        onClose={() => setIsUpdateWardModalOpen(false)}
        selectedWard={selectedWard}
        setLoading={setLoading}
        setLoaderText={setLoaderText}
        refreshWard={() => setRefreshWardDetails((prev) => !prev)}
      />
    </>
  );
};

export default WardManagement;
