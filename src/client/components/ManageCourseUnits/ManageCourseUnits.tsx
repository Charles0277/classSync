import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ICourseUnit } from '../../../common/types/ICourseUnit';
import { findFirstDigit } from '../../../common/utils';
import addIcon from '../../assets/addIcon.svg';
import {
    deleteCourseUnitRequest,
    fetchAllCourseUnitsRequest
} from '../../store/slices/courseUnitSlice';
import { RootState } from '../../store/store.js';
import Button from '../Button/Button';
import styles from './ManageCourseUnits.module.css'; // Update the stylesheet as necessary

interface ManageCourseUnitsProps {
    onAddEditCourseUnit: (courseUnit?: ICourseUnit) => void;
}

const ManageCourseUnits: React.FC<ManageCourseUnitsProps> = ({
    onAddEditCourseUnit
}) => {
    const { token } = useSelector((state: RootState) => state.auth);
    const { courseUnits } = useSelector((state: RootState) => state.courseUnit);

    const [filter, setFilter] = useState<
        'all' | 'Year 1' | 'Year 2' | 'Year 3' | 'Year 4' | 'Year 5' | 'Year 7'
    >('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [courseUnitToDelete, setCourseUnitToDelete] =
        useState<ICourseUnit | null>(null);

    const dispatch = useDispatch();

    useEffect(() => {
        if (token && courseUnits.length === 0) {
            dispatch(fetchAllCourseUnitsRequest());
        }
    }, [token]);

    const handleFilterChange = (
        newFilter:
            | 'all'
            | 'Year 1'
            | 'Year 2'
            | 'Year 3'
            | 'Year 4'
            | 'Year 5'
            | 'Year 7'
    ) => {
        setFilter(newFilter);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const onDeleteCourseUnit = (courseUnit: ICourseUnit) => {
        if (token) {
            dispatch(deleteCourseUnitRequest({ id: courseUnit._id, token }));
            setCourseUnitToDelete(null);
        }
    };

    const filteredCourseUnits = courseUnits?.filter((unit) => {
        const matchesFilter =
            filter === 'all' ||
            findFirstDigit(unit.code) === findFirstDigit(filter);
        const matchesSearch = unit.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div>
            <div className={styles.filterAndAddContainer}>
                <div className={styles.filterButtons}>
                    <Button
                        type="button"
                        onClick={() => handleFilterChange('all')}
                    >
                        All
                    </Button>
                    <Button
                        type="button"
                        onClick={() => handleFilterChange('Year 1')}
                    >
                        Year 1
                    </Button>
                    <Button
                        type="button"
                        onClick={() => handleFilterChange('Year 2')}
                    >
                        Year 2
                    </Button>
                    <Button
                        type="button"
                        onClick={() => handleFilterChange('Year 3')}
                    >
                        Year 3
                    </Button>
                    <Button
                        type="button"
                        onClick={() => handleFilterChange('Year 4')}
                    >
                        Year 4
                    </Button>
                    <Button
                        type="button"
                        onClick={() => handleFilterChange('Year 5')}
                    >
                        Year 5
                    </Button>
                    <Button
                        type="button"
                        onClick={() => handleFilterChange('Year 7')}
                    >
                        Year 7
                    </Button>
                </div>
                <Button type="button" onClick={() => onAddEditCourseUnit()}>
                    <img src={addIcon} alt="Add" /> Add Course Unit
                </Button>
            </div>

            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Search by course unit name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div className={styles.courseUnitList}>
                {filteredCourseUnits && filteredCourseUnits.length > 0 ? (
                    filteredCourseUnits.map((courseUnit, index) => (
                        <div
                            key={courseUnit.name}
                            className={`${styles.courseUnitContainer} ${
                                index === filteredCourseUnits.length - 1
                                    ? styles.lastCourse
                                    : ''
                            }`}
                        >
                            {courseUnit.name}
                            <div className={styles.rightSideControl}>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        onAddEditCourseUnit(courseUnit);
                                    }}
                                >
                                    <img
                                        src="src/client/assets/editIcon.svg"
                                        alt="Edit"
                                    />
                                </Button>
                                {courseUnitToDelete?.name ===
                                courseUnit.name ? (
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
                                                    onDeleteCourseUnit(
                                                        courseUnit
                                                    )
                                                }
                                            >
                                                Yes
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    setCourseUnitToDelete(null)
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
                                            setCourseUnitToDelete(courseUnit)
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
                    <div className={styles.noResults}>
                        No course units found
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageCourseUnits;
