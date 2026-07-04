package com.nagarseva.backend.controller;

import com.nagarseva.backend.dto.*;
import com.nagarseva.backend.service.WardService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
public class WardController {

    private WardService wardService;

    @PostMapping("/admin/ward")
    public ResponseEntity<RegisterWardResponse> createNewWard(@Valid @RequestBody RegisterWardRequest registerWardRequest) {
        RegisterWardResponse resp = wardService.addNewWard(registerWardRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @PutMapping("/admin/ward/{id}/assign-wc")
    public ResponseEntity<WardCouncillorAssignResponse> assignWardCouncillor(
            @PathVariable(name = "id") int wardId,
            @RequestParam(name = "councillorId") int councillorId
            ) {
        WardCouncillorAssignResponse resp = wardService.setWardCouncillor(wardId, councillorId);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @GetMapping("/admin/wards")
    public ResponseEntity<WardFetchResponse> getWardForAdmin() {
        WardFetchResponse resp = wardService.getWardDetails();
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @GetMapping("/citizen/wards")
    public ResponseEntity<WardFetchResponse> getWardForCitizen() {
        WardFetchResponse resp = wardService.getWardDetails();
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @GetMapping("/officer/wards")
    public ResponseEntity<WardFetchResponse> getWardForOfficer() {
        WardFetchResponse resp = wardService.getWardDetails();
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @PutMapping("/admin/ward/{id}")
    public ResponseEntity<UpdateWardResponse> updateWardDetails(
            @PathVariable(name = "id") Integer wardId,
            @RequestBody UpdateWardRequest updateWardRequest) {

        UpdateWardResponse resp = wardService.updateWard(wardId,updateWardRequest.getWardName());
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @GetMapping("/admin/wards/search")
    public ResponseEntity<WardFetchResponse> getWardForOfficerByKeyword(
            @RequestParam(name = "keyword", required = false) String keyword
    ) {
        WardFetchResponse resp = wardService.getWardDetailsByKeyword(keyword);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

}
