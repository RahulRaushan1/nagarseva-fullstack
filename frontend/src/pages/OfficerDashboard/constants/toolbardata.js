export const getToolbarData = (ward) => [
    {
      heading: "Dashboard",
      placeholder: "",
      filters: [],
    },
    {
      heading: "Assigned Complaints",
      placeholder: "Search complaints...",
      filters: [
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
          filterBy: "status",
          values: [
            "",
            "ASSIGNED",
            "IN_PROGRESS",
            "PENDING_VERIFICATION",
            "REOPENED",
          ],
        },
      ],
    },
    {
      heading: "Resolved Complaints",
      placeholder: "Search complaints....",
      filters: [
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
          filterBy: "status",
          values: [
            "",
            "CLOSED",
            "AUTO_CLOSED",
          ],
        },
      ],
    },
    {
      heading: "Logout",
      placeholder: "",
      filters: [],
    },
  ];