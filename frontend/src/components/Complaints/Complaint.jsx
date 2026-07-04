import React, { useEffect, useRef, useState } from "react";
import ComplaintCard from "../ComplaintCard/ComplaintCard";
import styles from "./complaint.module.css";
import { toast } from "react-toastify";
import AdminComplaintDetails from "../ComplaintDetails/AdminComplaintDetails/AdminComplaintDetails";

const Complaint = ({
  scrollRef,
  filtered,
  setLoading,
  setLoaderText,
  searchBar,
}) => {
  const [pageInfo, setPageInfo] = useState({});
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(6);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [refreshComplaintList, setRefreshComplaintList] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const lastFetchedRef = useRef({
    filtered: null,
    debouncedSearch: null,
    page: null
  });

  const loadingRef = useRef(false);
  const isLast = useRef(false);

  const handleViewDetails = async (complaintId) => {
    try {
      setLoading(true);
      setLoaderText("Loading details...");
      const response = await fetch(
        `http://localhost:8080/admin/complaint/${complaintId}`,
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
      // console.log(data)
      setSelectedComplaint(data.success ? data : []);
    } catch (err) {
      toast.error("Unable to connect to server");
      console.log(err);
    } finally {
      setLoading(false);
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

    let url = `http://localhost:8080/admin/complaints?page=${page}&size=${size}`;
    if (filtered.status != "") {
      url += `&status=${filtered.status}`;
    }
    if (filtered.ward != "") {
      url += `&wardId=${filtered.ward}`;
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

    let url = `http://localhost:8080/admin/complaints/search?page=${currentPage}&size=${size}`;
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

  useEffect(() => {
    isLast.current = false;

    if (debouncedSearch.trim() === "") {
      fetchComplaint(page);
    } else {
      searchComplaint(page);
    }
  }, [page, filtered, refreshComplaintList, debouncedSearch]);

  useEffect(() => {
    scrollRef.current.addEventListener("scroll", handleScroll);

    return () => {
      scrollRef.current.removeEventListener("scroll", handleScroll);
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

  if (selectedComplaint) {
    return (
      <AdminComplaintDetails
        complaint={selectedComplaint}
        onBack={() => setSelectedComplaint(null)}
        setLoading={setLoading}
        setLoaderText={setLoaderText}
        refreshComplaintDetails={handleViewDetails}
        refreshComplaintList={() => setRefreshComplaintList((prev) => !prev)}
      />
    );
  }

  if (showEmptyState) {
    return (
      <div className={styles.empty_state_container}>
        <div className={styles.empty_state_card}>
          <i className="ph ph-folder-open"></i>
          <h3>No complaints found</h3>
          <p>We couldn't find any complaints matching your active search or filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.complaints_wrapper}>
      <div className={styles.complaints_grid}>
        {complaints.map((complaint) => (
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
            // buttonPlaceholder={''}
          />
        ))}
      </div>
    </div>
  );
};

export default Complaint;
