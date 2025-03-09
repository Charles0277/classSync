import { getIdString } from '@/common/utils';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { ICourse } from '../../../common/types/ICourse';
import addIcon from '../../assets/addIcon.svg';
import editIcon from '../../assets/editIcon.svg';
import trashIcon from '../../assets/trashIcon.svg';
import {
    deleteCourseRequest,
    fetchAllCoursesRequest,
    resetCourseAdded,
    resetCourseDeleted,
    resetCourseUpdated
} from '../../store/slices/courseSlice';
import { RootState } from '../../store/store';
import Button from '../Button/Button';
import styles from './ManageCourses.module.css';

interface ManageCoursesProps {
    onAddEditCourse: (course?: ICourse) => void;
}

const ManageCourses: React.FC<ManageCoursesProps> = ({ onAddEditCourse }) => {
    const dispatch = useDispatch();
    const { token } = useSelector((state: RootState) => state.auth);
    const {
        courses,
        loading,
        isCourseAdded,
        isCourseDeleted,
        isCourseUpdated,
        error
    } = useSelector((state: RootState) => state.course);

    const [searchTerm, setSearchTerm] = useState('');
    const [courseToDelete, setCourseToDelete] = useState<ICourse | null>(null);

    useEffect(() => {
        if (token) {
            dispatch(fetchAllCoursesRequest());
        }
    }, [dispatch, token]);

    useEffect(() => {
        if (isCourseAdded) {
            toast.success('Course added successfully! 🆕');
            dispatch(resetCourseAdded());
        }
        if (isCourseUpdated) {
            toast.success('Course updated successfully! ✏️');
            dispatch(resetCourseUpdated());
        }
        if (isCourseDeleted) {
            toast.success('Course deleted successfully! 🗑️');
            dispatch(resetCourseDeleted());
        }
        if (error) {
            toast.error(
                `Course ${isCourseAdded ? 'submission' : isCourseUpdated ? 'update' : 'deletion'} failed: ${error} ⚠️`
            );
        }
    }, [isCourseAdded, isCourseUpdated, isCourseDeleted, error]);

    const filteredCourses = useMemo(
        () =>
            courses?.filter((course) =>
                course.name.toLowerCase().includes(searchTerm.toLowerCase())
            ) || [],
        [courses, searchTerm]
    );

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleDeleteCourse = () => {
        if (courseToDelete && token) {
            dispatch(deleteCourseRequest({ id: courseToDelete._id, token }));
            setCourseToDelete(null);
        }
    };

    return (
        <div>
            <div className={styles.filterAndAddContainer}>
                <Button type="button" onClick={() => onAddEditCourse()}>
                    <img src={addIcon} alt="Add Course" /> Add Course
                </Button>
            </div>

            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Search by course name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div className={styles.courseList}>
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course, index) => (
                        <div
                            key={getIdString(course._id)}
                            className={`${styles.courseContainer} ${
                                index === filteredCourses.length - 1
                                    ? styles.lastCourse
                                    : ''
                            }`}
                        >
                            <span>{course.name}</span>
                            <div className={styles.rightSideControl}>
                                <Button
                                    type="button"
                                    onClick={() => onAddEditCourse(course)}
                                >
                                    <img src={editIcon} alt="Edit Course" />
                                </Button>

                                {courseToDelete?._id === course._id ? (
                                    <div
                                        className={
                                            styles.confirmDeleteContainer
                                        }
                                    >
                                        <span>Confirm delete?</span>
                                        <div
                                            className={
                                                styles.confirmDeleteButtonGroup
                                            }
                                        >
                                            <Button
                                                type="button"
                                                onClick={handleDeleteCourse}
                                            >
                                                Yes
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    setCourseToDelete(null)
                                                }
                                            >
                                                No
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            setCourseToDelete(course)
                                        }
                                    >
                                        <img
                                            src={trashIcon}
                                            alt="Delete Course"
                                        />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                ) : loading ? (
                    <div className={styles.noResults}>Loading courses...</div>
                ) : (
                    <div className={styles.noResults}>No courses found</div>
                )}
            </div>
        </div>
    );
};

export default ManageCourses;
