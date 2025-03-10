import Button from '@/client/components/Button/Button';
import PageContainer from '@/client/components/Common/PageContainer/PageContainer';
import { NotFound } from '@/client/components/NotFound/NotFound';
import Schedule from '@/client/components/Schedule/Schedule';
import { getFriendsScheduleRequest } from '@/client/store/slices/scheduleSlice';
import { RootState } from '@/client/store/store';
import { IFriendsScheduleEntry } from '@/common/types/ISchedule';
import { IFriend } from '@/common/types/IUser';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './FriendsSchedule.module.css';

export const FriendsSchedule = () => {
    const { user, token } = useSelector((state: RootState) => state.auth);
    const { friendsSchedule } = useSelector(
        (state: RootState) => state.schedule
    );

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAnyFriendMissingSchedule = useMemo(() => {
        return user?.friends?.some(
            (friend) =>
                !friendsSchedule?.some(
                    (entry) =>
                        `${(friend as IFriend).firstName} ${
                            (friend as IFriend).lastName
                        }` === (entry as IFriendsScheduleEntry).friendName
                )
        );
    }, [friendsSchedule, user?.friends]);

    useEffect(() => {
        if (
            user?.friends?.length &&
            token &&
            (!friendsSchedule?.length || isAnyFriendMissingSchedule)
        ) {
            dispatch(
                getFriendsScheduleRequest({
                    token,
                    friendIds: user?.friends?.map((friend) => friend._id)
                })
            );
        }
    }, [
        dispatch,
        user?.friends,
        token,
        friendsSchedule,
        isAnyFriendMissingSchedule
    ]);

    return (
        <PageContainer className="friendsScheduleContainer">
            {friendsSchedule?.length ? (
                <>
                    <div className={styles.title}>Friends Schedule</div>
                    <Schedule friendsSchedule={friendsSchedule} />
                </>
            ) : (
                <div className={styles.notFoundContainer}>
                    <NotFound
                        title="No friends schedule found"
                        description="Please add friends to your account to view their schedule."
                    />
                    <Button onClick={() => navigate('/manage-friends')}>
                        Manage Friends
                    </Button>
                </div>
            )}
        </PageContainer>
    );
};
