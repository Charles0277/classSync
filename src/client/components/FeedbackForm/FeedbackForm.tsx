import { createFeedbackRequest } from '@/client/store/slices/feedbackSlice';
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
}

interface feedbackFormState {
    type: 'compliment' | 'suggestion' | 'complaint';
    feedback: string;
    user: string;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
    feedback,
    onCancel
}) => {
    const { user, token } = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch();

    const handleTypeChange = (
        type: 'compliment' | 'suggestion' | 'complaint'
    ) => {
        setFormData({ ...formData, type });
    };

    const [formData, setFormData] = useState<feedbackFormState>({
        type: 'compliment',
        feedback: '',
        user: getIdString(user?._id)
    });

    const handleSave = () => {
        dispatch(createFeedbackRequest({ formData, token }));
        onCancel();
    };

    return (
        <div className={styles.feedbackForm}>
            <div className={styles.typeContainer}>
                <div>
                    Type: {feedback && capitaliseFirstLetter(feedback.type)}
                </div>
                {!feedback && (
                    <div className={styles.typeButtons}>
                        <Button
                            className={styles.feedbackType}
                            onClick={() => handleTypeChange('compliment')}
                            style={{ backgroundColor: '#28a745' }}
                        >
                            Compliment
                        </Button>
                        <Button
                            className={styles.feedbackType}
                            onClick={() => handleTypeChange('suggestion')}
                            style={{ backgroundColor: '#b8b8b8' }}
                        >
                            Suggestion
                        </Button>
                        <Button
                            className={styles.feedbackType}
                            onClick={() => handleTypeChange('complaint')}
                            style={{ backgroundColor: '#cc4b4b' }}
                        >
                            Complaint
                        </Button>
                    </div>
                )}
            </div>
            <div>
                <div>Feedback:</div>
                {!feedback ? (
                    <div className={styles.feedbackEdit}>
                        <textarea
                            className={styles.feedbackInput}
                            value={formData.feedback}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    feedback: e.target.value
                                })
                            }
                        />
                        <div className={styles.feedbackEditButtons}>
                            <Button
                                type="button"
                                className="classDetailsSave"
                                onClick={handleSave}
                            >
                                Submit
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
