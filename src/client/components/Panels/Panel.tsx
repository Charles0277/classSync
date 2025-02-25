import { IHoliday } from '@/common/types/IHoliday';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { ICourse } from '../../../common/types/ICourse';
import { ICourseUnit } from '../../../common/types/ICourseUnit';
import { IRoom } from '../../../common/types/IRoom';
import { IUser } from '../../../common/types/IUser';
import Button from '../Button/Button';
import Input from '../Input/Input';
import { PopUpCard } from '../ManageConfigCard/PopUpCard';
import AddEditCourseCard from '../ManageCourses/AddEditCourseCard/AddEditCourseCard';
import ManageCourses from '../ManageCourses/ManageCourses';
import AddEditCourseUnitCard from '../ManageCourseUnits/AddEditCourseUnitCard/AddEditCourseUnitCard';
import ManageCourseUnits from '../ManageCourseUnits/ManageCourseUnits';
import AddEditHolidayCard from '../ManageHolidays/AddEditHolidayCard/AddEditHolidayCard';
import { ManageHolidays } from '../ManageHolidays/ManageHolidays';
import AddEditRoomCard from '../ManageRooms/AddEditRoomCard/AddEditRoomCard';
import ManageRooms from '../ManageRooms/ManageRooms';
import { ManageSchedules } from '../ManageSchedules/ManageSchedules';
import AddEditUserCard from '../ManageUsers/AddEditUserCard/AddEditUserCard';
import ManageUsers from '../ManageUsers/ManageUsers';
import styles from './Panel.module.css';

interface CardProps {
    title: string;
    rightSideControl: 'button' | 'input';
    min?: number;
    max?: number;
}

const Panel: React.FC<CardProps> = ({ title, rightSideControl, min, max }) => {
    const [inputState, setInputState] = useState({ current: '', initial: '' });
    const [modalState, setModalState] = useState({
        showPopup: false,
        showEditUserForm: false,
        showAddUserForm: false,
        showAddEditRoom: false,
        showAddEditCourse: false,
        showAddEditCourseUnit: false,
        showAddEditHoliday: false,
        editingUser: undefined as IUser | undefined,
        editingCourse: undefined as ICourse | undefined,
        editingCourseUnit: undefined as ICourseUnit | undefined,
        editingRoom: undefined as IRoom | undefined,
        editingHoliday: undefined as IHoliday | undefined
    });

    const openModal = (key: keyof typeof modalState, payload?: any) => {
        setModalState((prev) => ({ ...prev, [key]: true, ...payload }));
    };

    const closeModal = (key: keyof typeof modalState) => {
        setModalState((prev) => ({ ...prev, [key]: false }));
    };

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            if (/^-?\d*$/.test(newValue)) {
                const numericValue = parseFloat(newValue);
                setInputState((prev) => ({
                    ...prev,
                    current: !isNaN(numericValue)
                        ? Math.min(
                              Math.max(numericValue, min || numericValue),
                              max || numericValue
                          ).toString()
                        : newValue
                }));
            }
        },
        [min, max]
    );

    const PopupContent = useMemo(() => {
        const modalComponents = {
            Rooms: (
                <ManageRooms
                    onAddEditRoom={(room) =>
                        openModal('showAddEditRoom', { editingRoom: room })
                    }
                />
            ),
            'School Dates': (
                <ManageHolidays
                    onAddEditHoliday={(holiday) =>
                        openModal('showAddEditHoliday', {
                            editingHoliday: holiday
                        })
                    }
                />
            ),
            Users: (
                <ManageUsers
                    onAddUser={() => openModal('showAddUserForm')}
                    onEditUser={(user) =>
                        openModal('showEditUserForm', { editingUser: user })
                    }
                />
            ),
            Courses: (
                <ManageCourses
                    onAddEditCourse={(course) =>
                        openModal('showAddEditCourse', {
                            editingCourse: course
                        })
                    }
                />
            ),
            'Course Units': (
                <ManageCourseUnits
                    onAddEditCourseUnit={(courseUnit) =>
                        openModal('showAddEditCourseUnit', {
                            editingCourseUnit: courseUnit
                        })
                    }
                />
            ),
            Schedules: <ManageSchedules />
        };
        return modalComponents[title as keyof typeof modalComponents] || null;
    }, [title]);

    const RightControl = useMemo(() => {
        return rightSideControl === 'button' ? (
            <Button
                className="rightSideControl"
                onClick={() => openModal('showPopup')}
            >
                Manage
            </Button>
        ) : (
            <Input
                type="number"
                className="small"
                min={min}
                max={max}
                value={inputState.current}
                onChange={handleInputChange}
                step={1}
            />
        );
    }, [rightSideControl, inputState, handleInputChange, min, max]);

    return (
        <>
            {modalState.showPopup && (
                <PopUpCard
                    title={`Manage ${title}`}
                    onCancel={() => closeModal('showPopup')}
                >
                    {PopupContent}
                </PopUpCard>
            )}
            {modalState.showEditUserForm && modalState.editingUser && (
                <AddEditUserCard
                    user={modalState.editingUser}
                    onSave={() => closeModal('showEditUserForm')}
                    onCancel={() => closeModal('showEditUserForm')}
                    mode="admin"
                />
            )}
            {modalState.showAddUserForm && (
                <AddEditUserCard
                    onSave={() => closeModal('showAddUserForm')}
                    onCancel={() => closeModal('showAddUserForm')}
                    mode="signUp"
                />
            )}
            {modalState.showAddEditRoom && (
                <AddEditRoomCard
                    room={modalState.editingRoom}
                    onSave={() => closeModal('showAddEditRoom')}
                    onCancel={() => closeModal('showAddEditRoom')}
                />
            )}
            {modalState.showAddEditCourse && (
                <AddEditCourseCard
                    course={modalState.editingCourse}
                    onSave={() => closeModal('showAddEditCourse')}
                    onCancel={() => closeModal('showAddEditCourse')}
                />
            )}
            {modalState.showAddEditCourseUnit && (
                <AddEditCourseUnitCard
                    courseUnit={modalState.editingCourseUnit}
                    onSave={() => closeModal('showAddEditCourseUnit')}
                    onCancel={() => closeModal('showAddEditCourseUnit')}
                />
            )}
            {modalState.showAddEditHoliday && (
                <AddEditHolidayCard
                    holiday={modalState.editingHoliday}
                    onSave={() => closeModal('showAddEditHoliday')}
                    onCancel={() => closeModal('showAddEditHoliday')}
                />
            )}
            <div className={styles.panel}>
                <div>{title}</div>
                {RightControl}
            </div>
        </>
    );
};

export default memo(Panel);
