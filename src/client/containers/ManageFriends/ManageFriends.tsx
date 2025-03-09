import PageContainer from '@/client/components/Common/PageContainer/PageContainer';
import { RootState } from '@/client/store/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './ManageFriends.module.css';
import Input from '@/client/components/Input/Input';
import Button from '@/client/components/Button/Button';
import { addFriendRequest } from '@/client/store/slices/userSlice';

export const ManageFriends = () => {
    const { user, token } = useSelector((state: RootState) => state.auth);
    const [email, setEmail] = useState('');

    const dispatch = useDispatch();

    const handleAddFriend = () => {
        dispatch(addFriendRequest({ email, token }));
    };

    return (
        <PageContainer className="genericPageLayout">
            <div className={styles.title}>Manage Friends</div>
            <div className={styles.manageFriendsContainer}>
                <div className={styles.friendList}>Friends list</div>
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
