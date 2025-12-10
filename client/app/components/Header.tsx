'use client'
import React, { FC, useState, useEffect } from "react";
import Link from "next/link";
import NavItems from "../utils/NavItems"; // adjust path if needed
import { ThemeSwitcher } from "../utils/ThemeSwitcher"; // adjust path if needed
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import CustomModal from "../utils/CustomModal"; // adjust path if needed
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp"// adjust path if needed
import Verification from "./Auth/Verification";// adjust path if needed
import { stat } from "fs";
//import { useSelector } from "react-redux/es/hooks/useSelector";
import Image from "next/image";
import avatar from '../../public/assets/avatar.png';
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useLogOutQuery, useSocialAuthMutation } from "@/redux/features/auth/authApi";
import { userLoggedOut } from '@/redux/features/auth/authSlice';
import { useDispatch } from "react-redux";

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    activeItem: number;
    setRoute: (route: string) => void;
    route: string;
};

const Header: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
    const [active, setActive] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);
    const { user } = useSelector((state: any) => state.auth);
    const { data } = useSession();
    const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();
    const [logout, setLogout] = useState(false);
    const { status } = useSession();
    const dispatch = useDispatch();

    const { } = useLogOutQuery(undefined, {
        skip: !logout ? true : false,
    });
/*
   useEffect(() => {
        // First if: call socialAuth if user is not logged in and data exists
        if (!user) {
            if (data) {
                socialAuth({
                    email: data?.user?.email,
                    name: data?.user?.name,
                    avatar: data?.user?.image,
                });
            }
        }

         //if(data===null){}
         
        if (isSuccess) {
            toast.success("Login Successfully");
        }
     
       // if (data === null) {setLogout(true);}
    }, [data, user]);
    */
     
  /*
    useEffect(() => {
        // First if: call socialAuth if user is not logged in and data exists
        if (!user) {
            if (data) {
                socialAuth({
                    email: data?.user?.email,
                    name: data?.user?.name,
                    avatar: data?.user?.image,
                });
            }
        }

         if(data===null)
         {
          if (isSuccess) {
            toast.success("Login Successfully");
        }
          }
         
        

        if (data === null) {setLogout(true);}
    }, [data, user]);

    */

  




useEffect(() => {
    // 1️⃣ Don't do anything while NextAuth is still checking session
    if (status === "loading") return;

    // 2️⃣ If no Redux user but session data exists (NextAuth user), call social auth
    if (!user && data) {
        socialAuth({
            email: data?.user?.email,
            name: data?.user?.name,
            avatar: data?.user?.image,
        });
    }

    // 3️⃣ When socialAuth login succeeds
    if (data && isSuccess) {
        toast.success("Login Successfully");
    }

    // 4️⃣ When session disappears after logout
    if (status === "unauthenticated" && !data && !user) {
        dispatch(userLoggedOut()); // clear user from Redux
        setLogout(true);
    }
}, [data, user, isSuccess, status, dispatch]);


    if (typeof window !== "undefined") {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 85) {
                setActive(true);
            } else {
                setActive(false);
            }
        });
    }

    const handleClose = (e: any) => {
        if (e.target.id === "screen") {
            setOpenSidebar(false);
        }
    };
    //console.log(user);
    return (
        <div className="w-full relative">
            <div
                className={`${active
                    ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffff1]"
                    : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
                    }`}
            >
                <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
                    <div className="w-full h-[80px] flex items-center justify-between p-3">

                        <div>
                            <Link
                                href={"/"}
                                className={"text-[25px] font-Poppins font-[500] text-black dark:text-white"}
                            >
                                ELearning
                            </Link>
                        </div>

                        <div className="flex items-center">
                            <NavItems
                                activeItem={activeItem}
                                isMobile={false}
                            />
                            <ThemeSwitcher />

                            {/* only for mobile */}
                            <div className="800px:hidden">
                                <HiOutlineMenuAlt3
                                    size={25}
                                    className="cursor-pointer dark:text-white text-black"
                                    onClick={() => setOpenSidebar(true)}
                                />
                            </div>

                            {
                                user ? (
                                    <Link href={"/profile"}>
                                    <Image
                                        src={user.avatar ? user.avatar.url : avatar}
                                        alt="User Avatar"
                                        width={30}
                                        height={30}
                                        className="w-[30px] h-[30px] rounded-full cursor-pointer"
                                        style={{border:activeItem === 5 ? "2px solid #ffc1047":"none"}}
                                    />
                                    </Link>
                                ) : (
                                    <HiOutlineUserCircle
                                        size={25}
                                        className="hidden 800px:block cursor-pointer dark:text-white text-black"
                                        onClick={() => setOpen(true)}
                                    />
                                )
                            }





                        </div>

                    </div>
                </div>

                {/* mobile sidebar */}
                {openSidebar && (
                    <div
                        className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
                        onClick={handleClose}
                        id="screen"
                    >
                        <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
                            <NavItems activeItem={activeItem} isMobile={true} />
                            <HiOutlineUserCircle
                                size={25}
                                className="cursor-pointer ml-5 my-2 text-black dark:text-white"
                                onClick={() => setOpen(true)}
                            />
                            <br />
                            <br />
                            <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                                Copyright © 2023 ELearning
                            </p>
                        </div>
                    </div>
                )}

            </div>
            {route === "Login" && (
                <>
                    {open && (
                        <CustomModal
                            open={open}
                            setOpen={setOpen}
                            setRoute={setRoute}
                            activeItem={activeItem}
                            component={Login}
                        />
                    )}
                </>
            )}

            {route === "Sign-Up" && (
                <>
                    {open && (
                        <CustomModal
                            open={open}
                            setOpen={setOpen}
                            setRoute={setRoute}
                            activeItem={activeItem}
                            component={SignUp}
                        />
                    )}
                </>
            )}
            {route === "Verification" && (
                <>
                    {open && (
                        <CustomModal
                            open={open}
                            setOpen={setOpen}
                            setRoute={setRoute}
                            activeItem={activeItem}
                            component={Verification}
                        />
                    )}
                </>
            )}


        </div>
    );
};

export default Header;
