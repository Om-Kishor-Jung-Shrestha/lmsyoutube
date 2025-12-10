import React, { FC } from 'react';
import { IoMdCheckmark } from 'react-icons/io';

type Props = {
    active: number;
    setActive: (active: number) => void;
}; 

const CourseOptions: FC<Props> = ({ active, setActive }) => {
    const options = [
        "Course Information",
        "Course Options",
        "Course Content",
        "Course Preview",
    ];

    return (
        <div>
            {options.map((option, index) => (
                <div key={index} className="w-full flex py-5 items-center">
                    <div
                        className={`w-[35px] h-[35px] rounded-full flex items-center justify-center ${active + 1 > index ? "bg-blue-500" : "bg-[#384766]"
                            } relative`}
                    >
                        <IoMdCheckmark className="text-[25px] text-white" />
                        {index !== options.length - 1 && (
                            <div className="absolute top-1/2 left-full w-[50px] h-[2px] bg-gray-400"></div>
                        )}
                    </div>
                    <h5
                        className={`pl-3 text-[20px] ${active === index ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-300"
                            }`}
                    >
                        {option}
                    </h5>
                </div>
            ))}
        </div>
    );
};

export default CourseOptions;
