import { GenerateSchedule } from '@/client/components/GenerateSchedule/GenerateSchedule';
import { LoadingScreen } from '@/client/components/LoadingScreen/LoadingScreen';
import { NotFound } from '@/client/components/NotFound/NotFound';
import {
    getGlobalScheduleRequest,
    getUserScheduleRequest
} from '@/client/store/slices/scheduleSlice';
import { RootState } from '@/client/store/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageContainer from '../../components/PageContainer/PageContainer';
import Schedule from '../../components/Schedule/Schedule';

const Home = () => {
    const { token, user } = useSelector((state: RootState) => state.auth);
    const { userSchedule, globalSchedule, loading, hasLoaded } = useSelector(
        (state: RootState) => state.schedule
    );
    const dispatch = useDispatch();

    const isAdmin = user?.role === 'admin';
    const userId = user?._id;

    const [fetchRequested, setFetchRequested] = useState(hasLoaded || false);
    const [minLoadingElapsed, setMinLoadingElapsed] = useState(
        hasLoaded || false
    );

    useEffect(() => {
        if (!hasLoaded) {
            const timer = setTimeout(() => {
                setMinLoadingElapsed(true);
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setMinLoadingElapsed(true);
        }
    }, []);

    useEffect(() => {
        if (token) {
            if (userId && !isAdmin && !userSchedule) {
                dispatch(
                    getUserScheduleRequest({
                        token,
                        id: userId,
                        role: user.role
                    })
                );
                setFetchRequested(true);
            } else if (isAdmin && !globalSchedule) {
                dispatch(getGlobalScheduleRequest({ token }));
                setFetchRequested(true);
            }
        }
    }, [token, userId, isAdmin, userSchedule, globalSchedule, dispatch]);

    if (
        (!fetchRequested && !globalSchedule && user) ||
        loading ||
        !minLoadingElapsed
    ) {
        return <LoadingScreen />;
    }

    return (
        <PageContainer>
            {userSchedule?.length ? (
                <Schedule userSchedule={userSchedule} />
            ) : user?.role === 'admin' ? (
                globalSchedule?.length ? (
                    <Schedule globalSchedule={globalSchedule} />
                ) : (
                    <GenerateSchedule />
                )
            ) : (
                <NotFound
                    title="No Schedule Found"
                    description="You do not have a schedule at the moment. Please contact your administrator."
                />
            )}
        </PageContainer>
    );
};

export default Home;
