import { useState, useEffect, useMemo } from 'react';
import type { ExpenseLog } from '../services/expenseService';

export const useExpenseTable = (logs: ExpenseLog[]) => {
    // 1. Filter States
    const [inputValue, setInputValue] = useState(""); 
    const [searchQuery, setSearchQuery] = useState(""); 
    const [selectedGroup, setSelectedGroup] = useState("All Groups");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");

    // 2. Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

		const handleGroupChange = (group: string) => {
        setSelectedGroup(group);
        setCurrentPage(1); // Reset page instantly, in the exact same render cycle
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1); // Reset page instantly
    };

    // Debounce Search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
					setSearchQuery(inputValue);
					setCurrentPage(1);
				}, 300);
        return () => clearTimeout(timeoutId);
    }, [inputValue]);

    // 3. Dynamic Dropdown Options
    const uniqueGroups = useMemo(() => {
        const groups = Array.from(new Set(logs.map(log => log.group)));
        return ["All Groups", ...groups];
    }, [logs]);

    const uniqueCategories = useMemo(() => {
        const categories = Array.from(new Set(logs.map(log => log.category)));
        const formatted = categories.map(c => c.charAt(0).toUpperCase() + c.slice(1));
        return ["All Categories", ...formatted];
    }, [logs]);

    // 4. Filter Logic
    const filteredLogs = useMemo(() => {
        return logs.filter((log) => {
            const matchesSearch = log.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  log.payerName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesGroup = selectedGroup === "All Groups" || log.group === selectedGroup;
            const formattedLogCategory = log.category.charAt(0).toUpperCase() + log.category.slice(1);
            const matchesCategory = selectedCategory === "All Categories" || formattedLogCategory === selectedCategory;

            return matchesSearch && matchesGroup && matchesCategory;
        });
    }, [logs, searchQuery, selectedGroup, selectedCategory]);

    // 5. Pagination Math
    const totalPages = Math.ceil(filteredLogs.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    // Helpers
    const hasActiveFilters = searchQuery !== "" || selectedGroup !== "All Groups" || selectedCategory !== "All Categories";
    const clearAllFilters = () => {
        setInputValue("");
        setSearchQuery("");
        setSelectedGroup("All Groups");
        setSelectedCategory("All Categories");
    };

    return {
        // State
        inputValue, setInputValue,
        searchQuery, setSearchQuery,
        selectedGroup, setSelectedGroup: handleGroupChange,
        selectedCategory, setSelectedCategory: handleCategoryChange,
        currentPage, setCurrentPage,
        rowsPerPage, setRowsPerPage,
        
        // Computed Values
        uniqueGroups, uniqueCategories,
        filteredLogs, paginatedLogs,
        totalPages, startIndex, endIndex,
        
        // Helpers
        hasActiveFilters, clearAllFilters
    };
};
