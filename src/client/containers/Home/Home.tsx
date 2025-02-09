import { getUserScheduleRequest } from '@/client/store/slices/scheduleSlice';
import { RootState } from '@/client/store/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageContainer from '../../components/Common/PageContainer/PageContainer';
import Schedule from '../../components/Schedule/Schedule';

const Home = () => {
    const { token, user } = useSelector((state: RootState) => state.auth);
    const { userSchedule, loading } = useSelector(
        (state: RootState) => state.schedule
    );
    console.log('🚀 ~ Home ~ userSchedule:', userSchedule);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!userSchedule && user) {
            dispatch(getUserScheduleRequest({ token: token, id: user?._id }));
        }
    }, [user]);

    if (!userSchedule && loading) return <div>Loading...</div>;

    return (
        <PageContainer>
            {userSchedule && <Schedule userSchedule={userSchedule} />}
        </PageContainer>
    );
};

export default Home;
