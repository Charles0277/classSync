import {
    createFeedbackRequest,
    updateFeedbackRequest
} from '@/client/store/slices/feedbackSlice';
import { RootState } from '@/client/store/store';
import { IFeedback } from '@/common/types/IFeedback';
import { capitaliseFirstLetter, getIdString } from '@/common/utils';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button/Button';
import styles from './FeedbackForm.module.css';

interface FeedbackFormProps {
    feedback?: IFeedback;
    onCancel: () => void;
    edit?: boolean;
}

interface FeedbackFormState {
    type: 'compliment' | 'suggestion' | 'complaint';
    feedback: string;
    user: string;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
    feedback,
    onCancel,
    edit
}) => {
    const { user, token } = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch();

    const [formData, setFormData] = useState<FeedbackFormState>({
        type: feedback?.type || 'compliment',
        feedback: feedback?.feedback || '',
        user: getIdString(user?._id)
    });

    const handleTypeChange = (
        type: 'compliment' | 'suggestion' | 'complaint'
    ) => {
        setFormData((prevFormData) => ({ ...prevFormData, type }));
    };

    const handleFeedbackChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const { value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, feedback: value }));
    };

    const handleSave = () => {
        if (edit && feedback) {
            dispatch(
                updateFeedbackRequest({ id: feedback._id, formData, token })
            );
        } else {
            dispatch(createFeedbackRequest({ formData, token }));
        }
        onCancel();
    };

    return (
        <div className={styles.feedbackForm}>
            <div className={styles.feedbackTypeContainer}>
                <div>
                    Type:{' '}
                    {feedback && !edit && capitaliseFirstLetter(feedback.type)}
                </div>
                {(!feedback || edit) && (
                    <div className={styles.feedbackTypeButtons}>
                        {['compliment', 'suggestion', 'complaint'].map(
                            (type) => (
                                <Button
                                    key={type}
                                    className={
                                        formData.type === type
                                            ? 'selectedButton'
                                            : ''
                                    }
                                    onClick={() =>
                                        handleTypeChange(
                                            type as
                                                | 'compliment'
                                                | 'suggestion'
                                                | 'complaint'
                                        )
                                    }
                                    style={{
                                        backgroundColor:
                                            type === 'compliment'
                                                ? '#2ecc71'
                                                : type === 'suggestion'
                                                  ? '#b8b8b8'
                                                  : '#e74c3c'
                                    }}
                                >
                                    {capitaliseFirstLetter(type)}
                                </Button>
                            )
                        )}
                    </div>
                )}
            </div>
            <div className={styles.feedbackContainer}>
                <div>Feedback:</div>
                {!feedback || edit ? (
                    <div className={styles.feedbackEdit}>
                        <textarea
                            className={styles.feedbackInput}
                            value={formData.feedback}
                            onChange={handleFeedbackChange}
                            maxLength={1000}
                        />
                        <div className={styles.feedbackEditButtons}>
                            <Button
                                type="button"
                                className="classDetailsSave"
                                onClick={handleSave}
                                disabled={formData.feedback.trim().length === 0}
                            >
                                {edit ? 'Save' : 'Submit'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.feedback}>{feedback.feedback}</div>
                )}
            </div>
        </div>
    );
};
