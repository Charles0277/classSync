import PageContainer from '@/client/components/Common/PageContainer/PageContainer';
import { FeedbackForm } from '@/client/components/FeedbackForm/FeedbackForm';
import { PopUpCard } from '@/client/components/ManageConfigCard/PopUpCard';
import {
    deleteFeedbackRequest,
    getUserFeedbackRequest
} from '@/client/store/slices/feedbackSlice';
import { RootState } from '@/client/store/store';
import { IFeedback } from '@/common/types/IFeedback';
import { getIdString } from '@/common/utils';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import addIcon from '../../assets/addIcon.svg';
import trashIcon from '../../assets/trashIcon.svg';
import styles from './Feedback.module.css';

export const Feedback = () => {
    const dispatch = useDispatch();

    const { user, token } = useSelector((state: RootState) => state.auth);
    const { feedBackCollection } = useSelector(
        (state: RootState) => state.feedback
    );

    const [writeFeedback, setWriteFeedback] = useState(false);
    const [feedback, setFeedback] = useState<IFeedback>();

    const isAdmin = user?.role === 'admin';

    const handleSubmitFeedback = () => {
        setWriteFeedback(true);
    };

    const handleViewFeedback = (feedback: IFeedback) => {
        setWriteFeedback(true);
        setFeedback(feedback);
    };

    const handleDeleteFeedback = (feedbackId: string) => {
        dispatch(deleteFeedbackRequest({ id: feedbackId, token }));
    };

    const handleCancel = () => {
        setWriteFeedback(false);
        setFeedback(undefined);
    };

    useEffect(() => {
        if (user && token) {
            dispatch(getUserFeedbackRequest({ token, userId: user?._id }));
        }
    }, [user, token, dispatch]);

    return (
        <PageContainer className="feedbackPage">
            <div className={styles.title}>Feedback</div>
            <div className={styles.feedbackContainer}>
                <div
                    className={styles.submitFeedbackCard}
                    onClick={handleSubmitFeedback}
                >
                    Submit Feedback
                    <img src={addIcon} />
                </div>
                {feedBackCollection.map((feedback) => (
                    <div
                        key={feedback.id}
                        className={styles.feedbackCard}
                        onClick={() => handleViewFeedback(feedback)}
                    >
                        <div className={styles.feedbackHeader}>
                            <div
                                className={`${styles.feedbackType} ${styles[feedback.type]}`}
                            >
                                {feedback.type}
                            </div>
                            <img
                                src={trashIcon}
                                className={styles.deleteIcon}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteFeedback(
                                        getIdString(feedback._id)
                                    );
                                }}
                                alt="Delete feedback"
                            />
                        </div>
                        <div className={styles.feedbackText}>
                            {feedback.feedback}
                        </div>
                    </div>
                ))}
            </div>
            {writeFeedback && (
                <PopUpCard
                    title="Submit Feedback"
                    onCancel={handleCancel}
                    className="feedbackPopUp"
                >
                    <FeedbackForm onCancel={handleCancel} feedback={feedback} />
                </PopUpCard>
            )}
        </PageContainer>
    );
};
