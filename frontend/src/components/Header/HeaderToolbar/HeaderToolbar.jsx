import React, { useEffect } from "react";
import styles from "./headerToolbar.module.css";

const HeaderToolbar = ({
  heading,
  placeholder,
  buttonPlaceholder,
  filters,
  onCreateClick,
  selectedFilters,
  setSearchBar,
  searchVal = "",
  filtersVal = {}
}) => {

  if (heading === "Dashboard" || heading === "Logout" || heading === "Profile") {
    return null;
  }

  const handleFilterChange = (filterBy, value) => {
    selectedFilters(prev => ({
      ...prev,
      [filterBy]: value
    }))
  }

  const hasSearch = searchVal && searchVal.trim() !== "";
  const hasFilters = filtersVal && Object.values(filtersVal).some(val => val !== "");
  const showClear = hasSearch || hasFilters;

  const handleClearAll = () => {
    setSearchBar("");
    if (selectedFilters) {
      selectedFilters(prev => {
        const cleared = {};
        Object.keys(prev).forEach(key => {
          cleared[key] = "";
        });
        return cleared;
      });
    }
  };

  return (
    <div className={styles.action_row}>
      <div className={styles.search_box}>
        <i className="ph ph-magnifying-glass"></i>
        <input
          type="text" 
          placeholder={placeholder}
          value={searchVal}
          onChange={(e) => setSearchBar(e.target.value)}
        />
      </div>

      {filters.map((filter, idx) => (
        <select
          key={idx}
          className={styles.filter_dropdown}
          value={filtersVal[filter.filterBy] || ""}
          onChange={(e) =>
            handleFilterChange(filter.filterBy, e.target.value)
          }
        >
          {filter.values.map((value, valueIdx) => {

            const isWardFilter = filter.filterBy === "ward";

            const optionValue = isWardFilter
              ? value.wardId
              : value;

            const optionLabel = isWardFilter
              ? value.wardId === ""
                ? "All Wards"
                : `Ward ${value.wardId}`
              : value === ""
                ? "ALL"
                : value;

            return (
              <option
                key={valueIdx}
                value={optionValue}
              >
                {optionLabel}
              </option>
            );
          })}
        </select>
      ))}

      {showClear && (
        <button className={styles.btn_clear} onClick={handleClearAll}>
          <i className="ph ph-x-circle"></i> Clear All
        </button>
      )}

      <div className={styles.button_group}>
        {buttonPlaceholder?.map((btn, idx) => (
          <button key={idx} className={styles.btn_create_officer} onClick={() => onCreateClick(btn)}>
            <i className="ph ph-plus-circle"></i> Create {btn}</button>
        ))}
      </div>
    </div>
  );
};

export default HeaderToolbar;
