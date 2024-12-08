import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { fetchTeachersRequest } from '../../../store/slices/userSlice';
import { RootState } from '../../../store/store';
import Input from '../../Input/Input';
import styles from '../Forms.module.css';

interface CourseUnitFormProps {
    formData: {
        name: string;
        code: string;
        instructor: string;
        classTypes: string[];
    };
    handleInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | any
    ) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleBack: () => void;
    edit?: boolean;
}

const CourseUnitForm: React.FC<CourseUnitFormProps> = ({
    formData,
    handleInputChange,
    handleSubmit,
    handleBack,
    edit
}) => {
    const dispatch = useDispatch();
    const { teachers } = useSelector((state: RootState) => state.user);
    const { token } = useSelector((state: RootState) => state.auth);

    const classTypes = ['lecture', 'lab', 'tutorial', 'seminar', 'workshop'];

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

    const [selectedClassTypes, setSelectedClassTypes] = useState<
        { value: string; label: string }[]
    >(() =>
        formData.classTypes
            .map((formDataClassType) =>
                classTypes.find((classType) => classType === formDataClassType)
            )
            .filter((classType): classType is string => Boolean(classType))
            .map((classType) => ({
                value: classType,
                label: `${classType.charAt(0).toUpperCase()}${classType.slice(1)}`
            }))
    );
    console.log('🚀 ~ selectedClassTypes:', selectedClassTypes);

    useEffect(() => {
        if (selectedClassTypes?.length === 0) {
            const mappedUnits =
                formData.classTypes
                    .map((formDataClassType) =>
                        classTypes.find(
                            (classType) => classType === formDataClassType
                        )
                    )
                    .filter((classType): classType is string =>
                        Boolean(classType)
                    )
                    .map((classType) => ({
                        value: classType,
                        label: `${classType.charAt(0).toUpperCase()}${classType.slice(1)}`
                    })) || [];
            console.log('🚀 ~ useEffect ~ mappedUnits:', mappedUnits);
            setSelectedClassTypes(mappedUnits);
        }
    }, [formData.classTypes]);

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

    const handleTeacherChange = (selected: any) => {
        setSelectedTeacher(selected);
        handleInputChange({
            name: 'instructor',
            value: selected?.value || ''
        });
    };

    const handleClassTypesChange = (selected: any) => {
        const updatedClassTypes = selected
            ? selected.map((option: any) => option.value)
            : [];
        setSelectedClassTypes(selected.value);
        handleInputChange({ name: 'classTypes', value: updatedClassTypes });
    };

    const teacherOptions =
        teachers?.map((teacher) => ({
            value: teacher._id as string,
            label: `${teacher.firstName} ${teacher.lastName}`
        })) || [];

    const classTypeOptions =
        classTypes?.map((classType) => ({
            value: classType,
            label: `${classType.charAt(0).toUpperCase()}${classType.slice(1)}`
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
                    onChange={handleTeacherChange}
                    placeholder="Select an Instructor"
                    styles={{
                        container: (base) => ({
                            ...base,
                            width: '110%'
                        })
                    }}
                    maxMenuHeight={200}
                />

                <label htmlFor="classType">Class Type:</label>
                <Select
                    options={classTypeOptions}
                    isClearable
                    value={selectedClassTypes}
                    onChange={handleClassTypesChange}
                    placeholder="Select at least one Class Type"
                    styles={{
                        container: (base) => ({
                            ...base,
                            width: '110%'
                        })
                    }}
                    isMulti
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
