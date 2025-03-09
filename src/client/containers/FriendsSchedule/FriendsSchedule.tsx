import PageContainer from '@/client/components/Common/PageContainer/PageContainer';
import Schedule from '@/client/components/Schedule/Schedule';
import { getFriendsScheduleRequest } from '@/client/store/slices/scheduleSlice';
import { RootState } from '@/client/store/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './FriendsSchedule.module.css';

export const FriendsSchedule = () => {
    const { user, token } = useSelector((state: RootState) => state.auth);
    const { friendsSchedule } = useSelector(
        (state: RootState) => state.schedule
    );

    const dispatch = useDispatch();

    useEffect(() => {
        if (user?.friends && token && !friendsSchedule?.length) {
            dispatch(
                getFriendsScheduleRequest({
                    token,
                    friendIds: user?.friends?.map((friend) => friend._id)
                })
            );
        }
    }, [dispatch, user?.friends, token, friendsSchedule]);

    return (
        <PageContainer className="friendsScheduleContainer">
            <div className={styles.title}>Friends Schedule</div>
            <Schedule friendsSchedule={friendsSchedule} />
        </PageContainer>
    );
};
