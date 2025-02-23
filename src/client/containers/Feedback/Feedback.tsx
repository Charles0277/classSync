import PageContainer from '@/client/components/Common/PageContainer/PageContainer';
import { FeedbackForm } from '@/client/components/FeedbackForm/FeedbackForm';
import { PopUpCard } from '@/client/components/ManageConfigCard/PopUpCard';
import { useState } from 'react';
import styles from './Feedback.module.css';

export const Feedback = () => {
    const [writeFeedback, setWriteFeedback] = useState(false);

    const handleFeedbackSubmit = () => {
        setWriteFeedback(true);
    };

    const handleCancel = () => {
        setWriteFeedback(false);
    };

    return (
        <PageContainer className="feedbackPage">
            <div className={styles.title}>Feedback</div>
            <div className={styles.feedbackContainer}>
                <div
                    className={styles.feedbackItem}
                    onClick={handleFeedbackSubmit}
                >
                    Submit Feedback
                </div>
                {/* Additional feedback content can go here */}
            </div>
            {writeFeedback && (
                <PopUpCard title="Submit Feedback" onCancel={handleCancel}>
                    <FeedbackForm onCancel={handleCancel} />
                </PopUpCard>
            )}
        </PageContainer>
    );
};
