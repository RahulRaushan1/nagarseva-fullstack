import React, { useEffect, useRef, useState } from "react";
import styles from "../Complaints/complaint.module.css";
import ComplaintCard from "../ComplaintCard/ComplaintCard";
import OfficerComplaintDetails from "../ComplaintDetails/OfficerComplaintDetails/OfficerComplaintDetails";
import { toast } from "react-toastify";

const ResolvedComplaint = ({
  filtered,
  scrollRef,
  setLoading,
  setLoaderText,
  searchBar,
}) => {

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(6);
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [refreshComplaintList, setRefreshComplaintList] = useState(false);
  const [showComplaintList, setShowComplaintList] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const lastFetchedRef = useRef({
    filtered: null,
    debouncedSearch: null,
    page: null
  });

  const loadingRef = useRef(false);
  const isLast = useRef(false);

  const fetchComplaint = async () => {
    setIsFetching(true);
    lastFetchedRef.current = {
      filtered: JSON.stringify(filtered),
      debouncedSearch: debouncedSearch,
      page: page
    };
    setLoaderText("Loading complaints...");

    const loaderId = setTimeout(() => {
      setLoading(true);
    }, 300);

    let url = `https://nagarseva-backend-oy56.onrender.com/officer/complaints/resolved?page=${page}&size=${size}`;
    if (filtered.status != "") {
      url += `&status=${filtered.status}`;
    }
    if (filtered.ward != "") {
      url += `&wardId=${filtered.ward}`;
    }
    try {
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
      const newData = data.complaints;
      if (page === 0) {
        setComplaints(newData);
      } else {
        setComplaints((prev) => [...prev, ...newData]);
      }
      setShowComplaintList(true);
      isLast.current = data.isLast;
    } catch (err) {
      // console.log(err);
      console.log("in complaints");
      toast.error("Unable to connect to server.");
    } finally {
      loadingRef.current = false;
      clearInterval(loaderId);
      setLoading(false);
      setIsFetching(false);
    }
  };

  const handleViewDetails = async (complaintId) => {
    setShowComplaintList(false)
    const loaderId = setTimeout(() => setLoading(true),300);
    try {                 
      setLoaderText("Loading details...");
      const response = await fetch(
        `https://nagarseva-backend-oy56.onrender.com/officer/complaint/${complaintId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();

        console.log(errorData)
        toast.error("Failed to fetch complaint details");
        return;
      }

      const data = await response.json();
      console.log(data)
      setSelectedComplaint(data.success ? data : null);
      setShowComplaintList(false)
    } catch (err) {
      toast.error("Unable to connect to server");
      console.log(err);
    } finally {
      setLoading(false);
      clearTimeout(loaderId)
    }
  };

  const searchComplaint = async (currentPage = page) => {
    setIsFetching(true);
    lastFetchedRef.current = {
      filtered: JSON.stringify(filtered),
      debouncedSearch: debouncedSearch,
      page: currentPage
    };
    console.log("beta ji 2")
    setLoaderText("Finding complaints...");

    const loaderId = setTimeout(() => {
      setLoading(true);
    }, 300);

    let url = `https://nagarseva-backend-oy56.onrender.com/officer/complaints/resolved/search?page=${currentPage}&size=${size}`;
    if (searchBar.trim() != "") {
      url += `&keyword=${searchBar}`;
    }
    try {
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
      const newData = data.complaints;
      isLast.current = data.isLast;

      if (currentPage === 0) {
        setComplaints(newData);
      } else {
        setComplaints((prev) => [...prev, ...newData]);
      }
    } catch (err) {
      // console.log(err);
      // console.log("in complaints");
      toast.error("Unable to connect to server.");
    } finally {
      loadingRef.current = false;
      clearInterval(loaderId);
      setLoading(false);
      setIsFetching(false);
    }
  };

  const handleScroll = () => {
    const currentScrollPosition = scrollRef.current.scrollTop;
    const screenVisibleHeight = scrollRef.current.clientHeight;
    const totalPageHeight = scrollRef.current.scrollHeight;

    if (
      currentScrollPosition + screenVisibleHeight >= totalPageHeight - 200 &&
      !loadingRef.current &&
      !isLast.current
    ) {
      loadingRef.current = true;
      setPage((page) => page + 1);
    }
  };

  useEffect(() => {
    isLast.current = false;

    if (debouncedSearch.trim() === "") {
      fetchComplaint(page);
    } else {
      searchComplaint(page);
    }
  }, [page, filtered, refreshComplaintList, debouncedSearch]);

  useEffect(() => {
    const currentRef = scrollRef.current;

    if (!currentRef) return;

    currentRef.addEventListener("scroll", handleScroll);

    return () => {
      currentRef.removeEventListener("scroll", handleScroll);
    };
  }, []);


  useEffect(() => {
    setPage(0);
    isLast.current = false;
  }, [filtered, debouncedSearch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchBar);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchBar]);

  const isParamsChanged =
    JSON.stringify(filtered) !== lastFetchedRef.current.filtered ||
    debouncedSearch !== lastFetchedRef.current.debouncedSearch ||
    page !== lastFetchedRef.current.page;

  const isFetchingOrParamsChanged = isFetching || isParamsChanged || debouncedSearch !== searchBar;
  const showEmptyState = !isFetchingOrParamsChanged && complaints.length === 0;

  return (
    <div className={styles.complaints_wrapper}>
      {showComplaintList && (
        showEmptyState ? (
          <div className={styles.empty_state_container}>
            <div className={styles.empty_state_card}>
              <i className="ph ph-folder-open"></i>
              <h3>No complaints found</h3>
              <p>We couldn't find any complaints matching your active search or filters.</p>
            </div>
          </div>
        ) : (
          <div className={styles.complaints_grid}>
            {complaints.map((complaint, index) => (
              <ComplaintCard
                key={complaint.complaintId}
                id={complaint.complaintId}
                date={complaint.createdAt.substring(0, 10)}
                title={complaint.title}
                category={complaint.issueType}
                ward={complaint.wardId}
                priority={complaint.priority}
                status={complaint.issueStatus}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )
      )}

      {selectedComplaint && 
      <OfficerComplaintDetails
        complaint={selectedComplaint} 
        onBack={() => {
          setSelectedComplaint(null)
          setShowComplaintList(true)
        }} 
        setLoading={setLoading}
        setLoaderText={setLoaderText}
        refreshComplaintDetails={handleViewDetails}
        refreshComplaintList={() => setRefreshComplaintList(prev => !prev)}
    />
    }
    </div>
  );
};

export default ResolvedComplaint;
