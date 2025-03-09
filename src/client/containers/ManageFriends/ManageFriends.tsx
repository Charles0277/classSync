import Button from '@/client/components/Button/Button';
import PageContainer from '@/client/components/Common/PageContainer/PageContainer';
import { FriendList } from '@/client/components/FriendList/FriendList';
import Input from '@/client/components/Input/Input';
import {
    addFriendRequest,
    removeFriendRequest
} from '@/client/store/slices/userSlice';
import { RootState } from '@/client/store/store';
import { IFriend } from '@/common/types/IUser';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './ManageFriends.module.css';

export const ManageFriends = () => {
    const { user, token } = useSelector((state: RootState) => state.auth);
    const [email, setEmail] = useState('');

    const dispatch = useDispatch();

    const handleAddFriend = () => {
        dispatch(addFriendRequest({ email, token }));
        setEmail('');
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
                    />
                </div>
                <div className={styles.addFriends}>
                    <label htmlFor="email">Email:</label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
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
