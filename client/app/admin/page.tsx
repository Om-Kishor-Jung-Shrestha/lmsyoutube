'use client'
import React from 'react'
import Heading from '../utils/Heading'
import AdminProtected from '../hooks/adminProtected'
import AdminSidebar from '../components/Admin/sidebar/AdminSidebar'
import DashboardHero from '../components/Admin/DashboardHero'


type Props = {}

const Page = (props: Props) => {
    return (
        <div>
            <AdminProtected>
                <Heading
                    title="Elearning - Admin"
                    description="ELearning is a platform for students to learn and get help from teachers"
                    keywords="Programming, MERN, Redux, Machine Learning"
                />
                <div className="flex h-[200vh]">
                    <div className="1500px:w-[16%] w-1/5">
                        <AdminSidebar />
                    </div>
                    <div className="w-[85%]">
                      <DashboardHero />
                    </div>
                </div>
            </AdminProtected>
        </div>
    )
}

export default Page
