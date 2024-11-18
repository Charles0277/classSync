import React, { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button/Button';
import Input from '../Input/Input';
import ManageCardConfig from '../ManageConfigCard/ManageConfigCard';
import ManageSchoolWeek from '../ManageSchoolWeek/ManageSchoolWeek';
import ManageUsers from '../ManageUsers/ManageUsers';
import ManageCourses from '../ManageCourses/ManageCourses';
import EditUserForm from '../ManageUsers/EditUserCard/EditUserCard';
import AddUserCard from '../ManageUsers/AddUserCard/AddUserCard';
import { updateConfigRequest } from '../../store/slices/schoolWeekConfigSlice';
import { RootState } from '../../store/store';
import { IUser } from '../../../common/types/IUser';
import styles from './Panel.module.css';
import { IRoom } from '../../../common/types/IRoom';
import ManageRooms from '../ManageRooms/ManageRooms';
import AddEditRoomCard from '../ManageRooms/AddEditRoomCard/AddEditRoomCard';

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

// Utility type for CONFIG_MAP keys
type ConfigTitle = keyof typeof CONFIG_MAP;

// Validation utilities
const isWholeNumber = (value: string): boolean => /^-?\d*$/.test(value);

const clampValue = (value: number, min?: number, max?: number): number =>
    Math.min(Math.max(value, min ?? value), max ?? value);

const Panel: React.FC<CardProps> = React.memo(
    ({ title, rightSideControl, min, max }) => {
        // State
        const [{ value, initialValue }, setValue] = React.useState({
            value: '',
            initialValue: ''
        });
        const [modalState, setModalState] = React.useState({
            showPopup: false,
            showEditUserForm: false,
            showAddUserForm: false,
            showAddEditRoom: false,
            editingUser: undefined as IUser | undefined,
            editingRoom: undefined as IRoom | undefined
        });

        // Redux
        const dispatch = useDispatch();
        const { token } = useSelector((state: RootState) => state.auth);
        const { schoolWeekConfig } = useSelector(
            (state: RootState) => state.schoolWeekConfig
        );

        // Computed values
        const configKey = useMemo(
            () => CONFIG_MAP[title as ConfigTitle],
            [title]
        );

        // Modal handlers
        const modalHandlers = useMemo(
            () => ({
                openPopup: () =>
                    setModalState((prev) => ({ ...prev, showPopup: true })),
                closePopup: () =>
                    setModalState((prev) => ({ ...prev, showPopup: false })),
                openAddUser: () =>
                    setModalState((prev) => ({
                        ...prev,
                        showPopup: false,
                        showAddUserForm: true
                    })),
                closeAddUser: (returnToPopup: boolean = true) =>
                    setModalState((prev) => ({
                        ...prev,
                        showAddUserForm: false,
                        showPopup: returnToPopup
                    })),
                openEditUser: (user: IUser) =>
                    setModalState((prev) => ({
                        ...prev,
                        showPopup: false,
                        showEditUserForm: true,
                        editingUser: user
                    })),
                closeEditUser: (returnToPopup: boolean = true) =>
                    setModalState((prev) => ({
                        ...prev,
                        showEditUserForm: false,
                        editingUser: undefined,
                        showPopup: returnToPopup
                    })),
                openAddEditRoom: (room?: IRoom) =>
                    setModalState((prev) => ({
                        ...prev,
                        showPopup: false,
                        showAddEditRoom: true,
                        editingRoom: room
                    })),
                closeAddEditRoom: (returnToPopup: boolean = true) =>
                    setModalState((prev) => ({
                        ...prev,
                        showAddEditRoom: false,
                        editingRoom: undefined,
                        showPopup: returnToPopup
                    }))
            }),
            []
        );

        // Effects
        useEffect(() => {
            if (schoolWeekConfig && configKey) {
                const currentValue =
                    schoolWeekConfig[configKey]?.toString() || '';
                setValue({ value: currentValue, initialValue: currentValue });
            }
        }, [schoolWeekConfig, configKey]);

        useEffect(() => {
            if (
                value !== initialValue &&
                token &&
                schoolWeekConfig &&
                configKey
            ) {
                dispatch(
                    updateConfigRequest({
                        token,
                        updatedConfig: {
                            ...schoolWeekConfig,
                            [configKey]: Number(value)
                        }
                    })
                );
            }
        }, [value, initialValue, token, configKey, dispatch, schoolWeekConfig]);

        // Input handler
        const handleInputChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = e.target.value;

                if (!isWholeNumber(newValue)) return;

                const numericValue = parseFloat(newValue);
                if (!isNaN(numericValue)) {
                    setValue((prev) => ({
                        ...prev,
                        value: clampValue(numericValue, min, max).toString()
                    }));
                } else {
                    setValue((prev) => ({ ...prev, value: newValue }));
                }
            },
            [min, max]
        );

        // Memoized content components
        const PopupContent = useMemo(() => {
            switch (title) {
                case 'Rooms':
                    return (
                        <ManageRooms
                            onAddEditRoom={modalHandlers.openAddEditRoom}
                        />
                    );
                case 'School Week':
                    return <ManageSchoolWeek />;
                case 'Users':
                    return (
                        <ManageUsers
                            onAddUser={modalHandlers.openAddUser}
                            onEditUser={modalHandlers.openEditUser}
                        />
                    );
                case 'Courses':
                    return <ManageCourses />;
                default:
                    return null;
            }
        }, [title, modalHandlers]);

        // Memoized control component
        const Control = useMemo(
            () =>
                rightSideControl === 'button' ? (
                    <Button
                        className="rightSideControl"
                        onClick={modalHandlers.openPopup}
                    >
                        Manage
                    </Button>
                ) : (
                    <Input
                        id="input"
                        name="input"
                        type="number"
                        className="rightSideControl"
                        min={min}
                        max={max}
                        value={value}
                        onChange={handleInputChange}
                        step={1}
                        pattern={`^-?[${min}-${max}]+$`}
                        title={`Only whole numbers between ${min}-${max} are allowed`}
                    />
                ),
            [
                rightSideControl,
                min,
                max,
                value,
                handleInputChange,
                modalHandlers
            ]
        );

        return (
            <>
                {modalState.showPopup && (
                    <ManageCardConfig
                        title={`Manage ${title}`}
                        onCancel={modalHandlers.closePopup}
                    >
                        {PopupContent}
                    </ManageCardConfig>
                )}
                {modalState.showEditUserForm && modalState.editingUser && (
                    <EditUserForm
                        user={modalState.editingUser}
                        onSave={() => modalHandlers.closeEditUser(true)}
                        onCancel={() => modalHandlers.closeEditUser(true)}
                    />
                )}
                {modalState.showAddUserForm && (
                    <AddUserCard
                        onSave={() => modalHandlers.closeAddUser(true)}
                        onCancel={() => modalHandlers.closeAddUser(true)}
                    />
                )}
                {modalState.showAddEditRoom && (
                    <AddEditRoomCard
                        onSave={() => modalHandlers.closeAddEditRoom(true)}
                        onCancel={() => modalHandlers.closeAddEditRoom(true)}
                        room={modalState.editingRoom}
                    />
                )}
                <div className={styles.panel}>
                    {title}
                    {Control}
                </div>
            </>
        );
    }
);

Panel.displayName = 'Panel';

export default Panel;
