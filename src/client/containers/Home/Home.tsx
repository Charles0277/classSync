import {
    getGlobalScheduleRequest,
    getUserScheduleRequest
} from '@/client/store/slices/scheduleSlice';
import { RootState } from '@/client/store/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageContainer from '../../components/Common/PageContainer/PageContainer';

const Home = () => {
    const { token, user } = useSelector((state: RootState) => state.auth);
    const { globalSchedule, userSchedule, loading } = useSelector(
        (state: RootState) => state.schedule
    );

    const dispatch = useDispatch();

    useEffect(() => {
        if (!globalSchedule) {
            dispatch(getGlobalScheduleRequest({ token }));
        }
    }, []);

    useEffect(() => {
        if (!userSchedule && user) {
            dispatch(getUserScheduleRequest({ token: token, id: user?._id }));
        }
    }, [user]);

    if (!globalSchedule && loading) return <div>Loading...</div>;

    return <PageContainer>Hello World</PageContainer>;
};

export default Home;
