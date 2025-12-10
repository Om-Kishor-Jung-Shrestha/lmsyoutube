'use client';

import { styles } from '@/app/styles/style';
import React, { FC, useState } from 'react';

type Props = {
  courseInfo: any;
  setCourseInfo: (courseInfo: any) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseInformation: FC<Props> = ({ courseInfo, setCourseInfo, active, setActive }) => {
  const [dragging, setDragging] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setActive(active + 1);
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setCourseInfo({ ...courseInfo, thumbnail: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCourseInfo({ ...courseInfo, thumbnail: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-[80%] m-auto mt-24">
      <form onSubmit={handleSubmit}>
        {/* Course Name */}
        <label className={styles.label}>Course Name</label>
        <input
          type="text"
          required
          value={courseInfo.name}
          onChange={(e: any) => setCourseInfo({ ...courseInfo, name: e.target.value })}
          id="name"
          placeholder="MERN stack LMS platform with Next 13"
          className={styles.input}
        />

        <br />
        <div className="mb-5">
          <label className={styles.label}>Course Description</label>
          <textarea
            cols={30}
            rows={8}
            placeholder="Write something amazing..."
            className={`${styles.input} !min-h-[100px] !py-2`}
            value={courseInfo.description}
            onChange={(e: any) => setCourseInfo({ ...courseInfo, description: e.target.value })}
          ></textarea>
        </div>

        <br />

        {/* Price Fields */}
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label className={styles.label}>Course Price</label>
            <input
              type="number"
              required
              value={courseInfo.price}
              onChange={(e: any) => setCourseInfo({ ...courseInfo, price: e.target.value })}
              id="price"
              placeholder="29"
              className={styles.input}
            />
          </div>
          <div className="w-[45%]">
            <label className={styles.label}>Estimated Price</label>
            <input
              type="number"
              required
              value={courseInfo.estimatedPrice}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })
              }
              id="estimatedPrice"
              placeholder="49"
              className={styles.input}
            />
          </div>
        </div>

        <br />

        {/* Tags & Level */}
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label className={styles.label}>Course Tags</label>
            <input
              type="text"
              required
              value={courseInfo.tags}
              onChange={(e: any) => setCourseInfo({ ...courseInfo, tags: e.target.value })}
              id="tags"
              placeholder="MERN"
              className={styles.input}
            />
          </div>

          <div className="w-[45%]">
            <label className={styles.label}>Course Level</label>
            <input
              type="text"
              required
              value={courseInfo.level}
              onChange={(e: any) => setCourseInfo({ ...courseInfo, level: e.target.value })}
              id="level"
              placeholder="Beginner / Intermediate / Advanced"
              className={styles.input}
            />
          </div>
        </div>

        <br />

        {/* Demo URL */}
        <div className="w-full">
          <label className={styles.label}>Demo URL</label>
          <input
            type="text"
            required
            value={courseInfo.demoUrl}
            onChange={(e: any) => setCourseInfo({ ...courseInfo, demoUrl: e.target.value })}
            id="demoUrl"
            placeholder="https://example.com/demo"
            className={styles.input}
          />
        </div>

        <br />

        {/* Thumbnail Upload */}
        <div className="w-full">
          <input
            type="file"
            accept="image/*"
            id="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full min-h-[10vh] dark:border-white border-[#00000026] p-3 border flex items-center justify-center ${dragging ? 'bg-blue-500' : 'bg-transparent'
              }`}
          >
            {courseInfo.thumbnail ? (
              <img
                src={courseInfo.thumbnail}
                alt="Course thumbnail"
                className="max-h-full w-full object-cover"
              />
            ) : (
              <span className="text-black dark:text-white">
                Drag and drop your thumbnail here or click to browse
              </span>
            )}
          </label>
        </div>

        <br />

        {/* Submit Button */}
        <div className="w-full flex items-center justify-end">
          <input
            type="submit"
            value="Next"
            className="w-full 800px:w-[180px] h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
};

export default CourseInformation;
