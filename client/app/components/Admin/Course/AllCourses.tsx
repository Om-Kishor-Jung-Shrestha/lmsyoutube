'use client'

import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { useTheme } from "next-themes";
import Loader from "../../Loader/Loader";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { format } from "timeago.js";

const AllCourses = () => {
    const { theme } = useTheme();
    const { isLoading, data, error } = useGetAllCoursesQuery({});

    console.log("Courses API data:", data); // 🔹 Debug

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "title", headerName: "Course Title", flex: 1 },
        { field: "ratings", headerName: "Ratings", flex: 0.5 },
        { field: "purchased", headerName: "Purchased", flex: 0.5 },
        { field: "created_at", headerName: "Created At", flex: 0.5 },
        {
            field: "edit",
            headerName: "Edit",
            flex: 0.2,
            renderCell: () => (
                <Button>
                    <FiEdit2 className="dark:text-white text-black" size={20} />
                </Button>
            ),
        },
        {
            field: "delete",
            headerName: "Delete",
            flex: 0.2,
            renderCell: () => (
                <Button>
                    <AiOutlineDelete className="dark:text-white text-black" size={20} />
                </Button>
            ),
        },
    ];

    // ✅ Map rows properly
    const rows = data?.courses?.map((item: any) => ({
        id: item._id,
        title: item.name,
        ratings: item.ratings,
        purchased: item.purchased,
        created_at: format(new Date(item.createdAt)),
    })) || [];

    return (
        <div className="mt-[120px]">
            {isLoading ? (
                <Loader />
            ) : (
                <Box m="20px">
                    <Box
                        m="40px 0 0"
                        height="80vh"
                        sx={{
                            border: "none",
                            outline: "none",
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                                color: theme === "dark" ? "#fff" : "#000",
                            },
                            "& .MuiDataGrid-virtualScroller": {
                                backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0",
                            },
                            "& .MuiDataGrid-row": {
                                color: theme === "dark" ? "#fff" : "#000",
                                borderBottom:
                                    theme === "dark" ? "1px solid #ffffff30" : "1px solid #ccc",
                            },
                            "& .MuiCheckbox-root": {
                                color: theme === "dark" ? "#3e4396" : "#A4A9FC",
                            },
                            "& .MuiDataGrid-footerContainer": {
                                backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0",
                                borderTop: "none",
                                "& .MuiTablePagination-root": { color: theme === "dark" ? "#fff" : "#000" },
                                "& .MuiTablePagination-caption": { color: theme === "dark" ? "#fff" : "#000" },
                                "& .MuiTablePagination-selectLabel": { color: theme === "dark" ? "#fff" : "#000" },
                                "& .MuiTablePagination-select": { color: theme === "dark" ? "#fff" : "#000" },
                                "& .MuiTablePagination-actions button": { color: theme === "dark" ? "#fff" : "#000" },
                                "& .MuiTablePagination-displayedRows": { color: theme === "dark" ? "#fff" : "#000" },
                            },
                        }}
                    >
                        <DataGrid checkboxSelection rows={rows} columns={columns} />
                    </Box>
                </Box>
            )}
        </div>
    );
};

export default AllCourses;
