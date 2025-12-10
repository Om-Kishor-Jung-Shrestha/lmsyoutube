'use client';
import React, { FC } from 'react';
import avatarDefault from '../../../public/assets/avatar.png';
import Image from 'next/image';
import { RiLockPasswordLine } from 'react-icons/ri';
import { SiCoursera } from 'react-icons/si';
import { AiOutlineLogout } from 'react-icons/ai';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import Link from '@mui/material/Link/Link';



type Props = {
    user: any;
    active: number;
    avatar: string | null;
    setActive: (active: number) => void;
    logoutHandler: any;
};

const SideBarProfile: FC<Props> = ({ user, active, avatar, setActive, logoutHandler }) => {
    return (
        <div className="w-full">
            <div
                className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 1 ? "bg-white dark:bg-slate-800" : "bg-transparent"
                    }`}
                onClick={() => setActive(1)}
            >
                <Image
                    src={user?.avatar?.url || avatar || avatarDefault}
                    alt="User Avatar"
                    width={30}
                    height={30}
                    className="w-[20px] h-[20px] 800px:w-[30px] 800px:h-[30px] cursor-pointer rounded-full object-cover"
                />
                <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
                    My Account
                </h5>

            </div>
            <div className="w-full">
                <div
                    className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 2 ? "bg-white dark:bg-slate-800" : "bg-transparent"
                        }`}
                    onClick={() => setActive(2)}
                >
                    <RiLockPasswordLine
                        size={20}
                        className="text-black dark:text-white"
                    />
                    <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
                        Change Password
                    </h5>
                </div>
            </div>
            <div className="w-full">
                <div
                    className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 3 ? "bg-white dark:bg-slate-800" : "bg-transparent"
                        }`}
                    onClick={() => setActive(3)}
                >
                    <SiCoursera
                        size={20}
                        className="text-black dark:text-white"
                    />
                    <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
                        Enrolled Courses
                    </h5>
                </div>
            </div>
            {
                user?.role === 'admin' && (
                    <div className="w-full">
                <Link
                    className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 6 ? "bg-white dark:bg-slate-800" : "bg-transparent"
                        }`}
                   href={"/admin"}
                >
                    <MdOutlineAdminPanelSettings
                        size={20}

                        className="text-black dark:text-white"
                    />
                    <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
                        Admin Dashboard
                    </h5>
                </Link>
            </div>
                )
            }

            <div className="w-full">
                <div
                    className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 4 ? "bg-white dark:bg-slate-800" : "bg-transparent"
                        }`}
                    onClick={() => logoutHandler()}
                >
                    <AiOutlineLogout
                        size={20}
                        className="text-black dark:text-white"
                    />
                    <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
                        Log Out
                    </h5>
                </div>
            </div>


        </div>



    );
};

export default SideBarProfile;
