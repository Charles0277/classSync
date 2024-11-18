import { useEffect, useState } from 'react';
import styles from './ManageCourses.module.css'; // Update the stylesheet as necessary
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store.js';
import {
    deleteCourseRequest,
    // deleteCourseRequest,
    fetchAllCoursesRequest
} from '../../store/slices/courseSlice'; // Update actions and slice names
import Button from '../Button/Button';
import { ICourse } from '../../../common/types/ICourse'; // Replace with appropriate type
import addIcon from '../../assets/addIcon.svg';

interface ManageCoursesProps {
    onAddEditCourse: (course?: ICourse) => void;
}

const ManageCourses: React.FC<ManageCoursesProps> = ({ onAddEditCourse }) => {
    const { token } = useSelector((state: RootState) => state.auth);
    const { courses } = useSelector((state: RootState) => state.course);

    const [searchTerm, setSearchTerm] = useState('');
    const [courseToDelete, setCourseToDelete] = useState<ICourse | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            dispatch(fetchAllCoursesRequest());
        }
    }, [token]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const onDeleteCourse = (course: ICourse) => {
        if (token) {
            dispatch(deleteCourseRequest({ id: course._id, token }));
            setCourseToDelete(null);
        }
    };

    const filteredCourses = courses?.filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className={styles.filterAndAddContainer}>
                <Button type="button" onClick={() => onAddEditCourse()}>
                    <img src={addIcon} alt="Add" /> Add Course
                </Button>
            </div>

            {/* Search Bar */}
            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Search by course name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            {/* Course List */}
            <div className={styles.courseList}>
                {filteredCourses && filteredCourses.length > 0 ? (
                    filteredCourses.map((course, index) => (
                        <div
                            key={course.name}
                            className={`${styles.courseContainer} ${
                                index === filteredCourses.length - 1
                                    ? styles.lastCourse
                                    : ''
                            }`}
                        >
                            {course.name}
                            <div className={styles.rightSideControl}>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        onAddEditCourse(course);
                                    }}
                                >
                                    <img
                                        src="src/client/assets/editIcon.svg"
                                        alt="Edit"
                                    />
                                </Button>
                                {courseToDelete?.name === course.name ? (
                                    // Confirmation UI
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
                                                onClick={() =>
                                                    onDeleteCourse(course)
                                                }
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
                                    // Trash icon to initiate confirmation
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            setCourseToDelete(course)
                                        }
                                    >
                                        <img
                                            src="src/client/assets/trashIcon.svg"
                                            alt="Delete"
                                        />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.noResults}>No courses found</div>
                )}
            </div>
        </div>
    );
};

export default ManageCourses;
