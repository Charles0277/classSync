import Button from '@/client/components/Button/Button';
import PageContainer from '@/client/components/Common/PageContainer/PageContainer';
import { FeedbackForm } from '@/client/components/FeedbackForm/FeedbackForm';
import { PopUpCard } from '@/client/components/ManageConfigCard/PopUpCard';
import {
    deleteFeedbackRequest,
    getAllFeedbackRequest,
    getUserFeedbackRequest
} from '@/client/store/slices/feedbackSlice';
import { RootState } from '@/client/store/store';
import { IFeedback } from '@/common/types/IFeedback';
import { capitaliseFirstLetter, getIdString } from '@/common/utils';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import addIcon from '../../assets/addIcon.svg';
import editIcon from '../../assets/editIcon.svg';
import trashIcon from '../../assets/trashIcon.svg';
import styles from './Feedback.module.css';

export const Feedback = () => {
    const dispatch = useDispatch();
    const { user, token } = useSelector((state: RootState) => state.auth);
    const { feedBackCollection } = useSelector(
        (state: RootState) => state.feedback
    );

    const [openPopUp, setOpenPopUp] = useState(false);
    const [editFeedback, setEditFeedback] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<
        IFeedback | undefined
    >();
    const [filter, setFilter] = useState<
        'all' | 'compliment' | 'suggestion' | 'complaint'
    >('all');

    const handleFilterChange = (
        newFilter: 'all' | 'compliment' | 'suggestion' | 'complaint'
    ) => {
        setFilter(newFilter);
    };

    const isAdmin = user?.role === 'admin';
    const popupTitle = selectedFeedback
        ? editFeedback
            ? 'Edit Feedback'
            : 'View Feedback'
        : 'Submit Feedback';

    useEffect(() => {
        if (token && feedBackCollection?.length === 0) {
            if (user?._id && !isAdmin) {
                dispatch(getUserFeedbackRequest({ token, userId: user._id }));
            } else {
                dispatch(getAllFeedbackRequest({ token }));
            }
        }
    }, [user?._id, token, dispatch, isAdmin, feedBackCollection]);

    const handleFeedbackAction = (
        action: 'view' | 'edit' | 'submit',
        feedback?: IFeedback
    ) => {
        setOpenPopUp(true);
        setEditFeedback(action === 'edit');
        setSelectedFeedback(feedback);
    };

    const handleDeleteFeedback = (feedbackId: string) => {
        if (token) dispatch(deleteFeedbackRequest({ id: feedbackId, token }));
    };

    const handleCancel = () => {
        setOpenPopUp(false);
        setEditFeedback(false);
        setSelectedFeedback(undefined);
    };

    const filteredFeedback = feedBackCollection?.filter((feedback) => {
        const matchesFilter = filter === 'all' || feedback.type === filter;
        return matchesFilter;
    });

    return (
        <PageContainer className="feedbackPage">
            <div className={styles.title}>Feedback</div>
            <div className={styles.filter}>
                Filter:
                {['all', 'compliment', 'suggestion', 'complaint'].map(
                    (type) => (
                        <Button
                            key={type}
                            className={filter === type ? 'selectedType' : ''}
                            onClick={() =>
                                handleFilterChange(
                                    type as
                                        | 'all'
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
                                          : type === 'all'
                                            ? 'var(--darkBlue-color)'
                                            : '#e74c3c'
                            }}
                        >
                            {capitaliseFirstLetter(type)}
                        </Button>
                    )
                )}
            </div>
            <div className={styles.feedbackContainer}>
                {!isAdmin && (
                    <div
                        className={styles.submitFeedbackCard}
                        onClick={() => handleFeedbackAction('submit')}
                    >
                        Submit Feedback
                        <img src={addIcon} alt="Add feedback" />
                    </div>
                )}
                {filteredFeedback.map((feedback) => (
                    <div
                        key={getIdString(feedback._id)}
                        className={styles.feedbackCard}
                        onClick={() => handleFeedbackAction('view', feedback)}
                    >
                        <div className={styles.feedbackHeader}>
                            <div
                                className={`${styles.feedbackType} ${styles[feedback.type]}`}
                            >
                                {feedback.type}
                            </div>
                            <div className={styles.actionButtons}>
                                <img
                                    src={editIcon}
                                    className={styles.editIcon}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFeedbackAction('edit', feedback);
                                    }}
                                    alt="Edit feedback"
                                />
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
                        </div>
                        <div className={styles.feedbackText}>
                            {feedback.feedback}
                        </div>
                    </div>
                ))}
            </div>
            {openPopUp && (
                <PopUpCard
                    title={popupTitle}
                    onCancel={handleCancel}
                    className="feedbackPopUp"
                >
                    <FeedbackForm
                        onCancel={handleCancel}
                        feedback={selectedFeedback}
                        edit={editFeedback}
                    />
                </PopUpCard>
            )}
        </PageContainer>
    );
};
