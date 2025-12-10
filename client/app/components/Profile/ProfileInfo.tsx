'use client'
import Image from "next/image";
import { styles } from "../../../app/styles/style";
import React, { FC, useEffect, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import avatarIcon from "../../../public/assets/avatar.png";
import { useEditProfileMutation, useUpdateAvatarMutation } from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { toast } from "react-hot-toast/headless";


type Props = {
    avatar: string | null;
    user: any;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
    const [name, setName] = useState(user && user.name);
    const [editProfile, { isSuccess: success, error: updateError }] = useEditProfileMutation();

    const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
    const [loadUser, setLoadUser] = useState(false);
    const { } = useLoadUserQuery(undefined, { skip: loadUser ? false : true });

    const imageHandler = async (e: any) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            if (fileReader.readyState === 2) {
                const avatar = fileReader.result;
                updateAvatar(avatar as string);
            }
        };
        fileReader.readAsDataURL(e.target.files[0]);

    };

    useEffect(() => {
        if (isSuccess || success) {
            setLoadUser(true);
        }
        if (error || updateError) {
            console.log(error); 
        }
        if(success){
            toast.success("Profile updated successfully!");
        }
    }, [isSuccess, error,success,updateError]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (name !== "") {
            await editProfile({
                name: name,
               
            });
        }
    };


    return (
        <>
            <div className="w-full flex flex-col items-center mt-8">
                {/* Avatar Section */}
                <div className="relative mb-6">
                    <Image
                        src={user?.avatar?.url || avatar || avatarIcon}
                        alt="User Avatar"
                        width={30}
                        height={30}
                        priority
                        className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full"
                    />
                    <input
                        type="file"
                        id="avatar"
                        className="hidden"
                        onChange={imageHandler}
                        accept="image/png, image/jpg, image/jpeg, image/webp"
                    />
                    <label htmlFor="avatar">
                        <div className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
                            <AiOutlineCamera size={20} className="z-1 text-white" />
                        </div>
                    </label>
                </div>

                {/* Form Section */}
                <div className="w-full px-6 800px:px-10">
                    <form onSubmit={handleSubmit}>
                        <div className="800px:w-[50%] m-auto block pb-4">
                            <div className="w-[100%]">
                                <label className="block pb-2  text-black dark:text-[#fff]">Full Name</label>
                                <input
                                    type="text"
                                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="w-[100%] pt-2">
                                <label className="block pb-2  text-black dark:text-[#fff]">Email Address</label>
                                <input
                                    type="text"
                                    readOnly
                                    className={`${styles.input} w-[95%] mb-1 800px:mb-0`}
                                    required
                                    value={user?.email}
                                />
                            </div>
                            <input
                                required
                                type="submit"
                                value="Update"
                                className="w-full 800px:w-[250px] h-[40px] border border-[#37a39a] text-center dark:text-[#fff] text-black rounded-[3px] mt-8 cursor-pointer"
                            />
                        </div>
                    </form>
                    <br />
                </div>
            </div>

        </>
    );
};

export default ProfileInfo;