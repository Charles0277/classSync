import { fetchAllTeachersRequest } from '@/client/store/slices/userSlice';
import { getIdString } from '@/common/utils';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { RootState } from '../../../store/store';
import Button from '../../Button/Button';
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
    const { teachers } = useSelector((state: RootState) => state.user);
    const { token } = useSelector((state: RootState) => state.auth);
    const { error } = useSelector((state: RootState) => state.courseUnit);

    const dispatch = useDispatch();

    const [showResponseError, setShowResponseError] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<{
        value: string;
        label: string;
    } | null>(() =>
        teachers?.find(({ _id }) => getIdString(_id) === formData.instructor)
            ? {
                  value: formData.instructor,
                  label: teachers
                      .filter(
                          ({ _id }) => getIdString(_id) === formData.instructor
                      )
                      .map(
                          ({ firstName, lastName }) =>
                              `${firstName} ${lastName}`
                      )[0]
              }
            : null
    );

    const classTypes = useMemo(
        () => [
            'lectureTheatre',
            'laboratory',
            'classroom',
            'office',
            'computerCluster'
        ],
        []
    );

    const classTypesMap = useMemo(
        () => ({
            lectureTheatre: 'Lecture Theatre',
            laboratory: 'Laboratory',
            classroom: 'Classroom',
            office: 'Office',
            computerCluster: 'Computer Cluster'
        }),
        []
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
                label: classTypesMap[classType as keyof typeof classTypesMap]
            }))
    );

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
                        label: classTypesMap[
                            classType as keyof typeof classTypesMap
                        ]
                    })) || [];
            setSelectedClassTypes(mappedUnits);
        }
    }, [formData.classTypes]);

    useEffect(() => {
        if (!selectedTeacher && formData.instructor) {
            const teacher = teachers?.find(
                ({ _id }) => getIdString(_id) === formData.instructor
            );
            if (teacher) {
                setSelectedTeacher({
                    value: getIdString(teacher._id),
                    label: `${teacher.firstName} ${teacher.lastName}`
                });
            }
        }
    }, [teachers, formData.instructor, selectedTeacher]);

    useEffect(() => {
        if (!teachers?.length) {
            dispatch(fetchAllTeachersRequest({ token }));
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

    const teacherOptions = useMemo(
        () =>
            teachers.map((teacher) => ({
                value: getIdString(teacher._id),
                label: `${teacher.firstName} ${teacher.lastName}`
            })),
        [teachers]
    );

    const classTypeOptions = useMemo(
        () =>
            classTypes.map((classType) => ({
                value: classType,
                label: classTypesMap[classType as keyof typeof classTypesMap]
            })),
        [classTypes, classTypesMap]
    );

    const isFormFilled =
        formData.name.trim() !== '' &&
        formData.code.trim() !== '' &&
        formData.instructor !== '' &&
        formData.classTypes.length > 0;

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
                />

                <label htmlFor="classType">Class Type:</label>
                <Select
                    options={classTypeOptions}
                    isClearable
                    value={selectedClassTypes}
                    onChange={handleClassTypesChange}
                    placeholder="Select at least one Class Type"
                    isMulti
                />
                {error && showResponseError && (
                    <span className={styles.errorMessage}>{error}</span>
                )}
                <div className={styles.actionButtonGroup}>
                    <Button type="button" onClick={handleBack} className="back">
                        Back
                    </Button>
                    <Button
                        type="submit"
                        className="logIn"
                        disabled={!isFormFilled}
                        onClick={() => {
                            setShowResponseError(true);
                        }}
                    >
                        {edit ? 'Save' : 'Submit'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CourseUnitForm;
