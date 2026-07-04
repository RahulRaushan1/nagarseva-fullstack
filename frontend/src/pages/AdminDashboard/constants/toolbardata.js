export const getToolbarData = (ward) => [
    {
      heading: "Dashboard",
      placeholder: "",
      buttonPlaceholder: null,
      filters: [],
    },
    {
      heading: "Officer Management",
      placeholder: "Search officers...",
      buttonPlaceholder: ["Officer"],
      filters: [
        {
          filterBy: "department",
          values: [
            "",
            "SANITATION",
            "WATER",
            "ELECTRICITY",
            "ROADS",
            "DRAINAGE",
            "OTHER",
          ],
        },
      ],
    },
    {
      heading: "Complaints",
      placeholder: "Search complaints....",
      buttonPlaceholder: null,
      filters: [
        {
          filterBy: "status",
          values: [
            "",
            "CREATED",
            "APPROVED",
            "ASSIGNED",
            "IN_PROGRESS",
            "PENDING_VERIFICATION",
            "CLOSED",
            "AUTO_CLOSED",
            "REOPENED",
            "REJECTED",
          ],
        },
        {
          filterBy: "ward",
          values: [
            {
              wardId: "",
              wardName: "",
            },
            ...ward,
          ],
        },
        {
        filterBy: "issueType",
        values: [
          "",
          "WATER",
          "ELECTRICITY",
          "SEWAGE",
          "GARBAGE",
          "OTHER"
        ],
      },
      ],
    },
    {
      heading: "Ward Management",
      placeholder: "Search wards....",
      buttonPlaceholder: ["councillor", "ward"],
      filters: [],
    },
    {
      heading: "Logout",
      placeholder: "",
      buttonPlaceholder: null,
      filters: [],
    },
  ];