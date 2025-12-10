'use client';
import React, { FC, useState, useEffect, use } from 'react';
import SideBarProfile from './SideBarProfile';
import { useLogOutQuery } from '../../../redux/features/auth/authApi';
import { signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { userLoggedOut } from '@/redux/features/auth/authSlice';
import { useDispatch } from 'react-redux';
import ProfileInfo from './ProfileInfo';
import ChangePassword from './ChangePassword';

type Props = {
    user: any;
};

const Profile: FC<Props> = ({ user }) => {
    const [scroll, setScroll] = useState(false);

    const [avatar, setAvatar] = useState(null);
    const [logout, setLogout] = useState(false);
    const { } = useLogOutQuery(undefined, {
        skip: !logout ? true : false,
    });
    const dispatch = useDispatch();

    const [active, setActive] = useState(1);
    /*
       const logoutHandler = async() => {
            signOut();
            await setLogout(true);
            //redirect('/');
            
        }
    */
    const logoutHandler = async () => {
        // 1️⃣ Sign out from NextAuth (don’t redirect automatically)
        await signOut({ redirect: false });

        // 2️⃣ Clear Redux state
        dispatch(userLoggedOut());

        // 3️⃣ Trigger RTK logout query (optional, if your API handles cookie/session logout)
        setLogout(true);

        // 4️⃣ Manually navigate home
        redirect('/');
    };




    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 85) {
                setScroll(true);
            } else {
                setScroll(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup on unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="w-[85%] flex mx-auto">
            <div
                //className={`w-[60px] 800px:w-[310px] h-[450px] dark: bg-slate-900 bg-opacity-90 border bg-white dark: border-[#ffffff1d] border-[#ffffff16] rounded-[5px] shadow-sm dark:shadow-sm mt-[80px] mb-[80px] sticky left-[30px] ${scroll ? 'top-[120px]' : 'top-[30px]'}`}
                className={`w-[60px] 800px:w-[310px] h-[450px] bg-white dark:bg-slate-900 bg-opacity-90 border border-[#ffffff16] dark:border-[#ffffff1d] rounded-[5px] shadow-xl dark:shadow-sm mt-[80px] mb-[80px] sticky left-[30px] ${scroll ? 'top-[120px]' : 'top-[30px]'}`}



            >
                <SideBarProfile
                    user={user}
                    active={active}
                    avatar={avatar}
                    setActive={setActive}
                    logoutHandler={logoutHandler}

                />
            </div>
            {
                active === 1 && (
                    <div className="w-full h-full bg-transparent mt-[80px]">
                    <ProfileInfo avatar={null} user={undefined} />
                    </div>
                )
            }
            {
                active === 2 && (
                    <div className="w-full h-full bg-transparent mt-[80px]">
                    <ChangePassword/>
                    </div>
                )
            }
        </div>
    );
};

export default Profile;
