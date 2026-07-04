import React, { useEffect, useRef, useState } from 'react'
import { toast } from "react-toastify";
import OfficerCard from '../OfficerCard/OfficerCard';
import style from './officerManagement.module.css'
import CreateOfficerModal from '../CreateOfficerModal/CreateOfficerModal';

const OfficerManagement = ({ filtered, scrollRef, setLoading, setLoaderText, isCreateOfficerModalOpen, setIsCreateOfficerModalOpen, searchBar}) => {

  const [officersData, setOfficersData] = useState([])
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(6);
  const isLast = useRef(false);
  const loadingRef = useRef(false);
  const [refreshOfficer, setRefreshOfficer] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const lastFetchedRef = useRef({
    filtered: null,
    debouncedSearch: null,
    page: null
  });

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

  const fetchOfficerData = async (customPage = page) => {
    setIsFetching(true);
    lastFetchedRef.current = {
      filtered: JSON.stringify(filtered),
      debouncedSearch: debouncedSearch,
      page: customPage
    };
    setLoaderText("Loading officers...")

    const loadingId = setTimeout(() => setLoading(true), 300)
    try {
      let url = `http://localhost:8080/admin/officers?page=${customPage}`

      if (filtered.department != "") url += `&department=${filtered.department}`

      const response = await fetch(url,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      )

      if (!response.ok) {
        // console.log("gad bad");

        if (response.status === 401) {
            navigate("/login");
        }
        return;
      }

      const data = await response.json();
      console.log(data)
      isLast.current = data.isLast;

      if (customPage === 0) {
        setOfficersData(data.officers);
      } else {
        setOfficersData(prev => [...prev, ...data.officers]);
      }

    } catch (err) {
      // console.log(err)
      toast.error("Unable to connect to server.")
    } finally {
      loadingRef.current = false;
      clearTimeout(loadingId)
      setLoading(false)
      setIsFetching(false);
    }
  }

  const searchOfficers = async (currentPage = page) => {
    setIsFetching(true);
    lastFetchedRef.current = {
      filtered: JSON.stringify(filtered),
      debouncedSearch: debouncedSearch,
      page: currentPage
    };
    setLoaderText("Finding officers...");

    const loaderId = setTimeout(() => {
      setLoading(true);
    }, 300);

    let url = `http://localhost:8080/admin/officers/search?page=${currentPage}&size=${size}`;
    if (debouncedSearch.trim() != "") {
      url += `&keyword=${debouncedSearch}`;
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
      const newData = data.officers;
      isLast.current = data.isLast;

      if (currentPage === 0) {
        setOfficersData(newData)
      } else {
        setOfficersData((prev) => [...prev, ...newData]);
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
      fetchOfficerData(page);
    } else {
      searchOfficers(page);
    }
  }, [page, filtered, refreshOfficer, debouncedSearch]);

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
  const showEmptyState = !isFetchingOrParamsChanged && officersData.length === 0;

  return (
    <>
      {showEmptyState ? (
        <div className={style.empty_state_container}>
          <div className={style.empty_state_card}>
            <i className="ph ph-users"></i>
            <h3>No officers found</h3>
            <p>We couldn't find any officers matching your active search or filters.</p>
          </div>
        </div>
      ) : (
        <div className={style.officer_grid}>
          {officersData.map((data) => (
            <OfficerCard
              key={data.id}
              props={data}
            />
          ))}
        </div>
      )}

      <CreateOfficerModal
        isOpen={isCreateOfficerModalOpen}
        onClose={() => setIsCreateOfficerModalOpen(false)}
        refreshOfficer={() => setRefreshOfficer(prev => !prev)}
        setLoading={setLoading}
        setLoaderText={setLoaderText}
      />
    </>
  )
}

export default OfficerManagement
