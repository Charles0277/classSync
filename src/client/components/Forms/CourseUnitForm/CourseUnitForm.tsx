import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { fetchTeachersRequest } from '../../../store/slices/userSlice';
import { RootState } from '../../../store/store';
import Input from '../../Input/Input';
import styles from '../Forms.module.css';

interface CourseFormProps {
    formData: {
        name: string;
        code: string;
        instructor: string;
    };
    handleInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | any
    ) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleBack: () => void;
    edit?: boolean;
}

const CourseUnitForm: React.FC<CourseFormProps> = ({
    formData,
    handleInputChange,
    handleSubmit,
    handleBack,
    edit
}) => {
    const dispatch = useDispatch();
    const { teachers } = useSelector((state: RootState) => state.user);
    const { token } = useSelector((state: RootState) => state.auth);

    const [selectedTeacher, setSelectedTeacher] = useState<{
        value: string;
        label: string;
    } | null>(() =>
        teachers?.find(({ _id }) => _id === formData.instructor)
            ? {
                  value: formData.instructor,
                  label: teachers
                      .filter(({ _id }) => _id === formData.instructor)
                      .map(
                          ({ firstName, lastName }) =>
                              `${firstName} ${lastName}`
                      )[0]
              }
            : null
    );

    useEffect(() => {
        if (!selectedTeacher && formData.instructor) {
            const teacher = teachers?.find(
                ({ _id }) => _id === formData.instructor
            );
            if (teacher) {
                setSelectedTeacher({
                    value: teacher._id as string,
                    label: `${teacher.firstName} ${teacher.lastName}`
                });
            }
        }
    }, [teachers, formData.instructor, selectedTeacher]);

    useEffect(() => {
        if (!teachers?.length) {
            dispatch(fetchTeachersRequest({ token }));
        }
    }, [dispatch, teachers, token]);

    const handleSelectedChange = (selected: any) => {
        setSelectedTeacher(selected);
        handleInputChange({
            name: 'instructor',
            value: selected?.value || ''
        });
    };

    const teacherOptions =
        teachers?.map((teacher) => ({
            value: teacher._id as string,
            label: `${teacher.firstName} ${teacher.lastName}`
        })) || [];

    return (
        <div className={`${styles.formContainer} ${styles.notSignUp}`}>
            <form className={styles.formGroup} onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                />

                <label htmlFor="code">Code:</label>
                <Input
                    type="text"
                    id="code"
                    name="code"
                    placeholder="Code"
                    value={formData.code}
                    onChange={handleInputChange}
                />

                <label htmlFor="instructor">Instructor:</label>
                <Select
                    options={teacherOptions}
                    isClearable
                    value={selectedTeacher}
                    onChange={handleSelectedChange}
                    placeholder="Select an Instructor"
                    styles={{
                        container: (base) => ({
                            ...base,
                            width: '110%'
                        })
                    }}
                    maxMenuHeight={200}
                />

                <div className={styles.actionButtonGroup}>
                    <Input
                        type="button"
                        id="back"
                        name="back"
                        value="Back"
                        onClick={handleBack}
                    />
                    <Input
                        type="submit"
                        id="submit"
                        name="submit"
                        value={edit ? 'Save' : 'Submit'}
                    />
                </div>
            </form>
        </div>
    );
};

export default CourseUnitForm;
