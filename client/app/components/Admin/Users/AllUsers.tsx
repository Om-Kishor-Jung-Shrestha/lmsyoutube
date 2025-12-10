'use client'

import React, { FC, useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import { useTheme } from "next-themes";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import toast from "react-hot-toast";

import {
    useGetAllUsersQuery,
    useUpdateUserRoleMutation,
    useDeleteUserMutation,
} from "@/redux/features/user/userApi";

type Props = {
    isTeam: boolean;
};

const AllUsers: FC<Props> = ({ isTeam }) => {
    const { theme } = useTheme();

    const [active, setActive] = useState(false);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("admin");
    const [openDeleteId, setOpenDeleteId] = useState<string | null>(null);

    const { isLoading, data, refetch } = useGetAllUsersQuery({}, { refetchOnMountOrArgChange: true });
    const [updateUserRole, { error: updateError, isSuccess }] = useUpdateUserRoleMutation();
    const [deleteUser, { isSuccess: deleteSuccess, error: deleteError }] = useDeleteUserMutation();

    // -------------------- EFFECTS --------------------
    useEffect(() => {
        if (updateError && "data" in updateError) toast.error((updateError as any).data.message);

        if (isSuccess) {
            toast.success("User role updated successfully");
            refetch();
            setActive(false);
        }

        if (deleteSuccess) {
            toast.success("User deleted successfully");
            refetch();
            setOpenDeleteId(null);
        }

        if (deleteError && "data" in deleteError) toast.error((deleteError as any).data.message);
    }, [updateError, isSuccess, deleteSuccess, deleteError, refetch]);

    // -------------------- HANDLE ROLE UPDATE --------------------
    const handleSubmit = async () => {
        if (!email) return toast.error("Email is required!");

        try {
            // Send only email + role
            const result = await updateUserRole({ email: email.trim().toLowerCase(), role }).unwrap();

            if (!result.user) {
                return toast.error(result.message || "Update failed: user not found in DB");
            }

            toast.success("User role updated successfully");
            setEmail("");
            setRole("admin");
            setActive(false);
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update role");
        }
    };

    // -------------------- HANDLE DELETE --------------------
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            await deleteUser(id).unwrap();
            toast.success("User deleted successfully");
            setOpenDeleteId(null);
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to delete user");
        }
    };

    // -------------------- TABLE ROWS --------------------
    const rows: any[] = [];
    data?.users.forEach((item: any) => {
        if (isTeam && item.role !== "admin") return; // show only admins in team
        rows.push({
            id: item._id,
            name: item.name,
            email: item.email,
            role: item.role,
            courses: item.courses.length,
            created_at: format(item.createdAt),
        });
    });

    // -------------------- TABLE COLUMNS --------------------
    const columns = [
        { field: "id", headerName: "ID", flex: 0.4 },
        { field: "name", headerName: "Name", flex: 0.6 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "role", headerName: "Role", flex: 0.4 },
        { field: "courses", headerName: "Purchased Courses", flex: 0.4 },
        { field: "created_at", headerName: "Joined At", flex: 0.5 },
        {
            field: "delete",
            headerName: "Delete",
            flex: 0.2,
            renderCell: (params: any) => (
                <Button onClick={() => setOpenDeleteId(params.row.id)} className="dark:text-white">
                    <AiOutlineDelete size={20} />
                </Button>
            ),
        },
        {
            field: "email_btn",
            headerName: "Email",
            flex: 0.2,
            renderCell: (params: any) => (
                <a href={`mailto:${params.row.email}`}>
                    <AiOutlineMail className="dark:text-white text-black" size={20} />
                </a>
            ),
        },
    ];

    // -------------------- RENDER --------------------
    return (
        <div className="mt-[120px]">
            {isLoading ? <Loader /> : (
                <Box m="20px">

                    {/* Add / Promote Member Button */}
                    {isTeam && (
                        <div className="flex justify-start mb-3">
                            <div
                                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                                onClick={() => setActive(true)}
                            >
                                Add / Promote Member
                            </div>
                        </div>
                    )}

                    {/* POPUP */}
                    {active && (
                        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                            <div className="bg-white dark:bg-[#1F2A40] p-6 rounded w-[400px] shadow-lg">
                                <h2 className="text-xl font-semibold mb-4 dark:text-white">
                                    Add / Promote Member
                                </h2>

                                <input
                                    type="email"
                                    className="w-full p-2 border mb-3 rounded dark:bg-[#111827] dark:text-white"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <select
                                    className="w-full p-2 border mb-3 rounded dark:bg-[#111827] dark:text-white"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>

                                <div className="flex justify-end gap-3">
                                    <button
                                        className="px-4 py-2 bg-gray-400 text-white rounded"
                                        onClick={() => setActive(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded"
                                        onClick={handleSubmit} // ✅ Send email + role
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DELETE CONFIRMATION */}
                    {openDeleteId && (
                        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                            <div className="bg-white dark:bg-[#1F2A40] p-6 rounded w-[350px] shadow-lg">
                                <p className="mb-4 dark:text-white">Are you sure you want to delete this user?</p>
                                <div className="flex justify-end gap-3">
                                    <button
                                        className="px-4 py-2 bg-gray-400 text-white rounded"
                                        onClick={() => setOpenDeleteId(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-red-500 text-white rounded"
                                        onClick={() => handleDelete(openDeleteId)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DATA GRID */}
                    <Box
                        m="40px 0 0"
                        height="80vh"
                        sx={{
                            border: "none",
                            outline: "none",
                            "& .MuiDataGrid-columnHeaders": { backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC", color: theme === "dark" ? "#fff" : "#000" },
                            "& .MuiDataGrid-virtualScroller": { backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0" },
                            "& .MuiDataGrid-row, & .MuiDataGrid-cell": { color: theme === "dark" ? "#fff" : "#000", borderBottom: theme === "dark" ? "1px solid #ffffff30" : "1px solid #ccc" },
                            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": { outline: "none" },
                            "& .MuiCheckbox-root": { color: theme === "dark" ? "#A4A9FC" : "#3e4396" },
                            "& .MuiDataGrid-footerContainer": { backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0", borderTop: "none" },
                            "& .MuiTablePagination-root, .MuiTablePagination-caption, .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows, .MuiTablePagination-actions button": { color: theme === "dark" ? "#fff" : "#000" },
                        }}
                    >
                        <DataGrid checkboxSelection rows={rows} columns={columns} />
                    </Box>
                </Box>
            )}
        </div>
    );
};

export default AllUsers;
