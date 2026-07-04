package com.nagarseva.backend.controller;

import com.nagarseva.backend.dto.AdminDashboardResponse;
import com.nagarseva.backend.dto.CitizenDashboardResponse;
import com.nagarseva.backend.dto.OfficerDashboardResponse;
import com.nagarseva.backend.dto.CouncillorDashboardResponse;
import com.nagarseva.backend.service.DashboardService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin/dashboard")
    public ResponseEntity<AdminDashboardResponse> adminDashboardData() {
        AdminDashboardResponse resp = dashboardService.getAdminDashboardData();
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/citizen/dashboard")
    public ResponseEntity<CitizenDashboardResponse> citizenDashboardData() {
        CitizenDashboardResponse resp = dashboardService.getCitizenDashboard();
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/officer/dashboard")
    public ResponseEntity<OfficerDashboardResponse> officerDashboardData() {
        OfficerDashboardResponse resp = dashboardService.getOfficerDashboard();
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/councillor/dashboard")
    public ResponseEntity<CouncillorDashboardResponse> councillorDashboardData() {
        CouncillorDashboardResponse resp = dashboardService.getCouncillorDashboard();
        return ResponseEntity.ok(resp);
    }
}
