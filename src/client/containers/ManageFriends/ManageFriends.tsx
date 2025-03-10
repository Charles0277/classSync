import Button from '@/client/components/Button/Button';
import PageContainer from '@/client/components/Common/PageContainer/PageContainer';
import { FriendList } from '@/client/components/FriendList/FriendList';
import Input from '@/client/components/Input/Input';
import {
    acceptFriendRequest,
    declineFriendRequest,
    removeFriendRequest,
    resetFriendError,
    resetFriendRequestSent,
    resetRemoveFriendSuccess,
    sendFriendRequest
} from '@/client/store/slices/userSlice';
import { RootState } from '@/client/store/store';
import { IFriend } from '@/common/types/IUser';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import styles from './ManageFriends.module.css';

export const ManageFriends = () => {
    const { user, token } = useSelector((state: RootState) => state.auth);
    const { friendError, friendRequestSent, removeFriendSuccess, loading } =
        useSelector((state: RootState) => state.user);
    const [email, setEmail] = useState('');
    const [showError, setShowError] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (friendRequestSent) {
            toast.success('Friend request sent successfully! 🆕');
            dispatch(resetFriendRequestSent());
            dispatch(resetFriendError());
            setEmail('');
        }
        if (removeFriendSuccess) {
            toast.success('Friend removed successfully! 🗑️');
            dispatch(resetRemoveFriendSuccess());
        }
        if (friendError) {
            toast.error(`${friendError} ⚠️`);
        }
    }, [friendRequestSent, removeFriendSuccess, friendError]);

    const handleSendFriendRequest = () => {
        dispatch(sendFriendRequest({ email, token }));
        setShowError(true);
    };

    return (
        <PageContainer className="genericPageLayout">
            <div className={styles.title}>Manage Friends</div>
            <div className={styles.manageFriendsContainer}>
                <div className={styles.friendList}>
                    <FriendList
                        friends={user?.friends as IFriend[]}
                        onRemoveFriend={(friendId) => {
                            dispatch(removeFriendRequest({ friendId, token }));
                        }}
                        friendRequests={
                            (user?.friendRequests as IFriend[]) || []
                        }
                        onAcceptFriend={(friendId) => {
                            dispatch(acceptFriendRequest({ friendId, token }));
                        }}
                        onDeclineFriend={(friendId) => {
                            dispatch(declineFriendRequest({ friendId, token }));
                        }}
                    />
                </div>
                <div className={styles.sendFriendRequest}>
                    <div className={styles.sendFriendRequestTitle}>
                        Send Friend Request
                    </div>
                    <label htmlFor="email">Email:</label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setShowError(false);
                            dispatch(resetFriendError());
                        }}
                    />
                    {friendError && showError && (
                        <div className={styles.error}>{friendError}.</div>
                    )}
                    <div className={styles.sendFriendRequestButton}>
                        <Button
                            className="classDetailsSave"
                            onClick={handleSendFriendRequest}
                            disabled={!email}
                            loading={loading}
                        >
                            Send Friend Request
                        </Button>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
};
