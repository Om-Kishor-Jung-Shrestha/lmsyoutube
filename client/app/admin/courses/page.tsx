'use client'

import React from 'react'
import DashboardHero from '@/app/components/Admin/DashboardHero'
import AdminProtected from '@/app/hooks/adminProtected'
import Heading from '@/app/utils/Heading'
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar'
import AllCourses from '@/app/components/Admin/Course/AllCourses'

type Props = {}

const Page = (props: Props) => {
    return (
        <AdminProtected>
            <Heading
                title="Elearning - Admin"
                description="ELearning is a platform for students to learn and get help from teachers"
                keywords="Programming, MERN, Redux, Machine Learning"
            />
            <div className="flex h-screen">
                {/* Sidebar */}
                <div className=" 1500px:w-[16%] w-1/5">
                    <AdminSidebar />
                </div>

                {/* Main content */}
                <div className="w-[84%]">
                    <DashboardHero />
                    <AllCourses />
                </div>
            </div>
        </AdminProtected>
    )
}

export default Page
