import React, { useEffect, useRef, useState } from "react";
import ComplaintCard from "../ComplaintCard/ComplaintCard";
import styles from "../MyComplaints/myComplaints.module.css";
import CouncillorComplaintDetails from "../ComplaintDetails/CouncillorComplaintDetails/CouncillorComplaintDetails";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const WardComplaints = ({ scrollRef, filtered, setLoading, setLoaderText, searchBar }) => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(6);
  const [showComplaints, setShowComplaints] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showComplaintDetails, setShowComplaintDetails] = useState(false);
  const [refreshComplaintList, setRefreshComplaintList] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const lastFetchedRef = useRef({
    filtered: null,
    debouncedSearch: null,
    page: null
  });

  const loadingRef = useRef(false);
  const isLast = useRef(false);
//   console.log("hleu");

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

  const fetchComplaints = async (customPage = page) => {
    setIsFetching(true);
    lastFetchedRef.current = {
      filtered: JSON.stringify(filtered),
      debouncedSearch: debouncedSearch,
      page: customPage
    };
    setLoaderText("Loading complaints...");

    const loaderId = setTimeout(() => {
      setLoading(true);
    }, 300);

    let url = `https://nagarseva-backend-oy56.onrender.com/councillor/complaints?page=${page}&size=${size}`;

    if (filtered.status != "") {
      url += `&status=${filtered.status}`;
    }
    if (filtered.issueType != "") {
      url += `&issueType=${filtered.issueType}`;
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
        if (response.status === 401) {
          navigate("/login");
        }
        return;
      }

      const data = await response.json();

      if (customPage === 0) {
        setComplaints(data.complaints);
      } else {
        setComplaints((prev) => [...prev, ...data.complaints]);
      }

      isLast.current = data.isLast;
      // setShowComplaints(true)
    } catch (err) {
      console.log(err);
      toast.error("Unable to connect to server.");
    } finally {
      loadingRef.current = false;
      clearInterval(loaderId);
      setLoading(false);
      setIsFetching(false);
    }
  };

  const searchComplaint = async (currentPage = page) => {
    setIsFetching(true);
    lastFetchedRef.current = {
      filtered: JSON.stringify(filtered),
      debouncedSearch: debouncedSearch,
      page: currentPage
    };
    setLoaderText("Finding complaints...");

    const loaderId = setTimeout(() => {
      setLoading(true);
    }, 300);

    let url = `https://nagarseva-backend-oy56.onrender.com/councillor/complaints/search?page=${currentPage}&size=${size}`;
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
      toast.error("Unable to connect to server.");
    } finally {
      loadingRef.current = false;
      clearInterval(loaderId);
      setLoading(false);
      setIsFetching(false);
    }
  };

  const handleViewDetails = async (complaintId) => {
      setLoaderText("Loading details...");
      const loaderId = setTimeout(() => setLoading(false),300)
      try {
        const response = await fetch(
          `https://nagarseva-backend-oy56.onrender.com/councillor/complaint/${complaintId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
  
        if (!response.ok) {
          toast.error("Failed to fetch complaint details");
          return;
        }
  
        const data = await response.json();
        console.log(data);
        setSelectedComplaint(data.complaint ? data.complaint : data);
        setShowComplaints(false)
        setShowComplaintDetails(true)
      } catch (err) {
        toast.error("Unable to connect to server");
        console.log(err);
      } finally {
        setLoading(false);
        clearTimeout(loaderId)
      }
    };

  useEffect(() => {
    isLast.current = false;

    if (debouncedSearch.trim() === "") {
      fetchComplaints(page);
    } else {
      searchComplaint(page);
    }
  }, [page, filtered, refreshComplaintList, debouncedSearch]);

  useEffect(() => {
    const scrollElement = scrollRef.current;

    if (!scrollElement) return;

    scrollElement.addEventListener("scroll", handleScroll);

    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
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
      {showComplaints && (
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
            {complaints.map((complaint) => (
              <ComplaintCard
                key={complaint.complaintId}
                id={complaint.complaintId}
                date={complaint.createdAt}
                title={complaint.title}
                category={complaint.issueType}
                ward={complaint.wardId}
                priority={complaint.priority}
                status={complaint.issueStatus}
                onViewDetails={handleViewDetails}
              //   buttonPlaceholder={"Change Pr"}
              //   onEditComplaint={onEditComplaint}
              />
            ))}
          </div>
        )
      )}

      {showComplaintDetails && 
      <CouncillorComplaintDetails 
      complaint={selectedComplaint}
      onBack={() => {
        setShowComplaintDetails(false)
        setShowComplaints(true)
      }}
      setLoading={setLoading}
      setLoaderText={setLoaderText}
      refreshComplaintDetails={handleViewDetails}
      refreshComplaintList={() => setRefreshComplaintList((prev) => !prev)}
      />
      }
        </div>
  )

};

export default WardComplaints;
