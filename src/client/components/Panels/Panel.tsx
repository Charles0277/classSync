import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ICourse } from '../../../common/types/ICourse';
import { ICourseUnit } from '../../../common/types/ICourseUnit';
import { IRoom } from '../../../common/types/IRoom';
import { IUser } from '../../../common/types/IUser';
import { updateConfigRequest } from '../../store/slices/schoolWeekConfigSlice';
import { RootState } from '../../store/store';
import Button from '../Button/Button';
import Input from '../Input/Input';
import ManageCardConfig from '../ManageConfigCard/ManageConfigCard';
import AddEditCourseCard from '../ManageCourses/AddEditCourseCard/AddEditCourseCard';
import ManageCourses from '../ManageCourses/ManageCourses';
import AddEditCourseUnitCard from '../ManageCourseUnits/AddEditCourseUnitCard/AddEditCourseUnitCard';
import ManageCourseUnits from '../ManageCourseUnits/ManageCourseUnits';
import AddEditRoomCard from '../ManageRooms/AddEditRoomCard/AddEditRoomCard';
import ManageRooms from '../ManageRooms/ManageRooms';
import ManageSchoolWeek from '../ManageSchoolWeek/ManageSchoolWeek';
import AddEditUserCard from '../ManageUsers/AddEditUserCard/AddEditUserCard';
import ManageUsers from '../ManageUsers/ManageUsers';
import styles from './Panel.module.css';

interface CardProps {
    title: string;
    rightSideControl: 'button' | 'input';
    min?: number;
    max?: number;
}

const CONFIG_MAP = {
    'Days per week': 'daysPerWeek',
    'Hours per day': 'hoursPerDay',
    'Start hour': 'startHour',
    'End hour': 'endHour'
} as const;

type ConfigTitle = keyof typeof CONFIG_MAP;

const Panel: React.FC<CardProps> = ({ title, rightSideControl, min, max }) => {
    // Redux hooks
    const dispatch = useDispatch();
    const { token } = useSelector((state: RootState) => state.auth);
    const { schoolWeekConfig } = useSelector(
        (state: RootState) => state.schoolWeekConfig
    );

    // State hooks
    const [inputState, setInputState] = useState({ current: '', initial: '' });
    const [modalState, setModalState] = useState({
        showPopup: false,
        showEditUserForm: false,
        showAddUserForm: false,
        showAddEditRoom: false,
        showAddEditCourse: false,
        showAddEditCourseUnit: false,
        editingUser: undefined as IUser | undefined,
        editingCourse: undefined as ICourse | undefined,
        editingCourseUnit: undefined as ICourseUnit | undefined,
        editingRoom: undefined as IRoom | undefined
    });

    const configKey = CONFIG_MAP[title as ConfigTitle];

    // Modal handlers
    const openModal = (key: keyof typeof modalState, payload?: any) => {
        setModalState((prev) => ({
            ...prev,
            [key]: true,
            ...payload
        }));
    };

    const closeModal = (key: keyof typeof modalState) => {
        setModalState((prev) => ({ ...prev, [key]: false }));
    };

    // Input change handler
    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            if (/^-?\d*$/.test(newValue)) {
                const numericValue = parseFloat(newValue);
                if (!isNaN(numericValue)) {
                    setInputState((prev) => ({
                        ...prev,
                        current: Math.min(
                            Math.max(numericValue, min || numericValue),
                            max || numericValue
                        ).toString()
                    }));
                } else {
                    setInputState((prev) => ({ ...prev, current: newValue }));
                }
            }
        },
        [min, max]
    );

    useEffect(() => {
        if (schoolWeekConfig && configKey) {
            const currentValue = schoolWeekConfig[configKey]?.toString() || '';
            setInputState({ current: currentValue, initial: currentValue });
        }
    }, [schoolWeekConfig, configKey]);

    useEffect(() => {
        const { current, initial } = inputState;
        if (current !== initial && token && configKey) {
            dispatch(
                updateConfigRequest({
                    token,
                    updatedConfig: {
                        ...schoolWeekConfig,
                        [configKey]: Number(current)
                    }
                })
            );
        }
    }, [inputState, token, configKey, dispatch, schoolWeekConfig]);

    const PopupContent = useMemo(() => {
        switch (title) {
            case 'Rooms':
                return (
                    <ManageRooms
                        onAddEditRoom={(room) =>
                            openModal('showAddEditRoom', { editingRoom: room })
                        }
                    />
                );
            case 'School Week':
                return <ManageSchoolWeek />;
            case 'Users':
                return (
                    <ManageUsers
                        onAddUser={() => openModal('showAddUserForm')}
                        onEditUser={(user) =>
                            openModal('showEditUserForm', { editingUser: user })
                        }
                    />
                );
            case 'Courses':
                return (
                    <ManageCourses
                        onAddEditCourse={(course) =>
                            openModal('showAddEditCourse', {
                                editingCourse: course
                            })
                        }
                    />
                );
            case 'Course Units':
                return (
                    <ManageCourseUnits
                        onAddEditCourseUnit={(courseUnit) =>
                            openModal('showAddEditCourseUnit', {
                                editingCourseUnit: courseUnit
                            })
                        }
                    />
                );
            default:
                return null;
        }
    }, [title]);

    const RightControl = useMemo(() => {
        return rightSideControl === 'button' ? (
            <Button
                className={'rightSideControl'}
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
                <ManageCardConfig
                    title={`Manage ${title}`}
                    onCancel={() => closeModal('showPopup')}
                >
                    {PopupContent}
                </ManageCardConfig>
            )}
            {modalState.showEditUserForm && modalState.editingUser && (
                <AddEditUserCard
                    user={modalState.editingUser}
                    onSave={() => closeModal('showEditUserForm')}
                    onCancel={() => closeModal('showEditUserForm')}
                    mode="edit"
                />
            )}
            {modalState.showAddUserForm && (
                <AddEditUserCard
                    onSave={() => closeModal('showAddUserForm')}
                    onCancel={() => closeModal('showAddUserForm')}
                    mode="add"
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
            <div className={styles.panel}>
                <div>{title}</div>
                {RightControl}
            </div>
        </>
    );
};

export default memo(Panel);
