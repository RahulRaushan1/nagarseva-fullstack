package com.nagarseva.backend.enums;

public enum IssueType {
    WATER(Priority.HIGH),
    ELECTRICITY(Priority.CRITICAL),
    SEWAGE(Priority.HIGH),
    GARBAGE(Priority.MEDIUM),
    OTHER(Priority.LOW);

    private final Priority priority;

    IssueType(Priority priority) {
        this.priority = priority;
    }

    public Priority getPriority() {
        return this.priority;
    }
}

