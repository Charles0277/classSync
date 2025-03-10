import Button from '@/client/components/Button/Button';
import PageContainer from '@/client/components/Common/PageContainer/PageContainer';
import { FriendList } from '@/client/components/FriendList/FriendList';
import Input from '@/client/components/Input/Input';
import {
    addFriendRequest,
    removeFriendRequest,
    resetAddFriendSuccess,
    resetFriendError,
    resetRemoveFriendSuccess
} from '@/client/store/slices/userSlice';
import { RootState } from '@/client/store/store';
import { IFriend } from '@/common/types/IUser';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import styles from './ManageFriends.module.css';

export const ManageFriends = () => {
    const { user, token } = useSelector((state: RootState) => state.auth);
    const { friendError, addFriendSuccess, removeFriendSuccess } = useSelector(
        (state: RootState) => state.user
    );
    const [email, setEmail] = useState('');
    const [showError, setShowError] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (addFriendSuccess) {
            toast.success('Friend added successfully! 🆕');
            dispatch(resetAddFriendSuccess());
            dispatch(resetFriendError());
            setEmail('');
        }
        if (removeFriendSuccess) {
            toast.success('Friend removed successfully! 🗑️');
            dispatch(resetRemoveFriendSuccess());
        }
        if (friendError) {
            toast.error(
                `Friend ${addFriendSuccess ? 'add' : 'remove'} failed: ${friendError} ⚠️`
            );
        }
    }, [addFriendSuccess, removeFriendSuccess, friendError]);

    const handleAddFriend = () => {
        dispatch(addFriendRequest({ email, token }));
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
                            console.log('accept friend', friendId);
                            // dispatch(acceptFriendRequest({ friendId, token }));
                        }}
                        onDeclineFriend={(friendId) => {
                            console.log('decline friend', friendId);
                            // dispatch(declineFriendRequest({ friendId, token }));
                        }}
                    />
                </div>
                <div className={styles.addFriends}>
                    <div className={styles.addFriendsTitle}>Add Friends</div>
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
                        <div className={styles.error}>{friendError}</div>
                    )}
                    <div className={styles.addFriendButton}>
                        <Button
                            className="classDetailsSave"
                            onClick={handleAddFriend}
                        >
                            Add Friend
                        </Button>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
};
