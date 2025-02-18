import { GenerateSchedule } from '@/client/components/GenerateSchedule/GenerateSchedule';
import { NotFound } from '@/client/components/NotFound/NotFound';
import {
    getGlobalScheduleRequest,
    getUserScheduleRequest
} from '@/client/store/slices/scheduleSlice';
import { RootState } from '@/client/store/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageContainer from '../../components/Common/PageContainer/PageContainer';
import Schedule from '../../components/Schedule/Schedule';

const Home = () => {
    const { token, user } = useSelector((state: RootState) => state.auth);
    const { userSchedule, globalSchedule, loading } = useSelector(
        (state: RootState) => state.schedule
    );

    const dispatch = useDispatch();

    useEffect(() => {
        if (!userSchedule && user?._id && user?.role !== 'admin') {
            dispatch(getUserScheduleRequest({ token: token, id: user?._id }));
        }
    }, [user]);

    useEffect(() => {
        if (!userSchedule && user?.role === 'admin') {
            dispatch(getGlobalScheduleRequest({ token: token }));
        }
    }, [user]);

    if (!userSchedule && loading) return <div>Loading...</div>;

    return (
        <PageContainer>
            {userSchedule ? (
                <Schedule userSchedule={userSchedule} />
            ) : user?.role === 'admin' ? (
                globalSchedule ? (
                    <Schedule globalSchedule={globalSchedule} />
                ) : (
                    <GenerateSchedule />
                )
            ) : (
                <NotFound
                    title="No Schedule Found"
                    description="You do not have a schedule right now. Please contact your administrator."
                />
            )}
        </PageContainer>
    );
};

export default Home;
