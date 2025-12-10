'use client';

import React, { FC } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle'; // correct import for AddCircleIcon
import { styles } from '@/app/styles/style';
import { toast } from 'react-hot-toast'; 

type Props = {
    benefits: { title: string }[];
    setBenefits: (benefits: { title: string }[]) => void;
    prerequisites: { title: string }[];
    setPrerequisites: (prerequisites: { title: string }[]) => void;
    active: number;
    setActive: (active: number) => void;
};

const CourseData: FC<Props> = ({
    benefits,
    setBenefits,
    prerequisites,
    setPrerequisites,
    active,
    setActive,
}) => {
    const handleBenefitChange = (index: number, value: any) => {
        const updatedBenefits = [...benefits];
        updatedBenefits[index].title = value;
        setBenefits(updatedBenefits);
    };

    const handleAddBenefit = () => {
        setBenefits([...benefits, { title: "" }]);
    };

    const handlePrerequisitesChange = (index: number, value: any) => {
        const updatedPrerequisites = [...prerequisites];
        updatedPrerequisites[index].title = value;
        setPrerequisites(updatedPrerequisites);
    };

    const handleAddPrerequisites = () => {
        setPrerequisites([...prerequisites, { title: "" }]);
    };

    const prevButton = () => {
    // Move back one step
    setActive(active - 1);
};

const handleOptions = () => {
    // Check if the last benefit and prerequisite are filled
    if (
        benefits[benefits.length - 1]?.title !== "" &&
        prerequisites[prerequisites.length - 1]?.title !== ""
    ) {
        setActive(active + 1); // Move forward one step
    } else {
        toast.error("Please fill the fields to go to next!");
    }
};

    return (
        <div className="w-[80%] m-auto mt-24 block">
            <div>
                <label className={`${styles.label} text-[20px]`} htmlFor="email">
                    What are the benefits for students in this course?
                </label>
                <br />
                {benefits.map((benefit, index) => (
                    <input
                        type="text"
                        key={index}
                        name="Benefit"
                        placeholder="You will be able to build a full stack LMS Platform..."
                        required
                        className={`${styles.input} my-2`}
                        value={benefit.title}
                        onChange={(e) => handleBenefitChange(index, e.target.value)}
                    />
                ))}
                <AddCircleIcon
                    style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
                    onClick={handleAddBenefit}
                />
            </div>

            <div className="mt-6">
                <label className={`${styles.label} text-[20px]`} htmlFor="email">
                    What are the prerequisites for this course?
                </label>
                <br />
                {prerequisites.map((prerequisite, index) => (
                    <input
                        type="text"
                        key={index}
                        name="Prerequisite"
                        placeholder="You need basic knowledge of MERN stack."
                        required
                        className={`${styles.input} my-2`}
                        value={prerequisite.title}
                        onChange={(e) => handlePrerequisitesChange(index, e.target.value)}
                    />
                ))}
                <AddCircleIcon
                    style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
                    onClick={handleAddPrerequisites}
                />
            </div>
            <div className="w-full flex items-center justify-between mt-8">
                {/* Prev Button */}
                <div
                    className="w-full max-w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-white text-center rounded cursor-pointer"
                    onClick={() => prevButton()}
                >
                    Prev
                </div>

                {/* Next Button */}
                <div
                    className="w-full max-w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-white text-center rounded cursor-pointer"
                    onClick={() => handleOptions()}
                >
                    Next
                </div>
            </div>

        </div>




    );
};

export default CourseData;
