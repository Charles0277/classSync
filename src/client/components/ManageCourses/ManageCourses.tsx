import { useEffect } from 'react';
import styles from './ManageCourses.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store.js';
import { fetchAllCoursesRequest } from '../../store/slices/courseSlice';

const ManageCourses = () => {
    const { token } = useSelector((state: RootState) => state.auth);
    const { courses } = useSelector((state: RootState) => state.course);

    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            dispatch(fetchAllCoursesRequest());
        }
    }, [token]);

    return (
        <>
            {courses &&
                courses.map((course, index) => (
                    <div
                        key={course.name}
                        className={`${styles.courseContainer} ${
                            index === courses.length - 1
                                ? styles.lastCourse
                                : ''
                        }`}
                    >
                        {course.name} - {course.code}
                    </div>
                ))}
        </>
    );
};

export default ManageCourses;
