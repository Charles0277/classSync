import PageContainer from '@/client/components/Common/PageContainer/PageContainer';
import { FeedbackForm } from '@/client/components/FeedbackForm/FeedbackForm';
import { PopUpCard } from '@/client/components/ManageConfigCard/PopUpCard';
import { getUserFeedbackRequest } from '@/client/store/slices/feedbackSlice';
import { RootState } from '@/client/store/store';
import { IFeedback } from '@/common/types/IFeedback';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
                    className={styles.feedbackItem}
                    onClick={handleSubmitFeedback}
                >
                    Submit Feedback
                </div>
                {feedBackCollection.map((feedback) => (
                    <div
                        key={feedback.id}
                        className={styles.feedbackItem}
                        onClick={() => handleViewFeedback(feedback)}
                    >
                        {feedback.feedback}
                    </div>
                ))}
            </div>
            {writeFeedback && (
                <PopUpCard title="Submit Feedback" onCancel={handleCancel}>
                    <FeedbackForm onCancel={handleCancel} feedback={feedback} />
                </PopUpCard>
            )}
        </PageContainer>
    );
};
